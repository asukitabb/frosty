// ─── Módulo 1: Gestión Comercial ────────────────────────────────────────────

export interface Articulo {
  id: string;
  nombre: string;
  precioUnitario: number;
  categoria: 'helado' | 'bebida' | 'topping' | 'combo';
  emoji: string;
}

export interface LineaFactura {
  articulo: Articulo;
  cantidad: number;
  descuentoLinea: number; // percentage, 0-100
  subtotalLinea: number;  // calculated by PricingService
}

export interface CabeceraFactura {
  fecha: string;
  empresa: {
    nombre: string;
    ruc: string;
    direccion: string;
    telefono: string;
  };
  cliente: {
    nombre: string;
    nit: string;
  };
}

export interface PieFactura {
  totalBruto: number;
  descuentoGeneral: number; // percentage, 0-100
  montoDescuento: number;
  totalNeto: number;
  metodoPago: 'EFECTIVO' | 'QR';
}

export interface Factura {
  numeroFactura: string;
  fecha: string;
  cabecera: CabeceraFactura;
  lineas: LineaFactura[];
  pie: PieFactura;
}

// ─── Módulo 2: Gestión de Almacén ────────────────────────────────────────────

export interface ArticuloStock {
  idArticulo: string; // matches Articulo.id
  nombre: string;
  unidad: string;
  cantidadActual: number;
  stockMinimo: number;
  stockMaximo: number;
}

export type TipoMovimiento = 'ENTRADA' | 'SALIDA';

export interface MovimientoStock {
  idMovimiento: string;
  fecha: string;
  tipoMovimiento: TipoMovimiento;
  idArticulo: string;
  nombreArticulo: string;
  cantidad: number;
  referenciaDocumento: string; // factura number or manual ref
  descripcion: string;
}

export type NivelSemaforo = 'VERDE' | 'NARANJA' | 'ROJO';

// ─── EventBus Events ─────────────────────────────────────────────────────────

export interface VentaCompletadaPayload {
  factura: Factura;
}

export interface EventMap {
  VENTA_COMPLETADA: VentaCompletadaPayload;
}
