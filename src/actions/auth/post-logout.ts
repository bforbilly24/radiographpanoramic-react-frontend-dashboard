'use server'

import axios from 'axios'
import { ENDPOINTS } from '@/api/api-url'

export async function postLogout(token: string) {
  const response = await axios.post(
    ENDPOINTS.AUTH.LOGOUT,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (response.status === 200) {
    return { message: 'Logout Berhasil' }
  } else {
    throw new Error('Logout Gagal')
  }
}
