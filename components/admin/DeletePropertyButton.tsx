'use client';

import { useState } from 'react';
import { deleteProperty } from '@/app/admin/actions';

export default function DeletePropertyButton({ propertyId }: { propertyId: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    setLoading(true);
    try {
      await deleteProperty(propertyId);
    } catch (error) {
      alert('Error deleting property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className={`p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      }`} 
      title="Delete Property"
    >
      <span className="material-icons text-xl">
        {loading ? 'sync' : 'delete_outline'}
      </span>
    </button>
  );
}
