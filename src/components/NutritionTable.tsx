import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Nutriments, NutritionFlags } from '../types';
import { colors } from '../constants/colors';

interface Props {
  nutriments: Nutriments;
  flags: NutritionFlags[];
  summary: string;
}

function Row({ label, value, unit }: { label: string; value?: number; unit: string }) {
  if (value == null) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value.toFixed(1)}{unit}</Text>
    </View>
  );
}

const flagColors = {
  info: colors.info,
  warning: colors.warning,
  danger: colors.danger,
};

export function NutritionTable({ nutriments, flags, summary }: Props) {
  return (
    <View>
      <Text style={styles.summary}>{summary}</Text>

      {flags.length > 0 && (
        <View style={styles.flagsContainer}>
          {flags.map((f, i) => (
            <View key={i} style={[styles.flagRow, { borderLeftColor: flagColors[f.severity] }]}>
              <Text style={[styles.flagText, { color: flagColors[f.severity] }]}>{f.flag}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.table}>
        <Text style={styles.tableHeader}>Nutritional Values (per 100g)</Text>
        <Row label="Energy" value={nutriments.energy_kcal_100g ?? (nutriments.energy_100g ? nutriments.energy_100g / 4.184 : undefined)} unit=" kcal" />
        <Row label="Fat" value={nutriments.fat_100g} unit="g" />
        <Row label="Saturated Fat" value={nutriments.saturated_fat_100g} unit="g" />
        <Row label="Carbohydrates" value={nutriments.carbohydrates_100g} unit="g" />
        <Row label="Sugars" value={nutriments.sugars_100g} unit="g" />
        <Row label="Fiber" value={nutriments.fiber_100g} unit="g" />
        <Row label="Protein" value={nutriments.proteins_100g} unit="g" />
        <Row label="Salt" value={nutriments.salt_100g} unit="g" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
  flagsContainer: {
    marginBottom: 16,
    gap: 8,
  },
  flagRow: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    paddingVertical: 6,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 4,
  },
  flagText: {
    fontSize: 13,
    fontWeight: '500',
  },
  table: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    padding: 12,
    backgroundColor: colors.surface,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  rowValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
