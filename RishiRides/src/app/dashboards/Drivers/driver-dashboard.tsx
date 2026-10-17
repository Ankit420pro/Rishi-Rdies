import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { clearAuthenticatedSession } from '../../../api/session';
import { RishiColors } from '../../../constants/theme';

const serviceConfigured = Boolean(process.env.EXPO_PUBLIC_API_URL);

export default function DriverDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const unavailable = (feature: string) => {
    Alert.alert(feature + ' unavailable', 'This feature needs the secure RishiRide service, which is not configured in this build.');
  };

  const signOut = async () => {
    await clearAuthenticatedSession();
    router.replace('/login');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandMark}><MaterialCommunityIcons name="rickshaw" size={23} color={colors.ink} /></View>
          <View style={styles.brandText}>
            <Text style={styles.brand}>RishiRide</Text>
            <Text style={styles.kicker}>DRIVER WORKSPACE</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Open profile" style={styles.profileButton} onPress={() => unavailable('Driver profile')}>
            <MaterialCommunityIcons name="account-outline" size={22} color={colors.text} />
          </Pressable>
        </View>

        <Text style={styles.heading}>Your ride inbox</Text>
        <Text style={styles.subtitle}>Manage availability and requests from one place.</Text>

        <View style={styles.statusPanel}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIcon}>
              <MaterialCommunityIcons name="file-document-check-outline" size={23} color={colors.muted} />
            </View>
            <View style={styles.statusCopy}>
              <Text style={styles.kicker}>DRIVER APPLICATION</Text>
              <Text style={styles.statusTitle}>Incomplete</Text>
            </View>
          </View>
          <View style={styles.rule} />
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="information-outline" size={18} color={colors.amber} />
            <Text style={styles.infoText}>
              You cannot go online or accept rides until required documents are uploaded privately and an administrator approves them.
            </Text>
          </View>
          <Pressable accessibilityRole="button" style={styles.onboardingButton} onPress={() => router.push('/driver-onboarding')}>
            <Text style={styles.onboardingButtonText}>Continue driver onboarding</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color={colors.ink} />
          </Pressable>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Incoming requests</Text>
          <View style={styles.countPill}><Text style={styles.countText}>0</Text></View>
        </View>
        <View style={styles.emptyPanel}>
          <View style={styles.emptyIcon}><MaterialCommunityIcons name="inbox-outline" size={28} color={colors.mint} /></View>
          <Text style={styles.emptyTitle}>No requests available</Text>
          <Text style={styles.emptyDescription}>
            {serviceConfigured
              ? 'The configured service has not provided any ride requests.'
              : 'Ride requests need a secure service and verified pickup matching. None have been sent to you.'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Your work</Text>
        <View style={styles.actionList}>
          <WorkspaceAction icon="history" label="Ride history" onPress={() => unavailable('Ride history')} />
          <WorkspaceAction icon="cash-multiple" label="Earnings" onPress={() => unavailable('Earnings')} />
          <WorkspaceAction icon="file-document-outline" label="Registration and verification" onPress={() => unavailable('Driver registration')} />
        </View>

        <Pressable accessibilityRole="button" style={styles.signOut} onPress={signOut}>
          <MaterialCommunityIcons name="logout" size={18} color={colors.muted} />
          <Text style={styles.signOutText}>Sign in with another account</Text>
        </Pressable>
      </ScrollView>
      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.navItem}><MaterialCommunityIcons name="inbox-outline" size={20} color={colors.mint} /><Text style={styles.navActive}>Inbox</Text></View>
        <Pressable accessibilityRole="button" style={styles.navItem} onPress={() => unavailable('Driver history')}><MaterialCommunityIcons name="history" size={20} color={colors.muted} /><Text style={styles.navText}>History</Text></Pressable>
        <Pressable accessibilityRole="button" style={styles.navItem} onPress={() => unavailable('Driver profile')}><MaterialCommunityIcons name="account-outline" size={20} color={colors.muted} /><Text style={styles.navText}>Profile</Text></Pressable>
      </View>
    </View>
  );
}

function WorkspaceAction({ icon, label, onPress }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" style={styles.actionRow} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={21} color={colors.mint} />
      <Text style={styles.actionLabel}>{label}</Text>
      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.muted} />
    </Pressable>
  );
}

const colors = { ink: RishiColors.background, background: RishiColors.background, panel: RishiColors.surface, elevated: RishiColors.surfaceRaised, line: RishiColors.line, text: RishiColors.text, muted: RishiColors.muted, mint: RishiColors.mint, amber: RishiColors.warning };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { width: '100%', maxWidth: 680, alignSelf: 'center', paddingHorizontal: 20, paddingBottom: 30 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  brandMark: { width: 42, height: 42, borderRadius: 12, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  brandText: { flex: 1, marginLeft: 10 },
  brand: { color: colors.text, fontSize: 16, fontWeight: '900' },
  kicker: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1, marginTop: 3 },
  profileButton: { width: 42, height: 42, borderWidth: 1, borderColor: colors.line, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  heading: { color: colors.text, fontSize: 29, fontWeight: '900', marginTop: 19 },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 5, marginBottom: 22 },
  statusPanel: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 12, padding: 16 },
  statusHeader: { flexDirection: 'row', alignItems: 'center' },
  statusIcon: { width: 46, height: 46, borderRadius: 12, backgroundColor: colors.elevated, alignItems: 'center', justifyContent: 'center' },
  statusIconActive: { backgroundColor: colors.mint },
  onboardingButton: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.mint, borderRadius: 10, marginTop: 12 },
  onboardingButtonText: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  statusCopy: { flex: 1, marginLeft: 12 },
  statusTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: 2 },
  rule: { height: 1, backgroundColor: colors.line, marginVertical: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 9 },
  infoText: { color: colors.muted, fontSize: 12, lineHeight: 17, flex: 1 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 27, marginBottom: 12 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: 24, marginBottom: 12 },
  countPill: { minWidth: 26, height: 24, borderRadius: 12, backgroundColor: colors.elevated, alignItems: 'center', justifyContent: 'center' },
  countText: { color: colors.muted, fontSize: 11, fontWeight: '900' },
  emptyPanel: { minHeight: 185, backgroundColor: colors.panel, borderRadius: 12, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', padding: 20 },
  emptyIcon: { width: 54, height: 54, borderRadius: 14, backgroundColor: colors.elevated, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: colors.text, fontSize: 15, fontWeight: '900', marginTop: 13 },
  emptyDescription: { maxWidth: 320, color: colors.muted, fontSize: 12, lineHeight: 17, textAlign: 'center', marginTop: 6 },
  actionList: { borderTopWidth: 1, borderTopColor: colors.line },
  actionRow: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: colors.line },
  actionLabel: { color: colors.text, fontSize: 13, fontWeight: '700', flex: 1 },
  signOut: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 18, marginTop: 8 },
  signOutText: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  bottomNav: { minHeight: 67, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.background },
  navItem: { minWidth: 72, alignItems: 'center', gap: 4 },
  navText: { color: colors.muted, fontSize: 10, fontWeight: '800' },
  navActive: { color: colors.mint, fontSize: 10, fontWeight: '800' },
});