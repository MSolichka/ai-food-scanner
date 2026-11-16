import { Textarea } from '@mantine/core'
import { useLang } from '../LanguageContext'

interface Props {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function MealTextInput({ value, onChange, disabled }: Props) {
  const { t } = useLang()
  return (
    <Textarea
      placeholder={t.textPlaceholder}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      disabled={disabled}
      autosize
      minRows={2}
      maxRows={5}
    />
  )
}
