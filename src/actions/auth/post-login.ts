import axios from 'axios';
import { ENDPOINTS } from '@/api/api-url';
import { LoginRequest, LoginResponse } from '@/types/auth';
import { useAuthStore } from '@/stores/authStore';

export const postLogin = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axios.post(ENDPOINTS.AUTH.LOGIN, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const loginResponse = response.data as { status_code: number; message: string; data: { access_token: string; token_type: string }; error: null | string };
    const setAccessToken = useAuthStore.getState().auth.setAccessToken;
    const setUser = useAuthStore.getState().auth.setUser;

    setAccessToken(loginResponse.data.access_token);
    setUser({
      id: 'unknown',
      email: data.email,
    });

    return {
      accessToken: loginResponse.data.access_token,
      tokenType: loginResponse.data.token_type,
      message: loginResponse.message,
    } as LoginResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error ||
          'Login failed. Please check your credentials.'
      );
    }
    throw new Error('An unexpected error occurred during login');
  }
};