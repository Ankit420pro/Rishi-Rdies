/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const RideColors = {
  background: '#071713',
  surface: '#10251E',
  surfaceRaised: '#18352A',
  border: '#29473A',
  text: '#F3F5ED',
  textMuted: '#A9B9B0',
  accent: '#9BE8C5',
  accentStrong: '#52C891',
  warning: '#E9B769',
  critical: '#F87171',
} as const;

export const Colors = {
  light: {
    text: RideColors.text,
    background: RideColors.background,
    backgroundElement: RideColors.surface,
    backgroundSelected: RideColors.surfaceRaised,
    textSecondary: RideColors.textMuted,
  },
  dark: {
    text: RideColors.text,
    background: RideColors.background,
    backgroundElement: RideColors.surface,
    backgroundSelected: RideColors.surfaceRaised,
    textSecondary: RideColors.textMuted,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
