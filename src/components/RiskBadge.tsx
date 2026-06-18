import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

type Concern = 'none' | 'low' | 'medium' | 'high';
type Severity = 'low' | 'medium' | 'high';

interface Props {
  level: Concern | Severity;
  label?: string;
}

const levelConfig = {
  none: { color: colors.riskNone, label: 'SAFE' },
  low: { color: colors.riskLow, label: 'LOW' },
  medium: { color: colors.riskMedium, label: 'MEDIUM' },
  high: { color: colors.riskHigh, label: 'HIGH' },
};

export function RiskBadge({ level, label }: Props) {
  const config = levelConfig[level] ?? levelConfig.low;
  return (
    <View style={[styles.badge, { backgroundColor: config.color + '22', borderColor: config.color }]}>
      <Text style={[styles.text, { color: config.color }]}>{label ?? config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});
