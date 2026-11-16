"""Pydantic models describing the public API of the service."""

from enum import Enum
from typing import Annotated, Literal

from pydantic import BaseModel, Field

NonNegativeInt = Annotated[int, Field(ge=0)]
NonNegativeFloat = Annotated[float, Field(ge=0)]


# ---------------------------------------------------------------------------
# Incoming payload
# ---------------------------------------------------------------------------

class TextPart(BaseModel):
    """A free-text description of the meal."""

    text: str


class ImageLinkPart(BaseModel):
    """A photo that is reachable by a public URL."""

    image_url: str


class ImageInlinePart(BaseModel):
    """
    A photo sent inline as a base64 string.

    Recommended preparation: resize the long side to 768 px and use JPEG/WebP
    quality of about 60.
    """

    image_base64: str
    media_type: Literal["image/webp", "image/jpeg"]


InputPart = TextPart | ImageLinkPart | ImageInlinePart


class MacroEstimateRequest(BaseModel):
    content: list[InputPart]


# ---------------------------------------------------------------------------
# Outgoing payload
# ---------------------------------------------------------------------------

class MacroTotals(BaseModel):
    carbs: NonNegativeInt
    proteins: NonNegativeInt
    fats: NonNegativeInt


class IngredientItem(BaseModel):
    name: str
    protein_g: NonNegativeInt
    carbs_g: NonNegativeInt
    fat_g: NonNegativeInt
    weight_g: NonNegativeFloat


class InsightKind(str, Enum):
    reinforcement = "reinforcement"
    suggestion = "suggestion"


class Insight(BaseModel):
    type: InsightKind
    body: str


class MacroEstimateResponse(BaseModel):
    title: str
    description: str
    estimated_grams: NonNegativeFloat
    macros_in_grams: MacroTotals
    ingredients: list[IngredientItem]
    meal_insights: list[Insight]
