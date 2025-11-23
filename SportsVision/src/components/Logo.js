import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Asset } from 'expo-asset';

export default function Logo({ size = 84 }) {
  const { colors } = useTheme();

  // Try to render a bundled SVG if react-native-svg is available and the file exists.
  let SvgUri = null;
  try {
    // dynamic require so build doesn't fail if not installed
    // eslint-disable-next-line global-require
    SvgUri = require('react-native-svg').SvgUri;
  } catch (e) {
    SvgUri = null;
  }

  let svgUri = null;
  try {
    // asset path from src/components to project assets folder
    const asset = Asset.fromModule(require('../../assets/logo.svg'));
    svgUri = asset?.uri || null;
  } catch (e) {
    svgUri = null;
  }

  if (SvgUri && svgUri) {
    return (
      // render the SVG file using SvgUri when available
      // eslint-disable-next-line react/jsx-no-undef
      <SvgUri width={size} height={size} uri={svgUri} />
    );
  }

  // fallback: code-based circular mark
  // also attempt to render raster logo.jpg if present
  let raster;
  try {
    // eslint-disable-next-line global-require
    raster = require('../../assets/logo.jpg');
  } catch (e) {
    raster = null;
  }

  if (raster) {
    return <Image source={raster} style={{ width: size, height: size, borderRadius: size / 2 }} resizeMode="cover" />;
  }

  return (
    <View style={[styles.container, { width: size, height: size }]}> 
      <View style={[styles.circle, { backgroundColor: colors.primary, width: size, height: size, borderRadius: size / 2 }]}> 
        <Text style={[styles.initials, { color: '#fff', fontSize: Math.round(size / 2.8) }]}>SV</Text>
      </View>
      <View style={[styles.tag, { backgroundColor: colors.accent }]}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  circle: { alignItems: 'center', justifyContent: 'center', elevation: 4 },
  initials: { fontWeight: '900' },
  tag: { position: 'absolute', right: -6, bottom: -6, width: 18, height: 18, borderRadius: 4 },
});
