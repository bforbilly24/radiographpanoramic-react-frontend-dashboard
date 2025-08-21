import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { AxiosError } from 'axios';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import './styles/fonts.css';
import './styles/global.css';
import { useAuthStore } from '@/stores/authStore';
import { handleServerError } from '@/utils/handle-server-error';
import { toast } from '@/hooks/use-toast';
import { ThemeProvider } from './context/theme-context';
import { routeTree } from './routeTree.gen';

// Create router first
const router = createRouter({
  routeTree,
  context: { queryClient: {} as QueryClient }, // Temporary, will be updated
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  basepath: '/',
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (import.meta.env.DEV) {
          if (failureCount >= 0) return false;
        }
        if (failureCount > 3 && import.meta.env.PROD) return false;

        return !(
          error instanceof AxiosError &&
          [401, 403].includes(error.response?.status ?? 0)
        );
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 10 * 1000,
    },
    mutations: {
      onError: (error) => {
        handleServerError(error);

        if (error instanceof AxiosError) {
          if (error.response?.status === 304) {
            toast({
              variant: 'destructive',
              title: 'Content not modified!',
            });
          }
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast({
            variant: 'destructive',
            title: 'Session expired!',
          });
          useAuthStore.getState().auth.reset();
          const redirect = `${router.history.location.href}`;
          router.navigate({ to: '/sign-in', search: { redirect } });
        }
        if (error.response?.status === 500) {
          toast({
            variant: 'destructive',
            title: 'Internal Server Error!',
          });
          router.navigate({ to: '/500' });
        }
        if (error.response?.status === 403) {
          toast({
            variant: 'destructive',
            title: 'Forbidden!',
          });
          router.navigate({ to: '/403' });
        }
      }
    },
  }),
});

// Update router context with the actual queryClient
router.update({
  context: { queryClient },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultMode="light" storageKeyMode="vite-ui-mode">
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}