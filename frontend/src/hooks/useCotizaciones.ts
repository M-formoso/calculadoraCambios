import { useQuery } from '@tanstack/react-query';
import { cotizacionService } from '@/services/cotizacionService';

const POLLING_INTERVAL = parseInt(import.meta.env.VITE_POLLING_INTERVAL || '60000');

export function useCotizaciones() {
  return useQuery({
    queryKey: ['cotizaciones'],
    queryFn: cotizacionService.obtenerCotizaciones,
    refetchInterval: POLLING_INTERVAL,
    staleTime: POLLING_INTERVAL - 5000,
  });
}
