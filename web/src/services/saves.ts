import axios from 'axios';
import type { SavedItem } from '../types';
import { useAuthStore } from '../stores/authStore';

const API_URL = 'http://localhost:3000/api/v1';

const getHeaders = () => {
    const token = useAuthStore.getState().token;
    return {
        Authorization: `Bearer ${token}`
    };
};

export const savesService = {
    getAll: async (page = 1, limit = 20) => {
        const response = await axios.get<{ items: SavedItem[], pagination: any }>(`${API_URL}/saves`, {
            params: { page, limit },
            headers: getHeaders()
        });
        return response.data;
    },

    create: async (url: string, note?: string) => {
        const response = await axios.post<SavedItem>(`${API_URL}/saves`, { url, note }, {
            headers: getHeaders()
        });
        return response.data;
    },

    delete: async (id: string) => {
        await axios.delete(`${API_URL}/saves/${id}`, {
            headers: getHeaders()
        });
    }
};
