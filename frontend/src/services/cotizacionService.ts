import api from './api';
import { Cotizacion, CotizacionApiResponse, CotizacionUpdate, mapCotizacionFromApi } from '@/types/cotizacion';

export const cotizacionService = {
  obtenerCotizaciones: async (): Promise<Cotizacion[]> => {
    const response = await api.get<CotizacionApiResponse[]>('/cotizaciones');
    return response.data.map(mapCotizacionFromApi);
  },

  actualizarCotizaciones: async (cotizaciones: CotizacionUpdate[]): Promise<Cotizacion[]> => {
    const response = await api.put<CotizacionApiResponse[]>('/cotizaciones', cotizaciones);
    return response.data.map(mapCotizacionFromApi);
  },
};
