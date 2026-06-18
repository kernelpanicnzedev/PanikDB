import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { colors } from '../constants/colors';
import { getApiKey, getHistory } from '../services/historyStorage';
import { ScannedProduct } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ScannerScreen() {
  const navigation = useNavigation<Nav>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [recentScans, setRecentScans] = useState<ScannedProduct[]>([]);
  const cooldownRef = useRef(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Scanline animation
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(scanLineAnim, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ])
    );
    if (scanned) {
      loop.start();
    } else {
      loop.stop();
      scanLineAnim.setValue(0);
    }
    return () => loop.stop();
  }, [scanned]);

  useFocusEffect(
    React.useCallback(() => {
      Promise.all([getApiKey(), getHistory()]).then(([key, h]) => {
        setHasApiKey(!!key);
        setRecentScans(h.slice(0, 3));
      });
    }, [])
  );

  async function handleBarcode(result: BarcodeScanningResult) {
    if (cooldownRef.current) return;
    cooldownRef.current = true;
    setScanned(true);

    const barcode = result.data;

    if (!hasApiKey) {
      Alert.alert(
        'API Key Required',
        'Set your Anthropic API key in Settings to enable AI analysis.',
        [
          { text: 'Settings', onPress: () => { cooldownRef.current = false; setScanned(false); navigation.navigate('Settings'); } },
          {
            text: 'Continue',
            onPress: () => {
              navigation.navigate('Product', { barcode, productName: 'Loading...' });
              setTimeout(() => { cooldownRef.current = false; setScanned(false); }, 2000);
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => { cooldownRef.current = false; setScanned(false); },
          },
        ]
      );
      return;
    }

    navigation.navigate('Product', { barcode, productName: 'Loading...' });
    setTimeout(() => { cooldownRef.current = false; setScanned(false); }, 2000);
  }

  if (!permission) {
    return <View style={styles.center}><Text style={styles.monoText}>Checking permissions...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>CAMERA{'\n'}REQUIRED</Text>
          <Text style={styles.permissionText}>PanikDB needs camera access to scan product barcodes.</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>GRANT ACCESS</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const scanLineY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['18%', '78%'],
  });

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'qr', 'code128', 'code39'] }}
        onBarcodeScanned={scanned ? undefined : handleBarcode}
      />

      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.appName}>PANIK</Text>
            <Text style={styles.appSubtitle}>KNOW WHO YOU'RE BUYING FROM</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => navigation.navigate('Settings')}
          >
            <View style={styles.settingsDot} />
            <View style={styles.settingsDot} />
            <View style={styles.settingsDot} />
          </TouchableOpacity>
        </View>

        {/* Viewfinder */}
        <View style={styles.viewfinderContainer}>
          <View style={styles.viewfinder}>
            {/* Camera background with grid */}
            <View style={styles.cameraPlaceholder}>
              {[0,1,2,3,4,5].map(i => (
                <View key={`h${i}`} style={[styles.gridLine, styles.gridLineH, { top: `${(i + 1) * 14}%` }]} />
              ))}
              {[0,1,2,3,4,5].map(i => (
                <View key={`v${i}`} style={[styles.gridLine, styles.gridLineV, { left: `${(i + 1) * 14}%` }]} />
              ))}

              {/* Scan line */}
              {scanned && (
                <Animated.View style={[styles.scanLine, { top: scanLineY }]} />
              )}

              {/* Center reticle (not scanning) */}
              {!scanned && (
                <View style={styles.reticle}>
                  <Text style={styles.reticleText}>AIM AT BARCODE</Text>
                </View>
              )}
              {scanned && (
                <View style={styles.reticle}>
                  <Text style={[styles.reticleText, { color: colors.primary }]}>SCANNING...</Text>
                </View>
              )}
            </View>

            {/* Corner markers */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>

          {/* Scan button */}
          <View style={styles.scanButtonContainer}>
            <TouchableOpacity
              style={[styles.scanButton, scanned && styles.scanButtonScanning]}
              onPress={() => {
                if (scanned) {
                  setScanned(false);
                  cooldownRef.current = false;
                }
              }}
              activeOpacity={0.8}
            >
              <View style={styles.scanIcon}>
                <View style={styles.scanIconLine} />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>
            {scanned ? 'TAP TO SCAN AGAIN' : 'TAP TO SCAN'}
          </Text>
        </View>

        {/* Recent scans */}
        {recentScans.length > 0 && (
          <View style={styles.recentContainer}>
            <Text style={styles.recentLabel}>RECENT</Text>
            <View style={styles.recentRow}>
              {recentScans.map((p, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.recentItem}
                  onPress={() => navigation.navigate('Product', { barcode: p.barcode, productName: p.name })}
                >
                  <Text style={styles.recentName} numberOfLines={1}>{p.brand || p.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const CORNER_SIZE = 24;
const BORDER_W = 2.5;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  monoText: { color: colors.textSecondary, fontSize: 13, fontFamily: 'DMMono_400Regular' },

  permissionContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  permissionTitle: { fontFamily: 'BebasNeue_400Regular', fontSize: 52, color: colors.text, letterSpacing: 3, textAlign: 'center', marginBottom: 20 },
  permissionText: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 32, fontFamily: 'DMMono_400Regular' },
  permissionButton: { backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 32, paddingVertical: 14 },
  permissionButtonText: { color: '#fff', fontFamily: 'DMMono_500Medium', fontSize: 13, letterSpacing: 2 },

  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between' },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  appName: { fontFamily: 'BebasNeue_400Regular', fontSize: 32, color: colors.text, letterSpacing: 2, lineHeight: 32 },
  appSubtitle: { fontSize: 9, color: colors.primary, letterSpacing: 4, textTransform: 'uppercase', marginTop: 2, fontFamily: 'DMMono_400Regular' },
  settingsBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceElevated, alignItems: 'center', justifyContent: 'center', gap: 3 },
  settingsDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.textSecondary },

  viewfinderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  viewfinder: { width: '100%', aspectRatio: 1, maxHeight: 300, position: 'relative' },
  cameraPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    backgroundColor: '#0d0d0d',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridLine: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.03)' },
  gridLineH: { left: 0, right: 0, height: 1 },
  gridLineV: { top: 0, bottom: 0, width: 1 },
  scanLine: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    height: 2,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  reticle: { alignItems: 'center' },
  reticleText: { fontFamily: 'DMMono_400Regular', fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: 2, textTransform: 'uppercase' },

  corner: { position: 'absolute', width: CORNER_SIZE, height: CORNER_SIZE, borderColor: colors.primary },
  cornerTL: { top: 12, left: 12, borderTopWidth: BORDER_W, borderLeftWidth: BORDER_W },
  cornerTR: { top: 12, right: 12, borderTopWidth: BORDER_W, borderRightWidth: BORDER_W },
  cornerBL: { bottom: 12, left: 12, borderBottomWidth: BORDER_W, borderLeftWidth: BORDER_W },
  cornerBR: { bottom: 12, right: 12, borderBottomWidth: BORDER_W, borderRightWidth: BORDER_W },

  scanButtonContainer: { marginTop: 32, alignItems: 'center' },
  scanButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  scanButtonScanning: { backgroundColor: colors.surfaceElevated },
  scanIcon: { width: 28, height: 20, alignItems: 'center', justifyContent: 'center' },
  scanIconLine: { width: 22, height: 2, backgroundColor: '#fff', borderRadius: 1 },

  hint: {
    marginTop: 16,
    fontFamily: 'DMMono_400Regular',
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  recentContainer: { paddingHorizontal: 24, paddingBottom: 16 },
  recentLabel: { fontFamily: 'DMMono_400Regular', fontSize: 10, color: colors.textMuted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },
  recentRow: { flexDirection: 'row', gap: 10 },
  recentItem: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  recentName: { fontFamily: 'DMMono_400Regular', fontSize: 10, color: colors.textSecondary },
});
