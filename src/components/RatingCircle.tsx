import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

interface Props {
  rating: number;
  size?: number;
}

function getRatingColor(rating: number): string {
  if (rating <= 2) return colors.riskHigh;
  if (rating <= 4) return colors.caution;
  if (rating <= 6) return colors.warning;
  if (rating <= 8) return colors.info;
  return colors.safe;
}

function getRatingLabel(rating: number): string {
  if (rating <= 2) return 'Alarming';
  if (rating <= 4) return 'Concerning';
  if (rating <= 6) return 'Mixed';
  if (rating <= 8) return 'Acceptable';
  return 'Good';
}

export function RatingCircle({ rating, size = 80 }: Props) {
  const color = getRatingColor(rating);
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, borderColor: color }]}>
      <Text style={[styles.number, { color, fontSize: size * 0.38 }]}>{rating}</Text>
      <Text style={[styles.label, { color: colors.textSecondary, fontSize: size * 0.12 }]}>
        {getRatingLabel(rating)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  number: {
    fontWeight: '800',
    lineHeight: undefined,
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.3,
    marginTop: 1,
  },
});
