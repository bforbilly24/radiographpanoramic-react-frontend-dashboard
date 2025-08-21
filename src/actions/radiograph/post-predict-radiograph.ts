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

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!validTypes.includes(data.file.type)) {
      throw new Error('Invalid file type. Please upload JPG, JPEG, or PNG files only.')
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (data.file.size > maxSize) {
      throw new Error('File size too large. Please upload files smaller than 10MB.')
    }

    const formData = new FormData()
    formData.append('file', data.file)
    formData.append('patient_name', data.patient_name.trim())

    const response = await axios.post(ENDPOINTS.RADIOGRAPH.PREDICT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
      timeout: 300000, // 5 minutes timeout for prediction
    })

    return response.data as PredictResponse
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle specific error messages from backend
      const errorMessage = error.response?.data?.detail || error.response?.data?.message
      
      if (errorMessage) {
        // Handle specific overlay_file_path error
        if (errorMessage.includes('overlay_file_path')) {
          throw new Error('Server error during image processing. Please try again or contact support if the issue persists.')
        }
        
        // Handle other specific errors
        if (errorMessage.includes('F1 failed')) {
          throw new Error('Prediction model failed. Please try with a different image or contact support.')
        }
        
        if (error.response?.status === 413) {
          throw new Error('File size too large. Please upload a smaller image.')
        }
        
        if (error.response?.status === 422) {
          throw new Error('Invalid file format or corrupted image. Please upload a valid radiograph image.')
        }
        
        if (error.response?.status === 500) {
          throw new Error('Server error during prediction. Please try again later.')
        }
        
        throw new Error(errorMessage)
      }
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Prediction timeout. Please try again with a smaller image.')
      }
      
      throw new Error('Network error. Please check your connection and try again.')
    }
    throw new Error('An unexpected error occurred during prediction')
  }
}

export const predictMutation = () => ({
  mutationFn: (data: PredictRequest) => postPredictRadiograph(data),
})
