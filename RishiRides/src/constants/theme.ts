/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const RishiColors = {
  background: '#F4F7F3',
  surface: '#FFFFFF',
  surfaceRaised: '#EEF3EE',
  surfaceInput: '#FFFFFF',
  line: '#DCE5DE',
  mint: '#087F68',
  text: '#183A32',
  muted: '#718078',
  warning: '#9A6D16',
  danger: '#B94343',
} as const;

export const RideColors = {
  background: RishiColors.background,
  surface: RishiColors.surface,
  surfaceRaised: RishiColors.surfaceRaised,
  border: RishiColors.line,
  text: RishiColors.text,
  textMuted: RishiColors.muted,
  accent: RishiColors.mint,
  accentStrong: RishiColors.mint,
  warning: RishiColors.warning,
  critical: RishiColors.danger,
} as const;

export const Colors = {
  light: {
    text: RishiColors.text,
    background: RishiColors.background,
    backgroundElement: RishiColors.surface,
    backgroundSelected: RishiColors.surfaceRaised,
    textSecondary: RishiColors.muted,
  },
  dark: {
    text: RishiColors.text,
    background: RishiColors.background,
    backgroundElement: RishiColors.surface,
    backgroundSelected: RishiColors.surfaceRaised,
    textSecondary: RishiColors.muted,
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
