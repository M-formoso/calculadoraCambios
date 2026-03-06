import { Cotizacion, Divisa, Operacion } from '@/types/cotizacion';
import { formatearPrecioSinSimbolo } from '@/utils/format';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface CotizacionCardProps {
  cotizacion: Cotizacion;
  onAccion: (divisa: Divisa, operacion: Operacion) => void;
}

export default function CotizacionCard({ cotizacion, onAccion }: CotizacionCardProps) {
  const handleVender = () => {
    onAccion(cotizacion.divisa as Divisa, 'vender');
  };

  const handleComprar = () => {
    onAccion(cotizacion.divisa as Divisa, 'comprar');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
      {/* Header de la tarjeta */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{cotizacion.emoji}</span>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{cotizacion.nombre}</h3>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Cotizacion actual</p>
          </div>
        </div>
      </div>

      {/* Precios */}
      <div className="grid grid-cols-2 divide-x divide-gray-100">
        {/* Columna VOS VENDES */}
        <button
          onClick={handleVender}
          className="p-5 hover:bg-blue-50 transition-colors duration-200 group"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <ArrowDownCircle className="h-4 w-4 text-blue-500" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Vos vendes</p>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            ${formatearPrecioSinSimbolo(cotizacion.precioCompra)}
          </p>
          <div className="bg-blue-600 text-white py-2.5 px-4 rounded-xl font-semibold text-sm group-hover:bg-blue-700 transition-colors">
            VENDER
          </div>
        </button>

        {/* Columna VOS COMPRAS */}
        <button
          onClick={handleComprar}
          className="p-5 hover:bg-green-50 transition-colors duration-200 group"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <ArrowUpCircle className="h-4 w-4 text-green-500" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Vos compras</p>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            ${formatearPrecioSinSimbolo(cotizacion.precioVenta)}
          </p>
          <div className="bg-green-600 text-white py-2.5 px-4 rounded-xl font-semibold text-sm group-hover:bg-green-700 transition-colors">
            COMPRAR
          </div>
        </button>
      </div>
    </div>
  );
}
