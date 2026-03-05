import { formatearHora } from '@/utils/format';

interface HeaderProps {
  ultimaActualizacion?: string;
}

export default function Header({ ultimaActualizacion }: HeaderProps) {
  return (
    <header className="bg-primary text-white py-6 px-4 text-center shadow-md">
      <h1 className="text-2xl font-bold mb-1">Linea de Cambio</h1>
      {ultimaActualizacion && (
        <p className="text-sm text-white/80">
          Actualizado: {formatearHora(ultimaActualizacion)}
        </p>
      )}
    </header>
  );
}
