
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
import { signupUser } from '../api/signup';
import { RishiColors } from '../constants/theme';
import AuthScenicFooter from '../components/auth-scenic-footer';

type UserRole = 'passenger' | 'driver';

export default function SignupScreen() {
  const router = useRouter();
  const { role: initialRole, destination } = useLocalSearchParams<{ role?: string; destination?: string }>();

  const role: UserRole = initialRole === 'driver' ? 'driver' : 'passenger';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'hi'>('en');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const hindi = preferredLanguage === 'hi';

  const handleSignup = async () => {
    const cleanMobile = mobile.replace(/\D/g, '');
    if (!name.trim() || !cleanMobile) {
      Alert.alert(
        'Missing details',
        'Enter your name and mobile number to continue.'
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
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert('Invalid email', 'Enter a valid email address or leave it blank.');
      return;
    }
    if (!termsAccepted || !privacyAccepted) {
      Alert.alert(
        hindi ? 'सहमति आवश्यक है' : 'Consent required',
        hindi ? 'आगे बढ़ने के लिए दोनों नीतियों को स्वीकार करें।' : 'Accept both policies before continuing.'
      );
      return;
    }

    try {
      setLoading(true);
      const response = await signupUser({
        mobile: cleanMobile,
        role,
        name: name.trim(),
        ...(email.trim() ? { email: email.trim() } : {}),
        preferredLanguage,
        termsAccepted: true,
        privacyAccepted: true,
      });
      router.push({
        pathname: '/otp',
        params: {
          mobile: response.mobile,
          role: response.role,
          sessionId: response.sessionId,
          developmentOtp: response.developmentOtp ?? '',
          destination: destination ?? '',
        },
      });
    } catch (error) {
      Alert.alert(
        'Unable to start verification',
        error instanceof Error ? error.message : 'Please try again.'
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
              color={RishiColors.text}
            />
          </Pressable>

          {/* LOGO */}

          <View style={styles.logoCircle}>
            <MaterialCommunityIcons
              name="rickshaw"
              size={34}
              color={RishiColors.background}
            />
          </View>

          <Text style={styles.logoText}>
            RISHIRIDES
          </Text>

          <Text style={styles.title}>{hindi ? 'खाता बनाएँ' : 'Create your account'}</Text>

          <Text style={styles.subtitle}>
            {hindi ? 'RishiRides से जुड़ें' : `Sign up as a ${role}`}
          </Text>

          {/* ROLE */}

          <Input
            icon="account"
            placeholder={hindi ? 'पूरा नाम' : 'Full legal name'}
            value={name}
            onChangeText={setName}
          />

          <Input
            icon="email-outline"
            placeholder={hindi ? 'ईमेल (वैकल्पिक)' : 'Email (optional)'}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Input
            icon="phone"
            placeholder={hindi ? 'मोबाइल नंबर' : '10-digit mobile number'}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            maxLength={10}
            countryCode
          />

          <Text style={styles.optionLabel}>{hindi ? 'पसंदीदा भाषा' : 'PREFERRED LANGUAGE'}</Text>
          <View style={styles.languageControl}>
            {(['hi', 'en'] as const).map((language) => (
              <Pressable
                key={language}
                accessibilityRole="button"
                accessibilityState={{ selected: preferredLanguage === language }}
                style={[styles.languageOption, preferredLanguage === language && styles.languageOptionActive]}
                onPress={() => setPreferredLanguage(language)}
              >
                <Text style={[styles.languageText, preferredLanguage === language && styles.languageTextActive]}>
                  {language === 'hi' ? 'हिन्दी' : 'English'}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.policyLinks}>
            <Pressable accessibilityRole="link" onPress={() => router.push({ pathname: '/legal', params: { document: 'terms', language: preferredLanguage } })}>
              <Text style={styles.policyLink}>{hindi ? 'सेवा शर्तें पढ़ें' : 'Read Terms of Service'}</Text>
            </Pressable>
            <Pressable accessibilityRole="link" onPress={() => router.push({ pathname: '/legal', params: { document: 'privacy', language: preferredLanguage } })}>
              <Text style={styles.policyLink}>{hindi ? 'गोपनीयता नीति पढ़ें' : 'Read Privacy Policy'}</Text>
            </Pressable>
          </View>

          <ConsentRow
            checked={termsAccepted}
            onPress={() => setTermsAccepted((value) => !value)}
            label={hindi ? 'मैं RishiRides की सेवा शर्तों से सहमत हूँ।' : 'I agree to the RishiRides Terms of Service.'}
          />
          <ConsentRow
            checked={privacyAccepted}
            onPress={() => setPrivacyAccepted((value) => !value)}
            label={hindi ? 'मैं गोपनीयता नीति पढ़कर स्वीकार करता/करती हूँ।' : 'I have read and accept the Privacy Policy.'}
          />

          <Pressable
            style={[styles.signupButton, (loading || !termsAccepted || !privacyAccepted) && styles.disabledButton]}
            onPress={handleSignup}
            disabled={loading || !termsAccepted || !privacyAccepted}
          >
            <Text style={styles.signupButtonText}>
              {loading ? (hindi ? 'कोड भेज रहे हैं...' : 'SENDING CODE...') : (hindi ? 'OTP भेजें' : 'SEND OTP')}
            </Text>

            {!loading && <MaterialCommunityIcons name="arrow-right" size={20} color={RishiColors.background} />}
          </Pressable>

          {/* LOGIN */}

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>
              {hindi ? 'पहले से खाता है?' : 'Already have an account?'}
            </Text>

            <Pressable
              onPress={() => router.push({ pathname: '/login', params: { role } })}
            >
              <Text style={styles.loginLink}>
                {' '}
                Login
              </Text>
            </Pressable>
          </View>
          <Pressable accessibilityRole="button" style={styles.changeRole} onPress={() => router.replace('/auth/role')}>
            <Text style={styles.changeRoleText}>Choose a different account type</Text>
          </Pressable>
          <AuthScenicFooter />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ConsentRow({ checked, label, onPress }: { checked: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      style={styles.consentRow}
      onPress={onPress}
    >
      <View style={[styles.checkbox, checked && styles.checkboxActive]}>
        {checked && <MaterialCommunityIcons name="check" size={15} color={RishiColors.background} />}
      </View>
      <Text style={styles.consentText}>{label}</Text>
    </Pressable>
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
  countryCode,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: any;
  maxLength?: number;
  countryCode?: boolean;
}) {
  return (
    <View style={styles.inputContainer}>
      {countryCode ? <Text style={styles.countryCode}>🇮🇳  +91⌄</Text> : <MaterialCommunityIcons name={icon} size={21} color={RishiColors.mint} />}
      {countryCode && <View style={styles.phoneDivider} />}

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={RishiColors.muted}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RishiColors.background,
  },

  scroll: {
    flexGrow: 1,
    paddingTop: 12,
    paddingBottom: 28,
  },

  content: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingTop: 20,
    paddingHorizontal: 24,
  },

  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: RishiColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: RishiColors.line,
  },

  logoCircle: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: RishiColors.mint,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoText: {
    color: RishiColors.mint,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 9,
  },

  title: {
    color: RishiColors.text,
    fontSize: 29,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 18,
  },

  subtitle: {
    color: RishiColors.muted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 20,
  },

  roleLabel: {
    color: RishiColors.muted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },

  roleContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },

  roleButton: {
    flex: 1,
    height: 70,
    backgroundColor: RishiColors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: RishiColors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },

  roleButtonActive: {
    backgroundColor: RishiColors.mint,
    borderColor: RishiColors.mint,
  },

  roleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: RishiColors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },

  roleIconActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  roleText: {
    color: RishiColors.muted,
    fontSize: 9,
    fontWeight: '900',
    marginTop: 4,
  },

  roleTextActive: {
    color: RishiColors.background,
  },

  check: {
    position: 'absolute',
    top: 7,
    right: 7,
  },

  optionLabel: { color: RishiColors.muted, fontSize: 10, fontWeight: '900', marginBottom: 8 },
  languageControl: { flexDirection: 'row', backgroundColor: RishiColors.surface, borderWidth: 1, borderColor: RishiColors.line, borderRadius: 11, padding: 4, marginBottom: 14 },
  languageOption: { flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  languageOptionActive: { backgroundColor: RishiColors.mint },
  languageText: { color: RishiColors.muted, fontSize: 13, fontWeight: '800' },
  languageTextActive: { color: RishiColors.background },
  policyLinks: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 6 },
  policyLink: { color: RishiColors.mint, fontSize: 11, fontWeight: '800', paddingVertical: 5 },
  consentRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 11, paddingVertical: 9 },
  checkbox: { width: 22, height: 22, borderWidth: 1, borderColor: RishiColors.line, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: RishiColors.mint, borderColor: RishiColors.mint },
  consentText: { flex: 1, color: RishiColors.muted, fontSize: 12, lineHeight: 18 },

  inputContainer: {
    height: 55,
    backgroundColor: RishiColors.surfaceInput,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: RishiColors.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    height: '100%',
    color: RishiColors.text,
    fontSize: 14,
    marginLeft: 10,
  },

  signupButton: {
    height: 55,
    borderRadius: 11,
    backgroundColor: RishiColors.mint,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 8,
  },

  signupButtonText: {
    color: RishiColors.background,
    fontSize: 11,
    fontWeight: '900',
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 23,
  },

  loginText: {
    color: RishiColors.muted,
    fontSize: 13,
  },

  loginLink: {
    color: RishiColors.mint,
    fontSize: 13,
    fontWeight: '900',
  },
  countryCode: { color: RishiColors.text, fontSize: 11, fontWeight: '800' },
  phoneDivider: { width: 1, height: 22, backgroundColor: RishiColors.line, marginHorizontal: 10 },
  changeRole: { alignItems: 'center', paddingVertical: 10 },
  changeRoleText: { color: RishiColors.muted, fontSize: 10, fontWeight: '700' },
  disabledButton: { opacity: 0.6 },
});
