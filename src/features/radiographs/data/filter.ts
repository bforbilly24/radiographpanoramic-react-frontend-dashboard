import { IconCircleCheck, IconClock, IconCircleX } from '@tabler/icons-react'

const statuses = [
  {
    value: 'success',
    label: 'Sukses',
    icon: IconCircleCheck,
  },
  {
    value: 'process',
    label: 'Proses',
    icon: IconClock,
  },
  {
    value: 'failed',
    label: 'Gagal',
    icon: IconCircleX,
  },
]

const conditionOptions = [
  { label: 'Karies', value: 'has_karies' },
  { label: 'Lesi Periapikal', value: 'has_lesi_periapikal' },
  { label: 'Resorpsi', value: 'has_resorpsi' },
  { label: 'Impaksi', value: 'has_impaksi' },
]

export { statuses, conditionOptions }
