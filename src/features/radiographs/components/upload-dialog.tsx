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

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}
function UploadDialog({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient()
  const [showLoader, setShowLoader] = useState(false)

  const { mutate, isPending } = useMutation({
    ...predictMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['radiographs'] })
      toast({
        title: 'Proses selesai!',
        description: 'Radiograf berhasil diunggah dan diprediksi.',
      })
      setShowLoader(false)
      onOpenChange(false)
      form.reset()
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Proses gagal',
        description: error.message || 'Gagal mengunggah radiograf.',
      })
      setShowLoader(false)
      onOpenChange(false)
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
        onOpenChange={(val) => {
          onOpenChange(val)
          form.reset()
        }}
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
                        }}
                      />
                    </FormControl>
                    <FormMessage className='text-xs text-red-500' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
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
