import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserRole } from './login';

const ACCOUNT_KEY = 'rishirides.demo.accounts';
const CHALLENGE_KEY = 'rishirides.demo.otp-challenges';
export const DEMO_OTP = '1234';

export type DemoAccount = {
  mobile: string;
  role: UserRole;
  name?: string;
  email?: string;
  preferredLanguage?: 'en' | 'hi';
};

type DemoChallenge = {
  sessionId: string;
  mobile: string;
  role: UserRole;
  expiresAt: number;
  attempts: number;
};

async function readJson<T>(key: string, fallback: T): Promise<T> {
  const value = await AsyncStorage.getItem(key);
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    await AsyncStorage.removeItem(key);
    return fallback;
  }
}

function createSessionId(): string {
  return `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function issueChallenge(account: DemoAccount) {
  const challenges = await readJson<DemoChallenge[]>(CHALLENGE_KEY, []);
  const active = challenges.filter((challenge) => challenge.expiresAt > Date.now());
  const challenge: DemoChallenge = {
    sessionId: createSessionId(),
    mobile: account.mobile,
    role: account.role,
    expiresAt: Date.now() + 5 * 60 * 1000,
    attempts: 0,
  };
  await AsyncStorage.setItem(CHALLENGE_KEY, JSON.stringify([...active, challenge]));
  return {
    sessionId: challenge.sessionId,
    mobile: account.mobile,
    role: account.role,
    maskedMobile: `******${account.mobile.slice(-4)}`,
    developmentOtp: DEMO_OTP,
  };
}

export async function startDemoSignup(account: DemoAccount) {
  const accounts = await readJson<DemoAccount[]>(ACCOUNT_KEY, []);
  if (accounts.some((entry) => entry.mobile === account.mobile && entry.role === account.role)) {
    throw new Error(`A ${account.role} demo account already exists for this number. Sign in instead.`);
  }
  if (account.email && accounts.some((entry) => entry.email?.toLowerCase() === account.email?.toLowerCase() && entry.role === account.role)) {
    throw new Error(`A ${account.role} demo account already uses this email.`);
  }
  await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify([...accounts, account]));
  return issueChallenge(account);
}

export async function startDemoLogin(mobile: string, role: UserRole) {
  const accounts = await readJson<DemoAccount[]>(ACCOUNT_KEY, []);
  const account = accounts.find((entry) => entry.mobile === mobile && entry.role === role);
  if (!account) {
    throw new Error(`No ${role} demo account exists for this number. Sign up first.`);
  }
  return issueChallenge(account);
}

export async function resendDemoOtp(sessionId: string, mobile: string) {
  const challenges = await readJson<DemoChallenge[]>(CHALLENGE_KEY, []);
  const current = challenges.find((challenge) => challenge.sessionId === sessionId && challenge.mobile === mobile);
  if (!current || current.expiresAt <= Date.now()) {
    throw new Error('The demo verification expired. Start sign-in again.');
  }
  return issueChallenge({ mobile: current.mobile, role: current.role });
}

export async function verifyDemoOtp(sessionId: string, mobile: string, code: string) {
  const challenges = await readJson<DemoChallenge[]>(CHALLENGE_KEY, []);
  const challenge = challenges.find((entry) => entry.sessionId === sessionId && entry.mobile === mobile);
  if (!challenge || challenge.expiresAt <= Date.now() || challenge.attempts >= 5) {
    throw new Error('The demo code expired or the attempt limit was reached. Start again.');
  }
  if (code !== DEMO_OTP) {
    challenge.attempts += 1;
    await AsyncStorage.setItem(CHALLENGE_KEY, JSON.stringify(challenges));
    throw new Error('Incorrect demo OTP. Enter 1234.');
  }
  await AsyncStorage.setItem(CHALLENGE_KEY, JSON.stringify(challenges.filter((entry) => entry.sessionId !== sessionId)));
  return { verified: true as const, token: `demo.${createSessionId()}`, role: challenge.role };
}

export async function clearDemoAccounts(): Promise<void> {
  await AsyncStorage.multiRemove([ACCOUNT_KEY, CHALLENGE_KEY]);
}
