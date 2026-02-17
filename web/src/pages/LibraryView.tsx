import { useEffect, useState } from 'react';
import { savesService } from '../services/saves';
import { SavedItemCard } from '../components/SavedItemCard';
import { AddLinkModal } from '../components/AddLinkModal';
import type { SavedItem } from '../types';
import { Plus } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

export const LibraryView = () => {
    const [items, setItems] = useState<SavedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Auth check
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) return;
        loadItems();
    }, [isAuthenticated]);

    const loadItems = async () => {
        setIsLoading(true);
        try {
            const data = await savesService.getAll();
            setItems(data.items);
        } catch (error) {
            console.error('Failed to load items', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await savesService.delete(id);
            setItems(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            alert('Failed to delete item');
        }
    };

    if (!isAuthenticated) {
        navigate('/signin');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10 px-4 py-3 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">Library</h1>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </header>

            {/* List */}
            <main className="max-w-2xl mx-auto p-4 space-y-4">
                {isLoading ? (
                    <div className="text-center py-10 text-gray-500">Loading...</div>
                ) : items.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-lg mb-2">No saved items yet</div>
                        <p className="text-sm text-gray-500">Tap the + button to add your first link</p>
                    </div>
                ) : (
                    items.map(item => (
                        <SavedItemCard 
                            key={item.id} 
                            item={item} 
                            onDelete={handleDelete} 
                        />
                    ))
                )}
            </main>

            <AddLinkModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={loadItems}
            />
        </div>
    );
};
