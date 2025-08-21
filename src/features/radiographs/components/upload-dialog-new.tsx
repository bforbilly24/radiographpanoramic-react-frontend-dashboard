// src/features/radiographs/components/upload-dialog.tsx
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { predictMutation } from '@/actions/radiograph/post-predict-radiograph'
import { PredictRequest } from '@/types/radiograph'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/shadcn/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/shadcn/form'
import { MultiStepLoader } from '@/components/ui/aceternity/multi-step-loader'
import { loadingStates } from '../data/loading-state'
import { uploadFormSchema } from '../data/schema'
import { FileUpload } from './file-upload'
import { DebugInfo } from './debug-info'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function UploadDialog({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient()
  const [showLoader, setShowLoader] = useState(false)
  const [lastError, setLastError] = useState<Error | null>(null)

  const { mutate, isPending } = useMutation({
    ...predictMutation(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['radiographs'] })
      toast({
        title: 'Proses selesai!',
        description: `Radiograf untuk pasien "${data.patient_name}" berhasil diunggah dan diprediksi.`,
      })
      setShowLoader(false)
      onOpenChange(false)
      form.reset()
      setLastError(null)
    },
    onError: (error) => {
      console.error('Prediction error:', error)
      setLastError(error)
      
      let title = 'Proses gagal'
      let description = error.message || 'Gagal mengunggah radiograf.'
      
      // Customize error messages for better UX
      if (error.message.includes('overlay_file_path')) {
        title = 'Error Server'
        description = 'Terjadi kesalahan pada server saat memproses gambar. Silakan coba lagi atau hubungi support.'
      } else if (error.message.includes('F1 failed')) {
        title = 'Model Prediksi Gagal'
        description = 'Model prediksi tidak dapat memproses gambar ini. Coba gunakan gambar radiograf lainnya.'
      } else if (error.message.includes('timeout')) {
        title = 'Timeout'
        description = 'Proses prediksi memakan waktu terlalu lama. Coba gunakan gambar yang lebih kecil.'
      } else if (error.message.includes('file size')) {
        title = 'Ukuran File Terlalu Besar'
        description = 'Silakan upload gambar dengan ukuran lebih kecil (maksimal 10MB).'
      } else if (error.message.includes('Invalid file')) {
        title = 'Format File Tidak Valid'
        description = 'Silakan upload file dalam format JPG, JPEG, atau PNG.'
      }
      
      toast({
        variant: 'destructive',
        title,
        description,
      })
      setShowLoader(false)
      // Don't close dialog on error to allow retry
    },
  })

  const form = useForm<z.infer<typeof uploadFormSchema>>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      file: [],
      patient_name: '',
    },
  })

  const onSubmit = (values: z.infer<typeof uploadFormSchema>) => {
    const predictData: PredictRequest = {
      file: values.file[0],
      patient_name: values.patient_name,
    }
    setShowLoader(true)
    setLastError(null) // Clear previous errors
    mutate(predictData)
  }

  const handleLoaderClose = () => {
    setShowLoader(false)
    onOpenChange(false)
    toast({
      title: 'Proses berjalan di latar belakang',
      description: 'Anda akan diberi tahu saat proses selesai.',
    })
  }

  const handleDialogOpenChange = (val: boolean) => {
    if (!val) {
      setLastError(null) // Clear errors when closing dialog
    }
    onOpenChange(val)
    form.reset()
  }

  return (
    <>
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={showLoader}
        duration={1000}
        loop={false}
        onClose={handleLoaderClose}
      />
      <Dialog
        open={open && !showLoader}
        onOpenChange={handleDialogOpenChange}
      >
        <DialogContent className='sm:max-w-lg gap-6 bg-white dark:bg-neutral-900 rounded-lg shadow-lg'>
          <DialogHeader className='text-left'>
            <DialogTitle className='text-2xl font-bold text-neutral-900 dark:text-neutral-100'>
              Impor Radiograf
            </DialogTitle>
            <DialogDescription className='text-neutral-600 dark:text-neutral-400'>
              Unggah gambar radiografi (JPG, JPEG, atau PNG) dan berikan nama
              pasien.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              id='radiographs-import-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
            >
              <FormField
                control={form.control}
                name='patient_name'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                      Nama Pasien
                    </FormLabel>
                    <FormControl>
                      <motion.input
                        type='text'
                        placeholder='Masukkan Nama Pasien'
                        className={cn(
                          'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm',
                          'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                          'dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700'
                        )}
                        whileFocus={{ scale: 1.02 }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-xs text-red-500' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='file'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                      Gambar Radiograf
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        onChange={(files) => {
                          field.onChange(files)
                          form.trigger('file')
                          // Clear errors when new file is selected
                          if (files.length > 0) {
                            setLastError(null)
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage className='text-xs text-red-500' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          
          {/* Debug Information - only shown when there's an error or in development */}
          <DebugInfo 
            error={lastError} 
            file={form.watch('file')?.[0] || null}
            patientName={form.watch('patient_name')}
          />
          
          <DialogFooter className='flex justify-end gap-3'>
            <DialogClose asChild>
              <Button disabled={isPending} variant='outline' size='lg'>
                Batal
              </Button>
            </DialogClose>
            <Button
              type='submit'
              form='radiographs-import-form'
              disabled={isPending}
              variant='default'
              size='lg'
            >
              {isPending ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className='mr-2 inline-block'
                >
                  ⏳
                </motion.span>
              ) : null}
              {isPending ? 'Mengunggah...' : 'Unggah'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { UploadDialog }
