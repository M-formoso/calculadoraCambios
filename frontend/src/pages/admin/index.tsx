import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCotizaciones } from '@/hooks/useCotizaciones';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/components/ui/use-toast';
import { cotizacionService } from '@/services/cotizacionService';
import { CotizacionUpdate } from '@/types/cotizacion';
import { formatearFechaHora } from '@/utils/format';
import { LogOut, Save, TrendingUp, Clock, User, ArrowDownCircle, ArrowUpCircle, Home } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface PreciosEdit {
  dolar_blue: { compra: string; venta: string };
  euro_blue: { compra: string; venta: string };
  usdt: { compra: string; venta: string };
}

export default function AdminPage() {
  const { data: cotizaciones, isLoading } = useCotizaciones();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [precios, setPrecios] = useState<PreciosEdit>({
    dolar_blue: { compra: '', venta: '' },
    euro_blue: { compra: '', venta: '' },
    usdt: { compra: '', venta: '' },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cotizaciones) {
      const nuevosPrecios: PreciosEdit = {
        dolar_blue: { compra: '', venta: '' },
        euro_blue: { compra: '', venta: '' },
        usdt: { compra: '', venta: '' },
      };

      cotizaciones.forEach((cot) => {
        if (cot.divisa in nuevosPrecios) {
          nuevosPrecios[cot.divisa as keyof PreciosEdit] = {
            compra: cot.precioCompra.toString(),
            venta: cot.precioVenta.toString(),
          };
        }
      });

      setPrecios(nuevosPrecios);
    }
  }, [cotizaciones]);

  const mutation = useMutation({
    mutationFn: (data: CotizacionUpdate[]) => cotizacionService.actualizarCotizaciones(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cotizaciones'] });
      toast({
        title: 'Exito',
        description: 'Cotizaciones actualizadas correctamente',
        variant: 'success',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudieron actualizar las cotizaciones',
        variant: 'destructive',
      });
    },
  });

  const validarPrecios = (): boolean => {
    const newErrors: Record<string, string> = {};

    Object.entries(precios).forEach(([divisa, valores]) => {
      const compra = parseFloat(valores.compra);
      const venta = parseFloat(valores.venta);

      if (isNaN(compra) || compra <= 0) {
        newErrors[`${divisa}_compra`] = 'Debe ser un numero positivo';
      }
      if (isNaN(venta) || venta <= 0) {
        newErrors[`${divisa}_venta`] = 'Debe ser un numero positivo';
      }
      if (!isNaN(compra) && !isNaN(venta) && venta <= compra) {
        newErrors[`${divisa}_venta`] = 'El precio de venta debe ser mayor que el de compra';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGuardar = () => {
    if (!validarPrecios()) {
      toast({
        title: 'Error de validacion',
        description: 'Revise los campos marcados en rojo',
        variant: 'destructive',
      });
      return;
    }

    const cotizacionesUpdate: CotizacionUpdate[] = Object.entries(precios).map(
      ([divisa, valores]) => ({
        divisa,
        precio_compra: parseFloat(valores.compra),
        precio_venta: parseFloat(valores.venta),
      })
    );

    mutation.mutate(cotizacionesUpdate);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleHome = () => {
    navigate('/');
  };

  const handlePrecioChange = (
    divisa: keyof PreciosEdit,
    tipo: 'compra' | 'venta',
    valor: string
  ) => {
    setPrecios((prev) => ({
      ...prev,
      [divisa]: {
        ...prev[divisa],
        [tipo]: valor,
      },
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`${divisa}_${tipo}`];
      return newErrors;
    });
  };

  const divisasInfo = [
    { id: 'dolar_blue' as const, nombre: 'Dolar Blue', emoji: '💵' },
    { id: 'euro_blue' as const, nombre: 'Euro Blue', emoji: '💶' },
    { id: 'usdt' as const, nombre: 'USDT', emoji: '🌐' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Panel de Administracion</h1>
                <div className="flex items-center gap-2 text-blue-100 text-sm">
                  <User className="h-3.5 w-3.5" />
                  <span>{user?.nombre || 'Administrador'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleHome}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200"
                title="Ir al inicio"
              >
                <Home className="h-5 w-5" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200"
                title="Cerrar sesion"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Info de actualizacion */}
        {cotizaciones?.[0]?.actualizadoAt && (
          <div className="flex items-center justify-center gap-2 text-gray-500 mb-6">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              Ultima actualizacion: {formatearFechaHora(cotizaciones[0].actualizadoAt)}
            </span>
          </div>
        )}

        {/* Grid de tarjetas - responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {divisasInfo.map((divisa) => (
            <div
              key={divisa.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Header de la tarjeta */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{divisa.emoji}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{divisa.nombre}</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Editar precios</p>
                  </div>
                </div>
              </div>

              {/* Campos de edicion */}
              <div className="p-5 space-y-4">
                {/* Precio Compra */}
                <div>
                  <label
                    htmlFor={`${divisa.id}_compra`}
                    className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2"
                  >
                    <ArrowDownCircle className="h-3.5 w-3.5 text-blue-500" />
                    Precio Compra
                    <span className="text-gray-400 normal-case">(Vos vendes)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                    <input
                      id={`${divisa.id}_compra`}
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      value={precios[divisa.id].compra}
                      onChange={(e) => handlePrecioChange(divisa.id, 'compra', e.target.value)}
                      className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg font-semibold ${
                        errors[`${divisa.id}_compra`]
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors[`${divisa.id}_compra`] && (
                    <p className="text-xs text-red-500 mt-1">{errors[`${divisa.id}_compra`]}</p>
                  )}
                </div>

                {/* Precio Venta */}
                <div>
                  <label
                    htmlFor={`${divisa.id}_venta`}
                    className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2"
                  >
                    <ArrowUpCircle className="h-3.5 w-3.5 text-green-500" />
                    Precio Venta
                    <span className="text-gray-400 normal-case">(Vos compras)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                    <input
                      id={`${divisa.id}_venta`}
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      value={precios[divisa.id].venta}
                      onChange={(e) => handlePrecioChange(divisa.id, 'venta', e.target.value)}
                      className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 outline-none transition-all text-lg font-semibold ${
                        errors[`${divisa.id}_venta`]
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-green-500'
                      }`}
                    />
                  </div>
                  {errors[`${divisa.id}_venta`] && (
                    <p className="text-xs text-red-500 mt-1">{errors[`${divisa.id}_venta`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Boton guardar */}
        <div className="max-w-md mx-auto">
          <button
            onClick={handleGuardar}
            disabled={mutation.isPending}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-green-200"
          >
            {mutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 py-6 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            Linea de Cambio - Panel de Administracion
          </p>
        </div>
      </footer>
    </div>
  );
}
