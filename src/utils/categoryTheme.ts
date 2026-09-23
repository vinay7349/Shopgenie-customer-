import { ShopCategory } from '../types';

export interface CategoryMeta {
  category: ShopCategory;
  label: string;
  bgLight: string;
  bgDark: string;
  borderLight: string;
  textLight: string;
  textDark: string;
  iconBgLight: string;
  iconBgDark: string;
  accentColor: string;
}

export const CATEGORY_METAS: Record<ShopCategory, CategoryMeta> = {
  'Supermarket': {
    category: 'Supermarket',
    label: 'Supermarket',
    bgLight: '#ECFDF5',
    bgDark: '#064E3B25',
    borderLight: '#A7F3D0',
    textLight: '#065F46',
    textDark: '#6EE7B7',
    iconBgLight: '#D1FAE5',
    iconBgDark: '#064E3B40',
    accentColor: '#10B981'
  },
  'Food Cart': {
    category: 'Food Cart',
    label: 'Food Cart',
    bgLight: '#FFFBEB',
    bgDark: '#78350F25',
    borderLight: '#FDE68A',
    textLight: '#92400E',
    textDark: '#FCD34D',
    iconBgLight: '#FEF3C7',
    iconBgDark: '#78350F40',
    accentColor: '#F59E0B'
  },
  'Pop-up Store': {
    category: 'Pop-up Store',
    label: 'Pop-up Store',
    bgLight: '#F5F3FF',
    bgDark: '#4C1D9525',
    borderLight: '#DDD6FE',
    textLight: '#5B21B6',
    textDark: '#C4B5FD',
    iconBgLight: '#EDE9FE',
    iconBgDark: '#4C1D9540',
    accentColor: '#8B5CF6'
  },
  'Fashion & Apparel': {
    category: 'Fashion & Apparel',
    label: 'Fashion & Apparel',
    bgLight: '#FFF1F2',
    bgDark: '#88133725',
    borderLight: '#FECDD3',
    textLight: '#9F1239',
    textDark: '#FDA4AF',
    iconBgLight: '#FFE4E6',
    iconBgDark: '#88133740',
    accentColor: '#F43F5E'
  },
  'Bakery & Cafe': {
    category: 'Bakery & Cafe',
    label: 'Bakery & Cafe',
    bgLight: '#FEF3C7',
    bgDark: '#78350F20',
    borderLight: '#FDE68A',
    textLight: '#78350F',
    textDark: '#FDE68A',
    iconBgLight: '#FDE68A',
    iconBgDark: '#78350F35',
    accentColor: '#D97706'
  },
  'Electronics & Gadgets': {
    category: 'Electronics & Gadgets',
    label: 'Electronics & Gadgets',
    bgLight: '#EFF6FF',
    bgDark: '#1E3A8A25',
    borderLight: '#BFDBFE',
    textLight: '#1E40AF',
    textDark: '#93C5FD',
    iconBgLight: '#DBEAFE',
    iconBgDark: '#1E3A8A40',
    accentColor: '#3B82F6'
  },
  'Moto & Auto Gear': {
    category: 'Moto & Auto Gear',
    label: 'Moto & Auto Gear',
    bgLight: '#F0FDFA',
    bgDark: '#134E4A25',
    borderLight: '#99F6E4',
    textLight: '#115E59',
    textDark: '#5EEAD4',
    iconBgLight: '#CCFBF1',
    iconBgDark: '#134E4A40',
    accentColor: '#0F766E'
  },
  'Boutique': {
    category: 'Boutique',
    label: 'Boutique',
    bgLight: '#FDF2F8',
    bgDark: '#701A7525',
    borderLight: '#FBCFE8',
    textLight: '#86198F',
    textDark: '#F472B6',
    iconBgLight: '#FCE7F3',
    iconBgDark: '#701A7540',
    accentColor: '#D946EF'
  },
  'Pharmacy': {
    category: 'Pharmacy',
    label: 'Pharmacy',
    bgLight: '#ECFEFF',
    bgDark: '#164E6325',
    borderLight: '#A5F3FC',
    textLight: '#155E75',
    textDark: '#67E8F9',
    iconBgLight: '#CFFAFE',
    iconBgDark: '#164E6340',
    accentColor: '#06B6D4'
  },
  'Home & Decor': {
    category: 'Home & Decor',
    label: 'Home & Decor',
    bgLight: '#F8FAFC',
    bgDark: '#1E293B25',
    borderLight: '#E2E8F0',
    textLight: '#334155',
    textDark: '#CBD5E1',
    iconBgLight: '#F1F5F9',
    iconBgDark: '#1E293B40',
    accentColor: '#64748B'
  }
};

export const ALL_CATEGORIES: ShopCategory[] = [
  'Supermarket',
  'Food Cart',
  'Bakery & Cafe',
  'Electronics & Gadgets',
  'Fashion & Apparel',
  'Moto & Auto Gear',
  'Pop-up Store',
  'Pharmacy',
  'Boutique',
  'Home & Decor'
];
