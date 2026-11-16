from fastapi import FastAPI, HTTPException

from app.agent import GeminiClient
from app.meal_service import build_response, pick_response_language
from app.model_output import ModelAnswer
from app.prompt import build_system_prompt
from app.schemas import MacroEstimateRequest, MacroEstimateResponse
from app.settings import config

app = FastAPI(title="AI Food Recognition")

gemini = GeminiClient(
    api_key=config.GOOGLE_API_KEY,
    model_name=config.GOOGLE_MODEL_NAME,
)


@app.post("/estimate-macros")
async def estimate_macros(request: MacroEstimateRequest) -> MacroEstimateResponse:
    language = pick_response_language(request.content)
    answer = await gemini.request_structured(
        result_model=ModelAnswer,
        parts=request.content,
        instructions=build_system_prompt(language),
    )

    if not answer.valid_meal:
        raise HTTPException(
            status_code=422,
            detail="No food detected in the provided content.",
        )

    return build_response(answer)
