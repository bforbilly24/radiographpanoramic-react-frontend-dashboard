import { useState, useEffect, useMemo } from 'react'
import { useMutation } from '@tanstack/react-query'
import { filterRadiograph } from '@/actions/radiograph/post-filter-radiograph'
import { RadiographResponse } from '@/types/radiograph'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/shadcn/button'
import { Checkbox } from '@/components/ui/shadcn/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog'
import { Label } from '@/components/ui/shadcn/label'
import { diseaseLabels } from '../constant/disease-labels'
import { constructImageUrl } from '../utils/construct-image-url'

interface ImageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageUrl: string
  alt: string
  radiograph?: RadiographResponse
}

export function ImageDialog({
  open,
  onOpenChange,
  imageUrl,
  alt,
  radiograph,
}: ImageDialogProps) {
  const [filteredImage, setFilteredImage] = useState<string | null>(null)
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [initialConditions, setInitialConditions] = useState<string[]>([])

  const detectedConditions = useMemo(
    () =>
      radiograph?.detected_conditions || {
        has_impaksi: false,
        has_karies: false,
        has_lesi_periapikal: false,
        has_resorpsi: false,
      },
    [radiograph]
  )

  const labels = useMemo(
    () =>
      diseaseLabels.map((label) => ({
        ...label,
        active:
          detectedConditions[
            `has_${label.backendName.toLowerCase().replace('lesi_periapikal', 'lesi_periapikal')}` as keyof typeof detectedConditions
          ],
      })),
    [detectedConditions]
  )

  const imageName = useMemo(() => {
    if (!radiograph?.original_file) return null
    // Split the path and take the last segment to get the file name
    const segments = radiograph.original_file.split('/')
    return segments[segments.length - 1]
  }, [radiograph])

  const { mutate, isPending } = useMutation({
    mutationFn: filterRadiograph,
    onSuccess: (data) => {
      if (!data.filtered_image) {
        toast({
          variant: 'destructive',
          title: 'Gagal menerapkan filter',
          description: data.message || 'Data gambar yang difilter tidak ada.',
        })
        setFilteredImage(null)
        return
      }
      try {
        const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/
        if (!base64Pattern.test(data.filtered_image)) {
          throw new Error('Format base64 tidak valid')
        }
        if (data.filtered_image.length < 100) {
          throw new Error(
            'String base64 terlalu pendek untuk gambar yang valid'
          )
        }
        const decoded = atob(data.filtered_image)
        if (decoded.length < 100) {
          throw new Error(
            'Data base64 yang didekode terlalu pendek atau tidak valid'
          )
        }
        const base64Image = `data:image/jpeg;base64,${data.filtered_image}`
        setFilteredImage(base64Image)
        if (data.message) {
          toast({
            variant: 'success',
            title: '✅ Berhasil',
            description:
              'Filter berhasil diterapkan dengan catatan dari sistem.',
          })
        } else {
          toast({
            variant: 'success',
            title: '✅ Berhasil',
            description: 'Filter berhasil diterapkan.',
          })
        }
      } catch (error) {
        const err = error as Error
        toast({
          variant: 'destructive',
          title: 'Gagal memuat gambar',
          description: `Gambar yang difilter tidak valid: ${err.message}`,
        })
        setFilteredImage(null)
      }
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat memfilter gambar.'
      toast({
        variant: 'destructive',
        title: 'Gagal menerapkan filter',
        description: errorMessage,
      })
      setFilteredImage(null)
    },
  })

  useEffect(() => {
    if (open && radiograph) {
      const initial = labels
        .filter((label) => label.active)
        .map((label) => label.backendName)
      setSelectedConditions(initial)
      setInitialConditions(initial)
      if (alt.includes('Overlay') && radiograph.overlay_file) {
        constructImageUrl(radiograph.overlay_file)
        setFilteredImage(null)
      } else {
        setFilteredImage(null)
      }
    } else {
      setSelectedConditions([])
      setInitialConditions([])
      setFilteredImage(null)
    }
  }, [open, radiograph, alt, labels])

  const handleCheckboxChange = (backendName: string, checked: boolean) => {
    const newSelectedConditions = checked
      ? [...selectedConditions, backendName]
      : selectedConditions.filter((c) => c !== backendName)
    setSelectedConditions(newSelectedConditions)
  }

  const handleApplyFilter = () => {
    if (radiograph && radiograph.id && alt.includes('Overlay')) {
      mutate({
        radiograph_id: radiograph.id,
        selected_categories: selectedConditions,
      })
    }
  }

  const handleResetFilter = () => {
    setSelectedConditions(initialConditions)
    setFilteredImage(null)
    if (
      radiograph &&
      radiograph.id &&
      alt.includes('Overlay') &&
      initialConditions.length > 0
    ) {
      mutate({
        radiograph_id: radiograph.id,
        selected_categories: initialConditions,
      })
    }
    toast({
      variant: 'success',
      title: '✅ Berhasil',
      description: 'Filter telah direset ke kondisi awal.',
    })
  }

  const isOverlay = alt.includes('Overlay')
  const hasNoConditions = !labels.some((label) => label.active)
  const isResetDisabled =
    isPending ||
    (selectedConditions.length === initialConditions.length &&
      selectedConditions.every((cond) => initialConditions.includes(cond)))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='max-w-4xl'
        aria-describedby='dialog-description'
      >
        <DialogHeader>
          <DialogTitle>{alt}</DialogTitle>
          <DialogDescription>
            {imageName && <> File: {imageName}</>}
          </DialogDescription>
        </DialogHeader>
        <div id='dialog-description' className='sr-only'>
          Dialog ini menampilkan gambar radiograf dengan opsi untuk memfilter
          kondisi kesehatan gigi.
        </div>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1 relative'>
            {isPending && (
              <div className='absolute inset-0 flex items-center justify-center bg-black/50 rounded'>
                <span className='text-white'>Memuat filter...</span>
              </div>
            )}
            <img
              src={filteredImage || imageUrl || '/placeholder-image.jpg'}
              alt={alt}
              className='w-full h-auto max-h-[70vh] object-contain rounded'
              onError={() => {
                toast({
                  variant: 'destructive',
                  title: 'Gagal memuat gambar',
                  description: `Tidak dapat memuat gambar: ${filteredImage || imageUrl}`,
                })
              }}
            />
          </div>
          {isOverlay && radiograph && (
            <div className='w-full md:w-64 space-y-4'>
              <h3 className='text-lg font-semibold'>Kondisi Terdeteksi</h3>
              {hasNoConditions ? (
                <p className='text-sm text-muted-foreground'>
                  Tidak ada kondisi terdeteksi pada radiograf ini.
                </p>
              ) : (
                <>
                  <div className='space-y-2'>
                    {labels.map((label) => (
                      <div
                        key={label.name}
                        className='flex items-center space-x-2'
                      >
                        <Checkbox
                          id={label.name}
                          checked={selectedConditions.includes(
                            label.backendName
                          )}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(
                              label.backendName,
                              checked as boolean
                            )
                          }
                          disabled={!label.active}
                        />
                        <Label
                          htmlFor={label.name}
                          className={`text-sm flex items-center gap-2 ${
                            !label.active ? 'text-muted-foreground' : ''
                          }`}
                        >
                          <span
                            className='w-3 h-3 rounded-full inline-block'
                            style={{ backgroundColor: label.color }}
                          ></span>
                          {label.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className='space-y-2'>
                    <Button
                      variant='default'
                      onClick={handleApplyFilter}
                      disabled={isPending}
                      className='w-full'
                    >
                      {isPending ? 'Memuat...' : 'Terapkan'}
                    </Button>
                    <Button
                      onClick={handleResetFilter}
                      disabled={isResetDisabled}
                      variant='outline'
                      className='w-full'
                    >
                      Reset
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
