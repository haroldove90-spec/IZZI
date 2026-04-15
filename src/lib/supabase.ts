import { createClient } from '@supabase/supabase-js';
import { Promotion } from '../types';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

// Fallback to localStorage if Supabase is not configured
const isSupabaseConfigured = supabaseUrl && supabaseKey;

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

const STORAGE_KEY = 'izzi_promotions';

export const promotionService = {
  async getPromotions(): Promise<Promotion[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) return data;
      console.error('Supabase error, falling back to local storage:', error);
    }

    const localData = localStorage.getItem(STORAGE_KEY);
    return localData ? JSON.parse(localData) : [];
  },

  async savePromotion(promo: Promotion): Promise<void> {
    if (supabase) {
      const { error } = await supabase
        .from('promotions')
        .upsert(promo);
      
      if (!error) return;
      console.error('Supabase error saving, falling back to local storage:', error);
    }

    const promos = await this.getPromotions();
    const index = promos.findIndex(p => p.id === promo.id);
    if (index >= 0) {
      promos[index] = promo;
    } else {
      promos.push(promo);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(promos));
  },

  async deletePromotion(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);
      
      if (!error) return;
      console.error('Supabase error deleting, falling back to local storage:', error);
    }

    const promos = await this.getPromotions();
    const filtered = promos.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
