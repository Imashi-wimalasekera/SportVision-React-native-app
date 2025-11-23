import React, { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import Logo from './Logo';

// Animated wrapper around the code-based Logo component.
export default function AnimatedLogo({ size = 120 }) {
  const scale = useRef(new Animated.Value(0.95)).current;
  const rotate = useRef(new Animated.Value(0)).current; // 0..1 -> degrees

  useEffect(() => {
    const pulse = Animated.sequence([
      Animated.timing(scale, { toValue: 1.06, duration: 700, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(scale, { toValue: 0.98, duration: 700, easing: Easing.in(Easing.ease), useNativeDriver: true }),
    ]);

    const spin = Animated.sequence([
      Animated.timing(rotate, { toValue: 1, duration: 1400, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(rotate, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]);

    const loop = Animated.parallel([
      Animated.loop(pulse),
      Animated.loop(spin),
    ]);

    loop.start();

    return () => loop.stop();
  }, [scale, rotate]);

  const rotation = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '6deg'] });

  return (
    <Animated.View style={{ transform: [{ scale }, { rotate: rotation }] }}>
      <Logo size={size} />
    </Animated.View>
  );
}
