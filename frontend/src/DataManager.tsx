import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import ProductCard from './ProductCard';

// Interface for API response
interface ApiResponse {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    data: Product[];
}

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
}

// DataManager component for fetching and rendering products with infinite scroll
const DataManager: React.FC = () => {
    // Fetch products using useInfiniteQuery
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery<ApiResponse, Error>({
        queryKey: ['products'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await fetch(`http://localhost:3000/api/products?page=${pageParam}&limit=12`);
            if (!response.ok) throw new Error('Failed to fetch products');
            return response.json();
        },
        getNextPageParam: (lastPage, allpage) => {
            const page = allpage.length
            return page < lastPage.totalPages ? page + 1 : undefined
        }
    });

    // Handle infinite scroll with IntersectionObserver
    const observer = React.useRef<IntersectionObserver | null>(null);
    const lastProductRef = React.useCallback(
        (node: HTMLDivElement | null) => {
            if (isFetchingNextPage || isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            });
            if (node) observer.current.observe(node);
        },
        [isFetchingNextPage, isLoading, hasNextPage, fetchNextPage]
    );

    // Flatten pages into a single array of products
    const products = data?.pages.flatMap((page) => page.data) || [];
   
    // Render loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    // Render error state
    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 text-lg">Error: {error.message}</p>
            </div>
        );
    }

    // Render product grid
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
                <div
                    key={product.id}
                    ref={index === products.length - 1 ? lastProductRef : null}
                >
                    <ProductCard product={product} />
                </div>
            ))}
            {isFetchingNextPage && (
                <div className="flex justify-center mt-4 col-span-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                </div>
            )}
        </div>
    );
};

export default DataManager;