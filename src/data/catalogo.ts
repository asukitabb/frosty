import type { Articulo } from '@/types';

export const catalogo: Articulo[] = [
  // Helados
  { id: 'HEL-001', nombre: 'Vainilla Clásica', precioUnitario: 12.00, categoria: 'helado', emoji: '🍦' },
  { id: 'HEL-002', nombre: 'Chocolate Intenso', precioUnitario: 13.00, categoria: 'helado', emoji: '🍫' },
  { id: 'HEL-003', nombre: 'Fresa Silvestre', precioUnitario: 13.00, categoria: 'helado', emoji: '🍓' },
  { id: 'HEL-004', nombre: 'Menta con Chips', precioUnitario: 14.00, categoria: 'helado', emoji: '🌿' },
  { id: 'HEL-005', nombre: 'Dulce de Leche', precioUnitario: 14.00, categoria: 'helado', emoji: '🥛' },
  { id: 'HEL-006', nombre: 'Maracuyá Tropical', precioUnitario: 15.00, categoria: 'helado', emoji: '🌺' },
  { id: 'HEL-007', nombre: 'Cookies & Cream', precioUnitario: 15.00, categoria: 'helado', emoji: '🍪' },
  { id: 'HEL-008', nombre: 'Pistacho Premium', precioUnitario: 17.00, categoria: 'helado', emoji: '🫘' },
  // Bebidas
  { id: 'BEB-001', nombre: 'Limonada Frosty', precioUnitario: 8.00, categoria: 'bebida', emoji: '🍋' },
  { id: 'BEB-002', nombre: 'Smoothie de Frutos', precioUnitario: 12.00, categoria: 'bebida', emoji: '🥤' },
  { id: 'BEB-003', nombre: 'Agua Mineral', precioUnitario: 4.00, categoria: 'bebida', emoji: '💧' },
  // Toppings
  { id: 'TOP-001', nombre: 'Chispas de Chocolate', precioUnitario: 3.00, categoria: 'topping', emoji: '✨' },
  { id: 'TOP-002', nombre: 'Sirope de Fresa', precioUnitario: 3.00, categoria: 'topping', emoji: '🍯' },
  { id: 'TOP-003', nombre: 'Nueces Trituradas', precioUnitario: 4.00, categoria: 'topping', emoji: '🥜' },
  // Combos
  { id: 'COM-001', nombre: 'Combo Familiar (x4)', precioUnitario: 45.00, categoria: 'combo', emoji: '👨‍👩‍👧‍👦' },
  { id: 'COM-002', nombre: 'Combo Doble + Bebida', precioUnitario: 28.00, categoria: 'combo', emoji: '🎉' },
];

export const categoriaLabels: Record<Articulo['categoria'], string> = {
  helado: '🍦 Helados',
  bebida: '🥤 Bebidas',
  topping: '✨ Toppings',
  combo: '🎉 Combos',
};
