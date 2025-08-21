// src/actions/radiograph/post-filter-radiograph.ts
import axios from 'axios'
import Cookies from 'js-cookie'
import {
  FilterRadiographRequest,
  FilterRadiographResponse,
} from '@/types/radiograph'
import { ENDPOINTS } from '@/api/api-url'

export const filterRadiograph = async (
  data: FilterRadiographRequest
): Promise<FilterRadiographResponse> => {
  try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
      throw new Error('No access token found. Please log in.')
    }

    const response = await axios.post(ENDPOINTS.RADIOGRAPH.FILTER, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    return response.data as FilterRadiographResponse
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to apply filter')
    }
    throw new Error('An unexpected error occurred')
  }
}
