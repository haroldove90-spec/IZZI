import { Promotion } from './types';

export const IZZI_COLORS = {
  primary: '#047E29',
  secondary: '#CDCC34',
  accent: '#FC0000',
  light: '#EBFBCA',
  text: '#282829',
  white: '#FFFFFF',
  gray: '#F4F4F4',
};

export const IZZI_LOGO = "https://images.ctfassets.net/lx4ov5kud2ld/23qMcsoXhVZIeBO6VhFUNQ/c92a4b148c72923e33f67f9244414b45/izzi-logo-izzi-black.svg";
export const IZZI_ICON = IZZI_LOGO;

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: '1',
    titulo: 'izzi 100 Megas',
    megas: '100',
    precio: 450,
    imagen_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200',
    destacado: true,
    categoria: 'Internet',
    features: ['Incluye izzi tv', 'Llamadas ilimitadas', 'Instalación inmediata']
  },
  {
    id: '2',
    titulo: 'izzi 200 Megas + Disney+',
    megas: '200',
    precio: 650,
    imagen_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=1200',
    destacado: true,
    categoria: 'Combo',
    features: ['Disney+ incluido', 'izzi tv HD', '2 extensiones']
  },
  {
    id: '3',
    titulo: 'izzi Móvil Ilimitado',
    megas: 'Ilimitado',
    precio: 250,
    imagen_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1200',
    destacado: false,
    categoria: 'Móvil',
    features: ['Red 4.5G', 'Roaming en USA/CAN', 'Sin plazos forzosos']
  }
];
