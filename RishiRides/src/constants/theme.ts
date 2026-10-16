/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const RishiColors = {
  background: '#071713',
  surface: '#10251E',
  surfaceRaised: '#18372E',
  surfaceInput: '#1C4036',
  line: '#315448',
  mint: '#9BE8C5',
  text: '#F2F7F3',
  muted: '#A8BDB3',
  warning: '#E9C47B',
  danger: '#F07E7E',
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
