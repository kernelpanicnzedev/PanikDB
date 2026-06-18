export interface RawProduct {
  barcode: string;
  name: string;
  brand: string;
  imageUrl?: string;
  ingredients?: string;
  nutriments?: Nutriments;
  nutriscore?: string;
  novaGroup?: number;
  categories?: string;
  labels?: string;
  quantity?: string;
}

export interface Nutriments {
  energy_100g?: number;
  energy_kcal_100g?: number;
  fat_100g?: number;
  saturated_fat_100g?: number;
  carbohydrates_100g?: number;
  sugars_100g?: number;
  fiber_100g?: number;
  proteins_100g?: number;
  salt_100g?: number;
  sodium_100g?: number;
}

export interface IngredientInfo {
  name: string;
  decoded: string;
  concern: 'none' | 'low' | 'medium' | 'high';
  explanation: string;
}

export interface HealthRisk {
  ingredient: string;
  risk: string;
  severity: 'low' | 'medium' | 'high';
  context: string;
}

export interface CorporateIntel {
  parentCompany: string;
  subsidiaries: string[];
  lawsuits: string[];
  recalls: string[];
  environmentalViolations: string[];
  laborViolations: string[];
  controversies: string[];
  ethicsRating: 'poor' | 'concerning' | 'mixed' | 'moderate' | 'good';
  ethicsExplanation: string;
}

export interface NutritionFlags {
  flag: string;
  severity: 'info' | 'warning' | 'danger';
}

export interface AIAnalysis {
  ingredientsDecoded: IngredientInfo[];
  healthRisks: HealthRisk[];
  nutritionFlags: NutritionFlags[];
  nutritionSummary: string;
  corporateIntel: CorporateIntel;
  overallRating: number;
  tldr: string;
  misleadingClaims: string[];
}

export interface ScannedProduct extends RawProduct {
  analysis?: AIAnalysis;
  scannedAt: string;
}

export type RootStackParamList = {
  Main: undefined;
  Product: { barcode: string; productName: string };
  Company: { companyKey: string };
  Settings: undefined;
};

export type TabParamList = {
  Scanner: undefined;
  History: undefined;
};
