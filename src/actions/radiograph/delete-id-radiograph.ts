import axios from 'axios'
import Cookies from 'js-cookie'
import { ENDPOINTS } from '@/api/api-url'

interface DeleteResponse {
  message: string
}

const deleteIdRadiograph = async (id: number): Promise<DeleteResponse> => {
  try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
      throw new Error('No access token found. Please log in.')
    }

    const response = await axios.delete(
      `${ENDPOINTS.RADIOGRAPH.DELETE}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    return response.data as DeleteResponse
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_NETWORK') {
        throw new Error(
          'Cannot connect to the backend server. Please ensure the server is running.'
        )
      }
      throw new Error(
        error.response?.data?.detail || 'Failed to delete radiograph'
      )
    }
    throw new Error('An unexpected error occurred during deletion')
  }
}

export { deleteIdRadiograph }
