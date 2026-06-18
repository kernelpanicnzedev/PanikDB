import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, ScannedProduct, AIAnalysis } from '../types';
import { fetchProductByBarcode } from '../services/openFoodFacts';
import { analyzeProduct } from '../services/claudeAnalysis';
import { saveToHistory, getFromHistory, getApiKey } from '../services/historyStorage';
import { lookupCompanyKey } from '../data/corporateDatabase';
import { colors } from '../constants/colors';
import { RatingCircle } from '../components/RatingCircle';
import { RiskBadge } from '../components/RiskBadge';
import { LoadingAnalysis } from '../components/LoadingAnalysis';
import { NutritionTable } from '../components/NutritionTable';

type RouteT = RouteProp<RootStackParamList, 'Product'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

type Tab = 'overview' | 'ingredients' | 'health' | 'corporate';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'ingredients', label: 'Ingredients' },
  { id: 'health', label: 'Health' },
  { id: 'corporate', label: 'Corporate' },
];

const ethicsColors = {
  poor: colors.riskHigh,
  concerning: colors.caution,
  mixed: colors.warning,
  moderate: colors.info,
  good: colors.safe,
};

export function ProductScreen() {
  const route = useRoute<RouteT>();
  const navigation = useNavigation<Nav>();
  const { barcode } = route.params;

  const [product, setProduct] = useState<ScannedProduct | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadStep, setLoadStep] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    load();
    return () => { isMounted.current = false; };
  }, [barcode]);

  async function load() {
    try {
      // Check history first
      const cached = await getFromHistory(barcode);
      if (cached?.analysis) {
        if (isMounted.current) {
          setProduct(cached);
          setAnalysis(cached.analysis);
          setLoadStep(5);
        }
        return;
      }

      if (isMounted.current) setLoadStep(1);
      const rawProduct = await fetchProductByBarcode(barcode);
      if (!rawProduct) {
        if (isMounted.current) setError(`Product not found in OpenFoodFacts database.\nBarcode: ${barcode}`);
        return;
      }

      const scanned: ScannedProduct = { ...rawProduct, scannedAt: new Date().toISOString() };
      if (isMounted.current) { setProduct(scanned); setLoadStep(2); }

      const apiKey = await getApiKey();
      if (!apiKey) {
        await saveToHistory(scanned);
        if (isMounted.current) setLoadStep(5);
        return;
      }

      if (isMounted.current) setLoadStep(3);
      const ai = await analyzeProduct(rawProduct, apiKey);
      if (isMounted.current) setLoadStep(4);

      const full: ScannedProduct = { ...scanned, analysis: ai };
      await saveToHistory(full);

      if (isMounted.current) {
        setAnalysis(ai);
        setLoadStep(5);
      }
    } catch (e: any) {
      if (isMounted.current) {
        setError(e?.message || 'An error occurred. Check your API key and network connection.');
      }
    }
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!product || loadStep < 5) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <LoadingAnalysis step={loadStep} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView style={styles.scroll} stickyHeaderIndices={[1]}>
        {/* Product Header */}
        <View style={styles.header}>
          {product.imageUrl ? (
            <Image source={{ uri: product.imageUrl }} style={styles.productImage} contentFit="contain" />
          ) : (
            <View style={[styles.productImage, styles.imagePlaceholder]}>
              <Text style={styles.imagePlaceholderText}>📦</Text>
            </View>
          )}
          <View style={styles.headerInfo}>
            <Text style={styles.productName} numberOfLines={3}>{product.name}</Text>
            <Text style={styles.productBrand}>{product.brand}</Text>
            {product.quantity && <Text style={styles.productQty}>{product.quantity}</Text>}
            <Text style={styles.barcodeText}>#{barcode}</Text>
          </View>
          {analysis && <RatingCircle rating={analysis.overallRating} size={70} />}
        </View>

        {/* Tab Bar (sticky) */}
        <View style={styles.tabBar}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.content}>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'ingredients' && renderIngredients()}
          {activeTab === 'health' && renderHealth()}
          {activeTab === 'corporate' && renderCorporate()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  function renderOverview() {
    return (
      <View style={styles.section}>
        {analysis ? (
          <>
            <View style={styles.tldrBox}>
              <Text style={styles.tldrLabel}>TL;DR</Text>
              <Text style={styles.tldrText}>{analysis.tldr}</Text>
            </View>

            {analysis.misleadingClaims.length > 0 && (
              <View style={styles.alertBox}>
                <Text style={styles.alertTitle}>⚠ Potentially Misleading Claims</Text>
                {analysis.misleadingClaims.map((claim, i) => (
                  <Text key={i} style={styles.alertItem}>• {claim}</Text>
                ))}
              </View>
            )}

            <View style={styles.scores}>
              {product?.nutriscore && (
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>Nutri-Score</Text>
                  <Text style={styles.scoreValue}>{product.nutriscore.toUpperCase()}</Text>
                </View>
              )}
              {product?.novaGroup && (
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>NOVA Group</Text>
                  <Text style={styles.scoreValue}>{product.novaGroup}/4</Text>
                </View>
              )}
              <View style={styles.scoreItem}>
                <Text style={styles.scoreLabel}>PanikDB Rating</Text>
                <Text style={styles.scoreValue}>{analysis.overallRating}/10</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.noAiBox}>
            <Text style={styles.noAiText}>
              AI analysis unavailable. Set your Anthropic API key in Settings.
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Text style={styles.noAiLink}>Go to Settings →</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  function renderIngredients() {
    if (!analysis || !product) return noAiMessage();
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients Decoded</Text>
        <Text style={styles.rawIngredients}>{product.ingredients || 'No ingredients listed'}</Text>
        <View style={styles.divider} />
        {analysis.ingredientsDecoded.map((ing, i) => (
          <View key={i} style={styles.ingredientItem}>
            <View style={styles.ingredientHeader}>
              <Text style={styles.ingredientName}>{ing.name}</Text>
              <RiskBadge level={ing.concern} />
            </View>
            <Text style={styles.ingredientDecoded}>{ing.decoded}</Text>
            <Text style={styles.ingredientExplanation}>{ing.explanation}</Text>
          </View>
        ))}
      </View>
    );
  }

  function renderHealth() {
    if (!analysis || !product) return noAiMessage();
    return (
      <View style={styles.section}>
        {product.nutriments && Object.values(product.nutriments).some(v => v != null) && (
          <>
            <Text style={styles.sectionTitle}>Nutrition</Text>
            <NutritionTable
              nutriments={product.nutriments}
              flags={analysis.nutritionFlags}
              summary={analysis.nutritionSummary}
            />
            <View style={styles.divider} />
          </>
        )}

        <Text style={styles.sectionTitle}>Health Risks</Text>
        {analysis.healthRisks.length === 0 ? (
          <Text style={styles.noRisks}>No significant health risks identified.</Text>
        ) : (
          analysis.healthRisks.map((risk, i) => (
            <View key={i} style={styles.riskItem}>
              <View style={styles.riskHeader}>
                <Text style={styles.riskIngredient}>{risk.ingredient}</Text>
                <RiskBadge level={risk.severity} />
              </View>
              <Text style={styles.riskText}>{risk.risk}</Text>
              <Text style={styles.riskContext}>Context: {risk.context}</Text>
            </View>
          ))
        )}
      </View>
    );
  }

  function renderCorporate() {
    if (!analysis) return noAiMessage();
    const corp = analysis.corporateIntel;
    const ethicsColor = ethicsColors[corp.ethicsRating as keyof typeof ethicsColors] ?? colors.textMuted;

    // Look up by actual product brand (more reliable than Claude's formal company name)
    const companyKey = lookupCompanyKey(product?.brand ?? '') ?? lookupCompanyKey(corp.parentCompany ?? '');

    return (
      <View style={styles.section}>
        <View style={styles.corpHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Corporate Intel</Text>
            <Text style={styles.parentCompany}>{corp.parentCompany}</Text>
          </View>
          <View style={[styles.ethicsBadge, { backgroundColor: ethicsColor + '22', borderColor: ethicsColor }]}>
            <Text style={[styles.ethicsLabel, { color: ethicsColor }]}>
              {corp.ethicsRating.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.ethicsExplanation}>{corp.ethicsExplanation}</Text>

        {companyKey && (
          <TouchableOpacity
            style={styles.companyProfileBtn}
            onPress={() => navigation.navigate('Company', { companyKey })}
          >
            <Text style={styles.companyProfileText}>VIEW FULL CORPORATE PROFILE →</Text>
          </TouchableOpacity>
        )}

        {renderCorpSection('⚖ Lawsuits', corp.lawsuits)}
        {renderCorpSection('🔴 Product Recalls', corp.recalls)}
        {renderCorpSection('🌿 Environmental Violations', corp.environmentalViolations)}
        {renderCorpSection('👷 Labor Violations', corp.laborViolations)}
        {renderCorpSection('📰 Controversies', corp.controversies)}
        {corp.subsidiaries.length > 0 && renderCorpSection('🏢 Known Subsidiaries & Brands', corp.subsidiaries)}
      </View>
    );
  }

  function renderCorpSection(title: string, items: string[]) {
    if (!items || items.length === 0) return null;
    return (
      <View style={styles.corpSection}>
        <Text style={styles.corpSectionTitle}>{title}</Text>
        {items.map((item, i) => (
          <Text key={i} style={styles.corpItem}>• {item}</Text>
        ))}
      </View>
    );
  }

  function noAiMessage() {
    return (
      <View style={[styles.section, styles.noAiBox]}>
        <Text style={styles.noAiText}>Set your Anthropic API key to unlock AI analysis.</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.noAiLink}>Go to Settings →</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  errorIcon: { fontSize: 48, marginBottom: 16 },
  errorTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 8 },
  errorText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  backButton: { backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 },
  backButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  header: {
    flexDirection: 'row',
    padding: 16,
    gap: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'flex-start',
  },
  productImage: { width: 80, height: 80, borderRadius: 8, flexShrink: 0 },
  imagePlaceholder: { backgroundColor: colors.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  imagePlaceholderText: { fontSize: 36 },
  headerInfo: { flex: 1 },
  productName: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 4, lineHeight: 20 },
  productBrand: { fontSize: 13, color: colors.textSecondary, marginBottom: 2 },
  productQty: { fontSize: 12, color: colors.textMuted, marginBottom: 2 },
  barcodeText: { fontSize: 10, color: colors.textMuted, fontFamily: 'monospace' },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabLabel: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  tabLabelActive: { color: colors.primary },

  content: { padding: 16 },
  section: { paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 12 },

  tldrBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  tldrLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, color: colors.primary, marginBottom: 8, textTransform: 'uppercase' },
  tldrText: { fontSize: 14, color: colors.text, lineHeight: 21 },

  alertBox: {
    backgroundColor: colors.warning + '15',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.warning,
    marginBottom: 16,
  },
  alertTitle: { fontSize: 14, fontWeight: '700', color: colors.warning, marginBottom: 8 },
  alertItem: { fontSize: 13, color: colors.text, marginBottom: 4, lineHeight: 19 },

  scores: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  scoreItem: {
    flex: 1,
    minWidth: 90,
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  scoreLabel: { fontSize: 10, color: colors.textSecondary, marginBottom: 4, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  scoreValue: { fontSize: 20, fontWeight: '800', color: colors.text },

  noAiBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  noAiText: { color: colors.textSecondary, textAlign: 'center', marginBottom: 12, lineHeight: 20 },
  noAiLink: { color: colors.primary, fontWeight: '700', fontSize: 14 },

  rawIngredients: { fontSize: 12, color: colors.textMuted, lineHeight: 18, marginBottom: 16, fontStyle: 'italic' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 20 },

  ingredientItem: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ingredientHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  ingredientName: { fontSize: 14, fontWeight: '700', color: colors.text, flex: 1, marginRight: 8 },
  ingredientDecoded: { fontSize: 12, color: colors.primary, fontWeight: '600', marginBottom: 4 },
  ingredientExplanation: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },

  noRisks: { color: colors.safe, fontSize: 15, textAlign: 'center', padding: 20 },
  riskItem: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  riskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  riskIngredient: { fontSize: 13, fontWeight: '700', color: colors.text, flex: 1, marginRight: 8 },
  riskText: { fontSize: 13, color: colors.text, lineHeight: 19, marginBottom: 4 },
  riskContext: { fontSize: 11, color: colors.textMuted, fontStyle: 'italic' },

  corpHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  parentCompany: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 4 },
  ethicsBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 4,
  },
  ethicsLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  ethicsExplanation: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: 20 },

  corpSection: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  corpSectionTitle: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 8 },
  corpItem: { fontSize: 13, color: colors.textSecondary, lineHeight: 20, marginBottom: 4 },

  companyProfileBtn: {
    backgroundColor: colors.primary + '18',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  companyProfileText: { color: colors.primary, fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
});
