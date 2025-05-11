import { useRef, useState } from 'react'
import { IconUpload } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
}

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
}

interface FileUploadProps {
  onChange?: (files: File[]) => void
}

export const FileUpload = ({ onChange }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      const selectedFile = newFiles[0]
      setFile(selectedFile)
      onChange?.([selectedFile])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const clearFile = () => {
    setFile(null)
    onChange?.([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    onDrop: handleFileChange,
    onDropRejected: (fileRejections) => {
      fileRejections.forEach((rejection) => {
        const errorMessage =
          rejection.errors[0]?.message || 'Jenis atau ukuran file tidak valid'
        toast({
          variant: 'destructive',
          title: 'Gagal Menupload File',
          description: errorMessage,
        })
      })
    },
  })

  return (
    <div
      className='w-full'
      {...getRootProps()}
      role='region'
      aria-label='File upload dropzone'
    >
      <motion.div
        onClick={handleClick}
        whileHover='animate'
        className='p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden'
      >
        <input
          ref={fileInputRef}
          id='file-upload-handle'
          type='file'
          accept='image/jpeg,image/jpg,image/png'
          multiple={false}
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className='hidden'
        />
        <div className='absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]'>
          <GridPattern />
        </div>
        <div className='flex flex-col items-center justify-center'>
          {/* <p className='relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base'>
            Upload gambar
          </p> */}
          <p className='relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base text-center mt-2'>
            Seret atau jatuhkan satu file gambar di sini atau klik untuk mengunggah
          </p>
          <div className='relative w-full max-w-xl mx-auto'>
            {file && (
              <motion.div
                key='file'
                layoutId='file-upload'
                className={cn(
                  'relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start p-4 mt-4 w-full mx-auto rounded-md',
                  'shadow-sm'
                )}
              >
                <div className='flex justify-between w-full items-center gap-4'>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className='text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs'
                  >
                    {file.name}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className='rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input'
                  >
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </motion.p>
                </div>
                <div className='flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400'>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    className='px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800'
                  >
                    {file.type}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                  >
                    dimodifikasi {new Date(file.lastModified).toLocaleDateString()}
                  </motion.p>
                </div>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={clearFile}
                  className='mt-2 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300'
                >
                  Hapus
                </motion.button>
              </motion.div>
            )}
            {!file && (
              <motion.div
                layoutId='file-upload'
                variants={mainVariant}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={cn(
                  'relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md',
                  'shadow-[0px_10px_50px_rgba(0,0,0,0.1)]'
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='text-neutral-600 flex flex-col items-center'
                  >
                    Drop it
                    <IconUpload className='h-4 w-4 text-neutral-600 dark:text-neutral-400' />
                  </motion.p>
                ) : (
                  <IconUpload className='h-4 w-4 text-neutral-600 dark:text-neutral-300' />
                )}
              </motion.div>
            )}
            {!file && (
              <motion.div
                variants={secondaryVariant}
                className='absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md'
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function GridPattern() {
  const columns = 41
  const rows = 11
  return (
    <div className='flex bg-gray-100 dark:bg-neutral-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105'>
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? 'bg-gray-50 dark:bg-neutral-950'
                  : 'bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]'
              }`}
            />
          )
        })
      )}
    </div>
  )
}
