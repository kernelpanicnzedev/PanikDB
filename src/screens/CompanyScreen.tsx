import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { CORPORATE_DB, CorporateRecord, Violation } from '../data/corporateDatabase';
import { RootStackParamList } from '../types';
import { colors } from '../constants/colors';

type RouteT = RouteProp<RootStackParamList, 'Company'>;

const severityColor = (s: 1 | 2 | 3 | 4 | 5): string => {
  if (s >= 5) return '#FF2D2D';
  if (s >= 4) return '#FF6B2D';
  if (s >= 3) return '#FFB800';
  return colors.textMuted;
};

const ethicsColors: Record<string, string> = {
  poor: '#FF2D2D',
  concerning: '#FF6B2D',
  mixed: '#FFB800',
  moderate: colors.safe,
  good: '#2dc653',
};

function ViolationCard({ v }: { v: Violation }) {
  const dot = severityColor(v.severity);
  return (
    <View style={styles.violationCard}>
      <View style={styles.violationHeader}>
        <View style={styles.violationLeft}>
          <View style={[styles.severityDot, { backgroundColor: dot }]} />
          <View>
            <Text style={styles.violationType}>{v.type.replace('-', ' ').toUpperCase()}</Text>
            <Text style={styles.violationMeta}>{v.agency} · {v.year}</Text>
          </View>
        </View>
        {v.penalty && <Text style={styles.violationPenalty}>{v.penalty}</Text>}
      </View>
      <Text style={styles.violationDesc}>{v.description}</Text>
    </View>
  );
}

export function CompanyScreen() {
  const route = useRoute<RouteT>();
  const { companyKey } = route.params;
  const record: CorporateRecord | undefined = CORPORATE_DB[companyKey];

  if (!record) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>No corporate record found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const ethicsColor = ethicsColors[record.ethicsRating] ?? colors.textMuted;
  const totalFines = record.totalFines;
  const finesValue = /^[$€£¥CHF]/.test(totalFines) ? totalFines.split(' ')[0] : '—';
  const finesSub = finesValue === '—' ? totalFines.slice(0, 22) + (totalFines.length > 22 ? '…' : '') : 'Documented';
  const violationCount = record.violations.length;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTag}>PARENT CORPORATION</Text>
          <Text style={styles.heroName}>{record.name.toUpperCase()}</Text>
          <View style={styles.heroMeta}>
            {record.hq && <Text style={styles.heroMetaItem}><Text style={styles.heroMetaLabel}>HQ </Text>{record.hq}</Text>}
            {record.founded && <Text style={styles.heroMetaItem}><Text style={styles.heroMetaLabel}>Founded </Text>{record.founded}</Text>}
            {record.ticker && <Text style={styles.heroMetaItem}>{record.ticker}</Text>}
          </View>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {record.revenue && (
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>ANNUAL REVENUE</Text>
              <Text style={styles.statValue}>{record.revenue.split(' ')[0]}</Text>
              <Text style={styles.statSub}>{record.revenue.split(' ').slice(1).join(' ')}</Text>
            </View>
          )}
          {record.employees && (
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>EMPLOYEES</Text>
              <Text style={styles.statValue}>{record.employees}</Text>
              <Text style={styles.statSub}>Worldwide</Text>
            </View>
          )}
          <View style={[styles.statCard, styles.statCardRed]}>
            <Text style={styles.statLabel}>TOTAL FINES</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>{finesValue}</Text>
            <Text style={styles.statSub}>{finesSub}</Text>
          </View>
          <View style={[styles.statCard, styles.statCardRed]}>
            <Text style={styles.statLabel}>VIOLATIONS</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>{violationCount}</Text>
            <Text style={styles.statSub}>On record</Text>
          </View>
        </View>

        {/* Ethics rating */}
        <View style={[styles.ethicsBox, { borderColor: ethicsColor + '44' }]}>
          <View style={styles.ethicsHeader}>
            <Text style={styles.ethicsLabel}>ETHICS RATING</Text>
            <View style={[styles.ethicsBadge, { backgroundColor: ethicsColor + '22', borderColor: ethicsColor }]}>
              <Text style={[styles.ethicsBadgeText, { color: ethicsColor }]}>{record.ethicsRating.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Violations */}
        {record.violations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DOCUMENTED VIOLATIONS</Text>
            {record.violations.map((v, i) => (
              <ViolationCard key={i} v={v} />
            ))}
          </View>
        )}

        {/* Brands */}
        {record.brands.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>BRANDS UNDER THIS CORPORATION</Text>
            <View style={styles.brandsGrid}>
              {record.brands.slice(0, 24).map((b, i) => (
                <View key={i} style={styles.brandChip}>
                  <Text style={styles.brandChipText}>{b}</Text>
                </View>
              ))}
              {record.brands.length > 24 && (
                <View style={[styles.brandChip, styles.brandChipMore]}>
                  <Text style={[styles.brandChipText, { color: colors.textMuted }]}>+{record.brands.length - 24} more</Text>
                </View>
              )}
            </View>
          </View>
        )}

        <Text style={styles.disclaimer}>
          Data compiled from public records: SEC filings, DOJ settlements, EPA enforcement actions, court records, and investigative journalism. Current as of mid-2026.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingBottom: 60 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { color: colors.textSecondary, fontSize: 15 },

  hero: { padding: 24, paddingTop: 20 },
  heroTag: { fontSize: 9, color: colors.primary, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 },
  heroName: { fontFamily: 'BebasNeue_400Regular', fontSize: 44, color: colors.text, letterSpacing: 2, lineHeight: 48 },
  heroMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 10 },
  heroMetaItem: { fontSize: 10, color: colors.textSecondary },
  heroMetaLabel: { color: colors.textMuted, letterSpacing: 1 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 24, marginBottom: 16 },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statCardRed: { borderColor: colors.primary + '33' },
  statLabel: { fontSize: 9, color: colors.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  statValue: { fontFamily: 'BebasNeue_400Regular', fontSize: 28, color: colors.text, letterSpacing: 1 },
  statSub: { fontSize: 9, color: colors.textMuted, letterSpacing: 1 },

  ethicsBox: {
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
  },
  ethicsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ethicsLabel: { fontSize: 10, color: colors.textMuted, letterSpacing: 2, textTransform: 'uppercase' },
  ethicsBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  ethicsBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },

  section: { paddingHorizontal: 24, marginBottom: 24 },
  sectionTitle: { fontSize: 10, color: colors.textMuted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },

  violationCard: {
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  violationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  violationLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, flex: 1 },
  severityDot: { width: 8, height: 8, borderRadius: 4, marginTop: 3, flexShrink: 0 },
  violationType: { fontSize: 11, color: colors.text, fontWeight: '600', letterSpacing: 0.5 },
  violationMeta: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  violationPenalty: { fontSize: 12, color: colors.primary, fontWeight: '600', flexShrink: 0 },
  violationDesc: { fontSize: 11, color: colors.textSecondary, lineHeight: 17 },

  brandsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  brandChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  brandChipMore: { backgroundColor: 'transparent' },
  brandChipText: { fontSize: 11, color: colors.textSecondary },

  disclaimer: {
    marginHorizontal: 24,
    fontSize: 10,
    color: colors.textMuted,
    lineHeight: 16,
    fontStyle: 'italic',
  },
});
