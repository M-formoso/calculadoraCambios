import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { formatearHora } from '@/utils/format';
import { useAuthStore } from '@/stores/authStore';

interface HeaderProps {
  ultimaActualizacion?: string;
}

export default function Header({ ultimaActualizacion }: HeaderProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleAdminClick = () => {
    if (isAuthenticated) {
      navigate('/admin');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="bg-primary text-white py-4 px-4 shadow-md">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-xl font-bold">Linea de Cambio</h1>
          {ultimaActualizacion && (
            <p className="text-xs text-white/80">
              Actualizado: {formatearHora(ultimaActualizacion)}
            </p>
          )}
        </div>
        <button
          onClick={handleAdminClick}
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
          title="Panel de administracion"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
