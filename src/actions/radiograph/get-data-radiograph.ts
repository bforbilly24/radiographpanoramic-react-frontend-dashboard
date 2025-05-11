import axios from 'axios';
import Cookies from 'js-cookie';
import { PaginatedRadiographResponse } from '@/types/radiograph';
import { ENDPOINTS } from '@/api/api-url';

const getDataRadiograph = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedRadiographResponse> => {
  try {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
      throw new Error('No access token found. Please log in.');
    }

    const response = await axios.get(ENDPOINTS.RADIOGRAPH.GET, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data as PaginatedRadiographResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to the backend server. Please ensure the server is running.');
      }
      throw new Error(
        error.response?.data?.detail || 'Failed to fetch radiographs'
      );
    }
    throw new Error('An unexpected error occurred');
  }
};

export { getDataRadiograph };