// src/features/radiographs/components/ImageCell.tsx
import { useState } from 'react'

const STATIC_URL = import.meta.env.VITE_API_URL_IMAGE || 'http://127.0.0.1:8000'

interface ImageCellProps {
  path: string | null
  alt: string
}

export function ImageCell({ path, alt }: ImageCellProps) {
  const [isError, setIsError] = useState(false)

  if (!path || isError) {
    return <span>Tidak Ada Gambar</span>
  }

  const normalizedPath = path.replace(/^Uploads\//, 'uploads/')
  const imageUrl = `${STATIC_URL}/${normalizedPath}`

  return (
    <img
      src={imageUrl}
      alt={alt}
      className='w-20 h-20 object-cover rounded'
      loading='lazy'
      onError={(e) => {
        setIsError(true)
        e.currentTarget.src = '/placeholder-image.jpg'
        e.currentTarget.onerror = null
      }}
    />
  )
}
