import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DataManager from './DataManager';

// Main App component serving as the entry point with QueryClient configuration
const App: React.FC = () => {
  // Initialize QueryClient for TanStack Query with default options
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2, // Retry failed queries twice
        staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
        refetchOnWindowFocus: false, // Disable refetch on window focus
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Product List</h1>
        <DataManager />
      </div>
    </QueryClientProvider>
  );
};

export default App;