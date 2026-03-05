import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCotizaciones } from '@/hooks/useCotizaciones';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/components/ui/use-toast';
import { cotizacionService } from '@/services/cotizacionService';
import { CotizacionUpdate } from '@/types/cotizacion';
import { formatearFechaHora } from '@/utils/format';
import { LogOut, Save } from 'lucide-react';
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
    // Limpiar error al editar
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Admin */}
      <header className="bg-primary text-white py-4 px-4 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Panel Admin</h1>
            <p className="text-sm text-white/80">{user?.nombre}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Info de actualizacion */}
        {cotizaciones?.[0]?.actualizadoAt && (
          <p className="text-sm text-gray-500 text-center">
            Ultima actualizacion: {formatearFechaHora(cotizaciones[0].actualizadoAt)}
          </p>
        )}

        {/* Tarjetas de edicion */}
        {divisasInfo.map((divisa) => (
          <Card key={divisa.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>{divisa.emoji}</span>
                {divisa.nombre}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${divisa.id}_compra`}>
                    Precio Compra
                    <span className="text-xs text-gray-400 block">(Vos vendes)</span>
                  </Label>
                  <Input
                    id={`${divisa.id}_compra`}
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    value={precios[divisa.id].compra}
                    onChange={(e) => handlePrecioChange(divisa.id, 'compra', e.target.value)}
                    className={errors[`${divisa.id}_compra`] ? 'border-red-500' : ''}
                  />
                  {errors[`${divisa.id}_compra`] && (
                    <p className="text-xs text-red-500">{errors[`${divisa.id}_compra`]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${divisa.id}_venta`}>
                    Precio Venta
                    <span className="text-xs text-gray-400 block">(Vos compras)</span>
                  </Label>
                  <Input
                    id={`${divisa.id}_venta`}
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    value={precios[divisa.id].venta}
                    onChange={(e) => handlePrecioChange(divisa.id, 'venta', e.target.value)}
                    className={errors[`${divisa.id}_venta`] ? 'border-red-500' : ''}
                  />
                  {errors[`${divisa.id}_venta`] && (
                    <p className="text-xs text-red-500">{errors[`${divisa.id}_venta`]}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Boton guardar */}
        <Button
          size="lg"
          className="w-full"
          onClick={handleGuardar}
          disabled={mutation.isPending}
        >
          <Save className="mr-2 h-5 w-5" />
          {mutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </main>
    </div>
  );
}
