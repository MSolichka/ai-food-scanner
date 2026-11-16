"""Thin wrapper around PydanticAI that talks to Google Gemini."""

import base64
from typing import TYPE_CHECKING

from pydantic_ai import Agent, BinaryContent, ImageUrl
from pydantic_ai.models.google import GoogleModel
from pydantic_ai.providers.google import GoogleProvider

from app.schemas import ImageInlinePart, ImageLinkPart, TextPart

if TYPE_CHECKING:
    from pydantic import BaseModel
    from pydantic_ai import UserContent as AIUserContent

    from app.schemas import InputPart


# Fully deterministic sampling so the same input yields the same answer.
DETERMINISTIC_SAMPLING = {"temperature": 0, "top_p": 0, "seed": 0}


def _build_gemini_model(api_key: str, model_name: str) -> GoogleModel:
    return GoogleModel(
        model_name=model_name,
        provider=GoogleProvider(api_key=api_key),
        settings=dict(DETERMINISTIC_SAMPLING),
    )


def _to_model_input(part: "InputPart") -> "AIUserContent":
    """Convert one API input part into the format PydanticAI expects."""
    if isinstance(part, TextPart):
        return part.text
    if isinstance(part, ImageLinkPart):
        return ImageUrl(part.image_url)
    if isinstance(part, ImageInlinePart):
        raw_bytes = base64.b64decode(part.image_base64)
        return BinaryContent(data=raw_bytes, media_type=part.media_type)
    raise TypeError(f"Unsupported input part: {type(part).__name__}")


class GeminiClient:
    """Sends multimodal prompts to Gemini and returns validated objects."""

    def __init__(self, api_key: str, model_name: str):
        self._gemini = _build_gemini_model(api_key, model_name)

    async def request_structured[T: "BaseModel"](
        self,
        result_model: type[T],
        parts: list["InputPart"],
        instructions: str,
    ) -> T:
        agent = Agent(
            self._gemini,
            system_prompt=instructions,
            output_type=result_model,
        )
        model_input = [_to_model_input(part) for part in parts]
        run = await agent.run(model_input)
        return run.output
