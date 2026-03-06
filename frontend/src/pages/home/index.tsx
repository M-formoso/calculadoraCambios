import Header from '@/components/layout/Header';
import CotizacionCard from '@/components/cotizaciones/CotizacionCard';
import Calculadora from '@/components/calculadora/Calculadora';
import { useCotizaciones } from '@/hooks/useCotizaciones';
import { useCalculadoraStore } from '@/stores/calculadoraStore';
import { Divisa, Operacion } from '@/types/cotizacion';
import { TrendingUp } from 'lucide-react';

export default function HomePage() {
  const { data: cotizaciones, isLoading, error } = useCotizaciones();
  const setPreseleccion = useCalculadoraStore((state) => state.setPreseleccion);

  const handleAccion = (divisa: Divisa, operacion: Operacion) => {
    setPreseleccion(divisa, operacion);
  };

  const ultimaActualizacion = cotizaciones?.[0]?.actualizadoAt;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando cotizaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-2xl shadow-sm max-w-sm mx-4">
          <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
            <TrendingUp className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-gray-800 font-medium mb-2">Error al cargar las cotizaciones</p>
          <p className="text-gray-500 text-sm">Por favor, intente nuevamente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header ultimaActualizacion={ultimaActualizacion} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Layout responsive: en desktop side by side, en mobile stack */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna de cotizaciones */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-800">Cotizaciones del dia</h2>
            </div>
            <div className="space-y-4">
              {cotizaciones?.map((cotizacion) => (
                <CotizacionCard
                  key={cotizacion.id}
                  cotizacion={cotizacion}
                  onAccion={handleAccion}
                />
              ))}
            </div>
          </section>

          {/* Columna de calculadora */}
          <section className="lg:sticky lg:top-8 lg:self-start">
            {cotizaciones && <Calculadora cotizaciones={cotizaciones} />}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 py-6 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            Linea de Cambio - Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}
