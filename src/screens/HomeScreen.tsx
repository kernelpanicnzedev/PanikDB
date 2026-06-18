import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { colors } from '../constants/colors';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>PANIK<Text style={styles.logoAccent}>DB</Text></Text>
          <Text style={styles.tagline}>Know what you buy.</Text>
          <Text style={styles.subTagline}>Who you buy it from. What they put in it.</Text>
        </View>

        <View style={styles.features}>
          {[
            { icon: '🔬', label: 'Decoded Ingredients', desc: 'E-codes & chemicals explained' },
            { icon: '⚠️', label: 'Health Risks', desc: 'Short & long-term effects' },
            { icon: '🏢', label: 'Corporate Intel', desc: 'Violations, lawsuits & recalls' },
            { icon: '📊', label: 'Nutrition Analysis', desc: 'Red flags & misleading claims' },
          ].map(f => (
            <View key={f.label} style={styles.feature}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <View>
                <Text style={styles.featureLabel}>{f.label}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.8}
        >
          <Text style={styles.scanButtonSecondary}>⚙ Settings / API Key</Text>
        </TouchableOpacity>

        <Text style={styles.poweredBy}>
          Powered by OpenFoodFacts & Anthropic Claude
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 28, justifyContent: 'center' },
  header: { marginBottom: 40, alignItems: 'center' },
  logo: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 4,
    marginBottom: 12,
  },
  logoAccent: { color: colors.primary },
  tagline: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 4 },
  subTagline: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  features: { gap: 14, marginBottom: 40 },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  featureIcon: { fontSize: 28 },
  featureLabel: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 2 },
  featureDesc: { fontSize: 12, color: colors.textSecondary },
  scanButton: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  scanButtonSecondary: { color: colors.textSecondary, fontWeight: '600', fontSize: 15 },
  poweredBy: { textAlign: 'center', fontSize: 11, color: colors.textMuted },
});
