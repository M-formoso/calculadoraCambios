import { useNavigate } from 'react-router-dom';
import { Settings, TrendingUp } from 'lucide-react';
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
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <TrendingUp className="h-6 w-6 md:h-7 md:w-7" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Linea de Cambio</h1>
            {ultimaActualizacion && (
              <p className="text-xs md:text-sm text-blue-100">
                Actualizado: {formatearHora(ultimaActualizacion)}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleAdminClick}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105"
          title="Panel de administracion"
        >
          <Settings className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      </div>
    </header>
  );
}
