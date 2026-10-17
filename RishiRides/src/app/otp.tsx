import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { UserRole } from '../api/login';
import { resendOtp, verifyOtp } from '../api/otp';
import { saveAuthenticatedSession } from '../api/session';
import { RishiColors } from '../constants/theme';

export default function OtpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mobile, role, sessionId, destination, developmentOtp: initialDevelopmentOtp } = useLocalSearchParams<{
    mobile: string;
    role: UserRole;
    sessionId: string;
    destination?: string;
    developmentOtp?: string;
  }>();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [challengeId, setChallengeId] = useState(sessionId ?? '');
  const [developmentOtp, setDevelopmentOtp] = useState(initialDevelopmentOtp ?? '');
  const otpLength = developmentOtp ? developmentOtp.length : 6;

  const handleVerify = async () => {
    if (otp.length !== otpLength) {
      Alert.alert('Invalid OTP', `Please enter the ${otpLength}-digit OTP.`);
      return;
    }

    try {
      setLoading(true);
      const result = await verifyOtp({
        sessionId: challengeId,
        mobile: mobile ?? '',
        otp,
      });

      if (!result.verified || !result.token?.trim() || !role || !mobile) {
        throw new Error('Verification did not return a valid authenticated session.');
      }

      await saveAuthenticatedSession({ role, mobile, token: result.token });
      router.replace(
        role === 'driver'
          ? '/dashboards/Drivers/driver-dashboard'
          : { pathname: '/dashboards/passenger/passenger-dashboard', params: { destination: destination ?? '' } }
      );
    } catch (error) {
      Alert.alert(
        'Verification failed',
        error instanceof Error ? error.message : 'Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      const challenge = await resendOtp(challengeId, mobile ?? '');
      setChallengeId(challenge.sessionId);
      setDevelopmentOtp(challenge.developmentOtp ?? '');
      setOtp('');
      Alert.alert('OTP sent', 'A new OTP has been sent to your mobile number.');
    } catch (error) {
      Alert.alert(
        'Unable to resend',
        error instanceof Error ? error.message : 'Please try again.'
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={[
          styles.content,
          { paddingTop: Math.max(insets.top, 20) },
        ]}
      >
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={RishiColors.text} />
        </Pressable>

        <View style={styles.logoCircle}>
          <MaterialCommunityIcons name="shield-check" size={34} color={RishiColors.background} />
        </View>
        <Text style={styles.title}>Verify your number</Text>
        <Text style={styles.subtitle}>
          Enter the {otpLength}-digit OTP sent to {mobile ? `******${mobile.slice(-4)}` : 'your mobile'}.
        </Text>

        {developmentOtp.length > 0 && (
          <View style={styles.developmentCode}>
            <MaterialCommunityIcons name="flask-outline" size={17} color={RishiColors.warning} />
            <Text style={styles.developmentCodeText}>Development OTP: {developmentOtp}</Text>
          </View>
        )}

        <Text style={styles.label}>OTP</Text>
        <TextInput
          style={styles.otpInput}
          value={otp}
          onChangeText={(value) => setOtp(value.replace(/\D/g, '').slice(0, otpLength))}
          keyboardType="number-pad"
          maxLength={otpLength}
          placeholder={'0'.repeat(otpLength)}
          placeholderTextColor={RishiColors.muted}
          textContentType="oneTimeCode"
          autoFocus
        />

        <Pressable
          style={[styles.verifyButton, loading && styles.disabledButton]}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={styles.verifyText}>
            {loading ? 'VERIFYING...' : 'VERIFY OTP'}
          </Text>
          {!loading && (
            <MaterialCommunityIcons name="arrow-right" size={22} color={RishiColors.background} />
          )}
        </Pressable>

        <Pressable onPress={handleResend} disabled={resending}>
          <Text style={[styles.resendText, resending && styles.disabledButton]}>{resending ? 'SENDING...' : 'Resend OTP'}</Text>
        </Pressable>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: RishiColors.background },
  content: { flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center', paddingHorizontal: 24 },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: RishiColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 58,
    borderWidth: 1,
    borderColor: RishiColors.line,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: RishiColors.mint,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 25,
  },
  title: { fontSize: 29, fontWeight: '800', color: RishiColors.text, textAlign: 'left' },
  subtitle: { fontSize: 14, lineHeight: 21, color: RishiColors.muted, textAlign: 'left', marginTop: 9, marginBottom: 38 },
  label: { fontSize: 11, fontWeight: '800', color: RishiColors.muted, letterSpacing: 0.8, marginBottom: 8 },
  otpInput: {
    height: 64,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: RishiColors.line,
    backgroundColor: RishiColors.surfaceInput,
    color: RishiColors.text,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 10,
    textAlign: 'center',
    paddingLeft: 10,
  },
  verifyButton: {
    height: 58,
    borderRadius: 14,
    backgroundColor: RishiColors.mint,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 25,
  },
  disabledButton: { opacity: 0.65 },
  verifyText: { color: RishiColors.background, fontSize: 15, fontWeight: '900' },
  resendText: { color: RishiColors.mint, fontSize: 14, fontWeight: '800', textAlign: 'center', marginTop: 25 },
  developmentCode: { minHeight: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: RishiColors.line, backgroundColor: RishiColors.surface, borderRadius: 10, marginBottom: 22, paddingHorizontal: 12 },
  developmentCodeText: { color: RishiColors.warning, fontSize: 12, fontWeight: '700' },
});