"""Structure that the language model is asked to return.

Field names are part of the system prompt (see ``app/prompt.py``), so they must
stay in sync with it.
"""

from pydantic import BaseModel, Field

from app.schemas import Insight


class RawIngredient(BaseModel):
    name: str
    protein_g: int
    carbs_g: int
    fat_g: int
    weight_g: float


class ModelAnswer(BaseModel):
    carbs_g: int = Field(ge=0)
    protein_g: int = Field(ge=0)
    fat_g: int = Field(ge=0)
    estimated_grams: float = Field(ge=0)
    title: str
    valid_meal: bool
    meal_description: str
    ingredients: list[RawIngredient] = Field(default_factory=list)
    meal_insights: list[Insight] = Field(default_factory=list)
