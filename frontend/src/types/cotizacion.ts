export interface Cotizacion {
  id: string;
  divisa: string;
  nombre: string;
  emoji: string;
  precioCompra: number;
  precioVenta: number;
  actualizadoAt: string;
  activo: boolean;
}

export interface CotizacionUpdate {
  divisa: string;
  precio_compra: number;
  precio_venta: number;
}

export type Operacion = 'vender' | 'comprar';
export type Divisa = 'dolar_blue' | 'euro_blue' | 'usdt';

export interface CotizacionApiResponse {
  id: string;
  divisa: string;
  nombre: string;
  emoji: string;
  precio_compra: number;
  precio_venta: number;
  actualizado_at: string;
  activo: boolean;
}

export const mapCotizacionFromApi = (data: CotizacionApiResponse): Cotizacion => ({
  id: data.id,
  divisa: data.divisa,
  nombre: data.nombre,
  emoji: data.emoji,
  precioCompra: data.precio_compra,
  precioVenta: data.precio_venta,
  actualizadoAt: data.actualizado_at,
  activo: data.activo,
});
