export const translations = {
  en: {
    appTitle: 'AI Food Scanner',
    appSubtitle: 'Snap a photo or describe your meal',
    dropzoneHint: 'Drag a photo here, click to browse, or paste from clipboard',
    textPlaceholder: 'Describe your meal... (e.g. grilled chicken with rice)',
    analyzeButton: 'Analyze',
    newScan: 'New scan',
    kcal: 'kcal',
    totalWeight: 'total weight',
    protein: 'Protein',
    carbs: 'Carbs',
    fat: 'Fat',
    ingredients: 'Ingredients',
    errorTitle: 'Could not recognize food',
    errorFallback: 'Something went wrong. Please try again.',
  },
  uk: {
    appTitle: 'AI Сканер їжі',
    appSubtitle: 'Завантажте фото або опишіть страву',
    dropzoneHint: 'Перетягніть фото, натисніть для вибору, або вставте з буферу',
    textPlaceholder: 'Опишіть страву... (напр. курка гриль з рисом)',
    analyzeButton: 'Проаналізувати',
    newScan: 'Нове сканування',
    kcal: 'ккал',
    totalWeight: 'загальна вага',
    protein: 'Білки',
    carbs: 'Вуглеводи',
    fat: 'Жири',
    ingredients: 'Інгредієнти',
    errorTitle: 'Не вдалось розпізнати їжу',
    errorFallback: 'Щось пішло не так. Спробуйте ще раз.',
  },
} as const

export type Lang = keyof typeof translations
export type T = typeof translations.en
