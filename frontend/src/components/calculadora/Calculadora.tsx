import { useEffect, useRef, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCalculadoraStore } from '@/stores/calculadoraStore';
import { Cotizacion, Divisa, Operacion } from '@/types/cotizacion';
import { formatearPrecio, formatearPrecioSinSimbolo, getDivisaLabel } from '@/utils/format';
import { MessageCircle, Send } from 'lucide-react';

interface CalculadoraProps {
  cotizaciones: Cotizacion[];
}

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5493511234567';
const TELEGRAM_USER = import.meta.env.VITE_TELEGRAM_USER || 'cambiocba';

export default function Calculadora({ cotizaciones }: CalculadoraProps) {
  const calculadoraRef = useRef<HTMLDivElement>(null);
  const { divisa, operacion, monto, setDivisa, setOperacion, setMonto } = useCalculadoraStore();

  const cotizacionActual = useMemo(() => {
    return cotizaciones.find((c) => c.divisa === divisa);
  }, [cotizaciones, divisa]);

  const cotizacionUsada = useMemo(() => {
    if (!cotizacionActual) return 0;
    return operacion === 'vender'
      ? cotizacionActual.precioCompra
      : cotizacionActual.precioVenta;
  }, [cotizacionActual, operacion]);

  const total = useMemo(() => {
    const montoNum = parseFloat(monto) || 0;
    return montoNum * cotizacionUsada;
  }, [monto, cotizacionUsada]);

  const divisas: { id: Divisa; emoji: string; label: string }[] = [
    { id: 'dolar_blue', emoji: '💵', label: 'Blue' },
    { id: 'euro_blue', emoji: '💶', label: 'Euro' },
    { id: 'usdt', emoji: '🌐', label: 'USDT' },
  ];

  const operaciones: { id: Operacion; label: string }[] = [
    { id: 'vender', label: 'QUIERO VENDER' },
    { id: 'comprar', label: 'QUIERO COMPRAR' },
  ];

  const handleWhatsApp = () => {
    const operacionText = operacion === 'vender' ? 'vender' : 'comprar';
    const divisaLabel = getDivisaLabel(divisa);
    const mensaje = `Hola! Quiero ${operacionText} ${monto} ${divisaLabel} a $${formatearPrecioSinSimbolo(cotizacionUsada)}. Total estimado: ${formatearPrecio(total)}. Gracias!`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  const handleTelegram = () => {
    const operacionText = operacion === 'vender' ? 'vender' : 'comprar';
    const divisaLabel = getDivisaLabel(divisa);
    const mensaje = `Hola! Quiero ${operacionText} ${monto} ${divisaLabel} a $${formatearPrecioSinSimbolo(cotizacionUsada)}. Total estimado: ${formatearPrecio(total)}. Gracias!`;
    const url = `https://t.me/${TELEGRAM_USER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  // Scroll suave cuando cambia la preselección
  useEffect(() => {
    const unsubscribe = useCalculadoraStore.subscribe((state, prevState) => {
      if (state.divisa !== prevState.divisa || state.operacion !== prevState.operacion) {
        calculadoraRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div ref={calculadoraRef} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 text-center">Calculadora</h2>

      {/* Selector de divisa */}
      <div className="flex justify-center gap-2">
        {divisas.map((d) => (
          <button
            key={d.id}
            onClick={() => setDivisa(d.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              divisa === d.id
                ? 'border-2 border-primary text-primary bg-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {d.emoji} {d.label}
          </button>
        ))}
      </div>

      {/* Selector de operación */}
      <div className="flex justify-center bg-gray-200 rounded-lg p-1">
        {operaciones.map((op) => (
          <button
            key={op.id}
            onClick={() => setOperacion(op.id)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              operacion === op.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600'
            }`}
          >
            {op.label}
          </button>
        ))}
      </div>

      {/* Input de monto */}
      <div className="text-center">
        <Input
          type="number"
          inputMode="decimal"
          placeholder="0"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="text-center text-4xl font-bold h-20 border-2 focus:border-primary"
        />
        <p className="text-sm text-gray-500 mt-2">{getDivisaLabel(divisa)}</p>
      </div>

      {/* Resultado */}
      <Card className="p-4 bg-gray-100 text-center">
        <p className="text-sm text-gray-500 mb-1">Total Estimado</p>
        <p className="text-3xl font-bold text-success">{formatearPrecio(total)}</p>
        <p className="text-sm text-gray-500 mt-2">
          Cotización: ${formatearPrecioSinSimbolo(cotizacionUsada)}
        </p>
      </Card>

      {/* Botones de contacto */}
      <div className="space-y-3">
        <Button
          variant="whatsapp"
          size="lg"
          className="w-full"
          onClick={handleWhatsApp}
          disabled={!monto || parseFloat(monto) <= 0}
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Enviar por WhatsApp
        </Button>
        <Button
          variant="telegram"
          size="lg"
          className="w-full"
          onClick={handleTelegram}
          disabled={!monto || parseFloat(monto) <= 0}
        >
          <Send className="mr-2 h-5 w-5" />
          Enviar por Telegram
        </Button>
      </div>
    </div>
  );
}
