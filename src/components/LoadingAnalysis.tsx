import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../constants/colors';

const STEPS = [
  'Fetching product data...',
  'Decoding ingredients...',
  'Assessing health risks...',
  'Investigating corporate history...',
  'Compiling your report...',
];

interface Props {
  step: number;
}

export function LoadingAnalysis({ step }: Props) {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.icon, { opacity: pulse }]}>🔍</Animated.Text>
      <Text style={styles.title}>Analyzing Product</Text>
      {STEPS.map((s, i) => (
        <View key={i} style={styles.stepRow}>
          <Text style={[styles.stepDot, { color: i < step ? colors.safe : i === step ? colors.primary : colors.textMuted }]}>
            {i < step ? '✓' : i === step ? '●' : '○'}
          </Text>
          <Text style={[styles.stepText, { color: i <= step ? colors.text : colors.textMuted }]}>{s}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 24,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    width: 260,
  },
  stepDot: {
    fontSize: 16,
    width: 24,
    fontWeight: '700',
  },
  stepText: {
    fontSize: 14,
    flex: 1,
  },
});
