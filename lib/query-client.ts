import { QueryClient } from '@tanstack/react-query';

// Create a client with sensible defaults for a mobile app
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh (5 minutes)
      staleTime: 5 * 60 * 1000,
      // Cache time: how long data stays in cache when not being used (10 minutes)
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times with exponential backoff
      retry: 3,
      // Don't refetch on window focus (good for mobile apps)
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect by default (can be overridden per query)
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});
