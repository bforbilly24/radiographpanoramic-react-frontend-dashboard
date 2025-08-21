'use server'

import axios from 'axios'
import { apiUrl } from '@/types/environment'

async function getServerstatus() {
  try {
    const res = await axios.get(`${apiUrl}/status`, {
      headers: {
        'Cache-Control': 'no-store',
      },
    })

    const data = res.data

    const status = data.status
    const cpuUsage = data.details.cpu_usage
    const memoryUsage = data.details.memory_usage
    const diskFreeSpace = data.details.disk_free_space
    const diskTotalSpace = data.details.disk_total_space

    return {
      status,
      cpuUsage,
      memoryUsage,
      diskFreeSpace,
      diskTotalSpace,
    }
  } catch {
    return { error: 'Unable to fetch server status' }
  }
}

export { getServerstatus }
