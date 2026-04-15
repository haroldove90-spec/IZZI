import { Promotion } from './types';

export const IZZI_COLORS = {
  magenta: '#E5007E',
  black: '#000000',
  white: '#FFFFFF',
  gray: '#F5F5F5',
};

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: '1',
    title: 'Internet + Telefonía',
    megas: 50,
    channels: 0,
    price: 450,
    isPopular: false,
    features: ['Internet de alta velocidad', 'Llamadas ilimitadas', 'Instalación inmediata'],
  },
  {
    id: '2',
    title: 'Combo Entretenimiento',
    megas: 100,
    channels: 60,
    price: 650,
    isPopular: true,
    features: ['Internet 100 Megas', '60 Canales HD', 'izzi go incluido', 'Vix Premium'],
  },
  {
    id: '3',
    title: 'Ultra Gamer',
    megas: 500,
    channels: 100,
    price: 990,
    isPopular: false,
    features: ['Internet 500 Megas', '100 Canales HD', 'Extensor WiFi', 'Prioridad de red'],
  },
];
