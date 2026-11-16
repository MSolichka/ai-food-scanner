export interface Macros {
  carbs: number
  proteins: number
  fats: number
}

export interface Ingredient {
  name: string
  protein_g: number
  carbs_g: number
  fat_g: number
  weight_g: number
}

export interface MealInsight {
  type: 'reinforcement' | 'suggestion'
  body: string
}

export interface EstimateMacrosResponse {
  title: string
  description: string
  estimated_grams: number
  macros_in_grams: Macros
  ingredients: Ingredient[]
  meal_insights: MealInsight[]
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // strip "data:image/jpeg;base64," prefix
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function estimateMacros(
  image: File | null,
  text: string,
): Promise<EstimateMacrosResponse> {
  const content: object[] = []

  if (image) {
    const base64 = await fileToBase64(image)
    const mediaType = image.type === 'image/webp' ? 'image/webp' : 'image/jpeg'
    content.push({ image_base64: base64, media_type: mediaType })
  }

  if (text.trim()) {
    content.push({ text: text.trim() })
  }

  const response = await fetch('/api/estimate-macros', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),  // locale тепер автоматично визначається на бекенді
  })

  if (response.status === 422) {
    throw new Error('No food detected. Try a different photo or description.')
  }

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json()
}
