// src/actions/radiograph/delete-bulk-radiograph.ts
import axios from 'axios'
import Cookies from 'js-cookie'
import { BulkDeleteResponse } from '@/types/radiograph'
import { ENDPOINTS } from '@/api/api-url'

interface BulkDeleteRequest {
  ids: number[]
}

const deleteBulkRadiograph = async (
  data: BulkDeleteRequest
): Promise<BulkDeleteResponse> => {
  try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
      throw new Error('No access token found. Please log in.')
    }

    const response = await axios.delete(ENDPOINTS.RADIOGRAPH.DELETE_BULK, {
      data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    return response.data as BulkDeleteResponse
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_NETWORK') {
        throw new Error(
          'Cannot connect to the backend server. Please ensure the server is running.'
        )
      }
      throw new Error(
        error.response?.data?.detail || 'Failed to delete radiographs'
      )
    }
    throw new Error('An unexpected error occurred during bulk deletion')
  }
}


export { deleteBulkRadiograph }