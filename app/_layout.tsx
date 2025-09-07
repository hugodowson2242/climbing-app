import { AuthProvider } from '@/contexts/auth-context';
import { queryClient } from '@/lib/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack />
      </AuthProvider>
    </QueryClientProvider>
  );
}
