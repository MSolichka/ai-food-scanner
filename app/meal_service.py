"""Pure helpers that prepare the prompt language and shape the final response."""

import re

from app.model_output import ModelAnswer
from app.schemas import (
    InputPart,
    IngredientItem,
    MacroEstimateResponse,
    MacroTotals,
    TextPart,
)

DEFAULT_LANGUAGE = "Ukrainian"
_CYRILLIC = re.compile("[Ѐ-ӿ]")


def pick_response_language(parts: list[InputPart]) -> str:
    """Ukrainian for photo-only input or Cyrillic text, English otherwise."""
    written = [part.text for part in parts if isinstance(part, TextPart)]
    if not written:
        return DEFAULT_LANGUAGE
    return "Ukrainian" if _CYRILLIC.search(" ".join(written)) else "English"


def _whole_meal_as_ingredient(answer: ModelAnswer) -> IngredientItem:
    """Fallback used when the model returned no separate ingredients."""
    return IngredientItem(
        name=answer.title.capitalize(),
        protein_g=answer.protein_g,
        carbs_g=answer.carbs_g,
        fat_g=answer.fat_g,
        weight_g=answer.estimated_grams,
    )


def build_ingredients(answer: ModelAnswer) -> list[IngredientItem]:
    listed = [
        IngredientItem(
            name=raw.name.capitalize(),
            protein_g=raw.protein_g,
            carbs_g=raw.carbs_g,
            fat_g=raw.fat_g,
            weight_g=raw.weight_g,
        )
        for raw in answer.ingredients
    ]
    return listed or [_whole_meal_as_ingredient(answer)]


def build_response(answer: ModelAnswer) -> MacroEstimateResponse:
    return MacroEstimateResponse(
        title=answer.title.capitalize(),
        description=answer.meal_description,
        estimated_grams=answer.estimated_grams,
        macros_in_grams=MacroTotals(
            carbs=answer.carbs_g,
            proteins=answer.protein_g,
            fats=answer.fat_g,
        ),
        ingredients=build_ingredients(answer),
        meal_insights=answer.meal_insights,
    )
