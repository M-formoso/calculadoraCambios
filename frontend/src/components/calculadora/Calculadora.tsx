import { useEffect, useRef, useMemo } from 'react';
import { useCalculadoraStore } from '@/stores/calculadoraStore';
import { Cotizacion, Divisa, Operacion } from '@/types/cotizacion';
import { formatearPrecio, formatearPrecioSinSimbolo, getDivisaLabel } from '@/utils/format';
import { MessageCircle, Send, Calculator, ArrowRightLeft, RefreshCw } from 'lucide-react';

interface CalculadoraProps {
  cotizaciones: Cotizacion[];
}

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5493511234567';
const TELEGRAM_USER = import.meta.env.VITE_TELEGRAM_USER || 'cambiocba';

export default function Calculadora({ cotizaciones }: CalculadoraProps) {
  const calculadoraRef = useRef<HTMLDivElement>(null);
  const { divisa, operacion, monto, modoEntrada, setDivisa, setOperacion, setMonto, toggleModoEntrada } = useCalculadoraStore();

  const cotizacionActual = useMemo(() => {
    return cotizaciones.find((c) => c.divisa === divisa);
  }, [cotizaciones, divisa]);

  const cotizacionUsada = useMemo(() => {
    if (!cotizacionActual) return 0;
    return operacion === 'vender'
      ? cotizacionActual.precioCompra
      : cotizacionActual.precioVenta;
  }, [cotizacionActual, operacion]);

  // Calcular resultado segun modo de entrada
  const resultado = useMemo(() => {
    const montoNum = parseFloat(monto) || 0;
    if (modoEntrada === 'divisa') {
      // Entrada en divisa -> resultado en pesos
      return montoNum * cotizacionUsada;
    } else {
      // Entrada en pesos -> resultado en divisa
      return cotizacionUsada > 0 ? montoNum / cotizacionUsada : 0;
    }
  }, [monto, cotizacionUsada, modoEntrada]);

  // Para el mensaje, necesitamos calcular ambos valores
  const montoDivisa = modoEntrada === 'divisa' ? parseFloat(monto) || 0 : resultado;
  const montoPesos = modoEntrada === 'pesos' ? parseFloat(monto) || 0 : resultado;

  const divisas: { id: Divisa; emoji: string; label: string }[] = [
    { id: 'dolar_blue', emoji: '💵', label: 'Dolar Blue' },
    { id: 'euro_blue', emoji: '💶', label: 'Euro Blue' },
    { id: 'usdt', emoji: '🌐', label: 'USDT' },
  ];

  const handleWhatsApp = () => {
    const operacionText = operacion === 'vender' ? 'vender' : 'comprar';
    const divisaLabel = getDivisaLabel(divisa);
    const mensaje = `Hola! Quiero ${operacionText} ${montoDivisa.toFixed(2)} ${divisaLabel} a $${formatearPrecioSinSimbolo(cotizacionUsada)}. Total estimado: ${formatearPrecio(montoPesos)}. Gracias!`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  const handleTelegram = () => {
    const operacionText = operacion === 'vender' ? 'vender' : 'comprar';
    const divisaLabel = getDivisaLabel(divisa);
    const mensaje = `Hola! Quiero ${operacionText} ${montoDivisa.toFixed(2)} ${divisaLabel} a $${formatearPrecioSinSimbolo(cotizacionUsada)}. Total estimado: ${formatearPrecio(montoPesos)}. Gracias!`;
    const url = `https://t.me/${TELEGRAM_USER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    const unsubscribe = useCalculadoraStore.subscribe((state, prevState) => {
      if (state.divisa !== prevState.divisa || state.operacion !== prevState.operacion) {
        calculadoraRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    return unsubscribe;
  }, []);

  const inputLabel = modoEntrada === 'divisa'
    ? `Monto en ${getDivisaLabel(divisa)}`
    : 'Monto en Pesos (ARS)';

  const inputSuffix = modoEntrada === 'divisa'
    ? getDivisaLabel(divisa)
    : 'ARS';

  const resultadoLabel = modoEntrada === 'divisa'
    ? 'Total Estimado en ARS'
    : `Total Estimado en ${getDivisaLabel(divisa)}`;

  const formatearResultado = () => {
    if (modoEntrada === 'divisa') {
      return formatearPrecio(resultado);
    } else {
      // Mostrar resultado en divisa con 2 decimales
      return `${resultado.toFixed(2)} ${getDivisaLabel(divisa)}`;
    }
  };

  return (
    <div ref={calculadoraRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-xl">
              <Calculator className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Calculadora</h2>
              <p className="text-xs text-gray-500">Calcula tu operacion al instante</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Selector de divisa */}
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
            Selecciona la divisa
          </label>
          <div className="grid grid-cols-3 gap-2">
            {divisas.map((d) => (
              <button
                key={d.id}
                onClick={() => setDivisa(d.id)}
                className={`py-3 px-3 rounded-xl text-sm font-medium transition-all duration-200 flex flex-col items-center gap-1 ${
                  divisa === d.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="text-xl">{d.emoji}</span>
                <span className="text-xs">{d.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selector de operación */}
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
            Tipo de operacion
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setOperacion('vender')}
              className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                operacion === 'vender'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ArrowRightLeft className="h-4 w-4" />
              Quiero Vender
            </button>
            <button
              onClick={() => setOperacion('comprar')}
              className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                operacion === 'comprar'
                  ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ArrowRightLeft className="h-4 w-4" />
              Quiero Comprar
            </button>
          </div>
        </div>

        {/* Toggle modo de entrada */}
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
            Ingresar monto en
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleModoEntrada}
              className="flex-1 flex items-center justify-center gap-3 py-3 px-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl hover:border-purple-400 transition-all duration-200"
            >
              <span className={`font-semibold transition-colors ${modoEntrada === 'divisa' ? 'text-purple-600' : 'text-gray-400'}`}>
                {getDivisaLabel(divisa)}
              </span>
              <RefreshCw className="h-4 w-4 text-purple-500" />
              <span className={`font-semibold transition-colors ${modoEntrada === 'pesos' ? 'text-purple-600' : 'text-gray-400'}`}>
                ARS
              </span>
            </button>
          </div>
          <p className="text-xs text-center text-gray-400 mt-1">
            Toca para cambiar el modo de entrada
          </p>
        </div>

        {/* Input de monto */}
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
            {inputLabel}
          </label>
          <div className="relative">
            {modoEntrada === 'pesos' && (
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-2xl">$</span>
            )}
            <input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className={`w-full text-center text-4xl md:text-5xl font-bold py-6 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all ${
                modoEntrada === 'pesos' ? 'pl-12 pr-16' : 'px-4'
              }`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
              {inputSuffix}
            </span>
          </div>
        </div>

        {/* Resultado */}
        <div className={`rounded-xl p-5 border ${
          modoEntrada === 'divisa'
            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100'
            : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100'
        }`}>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">{resultadoLabel}</p>
            <p className={`text-4xl md:text-5xl font-bold mb-2 ${
              modoEntrada === 'divisa' ? 'text-green-600' : 'text-blue-600'
            }`}>
              {formatearResultado()}
            </p>
            <div className="inline-flex items-center gap-2 bg-white/80 px-3 py-1 rounded-full">
              <span className="text-xs text-gray-500">Cotizacion:</span>
              <span className="text-sm font-semibold text-gray-700">
                ${formatearPrecioSinSimbolo(cotizacionUsada)}
              </span>
            </div>
          </div>
        </div>

        {/* Botones de contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={handleWhatsApp}
            disabled={!monto || parseFloat(monto) <= 0}
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-green-200"
          >
            <MessageCircle className="h-5 w-5" />
            Enviar por WhatsApp
          </button>
          <button
            onClick={handleTelegram}
            disabled={!monto || parseFloat(monto) <= 0}
            className="flex items-center justify-center gap-2 bg-[#0088CC] hover:bg-[#0077B5] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-200"
          >
            <Send className="h-5 w-5" />
            Enviar por Telegram
          </button>
        </div>
      </div>
    </div>
  );
}
