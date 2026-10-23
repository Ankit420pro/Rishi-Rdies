import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import type { UserRole } from './login';

const SESSION_KEYS = ['isLoggedIn', 'userRole', 'userMobile', 'authToken'];

export type AuthSession = {
  role: UserRole;
  mobile: string;
};

export async function saveAuthSession(
  session: AuthSession & { token: string }
): Promise<void> {
  if (!session.token.trim()) {
    throw new Error('The authentication service did not return a valid session token.');
  }

  await SecureStore.setItemAsync('authToken', session.token);
  await AsyncStorage.multiSet([
    ['isLoggedIn', 'true'],
    ['userRole', session.role],
    ['userMobile', session.mobile],
  ]);
  await AsyncStorage.removeItem('authToken');
}

export async function getAuthSession(): Promise<AuthSession | null> {
  let token = await SecureStore.getItemAsync('authToken');

  if (!token) {
    const legacyToken = await AsyncStorage.getItem('authToken');
    if (legacyToken) {
      await SecureStore.setItemAsync('authToken', legacyToken);
      await AsyncStorage.removeItem('authToken');
      token = legacyToken;
    }
  }

  const [role, mobile] = await AsyncStorage.multiGet(['userRole', 'userMobile']);
  if (!token || role[1] !== 'passenger') {
    await clearAuthSession();
    return null;
  }

  return { role: role[1], mobile: mobile[1] ?? '' };
}

export async function clearAuthSession(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync('authToken'),
    AsyncStorage.multiRemove(SESSION_KEYS),
  ]);
}