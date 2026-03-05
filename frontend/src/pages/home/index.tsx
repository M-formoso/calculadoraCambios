import Header from '@/components/layout/Header';
import CotizacionCard from '@/components/cotizaciones/CotizacionCard';
import Calculadora from '@/components/calculadora/Calculadora';
import { useCotizaciones } from '@/hooks/useCotizaciones';
import { useCalculadoraStore } from '@/stores/calculadoraStore';
import { Divisa, Operacion } from '@/types/cotizacion';

export default function HomePage() {
  const { data: cotizaciones, isLoading, error } = useCotizaciones();
  const setPreseleccion = useCalculadoraStore((state) => state.setPreseleccion);

  const handleAccion = (divisa: Divisa, operacion: Operacion) => {
    setPreseleccion(divisa, operacion);
  };

  const ultimaActualizacion = cotizaciones?.[0]?.actualizadoAt;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-500 mb-2">Error al cargar las cotizaciones</p>
          <p className="text-gray-500 text-sm">Por favor, intente nuevamente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header ultimaActualizacion={ultimaActualizacion} />

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Tarjetas de cotizaciones */}
        <section className="space-y-4">
          {cotizaciones?.map((cotizacion) => (
            <CotizacionCard
              key={cotizacion.id}
              cotizacion={cotizacion}
              onAccion={handleAccion}
            />
          ))}
        </section>

        {/* Calculadora */}
        {cotizaciones && <Calculadora cotizaciones={cotizaciones} />}
      </main>
    </div>
  );
}
