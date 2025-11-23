import React, { useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

export default function ImageWithFallback({ uri, size = 48, style, alt }){
  const [failed, setFailed] = useState(false);
  if (!uri || failed) {
    const initials = (alt || '').split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase();
    return (
      <View style={[styles.placeholder, { width: size, height: size, borderRadius: size/2 }, style]}>
        <Text style={styles.initials}>{initials || 'SV'}</Text>
      </View>
    );
  }

  return (
    <Image source={{ uri }} style={[{ width: size, height: size, borderRadius: size/2 }, style]} onError={() => setFailed(true)} />
  );
}

const styles = StyleSheet.create({
  placeholder: { backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  initials: { color: '#fff', fontWeight: '800' },
});
