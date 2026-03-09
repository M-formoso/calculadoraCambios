import { useQuery } from '@tanstack/react-query';
import { cotizacionService } from '@/services/cotizacionService';
import { Cotizacion } from '@/types/cotizacion';

const POLLING_INTERVAL = parseInt(import.meta.env.VITE_POLLING_INTERVAL || '60000');

// Orden deseado de las divisas
const ORDEN_DIVISAS = ['dolar_blue', 'euro_blue', 'usdt'];

// Función para limpiar el nombre (quitar "Blue")
const limpiarNombre = (nombre: string): string => {
  return nombre.replace(/ Blue$/i, '');
};

export function useCotizaciones() {
  return useQuery({
    queryKey: ['cotizaciones'],
    queryFn: cotizacionService.obtenerCotizaciones,
    refetchInterval: POLLING_INTERVAL,
    staleTime: POLLING_INTERVAL - 5000,
    select: (data: Cotizacion[]) => {
      // Ordenar según el orden definido y limpiar nombres
      return data
        .map(cot => ({ ...cot, nombre: limpiarNombre(cot.nombre) }))
        .sort((a, b) => {
          const indexA = ORDEN_DIVISAS.indexOf(a.divisa);
          const indexB = ORDEN_DIVISAS.indexOf(b.divisa);
          return indexA - indexB;
        });
    },
  });
}
