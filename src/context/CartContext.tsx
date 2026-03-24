import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { Articulo, LineaFactura } from '@/types';
import { PricingService } from '@/services/PricingService';

interface CartState {
  lineas: LineaFactura[];
  descuentoGeneral: number;
  metodoPago: 'EFECTIVO' | 'QR';
}

type CartAction =
  | { type: 'AGREGAR_ARTICULO'; articulo: Articulo }
  | { type: 'QUITAR_ARTICULO'; idArticulo: string }
  | { type: 'CAMBIAR_CANTIDAD'; idArticulo: string; cantidad: number }
  | { type: 'CAMBIAR_DESCUENTO_LINEA'; idArticulo: string; descuento: number }
  | { type: 'SET_DESCUENTO_GENERAL'; descuento: number }
  | { type: 'SET_METODO_PAGO'; metodo: 'EFECTIVO' | 'QR' }
  | { type: 'LIMPIAR_CARRITO' };

const initialState: CartState = {
  lineas: [],
  descuentoGeneral: 0,
  metodoPago: 'EFECTIVO',
};

function buildLinea(articulo: Articulo, cantidad: number, descuentoLinea: number): LineaFactura {
  return {
    articulo,
    cantidad,
    descuentoLinea,
    subtotalLinea: PricingService.calcularSubtotalLinea(cantidad, articulo.precioUnitario, descuentoLinea),
  };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'AGREGAR_ARTICULO': {
      const existing = state.lineas.find((l) => l.articulo.id === action.articulo.id);
      if (existing) {
        return {
          ...state,
          lineas: state.lineas.map((l) =>
            l.articulo.id === action.articulo.id
              ? buildLinea(l.articulo, l.cantidad + 1, l.descuentoLinea)
              : l
          ),
        };
      }
      return {
        ...state,
        lineas: [...state.lineas, buildLinea(action.articulo, 1, 0)],
      };
    }
    case 'QUITAR_ARTICULO':
      return { ...state, lineas: state.lineas.filter((l) => l.articulo.id !== action.idArticulo) };
    case 'CAMBIAR_CANTIDAD':
      return {
        ...state,
        lineas: state.lineas.map((l) =>
          l.articulo.id === action.idArticulo
            ? buildLinea(l.articulo, Math.max(1, action.cantidad), l.descuentoLinea)
            : l
        ),
      };
    case 'CAMBIAR_DESCUENTO_LINEA':
      return {
        ...state,
        lineas: state.lineas.map((l) =>
          l.articulo.id === action.idArticulo
            ? buildLinea(l.articulo, l.cantidad, action.descuento)
            : l
        ),
      };
    case 'SET_DESCUENTO_GENERAL':
      return { ...state, descuentoGeneral: action.descuento };
    case 'SET_METODO_PAGO':
      return { ...state, metodoPago: action.metodo };
    case 'LIMPIAR_CARRITO':
      return initialState;
    default:
      return state;
  }
}

interface CartContextType extends CartState {
  totales: ReturnType<typeof PricingService.calcularTotales>;
  agregarArticulo: (articulo: Articulo) => void;
  quitarArticulo: (idArticulo: string) => void;
  cambiarCantidad: (idArticulo: string, cantidad: number) => void;
  cambiarDescuentoLinea: (idArticulo: string, descuento: number) => void;
  setDescuentoGeneral: (descuento: number) => void;
  setMetodoPago: (metodo: 'EFECTIVO' | 'QR') => void;
  limpiarCarrito: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const totales = PricingService.calcularTotales(state.lineas, state.descuentoGeneral);

  const agregarArticulo = useCallback((articulo: Articulo) => dispatch({ type: 'AGREGAR_ARTICULO', articulo }), []);
  const quitarArticulo = useCallback((idArticulo: string) => dispatch({ type: 'QUITAR_ARTICULO', idArticulo }), []);
  const cambiarCantidad = useCallback((idArticulo: string, cantidad: number) => dispatch({ type: 'CAMBIAR_CANTIDAD', idArticulo, cantidad }), []);
  const cambiarDescuentoLinea = useCallback((idArticulo: string, descuento: number) => dispatch({ type: 'CAMBIAR_DESCUENTO_LINEA', idArticulo, descuento }), []);
  const setDescuentoGeneral = useCallback((descuento: number) => dispatch({ type: 'SET_DESCUENTO_GENERAL', descuento }), []);
  const setMetodoPago = useCallback((metodo: 'EFECTIVO' | 'QR') => dispatch({ type: 'SET_METODO_PAGO', metodo }), []);
  const limpiarCarrito = useCallback(() => dispatch({ type: 'LIMPIAR_CARRITO' }), []);

  return (
    <CartContext.Provider value={{
      ...state, totales,
      agregarArticulo, quitarArticulo, cambiarCantidad,
      cambiarDescuentoLinea, setDescuentoGeneral, setMetodoPago, limpiarCarrito,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
