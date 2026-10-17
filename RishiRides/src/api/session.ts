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
    throw new Error('Secure sign-in storage is not available on web. Use the Android app to sign in.');
  }
  if (!token.trim()) {
    throw new Error('The authentication service did not return a session token.');
  }
  if (role !== 'driver' && role !== 'passenger') {
    throw new Error('The authentication service returned an invalid account role.');
  }

  const session: AuthenticatedSession = { token, role, mobile };
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function getAuthenticatedSession(): Promise<AuthenticatedSession | null> {
  if (Platform.OS === 'web') {
    return null;
  }

  const stored = await SecureStore.getItemAsync(SESSION_KEY);
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

  return {
    token: value.token,
    role: value.role,
    mobile: value.mobile,
  };
}

export async function clearAuthenticatedSession(): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  await SecureStore.deleteItemAsync(SESSION_KEY);
}
