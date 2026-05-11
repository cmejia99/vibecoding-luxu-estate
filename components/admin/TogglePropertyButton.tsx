'use client';

import { useState } from 'react';
import { togglePropertyStatus } from '@/app/admin/actions';

interface TogglePropertyButtonProps {
  propertyId: string;
  isActive: boolean;
}

export default function TogglePropertyButton({ propertyId, isActive }: TogglePropertyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(isActive);

  const handleToggle = async () => {
    const action = active ? 'desactivar' : 'activar';
    if (!confirm(`¿Estás seguro de que deseas ${action} esta propiedad?`)) return;

    setLoading(true);
    try {
      await togglePropertyStatus(propertyId, !active);
      setActive((prev) => !prev);
    } catch {
      alert(`Error al ${action} la propiedad`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-lg transition-all ${
        loading
          ? 'opacity-50 cursor-not-allowed text-gray-400'
          : active
          ? 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
          : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
      }`}
      title={active ? 'Desactivar propiedad' : 'Activar propiedad'}
    >
      <span className="material-icons text-xl">
        {loading ? 'sync' : active ? 'visibility' : 'visibility_off'}
      </span>
    </button>
  );
}
