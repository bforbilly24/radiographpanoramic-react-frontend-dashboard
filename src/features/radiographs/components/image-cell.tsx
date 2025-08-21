import { useState } from 'react'
import { RadiographResponse } from '@/types/radiograph'
import { toast } from '@/hooks/use-toast'
import { constructImageUrl } from '../utils/construct-image-url'
import { ImageDialog } from './image-dialog'

interface ImageCellProps {
  path: string | null
  alt: string
  radiograph?: RadiographResponse
}

function ImageCell({ path, alt, radiograph }: ImageCellProps) {
  const [isError, setIsError] = useState(false)
  const [open, setOpen] = useState(false)

  if (!path || isError) {
    return <span>Tidak Ada Gambar</span>
  }

  const imageUrl = constructImageUrl(path)

  return (
    <>
      <img
        src={imageUrl}
        alt={alt}
        className='w-20 h-20 object-cover rounded cursor-pointer'
        loading='lazy'
        onClick={() => setOpen(true)}
        onError={() => {
          toast({
            variant: 'destructive',
            title: 'Gagal memuat gambar',
            description: `Tidak dapat memuat gambar: ${imageUrl}`,
          })
          setIsError(true)
        }}
      />
      <ImageDialog
        open={open}
        onOpenChange={setOpen}
        imageUrl={imageUrl}
        alt={alt}
        radiograph={radiograph}
      />
    </>
  )
}

export { ImageCell }