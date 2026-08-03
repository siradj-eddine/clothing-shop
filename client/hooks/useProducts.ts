import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: any) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
  categories: () => [...productKeys.all, 'categories'] as const,
};

export const useProducts = (filters?: {
  page?: number;
  page_size?: number;
  search?: string;
  size?: string;
  ordering?: string;
}) => {
  return useQuery({
    queryKey: productKeys.list(filters || {}),
    queryFn: () => productsApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => productsApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: () => productsApi.getCategories(),
    staleTime: 30 * 60 * 1000,
  });
};
