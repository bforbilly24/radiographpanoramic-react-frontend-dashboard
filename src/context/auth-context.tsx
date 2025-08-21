import { createContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '@/stores/authStore';
import { postLogout } from '@/actions/auth/post-logout';

interface JwtPayload {
  exp: number;
  sub: string;
  role: string;
  email?: string;
  name?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean; // Add loading state
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Track loading
  const navigate = useNavigate();

  const checkToken = useCallback(() => {
    const accessToken = Cookies.get('accessToken');
    const currentPath = window.location.pathname;
    
    // Don't redirect if on public routes
    const publicRoutes = ['/sign-in', '/sign-up', '/forgot-password', '/otp', '/'];
    const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));
    
    if (!accessToken) {
      setIsAuthenticated(false);
      setIsLoading(false);
      
      // Only redirect if on protected route
      if (!isPublicRoute && !currentPath.startsWith('/_authenticated')) {
        navigate({ to: '/sign-in', search: { redirect: window.location.pathname } });
      }
      return;
    }

    try {
      const decoded: JwtPayload = jwtDecode(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        Cookies.remove('accessToken', { path: '/' });
        setIsAuthenticated(false);
        
        // Only redirect if on protected route
        if (!isPublicRoute) {
          navigate({ to: '/sign-in', search: { redirect: window.location.pathname } });
        }
      } else {
        // Only update user info if not already set (preserve login email)
        const currentUser = useAuthStore.getState().auth.user;
        if (!currentUser) {
          const setUser = useAuthStore.getState().auth.setUser;
          setUser({
            id: decoded.sub,
            email: decoded.email || 'superadmin@mail.com',
          });
        }
        
        setIsAuthenticated(true);
      }
    } catch {
      Cookies.remove('accessToken', { path: '/' });
      setIsAuthenticated(false);
      
      // Only redirect if on protected route  
      if (!isPublicRoute) {
        navigate({ to: '/sign-in', search: { redirect: window.location.pathname } });
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    checkToken(); // Run synchronously on mount
    
    // Check token every minute
    const interval = setInterval(checkToken, 60000);
    
    // Listen for page visibility changes
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkToken(); // Re-check when page becomes visible
      }
    };
    
    // Listen for browser back/forward navigation
    const handlePopState = () => {
      checkToken(); // Re-check on navigation
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [checkToken]);

  const logout = async () => {
    const accessToken = Cookies.get('accessToken')
    
    try {
      // Call logout API if token exists
      if (accessToken) {
        await postLogout(accessToken)
      }
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error)
    } finally {
      // Clear all auth data
      const { resetAccessToken, reset } = useAuthStore.getState().auth
      resetAccessToken()
      reset()
      Cookies.remove('accessToken')
      setIsAuthenticated(false)
      navigate({ to: '/sign-in' })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Memuat autentikasi...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}