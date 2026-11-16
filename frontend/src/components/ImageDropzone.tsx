import { useEffect, useRef } from 'react'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { ActionIcon, Box, Image, Text, Stack } from '@mantine/core'
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react'
import { useLang } from '../LanguageContext'

interface Props {
  image: File | null
  onChange: (file: File | null) => void
  disabled?: boolean
}

export function ImageDropzone({ image, onChange, disabled }: Props) {
  const { t } = useLang()
  const previewUrl = image ? URL.createObjectURL(image) : null
  const prevUrlRef = useRef<string | null>(null)

  useEffect(() => {
    if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current)
    prevUrlRef.current = previewUrl
  }, [previewUrl])

  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      if (disabled) return
      const items = Array.from(e.clipboardData?.items ?? [])
      const imageItem = items.find((i) => i.type.startsWith('image/'))
      if (imageItem) {
        const file = imageItem.getAsFile()
        if (file) onChange(file)
      }
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [disabled, onChange])

  if (image && previewUrl) {
    return (
      <Box pos="relative" style={{ borderRadius: 'var(--mantine-radius-md)', overflow: 'hidden' }}>
        <Image
          src={previewUrl}
          alt="Selected food"
          radius="md"
          mah={280}
          fit="cover"
          style={{ display: 'block', width: '100%' }}
        />
        <ActionIcon
          pos="absolute"
          top={8}
          right={8}
          size="sm"
          radius="xl"
          color="dark"
          variant="filled"
          onClick={() => onChange(null)}
          disabled={disabled}
        >
          <IconX size={12} />
        </ActionIcon>
      </Box>
    )
  }

  return (
    <Dropzone
      onDrop={(files) => onChange(files[0])}
      accept={IMAGE_MIME_TYPE}
      maxFiles={1}
      disabled={disabled}
      styles={{
        root: {
          minHeight: 140,
          background: 'color-mix(in srgb, var(--mantine-color-teal-9) 15%, transparent)',
          borderColor: 'color-mix(in srgb, var(--mantine-color-teal-6) 40%, transparent)',
        },
      }}
    >
      <Stack align="center" justify="center" gap="xs" style={{ minHeight: 120, pointerEvents: 'none' }}>
        <Dropzone.Accept>
          <IconUpload size={36} color="var(--mantine-color-teal-4)" stroke={1.5} />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX size={36} color="var(--mantine-color-red-4)" stroke={1.5} />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto size={36} color="var(--mantine-color-dimmed)" stroke={1.5} />
        </Dropzone.Idle>
        <Text size="sm" c="dimmed" ta="center">
          {t.dropzoneHint}
        </Text>
      </Stack>
    </Dropzone>
  )
}
