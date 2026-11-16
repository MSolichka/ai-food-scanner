import { type ReactNode, useMemo } from 'react'
import { Badge, Card, Divider, Group, Image, Paper, RingProgress, Stack, Text, Title } from '@mantine/core'
import { IconBulb, IconDroplet, IconLeaf, IconMeat, IconWheat } from '@tabler/icons-react'
import type { EstimateMacrosResponse } from '../api'
import { useLang } from '../LanguageContext'

interface Props {
  result: EstimateMacrosResponse
  image: File | null
}

export function MealResult({ result, image }: Props) {
  const { t } = useLang()
  const { title, description, estimated_grams, macros_in_grams, ingredients, meal_insights } = result
  const { carbs, proteins, fats } = macros_in_grams
  const imageUrl = useMemo(() => image ? URL.createObjectURL(image) : null, [image])

  const kcal = Math.round(carbs * 4 + proteins * 4 + fats * 9)
  const carbsPct = kcal > 0 ? Math.round((carbs * 4 / kcal) * 100) : 0
  const proteinPct = kcal > 0 ? Math.round((proteins * 4 / kcal) * 100) : 0
  const fatPct = kcal > 0 ? 100 - carbsPct - proteinPct : 0

  return (
    <Card radius="md" withBorder padding="lg">
      <Stack gap="md">

        {/* Title & description */}
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack gap={4} style={{ flex: 1 }}>
            <Title order={3}>{title}</Title>
            {description && <Text size="sm" c="dimmed">{description}</Text>}
          </Stack>
          {imageUrl && (
            <Image
              src={imageUrl}
              w={56}
              h={56}
              radius="md"
              fit="cover"
              style={{ flexShrink: 0 }}
            />
          )}
        </Group>

        <Divider />

        {/* Calories + weight */}
        <Paper
          radius="md"
          p="md"
          style={{
            background: 'color-mix(in srgb, var(--mantine-color-teal-9) 25%, transparent)',
            border: '1px solid color-mix(in srgb, var(--mantine-color-teal-7) 25%, transparent)',
            textAlign: 'center',
          }}
        >
          <Text fw={800} size="2.5rem" lh={1} c="gray.1">{kcal}</Text>
          <Text size="xs" c="teal.5" mt={2}>{t.kcal}</Text>
          <Text size="sm" c="gray.4" mt={6}>≈ {Math.round(estimated_grams)}g {t.totalWeight}</Text>
        </Paper>

        <Divider />

        {/* Macros — ring progress */}
        <Group justify="space-around" align="flex-start">
          <MacroRing label={t.protein} grams={proteins} pct={proteinPct} color="orange" icon={<IconMeat size={14} color="var(--mantine-color-orange-4)" />} />
          <MacroRing label={t.carbs} grams={carbs} pct={carbsPct} color="yellow" icon={<IconWheat size={14} color="var(--mantine-color-yellow-4)" />} />
          <MacroRing label={t.fat} grams={fats} pct={fatPct} color="grape" icon={<IconDroplet size={14} color="var(--mantine-color-grape-4)" />} />
        </Group>

        {/* Ingredients — hidden in v1, uncomment for v2
        {ingredients.length > 0 && (
          <>
            <Divider />
            <Stack gap={6}>
              <Text size="xs" fw={600} tt="uppercase" c="dimmed">{t.ingredients}</Text>
              {ingredients.map((ing, i) => (
                <Stack key={i} gap={2}>
                  <Group justify="space-between">
                    <Text size="sm" fw={500}>{ing.name}</Text>
                    <Text size="sm" c="gray.4">{Math.round(ing.weight_g)}g</Text>
                  </Group>
                  <Group gap="sm">
                    <Group gap={3} align="center">
                      <IconMeat size={12} color="var(--mantine-color-orange-4)" />
                      <Text size="xs" c="dimmed">{ing.protein_g}g</Text>
                    </Group>
                    <Group gap={3} align="center">
                      <IconWheat size={12} color="var(--mantine-color-yellow-4)" />
                      <Text size="xs" c="dimmed">{ing.carbs_g}g</Text>
                    </Group>
                    <Group gap={3} align="center">
                      <IconDroplet size={12} color="var(--mantine-color-grape-4)" />
                      <Text size="xs" c="dimmed">{ing.fat_g}g</Text>
                    </Group>
                  </Group>
                </Stack>
              ))}
            </Stack>
          </>
        )}
        */}

        {/* Meal insights — hidden in v1, uncomment for v2
        {meal_insights.length > 0 && (
          <>
            <Divider />
            <Stack gap="xs">
              {meal_insights.map((insight, i) => (
                <InsightCard key={i} type={insight.type} body={insight.body} />
              ))}
            </Stack>
          </>
        )}
        */}

      </Stack>
    </Card>
  )
}

function MacroRing({ label, grams, pct, color, icon }: {
  label: string
  grams: number
  pct: number
  color: string
  icon: ReactNode
}) {
  return (
    <Stack align="center" gap={4}>
      <RingProgress
        size={110}
        thickness={10}
        roundCaps
        sections={[{ value: pct, color }]}
        label={
          <Text ta="center" fw={700} size="sm">{pct}%</Text>
        }
      />
      <Badge color={color} variant="light" radius="xl" size="md">{grams}g</Badge>
      <Group gap={4} align="center">
        {icon}
        <Text size="xs" c="dimmed">{label}</Text>
      </Group>
    </Stack>
  )
}

function InsightCard({ type, body }: { type: string; body: string }) {
  const isReinforcement = type === 'reinforcement'
  return (
    <Paper
      p="sm"
      radius="md"
      style={{
        background: isReinforcement
          ? 'color-mix(in srgb, var(--mantine-color-teal-9) 40%, transparent)'
          : 'color-mix(in srgb, var(--mantine-color-blue-9) 40%, transparent)',
      }}
    >
      <Group gap="xs" wrap="nowrap" align="flex-start">
        {isReinforcement
          ? <IconLeaf size={16} color="var(--mantine-color-teal-4)" style={{ marginTop: 2, flexShrink: 0 }} />
          : <IconBulb size={16} color="var(--mantine-color-blue-4)" style={{ marginTop: 2, flexShrink: 0 }} />
        }
        <Text size="sm">{body}</Text>
      </Group>
    </Paper>
  )
}
