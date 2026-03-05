import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cotizacion, Divisa, Operacion } from '@/types/cotizacion';
import { formatearPrecioSinSimbolo } from '@/utils/format';

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
    <Card className="p-4 bg-white">
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-2xl">{cotizacion.emoji}</span>
        <h3 className="text-lg font-semibold text-gray-800">{cotizacion.nombre}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Columna VOS VENDES - precio que la casa paga */}
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase mb-1">Vos vendes</p>
          <p className="text-2xl font-bold text-gray-800 mb-2">
            ${formatearPrecioSinSimbolo(cotizacion.precioCompra)}
          </p>
          <Button
            variant="default"
            className="w-full"
            onClick={handleVender}
          >
            VENDER
          </Button>
        </div>

        {/* Columna VOS COMPRAS - precio que la casa cobra */}
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase mb-1">Vos compras</p>
          <p className="text-2xl font-bold text-gray-800 mb-2">
            ${formatearPrecioSinSimbolo(cotizacion.precioVenta)}
          </p>
          <Button
            variant="success"
            className="w-full"
            onClick={handleComprar}
          >
            COMPRAR
          </Button>
        </div>
      </div>
    </Card>
  );
}
