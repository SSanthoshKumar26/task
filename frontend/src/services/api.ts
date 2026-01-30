import axios from 'axios';
import { ApiResponse, Transaction, Preset, FilterConfig } from '../types';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});

export const fetchTransactions = async (
    page: number,
    limit: number,
    sort_by: string,
    order: 'asc' | 'desc',
    filters?: FilterConfig
): Promise<ApiResponse<Transaction>> => {
    const params: any = { page, limit, sort_by, order };
    if (filters && filters.rules.length > 0) {
        params.filters = JSON.stringify(filters);
    }
    const { data } = await api.get<ApiResponse<Transaction>>('/transactions', { params });
    return data;
};

export const fetchPresets = async (): Promise<Preset[]> => {
    const { data } = await api.get<Preset[]>('/presets');
    return data;
};

export const createPreset = async (preset: Preset): Promise<Preset> => {
    const { data } = await api.post<Preset>('/presets', preset);
    return data;
};

export const deletePreset = async (id: number): Promise<void> => {
    await api.delete(`/presets/${id}`);
};

export const seedData = async () => {
    await api.post('/seed');
}
