import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getApiKey, saveApiKey, clearHistory } from '../services/historyStorage';
import { colors } from '../constants/colors';

export function SettingsScreen() {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getApiKey().then(key => { if (key) setApiKey(key); });
  }, []);

  async function handleSaveKey() {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter a valid API key');
      return;
    }
    await saveApiKey(apiKey.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleClearHistory() {
    Alert.alert(
      'Clear History',
      'Delete all scan history? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: clearHistory },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ANTHROPIC API KEY</Text>
          <Text style={styles.sectionDesc}>
            Required for AI ingredient decoding, health risk analysis, and corporate intelligence.
            Get your key at console.anthropic.com
          </Text>
          <TextInput
            style={styles.input}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="sk-ant-..."
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[styles.button, saved && styles.buttonSaved]}
            onPress={handleSaveKey}
          >
            <Text style={styles.buttonText}>{saved ? '✓ Saved' : 'Save API Key'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Linking.openURL('https://console.anthropic.com/account/keys')}
          >
            <Text style={styles.linkText}>Get API Key →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA</Text>
          <TouchableOpacity style={styles.dangerButton} onPress={handleClearHistory}>
            <Text style={styles.dangerText}>Clear Scan History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <Text style={styles.about}>
            PanikDB uses OpenFoodFacts for product data and Anthropic Claude for AI analysis.
            {'\n\n'}Know what you buy. Know who you're buying from.
          </Text>
          <Text style={styles.version}>v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 32 },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sectionDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: 'monospace',
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonSaved: { backgroundColor: colors.safe },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  linkButton: { alignItems: 'center', padding: 8 },
  linkText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
  dangerButton: {
    backgroundColor: colors.danger + '22',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  dangerText: { color: colors.danger, fontWeight: '700', fontSize: 15 },
  about: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  version: { fontSize: 12, color: colors.textMuted, marginTop: 12 },
});
