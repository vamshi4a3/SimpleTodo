import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

type Props = { onFinish: () => void; duration?: number };

export default function SplashScreen({ onFinish, duration = 2000 }: Props) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
    const timer = setTimeout(onFinish, duration);
    return () => clearTimeout(timer);
  }, [scale, opacity, onFinish, duration]);

  return (
    <View style={styles.container} testID="splash-screen">
      <Animated.View style={[styles.logo, { opacity, transform: [{ scale }] }]}>
        <Text style={styles.check}>✓</Text>
      </Animated.View>
      <Animated.Text style={[styles.title, { opacity }]}>
        Simple Todo
      </Animated.Text>
      <Animated.Text style={[styles.tagline, { opacity }]}>
        Get things done
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  check: { fontSize: 64, color: colors.primary, fontWeight: '900' },
  title: { fontSize: 32, fontWeight: '800', color: '#FFFFFF' },
  tagline: { fontSize: 16, color: '#E0E7FF', marginTop: 6 },
});
