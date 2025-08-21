import axios from 'axios'
import { Category } from '@/types/categories'
import { ENDPOINTS } from '@/api/api-url'

interface GetCategoriesConfig {
  token?: string
}

export const getCategories = async (
  config?: GetCategoriesConfig
): Promise<Category[]> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (config?.token) {
      headers['Authorization'] = `Bearer ${config.token}`
    }

    const response = await axios.get(ENDPOINTS.CATEGORIES, {
      headers,
    })

    return response.data as Category[]
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch categories'
      )
    }
    throw new Error('An unexpected error occurred while fetching categories')
  }
}

export const fetchCategoriesQuery = (token?: string) => ({
  queryKey: ['categories', token],
  queryFn: () => getCategories({ token }),
})

export default getCategories
