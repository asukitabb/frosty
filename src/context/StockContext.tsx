import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ArticuloStock, MovimientoStock, NivelSemaforo, VentaCompletadaPayload } from '@/types';
import { EventBus } from '@/services/EventBus';
import { stockInicial } from '@/data/stockInicial';

interface StockState {
  articulos: ArticuloStock[];
  movimientos: MovimientoStock[];
}

type StockAction =
  | { type: 'REGISTRAR_SALIDA'; movimiento: MovimientoStock; idArticulo: string; cantidad: number }
  | { type: 'REGISTRAR_ENTRADA'; movimiento: MovimientoStock; idArticulo: string; cantidad: number };

function stockReducer(state: StockState, action: StockAction): StockState {
  const updatedArticulos = (delta: number, id: string) =>
    state.articulos.map((a) =>
      a.idArticulo === id
        ? { ...a, cantidadActual: Math.max(0, a.cantidadActual + delta) }
        : a
    );

  switch (action.type) {
    case 'REGISTRAR_SALIDA':
      return {
        articulos: updatedArticulos(-action.cantidad, action.idArticulo),
        movimientos: [action.movimiento, ...state.movimientos],
      };
    case 'REGISTRAR_ENTRADA':
      return {
        articulos: updatedArticulos(action.cantidad, action.idArticulo),
        movimientos: [action.movimiento, ...state.movimientos],
      };
    default:
      return state;
  }
}

interface StockContextType extends StockState {
  registrarEntrada: (idArticulo: string, cantidad: number, referencia: string) => void;
  getNivelSemaforo: (articulo: ArticuloStock) => NivelSemaforo;
}

const StockContext = createContext<StockContextType | null>(null);

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(stockReducer, {
    articulos: stockInicial,
    movimientos: [],
  });

  // ── EventBus listener: VENTA_COMPLETADA → auto-deducción de stock ──────────
  useEffect(() => {
    const handler = ({ factura }: VentaCompletadaPayload) => {
      factura.lineas.forEach((linea) => {
        const idArticulo = linea.articulo.id;
        const movimiento: MovimientoStock = {
          idMovimiento: `MOV-${Date.now()}-${idArticulo}`,
          fecha: new Date().toISOString(),
          tipoMovimiento: 'SALIDA',
          idArticulo,
          nombreArticulo: linea.articulo.nombre,
          cantidad: linea.cantidad,
          referenciaDocumento: factura.numeroFactura,
          descripcion: `Salida por venta | Factura ${factura.numeroFactura}`,
        };
        dispatch({ type: 'REGISTRAR_SALIDA', movimiento, idArticulo, cantidad: linea.cantidad });
      });
    };

    EventBus.on('VENTA_COMPLETADA', handler);
    return () => EventBus.off('VENTA_COMPLETADA', handler);
  }, []);

  const registrarEntrada = useCallback((idArticulo: string, cantidad: number, referencia: string) => {
    const articulo = state.articulos.find((a) => a.idArticulo === idArticulo);
    if (!articulo) return;
    const movimiento: MovimientoStock = {
      idMovimiento: `MOV-${Date.now()}-${idArticulo}`,
      fecha: new Date().toISOString(),
      tipoMovimiento: 'ENTRADA',
      idArticulo,
      nombreArticulo: articulo.nombre,
      cantidad,
      referenciaDocumento: referencia || `ENT-${Date.now()}`,
      descripcion: `Entrada de mercancía | Ref: ${referencia}`,
    };
    dispatch({ type: 'REGISTRAR_ENTRADA', movimiento, idArticulo, cantidad });
  }, [state.articulos]);

  const getNivelSemaforo = useCallback((articulo: ArticuloStock): NivelSemaforo => {
    const umbralCritico = articulo.stockMinimo;
    const umbralOk = articulo.stockMinimo * 1.5;
    if (articulo.cantidadActual <= umbralCritico) return 'ROJO';
    if (articulo.cantidadActual <= umbralOk) return 'NARANJA';
    return 'VERDE';
  }, []);

  return (
    <StockContext.Provider value={{ ...state, registrarEntrada, getNivelSemaforo }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStock = (): StockContextType => {
  const ctx = useContext(StockContext);
  if (!ctx) throw new Error('useStock must be used within StockProvider');
  return ctx;
};
