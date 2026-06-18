import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScannedProduct } from '../types';

const HISTORY_KEY = '@panikdb_history';
const API_KEY_STORAGE = '@panikdb_claude_key';
const MAX_HISTORY = 100;

export async function saveToHistory(product: ScannedProduct): Promise<void> {
  const existing = await getHistory();
  const filtered = existing.filter(p => p.barcode !== product.barcode);
  const updated = [product, ...filtered].slice(0, MAX_HISTORY);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export async function getHistory(): Promise<ScannedProduct[]> {
  const data = await AsyncStorage.getItem(HISTORY_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function getFromHistory(barcode: string): Promise<ScannedProduct | null> {
  const history = await getHistory();
  return history.find(p => p.barcode === barcode) ?? null;
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_KEY);
}

export async function saveApiKey(key: string): Promise<void> {
  await AsyncStorage.setItem(API_KEY_STORAGE, key);
}

export async function getApiKey(): Promise<string | null> {
  return AsyncStorage.getItem(API_KEY_STORAGE);
}
