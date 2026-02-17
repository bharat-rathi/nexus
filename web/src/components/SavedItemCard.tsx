import type { SavedItem } from '../types';
import { ExternalLink, Trash2, Clock } from 'lucide-react';

interface Props {
  item: SavedItem;
  onDelete: (id: string) => void;
}

export const SavedItemCard = ({ item, onDelete }: Props) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                {item.sourceApp && (
                    <span className="font-medium text-gray-700">{item.sourceApp}</span>
                )}
                <span>•</span>
                <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(item.createdAt).toLocaleDateString()}
                </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                <a href={item.url || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                    {item.title || item.url || 'Untitled'}
                </a>
            </h3>
            
            {item.note && (
                <p className="text-gray-600 text-sm mb-3 bg-gray-50 p-2 rounded">
                    "{item.note}"
                </p>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
                {item.tags.map(tag => (
                    <span key={tag.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {tag.name}
                    </span>
                ))}
            </div>
        </div>

        <div className="flex space-x-2 ml-4">
            {item.url && (
                <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1 text-gray-400 hover:text-gray-600"
                >
                    <ExternalLink className="w-5 h-5" />
                </a>
            )}
            <button 
                onClick={() => onDelete(item.id)}
                className="p-1 text-gray-400 hover:text-red-600"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};
