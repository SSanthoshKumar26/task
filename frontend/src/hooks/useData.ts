import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { fetchTransactions, fetchPresets, createPreset, deletePreset, seedData } from '../services/api';
import { FilterConfig, Preset } from '../types';

export const useTransactions = (
    page: number,
    limit: number,
    sort_by: string,
    order: 'asc' | 'desc',
    filters?: FilterConfig
) => {
    return useQuery({
        queryKey: ['transactions', page, limit, sort_by, order, filters],
        queryFn: () => fetchTransactions(page, limit, sort_by, order, filters),
        placeholderData: keepPreviousData,
        staleTime: 5000,
    });
};

export const usePresets = () => {
    return useQuery({
        queryKey: ['presets'],
        queryFn: fetchPresets,
    });
};

export const useCreatePreset = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPreset,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['presets'] });
        }
    });
}

export const useDeletePreset = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePreset,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['presets'] });
        }
    });
}

export const useSeedData = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: seedData,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        }
    });
}
