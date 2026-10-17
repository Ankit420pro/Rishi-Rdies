
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
  type TextInputProps,
  View,
} from 'react-native';
import { signupUser } from '../api/signup';
import type { UserRole } from '../api/login';
import { RideColors } from '../constants/theme';

export default function SignupScreen() {
  const router = useRouter();
  const { role: requestedRole } = useLocalSearchParams<{ role?: UserRole }>();

  const [role, setRole] = useState<UserRole>(
    requestedRole === 'driver' ? 'driver' : 'passenger'
  );

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [LicenceNumber, setLicenceNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    const cleanMobile = mobile.replace(/\D/g, '');
    const cleanName = name.trim();
    const cleanLicenceNumber = LicenceNumber.trim();

    if (
      !cleanName ||
      !cleanMobile ||
      !password ||
      !confirmPassword ||
      (role === 'driver' && !cleanLicenceNumber)
    ) {
      Alert.alert(
        'Missing details',
        'Please fill in all fields.'
      );
      return;
    }

    if (cleanMobile.length !== 10) {
      Alert.alert(
        'Invalid mobile',
        'Please enter a valid 10 digit mobile number.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Password mismatch',
        'Passwords do not match.'
      );
      return;
    }

    try {
      setLoading(true);
      const response = await signupUser({
        name: cleanName,
        mobile: cleanMobile,
        password,
        role,
        ...(role === 'driver' && { licenseNumber: cleanLicenceNumber }),
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
        'Sign-up Error',
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
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.content}>

          {/* BACK */}

          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={23}
              color={RideColors.text}
            />
          </Pressable>

          {/* LOGO */}

          <View style={styles.logoCircle}>
            <MaterialCommunityIcons
              name="rickshaw"
              size={34}
              color={RideColors.background}
            />
          </View>

          <Text style={styles.logoText}>
            RISHIRIDES
          </Text>

          <Text style={styles.title}>
            Create Account
          </Text>

          <Text style={styles.subtitle}>
            Join RishiRides today
          </Text>

          {/* ROLE */}

          <Text style={styles.roleLabel}>
            CREATE ACCOUNT AS
          </Text>

          <View style={styles.roleContainer}>

            {/* PASSENGER */}

            <Pressable
              style={[
                styles.roleButton,
                role === 'passenger' &&
                  styles.roleButtonActive,
              ]}
              onPress={() => {
                setRole('passenger');
                setLicenceNumber('');
              }}
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
                      : RideColors.accent
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
                PASSENGER
              </Text>

              {role === 'passenger' && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={18}
                  color={RideColors.accent}
                  style={styles.check}
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
              onPress={() =>
                setRole('driver')
              }
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
                      : RideColors.accent
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
                DRIVER
              </Text>

              {role === 'driver' && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={18}
                  color={RideColors.accent}
                  style={styles.check}
                />
              )}
            </Pressable>
          </View>

          {/* NAME */}

          <Input
            icon="account"
            placeholder="Full name"
            value={name}
            onChangeText={setName}
          />

          {/* MOBILE */}

          <Input
            icon="phone"
            placeholder="Mobile number"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            maxLength={10}
          />

          {role === 'driver' && (
            <Input
              icon="card-account-details-outline"
              placeholder="Driving licence number"
              value={LicenceNumber}
              onChangeText={setLicenceNumber}
              autoCapitalize="characters"
            />
          )}

          {/* PASSWORD */}

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock"
              size={21}
              color={RideColors.accent}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={RideColors.textMuted}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />

            <Pressable
              onPress={() =>
                setShowPassword(!showPassword)
              }
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

          {/* CONFIRM */}

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock-check"
              size={21}
              color={RideColors.accent}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor={RideColors.textMuted}
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <Pressable
              onPress={() =>
                setShowConfirm(!showConfirm)
              }
            >
              <MaterialCommunityIcons
                name={
                  showConfirm
                    ? 'eye-off'
                    : 'eye'
                }
                size={21}
                color={RideColors.textMuted}
              />
            </Pressable>
          </View>

          {/* SIGNUP */}

          <Pressable
            style={[
              styles.signupButton,
              loading && styles.signupButtonDisabled,
            ]}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={styles.signupButtonText}>
              {loading
                ? 'CREATING ACCOUNT...'
                : `CREATE ${role === 'passenger' ? 'PASSENGER' : 'DRIVER'} ACCOUNT`}
            </Text>

            {!loading && (
              <MaterialCommunityIcons
                name="arrow-right"
                size={20}
                color={RideColors.background}
              />
            )}
          </Pressable>

          {/* LOGIN */}

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <Pressable
              onPress={() =>
                router.push({ pathname: '/login', params: { role } })
              }
            >
              <Text style={styles.loginLink}>
                {' '}
                Login
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ================= INPUT ================= */

function Input({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  maxLength,
  autoCapitalize,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: TextInputProps['keyboardType'];
  maxLength?: number;
  autoCapitalize?: TextInputProps['autoCapitalize'];
}) {
  return (
    <View style={styles.inputContainer}>
      <MaterialCommunityIcons
        name={icon}
        size={21}
        color={RideColors.accent}
      />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={RideColors.textMuted}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize ?? 'none'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: RideColors.background },
  scroll: { flexGrow: 1, paddingVertical: 30 },
  content: { width: '90%', maxWidth: 430, alignSelf: 'center', paddingTop: 40 },
  backButton: { position: 'absolute', top: 0, left: 0, width: 45, height: 45, borderRadius: 23, backgroundColor: RideColors.surface, borderWidth: 1, borderColor: RideColors.border, alignItems: 'center', justifyContent: 'center' },
  logoCircle: { width: 65, height: 65, borderRadius: 33, backgroundColor: RideColors.accentStrong, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: RideColors.accent, fontSize: 17, fontWeight: '900', letterSpacing: 2, textAlign: 'center', marginTop: 9 },
  title: { color: RideColors.text, fontSize: 29, fontWeight: '900', textAlign: 'center', marginTop: 25 },
  subtitle: { color: RideColors.textMuted, fontSize: 13, textAlign: 'center', marginTop: 7, marginBottom: 20 },
  roleLabel: { color: RideColors.textMuted, fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  roleContainer: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  roleButton: { flex: 1, height: 70, backgroundColor: RideColors.surface, borderRadius: 15, borderWidth: 1, borderColor: RideColors.border, alignItems: 'center', justifyContent: 'center' },
  roleButtonActive: { backgroundColor: RideColors.surfaceRaised, borderColor: RideColors.accentStrong },
  roleIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: RideColors.surfaceRaised, alignItems: 'center', justifyContent: 'center' },
  roleIconActive: { backgroundColor: RideColors.accentStrong },
  roleText: { color: RideColors.textMuted, fontSize: 9, fontWeight: '900', marginTop: 4 },
  roleTextActive: { color: RideColors.accent },
  check: { position: 'absolute', top: 7, right: 7 },
  inputContainer: { height: 55, backgroundColor: RideColors.surfaceRaised, borderRadius: 18, borderWidth: 1, borderColor: RideColors.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, marginBottom: 12 },
  input: { flex: 1, height: '100%', color: RideColors.text, fontSize: 14, marginLeft: 10 },
  signupButton: { height: 55, borderRadius: 28, backgroundColor: RideColors.accentStrong, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 8 },
  signupButtonDisabled: { opacity: 0.6 },
  signupButtonText: { color: RideColors.background, fontSize: 11, fontWeight: '900' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 23 },
  loginText: { color: RideColors.textMuted, fontSize: 13 },
  loginLink: { color: RideColors.accent, fontSize: 13, fontWeight: '900' },
});
