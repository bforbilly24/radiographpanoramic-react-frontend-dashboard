import axios from 'axios'
import Cookies from 'js-cookie'
import { PredictRequest, PredictResponse } from '@/types/radiograph'
import { ENDPOINTS } from '@/api/api-url'

export const postPredictRadiograph = async (
  data: PredictRequest
): Promise<PredictResponse> => {
  try {
    const accessToken = Cookies.get('accessToken')
    if (!accessToken) {
      throw new Error('No access token found. Please log in.')
    }

    const formData = new FormData()
    formData.append('file', data.file)
    formData.append('patient_name', data.patient_name)

    const response = await axios.post(ENDPOINTS.RADIOGRAPH.PREDICT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return response.data as PredictResponse
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Prediction failed')
    }
    throw new Error('An unexpected error occurred during prediction')
  }
}

export const predictMutation = () => ({
  mutationFn: (data: PredictRequest) => postPredictRadiograph(data),
})
