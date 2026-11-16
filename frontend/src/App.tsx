import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button, Container, Group, SegmentedControl, Skeleton, Stack, Text, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconScan, IconRefresh } from '@tabler/icons-react'
import { estimateMacros, type EstimateMacrosResponse } from './api'
import { ImageDropzone } from './components/ImageDropzone'
import { MealTextInput } from './components/MealTextInput'
import { MealResult } from './components/MealResult'
import { useLang } from './LanguageContext'

export default function App() {
  const { t /* , lang, toggle — uncomment for v2 language switcher */ } = useLang()
  const [image, setImage] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<EstimateMacrosResponse | null>(null)

  const canSubmit = (image !== null || text.trim().length > 0) && !loading

  async function handleSubmit() {
    setLoading(true)
    setResult(null)
    try {
      const data = await estimateMacros(image, text)
      setResult(data)
    } catch (err) {
      notifications.show({
        color: 'red',
        title: t.errorTitle,
        message: err instanceof Error ? err.message : t.errorFallback,
      })
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setImage(null)
    setText('')
    setResult(null)
  }

  return (
    <Container size="sm" py="xl">
      <Stack gap="xl">

        {/* Header */}
        <Stack align="center" gap={4}>
          {/* Language switcher — hidden in v1, uncomment for v2
          <Group w="100%" justify="flex-end">
            <SegmentedControl
              size="xs"
              value={lang}
              onChange={toggle}
              data={[
                { label: 'EN', value: 'en' },
                { label: 'УК', value: 'uk' },
              ]}
            />
          </Group>
          */}
          <Title
            order={1}
            ta="center"
            style={{
              background: 'linear-gradient(135deg, #00f5a0 0%, #00b3cc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t.appTitle}
          </Title>
          <Text c="dimmed" size="sm" ta="center">
            {t.appSubtitle}
          </Text>
        </Stack>

        {/* Input form — hidden when result is shown */}
        <AnimatePresence mode="wait">
          {!result && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
            >
              <Stack gap="sm">
                <ImageDropzone image={image} onChange={setImage} disabled={loading} />
                <MealTextInput value={text} onChange={setText} disabled={loading} />
                <Button
                  leftSection={<IconScan size={18} />}
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  loading={loading}
                  size="md"
                  fullWidth
                  variant="gradient"
                  gradient={{ from: 'teal', to: 'cyan', deg: 135 }}
                  style={{ fontWeight: 600 }}
                >
                  {t.analyzeButton}
                </Button>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading skeleton */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Stack gap="sm">
                <Skeleton height={28} width="55%" radius="md" />
                <Skeleton height={16} width="75%" radius="md" />
                <Skeleton height={80} radius="md" />
                <Skeleton height={60} radius="md" />
                <Skeleton height={60} radius="md" />
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            >
              <Stack gap="sm">
                <MealResult result={result} image={image} />
                <Button
                  leftSection={<IconRefresh size={16} />}
                  variant="subtle"
                  color="gray"
                  onClick={handleReset}
                  fullWidth
                >
                  {t.newScan}
                </Button>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>

      </Stack>
    </Container>
  )
}
