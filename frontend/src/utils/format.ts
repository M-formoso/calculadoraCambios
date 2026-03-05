export const formatearPrecio = (monto: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(monto);
};

export const formatearPrecioSinSimbolo = (monto: number): string => {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(monto);
};

export const formatearFechaHora = (fecha: string): string => {
  const date = new Date(fecha);
  return date.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatearHora = (fecha: string): string => {
  const date = new Date(fecha);
  return date.toLocaleString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const getDivisaLabel = (divisa: string): string => {
  switch (divisa) {
    case 'dolar_blue':
      return 'USD';
    case 'euro_blue':
      return 'EUR';
    case 'usdt':
      return 'USDT';
    default:
      return divisa.toUpperCase();
  }
};
