
import React, { useEffect, useRef } from 'react';
import { RishiColors } from '../constants/theme';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RideColors } from '../constants/theme';

export default function SplashScreen() {
  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      }),

      Animated.timing(opacity, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>

      {/* Decorative circles */}
      <View style={styles.circleLarge} />
      <View style={styles.circleSmall} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        {/* Logo */}
        <View style={styles.logo}>
          <Text style={styles.logoIcon}>R</Text>
        </View>

        {/* App name */}
        <Text style={styles.title}>RishiRides</Text>

        <Text style={styles.subtitle}>
          Ride Smart. Ride Safe.
        </Text>

        {/* Bottom line */}
        <View style={styles.line} />

        <Text style={styles.loading}>
          YOUR JOURNEY STARTS HERE
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: RishiColors.background,
=======
    backgroundColor: RideColors.background,
>>>>>>> origin/main
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  content: {
    alignItems: 'center',
    zIndex: 5,
  },

  logo: {
    width: 125,
    height: 125,
    borderRadius: 38,
<<<<<<< HEAD
    backgroundColor: RishiColors.surface,
=======
    backgroundColor: RideColors.surface,
>>>>>>> origin/main

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,

    elevation: 15,
  },

  logoIcon: {
    fontSize: 72,
    fontWeight: '900',
<<<<<<< HEAD
    color: RishiColors.mint,
=======
    color: RideColors.accentStrong,
>>>>>>> origin/main
    fontStyle: 'italic',
  },

  title: {
    marginTop: 28,
    fontSize: 42,
    fontWeight: '900',
<<<<<<< HEAD
    color: RishiColors.text,
=======
    color: RideColors.text,
>>>>>>> origin/main
    letterSpacing: -1.5,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
<<<<<<< HEAD
    color: RishiColors.muted,
=======
    color: RideColors.textMuted,
>>>>>>> origin/main
    letterSpacing: 1,
  },

  line: {
    width: 55,
    height: 4,
    borderRadius: 10,
<<<<<<< HEAD
    backgroundColor: RishiColors.mint,
=======
    backgroundColor: RideColors.accent,
>>>>>>> origin/main
    marginTop: 30,
    marginBottom: 18,
  },

  loading: {
    fontSize: 10,
    fontWeight: '800',
    color: RishiColors.muted,
    letterSpacing: 2,
  },

  circleLarge: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: 'rgba(155,232,197,0.04)',
    top: -130,
    right: -150,
  },

  circleSmall: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(155,232,197,0.03)',
    bottom: -100,
    left: -100,
  },
});
