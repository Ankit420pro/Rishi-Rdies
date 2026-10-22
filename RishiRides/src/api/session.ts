import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { UserRole } from './login';

const SESSION_KEY = 'rishirides.auth-session';

export type AuthenticatedSession = {
  token: string;
  role: UserRole;
  mobile: string;
};

export async function saveAuthenticatedSession({
  token,
  role,
  mobile,
}: {
  token: string;
  role: UserRole;
  mobile: string;
}): Promise<void> {
  if (Platform.OS === 'web') {
    if (!token.startsWith('demo.')) {
      throw new Error('Secure sign-in storage is not available on web. Use the native app for live API sign-in.');
    }
  }
  if (!token.trim()) {
    throw new Error('The authentication service did not return a session token.');
  }
  if (role !== 'driver' && role !== 'passenger') {
    throw new Error('The authentication service returned an invalid account role.');
  }

  const session: AuthenticatedSession = { token, role, mobile };
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  }
}

export async function getAuthenticatedSession(): Promise<AuthenticatedSession | null> {
  const stored = Platform.OS === 'web'
    ? await AsyncStorage.getItem(SESSION_KEY)
    : await SecureStore.getItemAsync(SESSION_KEY);
  if (!stored) {
    return null;
  }

  let value: unknown;
  try {
    value = JSON.parse(stored);
  } catch {
    throw new Error('The saved sign-in session is invalid. Please sign in again.');
  }

  if (
    typeof value !== 'object' ||
    value === null ||
    !('token' in value) ||
    typeof value.token !== 'string' ||
    !value.token ||
    !('role' in value) ||
    (value.role !== 'passenger' && value.role !== 'driver') ||
    !('mobile' in value) ||
    typeof value.mobile !== 'string'
  ) {
    throw new Error('The saved sign-in session is invalid. Please sign in again.');
  }
  if (Platform.OS === 'web' && !value.token.startsWith('demo.')) return null;

  return {
    token: value.token,
    role: value.role,
    mobile: value.mobile,
  };
}

export async function clearAuthenticatedSession(): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(SESSION_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(SESSION_KEY);
}
