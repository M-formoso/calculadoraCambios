import { create } from 'zustand';
import { Divisa, Operacion } from '@/types/cotizacion';

type ModoEntrada = 'divisa' | 'pesos';

interface CalculadoraState {
  divisa: Divisa;
  operacion: Operacion;
  monto: string;
  modoEntrada: ModoEntrada;
  setDivisa: (divisa: Divisa) => void;
  setOperacion: (operacion: Operacion) => void;
  setMonto: (monto: string) => void;
  setModoEntrada: (modo: ModoEntrada) => void;
  toggleModoEntrada: () => void;
  setPreseleccion: (divisa: Divisa, operacion: Operacion) => void;
}

export const useCalculadoraStore = create<CalculadoraState>((set) => ({
  divisa: 'dolar_blue',
  operacion: 'vender',
  monto: '',
  modoEntrada: 'divisa',

  setDivisa: (divisa) => set({ divisa }),
  setOperacion: (operacion) => set({ operacion }),
  setMonto: (monto) => set({ monto }),
  setModoEntrada: (modoEntrada) => set({ modoEntrada, monto: '' }),
  toggleModoEntrada: () => set((state) => ({
    modoEntrada: state.modoEntrada === 'divisa' ? 'pesos' : 'divisa',
    monto: ''
  })),
  setPreseleccion: (divisa, operacion) => set({ divisa, operacion }),
}));
