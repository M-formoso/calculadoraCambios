import { create } from 'zustand';
import { Divisa, Operacion } from '@/types/cotizacion';

interface CalculadoraState {
  divisa: Divisa;
  operacion: Operacion;
  monto: string;
  setDivisa: (divisa: Divisa) => void;
  setOperacion: (operacion: Operacion) => void;
  setMonto: (monto: string) => void;
  setPreseleccion: (divisa: Divisa, operacion: Operacion) => void;
}

export const useCalculadoraStore = create<CalculadoraState>((set) => ({
  divisa: 'dolar_blue',
  operacion: 'vender',
  monto: '',

  setDivisa: (divisa) => set({ divisa }),
  setOperacion: (operacion) => set({ operacion }),
  setMonto: (monto) => set({ monto }),
  setPreseleccion: (divisa, operacion) => set({ divisa, operacion }),
}));
