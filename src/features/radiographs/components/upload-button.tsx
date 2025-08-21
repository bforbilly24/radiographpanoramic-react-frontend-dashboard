// src/features/radiographs/components/radiographs-dialogs.tsx
import { useRadiographs } from '../context/radiographs-context'
import { UploadDialog } from './upload-dialog'

function UploadButton() {
  const { open, setOpen } = useRadiographs()
  return (
    <>
      <UploadDialog
        key='radiographs-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />
    </>
  )
}

export { UploadButton }
