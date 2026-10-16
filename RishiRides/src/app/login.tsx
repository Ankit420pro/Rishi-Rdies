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
import { RideColors } from '../constants/theme';

type UserRole = 'passenger' | 'driver';

export default function LoginScreen() {
  const router = useRouter();
  const { role: requestedRole } = useLocalSearchParams<{ role?: string }>();
  const insets = useSafeAreaInsets();

  const [role, setRole] = useState<UserRole>(
    requestedRole === 'driver' ? 'driver' : 'passenger'
  );
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

    if (!password.trim()) {
      Alert.alert(
        'Missing Password',
        'Please enter your password.'
      );
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({
        mobile: cleanMobile,
        password,
        role,
      });

      router.push({
        pathname: '/otp',
        params: {
          mobile: response.mobile,
          role: response.role,
          sessionId: response.sessionId,
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
        {/* BACK BUTTON */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={RideColors.text}
          />
        </Pressable>

        {/* LOGO */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons
              name="rickshaw"
              size={34}
              color={RideColors.background}
            />
          </View>

          <Text style={styles.logoText}>RISHI</Text>
          <Text style={styles.logoTextGreen}>RIDES</Text>
        </View>

        {/* TITLE */}
        <Text style={styles.title}>
          Welcome Back
        </Text>

        <Text style={styles.subtitle}>
          Login to continue with RishiRides
        </Text>

        {/* ROLE */}
        <Text style={styles.label}>
          LOGIN AS
        </Text>

        <View style={styles.roleContainer}>
          {/* PASSENGER */}
          <Pressable
            style={[
              styles.roleButton,
              role === 'passenger' &&
                styles.roleButtonActive,
            ]}
            onPress={() => setRole('passenger')}
          >
            <View
              style={[
                styles.roleIcon,
                role === 'passenger' &&
                  styles.roleIconActive,
              ]}
            >
              <MaterialCommunityIcons
                name="account"
                size={24}
                color={
                  role === 'passenger'
                    ? RideColors.background
                    : RideColors.textMuted
                }
              />
            </View>

            <Text
              style={[
                styles.roleText,
                role === 'passenger' &&
                  styles.roleTextActive,
              ]}
            >
              Passenger
            </Text>

            {role === 'passenger' && (
              <MaterialCommunityIcons
                name="check-circle"
                size={21}
                color={RideColors.accent}
              />
            )}
          </Pressable>

          {/* DRIVER */}
          <Pressable
            style={[
              styles.roleButton,
              role === 'driver' &&
                styles.roleButtonActive,
            ]}
            onPress={() => setRole('driver')}
          >
            <View
              style={[
                styles.roleIcon,
                role === 'driver' &&
                  styles.roleIconActive,
              ]}
            >
              <MaterialCommunityIcons
                name="steering"
                size={24}
                color={
                  role === 'driver'
                    ? RideColors.background
                    : RideColors.textMuted
                }
              />
            </View>

            <Text
              style={[
                styles.roleText,
                role === 'driver' &&
                  styles.roleTextActive,
              ]}
            >
              Driver
            </Text>

            {role === 'driver' && (
              <MaterialCommunityIcons
                name="check-circle"
                size={21}
                color={RideColors.accent}
              />
            )}
          </Pressable>
        </View>

        {/* MOBILE NUMBER */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            MOBILE NUMBER
          </Text>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="phone"
              size={21}
              color={RideColors.textMuted}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter 10-digit mobile number"
              placeholderTextColor={RideColors.textMuted}
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

        {/* PASSWORD */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            PASSWORD
          </Text>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={21}
              color={RideColors.textMuted}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={RideColors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />

            <Pressable
              onPress={() =>
                setShowPassword((previous) => !previous)
              }
              hitSlop={10}
            >
              <MaterialCommunityIcons
                name={
                  showPassword
                    ? 'eye-off'
                    : 'eye'
                }
                size={21}
                color={RideColors.textMuted}
              />
            </Pressable>
          </View>
        </View>

        {/* FORGOT PASSWORD */}
        <Pressable
          style={styles.forgotButton}
          onPress={() =>
            Alert.alert(
              'Forgot Password',
              'Password recovery will be connected later.'
            )
          }
        >
          <Text style={styles.forgotText}>
            Forgot Password?
          </Text>
        </Pressable>

        {/* LOGIN BUTTON */}
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
              ? 'LOGGING IN...'
              : role === 'passenger'
                ? 'LOGIN AS PASSENGER'
                : 'LOGIN AS DRIVER'}
          </Text>

          {!loading && (
            <MaterialCommunityIcons
              name="arrow-right"
              size={22}
              color={RideColors.background}
            />
          )}
        </Pressable>

        {/* SIGN UP */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>
            Don't have an account?
          </Text>

          <Pressable
            onPress={() =>
              router.push({ pathname: '/signup', params: { role } })
            }
          >
            <Text style={styles.signupLink}>
              {' '}Sign Up
            </Text>
          </Pressable>
        </View>

        {/* SECURITY */}
        <View style={styles.infoBox}>
          <MaterialCommunityIcons
            name="shield-check"
            size={22}
            color={RideColors.accent}
          />

          <Text style={styles.infoText}>
            Your information is secure with RishiRides.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: RideColors.background },
  scrollContent: { paddingHorizontal: 22, width: '100%', maxWidth: 480, alignSelf: 'center' },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: RideColors.surface, justifyContent: 'center', alignItems: 'center', marginBottom: 25, borderWidth: 1, borderColor: RideColors.border },
  logoContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 25 },
  logoCircle: { width: 58, height: 58, borderRadius: 29, backgroundColor: RideColors.accentStrong, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  logoText: { fontSize: 28, fontWeight: '900', color: RideColors.text, letterSpacing: 1 },
  logoTextGreen: { fontSize: 28, fontWeight: '900', color: RideColors.accent, letterSpacing: 1 },
  title: { fontSize: 30, fontWeight: '900', color: RideColors.text, textAlign: 'center' },
  subtitle: { fontSize: 14, color: RideColors.textMuted, textAlign: 'center', marginTop: 7, marginBottom: 30 },
  label: { fontSize: 11, fontWeight: '800', color: RideColors.textMuted, letterSpacing: 0.8, marginBottom: 8 },
  roleContainer: { gap: 10, marginBottom: 25 },
  roleButton: { minHeight: 68, borderRadius: 15, backgroundColor: RideColors.surface, borderWidth: 1, borderColor: RideColors.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
  roleButtonActive: { borderColor: RideColors.accentStrong, backgroundColor: RideColors.surfaceRaised },
  roleIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: RideColors.surfaceRaised, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  roleIconActive: { backgroundColor: RideColors.accentStrong },
  roleText: { flex: 1, fontSize: 15, fontWeight: '700', color: RideColors.textMuted },
  roleTextActive: { color: RideColors.accent },
  inputGroup: { marginBottom: 18 },
  inputContainer: { height: 56, backgroundColor: RideColors.surfaceRaised, borderRadius: 18, borderWidth: 1, borderColor: RideColors.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 },
  input: { flex: 1, fontSize: 15, color: RideColors.text, marginLeft: 10 },
  forgotButton: { alignSelf: 'flex-end', marginBottom: 25 },
  forgotText: { color: RideColors.accent, fontSize: 13, fontWeight: '700' },
  loginButton: { height: 56, borderRadius: 28, backgroundColor: RideColors.accentStrong, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, gap: 10 },
  loginButtonDisabled: { opacity: 0.6 },
  loginButtonText: { color: RideColors.background, fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
  signupContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 25 },
  signupText: { color: RideColors.textMuted, fontSize: 14 },
  signupLink: { color: RideColors.accent, fontSize: 14, fontWeight: '800' },
  infoBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, paddingHorizontal: 15 },
  infoText: { color: RideColors.textMuted, fontSize: 11, marginLeft: 7 },
});