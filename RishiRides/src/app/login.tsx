import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { loginUser } from '../api/login';
import { RishiColors } from '../constants/theme';
import AuthScenicFooter from '../components/auth-scenic-footer';

type UserRole = 'passenger' | 'driver';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { role: requestedRole } = useLocalSearchParams<{ role?: string }>();

  const role: UserRole = requestedRole === 'driver' ? 'driver' : 'passenger';
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const cleanMobile = mobile.replace(/\D/g, '');

    if (!cleanMobile) {
      Alert.alert(
        'Missing Mobile Number',
        'Please enter your mobile number.'
      );
      return;
    }

    if (cleanMobile.length !== 10) {
      Alert.alert(
        'Invalid Mobile Number',
        'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({
        mobile: cleanMobile,
        role,
      });

      router.push({
        pathname: '/otp',
        params: {
          mobile: response.mobile,
          role: response.role,
          sessionId: response.sessionId,
          developmentOtp: response.developmentOtp ?? '',
        },
      });
    } catch (error) {
      Alert.alert(
        'Login Error',
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 20),
            paddingBottom: Math.max(insets.bottom, 30),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Pressable accessibilityRole="button" accessibilityLabel="Back" style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={21} color={RishiColors.text} />
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => Alert.alert('RishiRide help', 'For sign-in assistance, contact RishiRide support after service setup.')}>
            <Text style={styles.helpText}>Need help? ⓘ</Text>
          </Pressable>
        </View>

        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons
              name="rickshaw"
              size={34}
              color={RishiColors.background}
            />
          </View>
          <View>
            <Text style={styles.logoText}>RishiRides</Text>
            <Text style={styles.logoCaption}>RISHIKESH · UTTARAKHAND</Text>
          </View>
        </View>

        <Text style={styles.title}>Welcome back!</Text>

        <Text style={styles.subtitle}>Log in to continue as a {role}</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            MOBILE NUMBER
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.countryCode}>🇮🇳  +91⌄</Text>
            <View style={styles.phoneDivider} />

            <TextInput
              style={styles.input}
              placeholder="Enter your mobile number"
              placeholderTextColor={RishiColors.muted}
              value={mobile}
              onChangeText={(text) => {
                const cleaned = text
                  .replace(/\D/g, '')
                  .slice(0, 10);

                setMobile(cleaned);
              }}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>

        <Pressable
          style={[
            styles.loginButton,
            loading &&
              styles.loginButtonDisabled,
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading
              ? 'SENDING CODE...'
              : 'SEND OTP'}
          </Text>

          {!loading && (
            <MaterialCommunityIcons
              name="arrow-right"
              size={22}
              color={RishiColors.background}
            />
          )}
        </Pressable>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>
            Don't have an account?
          </Text>

          <Pressable
            onPress={() => router.push({ pathname: '/signup', params: { role } })}
          >
            <Text style={styles.signupLink}>
              {' '}Sign Up
            </Text>
          </Pressable>
        </View>

        <View style={styles.infoBox}>
          <MaterialCommunityIcons
            name="shield-check"
            size={22}
            color={RishiColors.mint}
          />

          <Text style={styles.infoText}>
            Your information is secure with RishiRides.
          </Text>
        </View>
        <Pressable accessibilityRole="button" style={styles.changeRole} onPress={() => router.replace('/auth/role')}>
          <Text style={styles.changeRoleText}>Choose a different account type</Text>
        </Pressable>
        <AuthScenicFooter />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RishiColors.background,
  },

  scrollContent: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  topBar: { minHeight: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  helpText: { color: RishiColors.text, fontSize: 11, fontWeight: '700' },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

  logoCircle: {
    width: 43,
    height: 43,
    borderRadius: 11,
    backgroundColor: RishiColors.mint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  logoText: {
    fontSize: 19,
    fontWeight: '900',
    color: RishiColors.text,
  },

  logoCaption: {
    color: RishiColors.muted,
    fontSize: 9,
    fontWeight: '800',
    marginTop: 3,
    letterSpacing: 1,
  },

  title: {
    fontSize: 25,
    fontWeight: '900',
    color: RishiColors.text,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 12,
    color: RishiColors.muted,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 28,
  },

  label: {
    fontSize: 11,
    fontWeight: '800',
    color: RishiColors.muted,
    letterSpacing: 0.8,
    marginBottom: 8,
  },

  roleContainer: {
    flexDirection: 'row',
    gap: 10,
    padding: 5,
    borderRadius: 14,
    backgroundColor: RishiColors.surface,
    marginBottom: 28,
  },

  roleButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  roleButtonActive: {
    backgroundColor: RishiColors.mint,
  },

  roleIcon: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: RishiColors.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
  },

  roleIconActive: {
    backgroundColor: 'rgba(7, 23, 19, 0.12)',
  },

  roleText: {
    fontSize: 13,
    fontWeight: '700',
    color: RishiColors.muted,
  },

  roleTextActive: {
    color: RishiColors.background,
  },

  inputGroup: {
    marginBottom: 22,
  },

  inputContainer: {
    height: 52,
    backgroundColor: RishiColors.surfaceInput,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: RishiColors.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: RishiColors.text,
    marginLeft: 10,
  },
  countryCode: { color: RishiColors.text, fontSize: 12, fontWeight: '800' },
  phoneDivider: { width: 1, height: 22, backgroundColor: RishiColors.line, marginHorizontal: 10 },

  loginButton: {
    height: 48,
    borderRadius: 7,
    backgroundColor: RishiColors.mint,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 10,
  },

  loginButtonDisabled: {
    opacity: 0.6,
  },

  loginButtonText: {
    color: RishiColors.background,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  changeRole: { alignItems: 'center', paddingVertical: 10 },
  changeRoleText: { color: RishiColors.muted, fontSize: 10, fontWeight: '700' },

  signupText: {
    color: RishiColors.muted,
    fontSize: 14,
  },

  signupLink: {
    color: RishiColors.mint,
    fontSize: 14,
    fontWeight: '800',
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    paddingHorizontal: 15,
  },

  infoText: {
    color: RishiColors.muted,
    fontSize: 11,
    marginLeft: 7,
  },
});