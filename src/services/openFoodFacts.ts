import axios from 'axios';
import { RawProduct, Nutriments } from '../types';

const BASE_URL = 'https://world.openfoodfacts.org/api/v0/product';
const USER_AGENT = 'PanikDB/1.0.0 (dev.kernelpanicnze.panikdb)';

export async function fetchProductByBarcode(barcode: string): Promise<RawProduct | null> {
  const response = await axios.get(`${BASE_URL}/${barcode}.json`, {
    headers: { 'User-Agent': USER_AGENT },
    timeout: 10000,
  });

  if (response.data.status !== 1 || !response.data.product) {
    return null;
  }

  const p = response.data.product;

  const nutriments: Nutriments = {
    energy_100g: p.nutriments?.['energy_100g'],
    energy_kcal_100g: p.nutriments?.['energy-kcal_100g'],
    fat_100g: p.nutriments?.['fat_100g'],
    saturated_fat_100g: p.nutriments?.['saturated-fat_100g'],
    carbohydrates_100g: p.nutriments?.['carbohydrates_100g'],
    sugars_100g: p.nutriments?.['sugars_100g'],
    fiber_100g: p.nutriments?.['fiber_100g'],
    proteins_100g: p.nutriments?.['proteins_100g'],
    salt_100g: p.nutriments?.['salt_100g'],
    sodium_100g: p.nutriments?.['sodium_100g'],
  };

  return {
    barcode,
    name: p.product_name || p.product_name_en || 'Unknown Product',
    brand: p.brands || 'Unknown Brand',
    imageUrl: p.image_url || p.image_front_url,
    ingredients: p.ingredients_text || p.ingredients_text_en,
    nutriments,
    nutriscore: p.nutriscore_grade,
    novaGroup: p.nova_group,
    categories: p.categories,
    labels: p.labels,
    quantity: p.quantity,
  };
}
