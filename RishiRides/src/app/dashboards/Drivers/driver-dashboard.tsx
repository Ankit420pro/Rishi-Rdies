import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { clearAuthenticatedSession, getAuthenticatedSession } from '../../../api/session';
import { acceptDemoRide, getDemoRides, rejectDemoRide, updateDemoRideStatus, type DemoRide } from '../../../api/demo-rides';
import RishikeshMapPreview from '../../../components/rishikesh-map-preview';

const demoMode = !process.env.EXPO_PUBLIC_API_URL;

export default function DriverDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [demoMessage, setDemoMessage] = useState('');
  const [driverMobile, setDriverMobile] = useState('');
  const [demoOnline, setDemoOnline] = useState(false);
  const [requests, setRequests] = useState<DemoRide[]>([]);
  const [rideHistory, setRideHistory] = useState<DemoRide[]>([]);
  const [activeRide, setActiveRide] = useState<DemoRide | null>(null);
  const unavailable = (feature: string) => {
    Alert.alert(feature + ' unavailable', 'This feature needs the secure RishiRide service, which is not configured in this build.');
  };

  const signOut = async () => {
    await clearAuthenticatedSession();
    router.replace({ pathname: '/login', params: { role: 'driver' } });
  };

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      const session = await getAuthenticatedSession();
      if (!session || !active) return;
      setDriverMobile(session.mobile);
      const rides = await getDemoRides();
      if (!active) return;
      setRequests(rides.filter((ride) => ride.status === 'requested'));
      setRideHistory(rides.filter((ride) => ride.driverMobile === session.mobile));
      setActiveRide(rides.find((ride) => ride.driverMobile === session.mobile && ['accepted', 'driver_arriving', 'in_progress'].includes(ride.status)) ?? null);
    };
    void refresh();
    const timer = setInterval(() => void refresh(), 2000);
    return () => { active = false; clearInterval(timer); };
  }, []);

  const acceptRequest = async (rideId: string) => {
    if (!demoMode || !demoOnline) return;
    try {
      await acceptDemoRide(rideId, driverMobile);
      setDemoMessage('Demo request accepted locally. Passenger status will update on this device.');
    } catch (error) {
      setDemoMessage(error instanceof Error ? error.message : 'Could not accept this demo request.');
    }
  };

  const updateActiveRide = async (status: 'driver_arriving' | 'in_progress' | 'completed') => {
    if (!activeRide) return;
    try {
      await updateDemoRideStatus(activeRide.id, status, driverMobile);
      setDemoMessage(`Demo trip updated: ${status.replace('_', ' ')}.`);
    } catch (error) {
      setDemoMessage(error instanceof Error ? error.message : 'Could not update the demo trip.');
    }
  };

  const completedRides = rideHistory.filter((ride) => ride.status === 'completed');
  const demoEarnings = completedRides.reduce((total, ride) => total + ride.estimate, 0);
  const openRideHistory = () => {
    const description = rideHistory.length
      ? rideHistory.map((ride) => `${ride.pickup} → ${ride.destination} · ${ride.status.replace('_', ' ')} · ₹${ride.estimate}`).join('\n')
      : 'No demo rides yet.';
    Alert.alert('Local demo ride history', description);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandMark}><MaterialCommunityIcons name="rickshaw" size={23} color={colors.ink} /></View>
          <View style={styles.brandText}>
            <Text style={styles.brand}>RishiRide</Text>
            <Text style={styles.kicker}>RISHIKESH · DRIVER</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Open profile" style={styles.profileButton} onPress={() => Alert.alert('Driver demo profile', `Role: Driver Partner\nMobile: •••• ${driverMobile.slice(-4)}\nVerification: Not submitted`)}>
            <MaterialCommunityIcons name="account-outline" size={22} color={colors.text} />
          </Pressable>
        </View>

        <Text style={styles.heading}>Your ride inbox</Text>
        <Text style={styles.subtitle}>Your status and trip previews, in one place.</Text>

        <RishikeshMapPreview />

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>TODAY'S EARNINGS</Text>
            <Text style={styles.summaryValue}>{demoMode ? `₹${demoEarnings}` : '--'}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>COMPLETED RIDES</Text>
            <Text style={styles.summaryValue}>{demoMode ? completedRides.length : '--'}</Text>
          </View>
          <Pressable accessibilityRole="switch" accessibilityState={{ checked: demoOnline, disabled: !demoMode }} style={[styles.offlineBadge, demoOnline && styles.onlineBadge]} disabled={!demoMode} onPress={() => setDemoOnline((value) => !value)}>
            <View style={[styles.offlineDot, demoOnline && styles.onlineDot]} /><Text style={[styles.offlineText, demoOnline && styles.onlineText]}>{demoOnline ? 'DEMO ONLINE' : 'OFFLINE'}</Text>
          </Pressable>
        </View>

        <View style={styles.statusPanel}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIcon}>
              <MaterialCommunityIcons name="file-document-check-outline" size={23} color={colors.muted} />
            </View>
            <View style={styles.statusCopy}>
              <Text style={styles.kicker}>DRIVER APPLICATION</Text>
              <Text style={styles.statusTitle}>Not submitted</Text>
            </View>
          </View>
          <View style={styles.rule} />
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="information-outline" size={18} color={colors.amber} />
            <Text style={styles.infoText}>
              {demoMode ? 'Demo mode allows locally stored sample requests only. Real trips require private document review and administrator approval.' : 'You cannot accept live rides until required documents are uploaded privately and an administrator approves them.'}
            </Text>
          </View>
          <Pressable accessibilityRole="button" style={styles.onboardingButton} onPress={() => router.push('/driver-onboarding')}>
            <Text style={styles.onboardingButtonText}>Continue driver onboarding</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color={colors.ink} />
          </Pressable>
        </View>

        {activeRide && (
          <View style={styles.requestPanel}>
            <Text style={styles.sampleCaption}>LOCAL DEMO TRIP · NOT LIVE TRACKING</Text>
            <Text style={styles.sampleTitle}>{activeRide.pickup} → {activeRide.destination}</Text>
            <Text style={styles.requestMetaText}>Passenger •••• {activeRide.passengerMobile.slice(-4)} · {activeRide.vehicle} · ₹{activeRide.estimate} estimate</Text>
            {activeRide.status === 'accepted' && <Pressable accessibilityRole="button" style={styles.onboardingButton} onPress={() => void updateActiveRide('driver_arriving')}><Text style={styles.onboardingButtonText}>Confirm arrival</Text><MaterialCommunityIcons name="map-marker-check" size={18} color={colors.ink} /></Pressable>}
            {activeRide.status === 'driver_arriving' && <Pressable accessibilityRole="button" style={styles.onboardingButton} onPress={() => void updateActiveRide('in_progress')}><Text style={styles.onboardingButtonText}>Start demo trip</Text><MaterialCommunityIcons name="play" size={18} color={colors.ink} /></Pressable>}
            {activeRide.status === 'in_progress' && <Pressable accessibilityRole="button" style={styles.onboardingButton} onPress={() => void updateActiveRide('completed')}><Text style={styles.onboardingButtonText}>Complete demo trip</Text><MaterialCommunityIcons name="check" size={18} color={colors.ink} /></Pressable>}
          </View>
        )}

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Incoming requests</Text>
          <View style={styles.countPill}><Text style={styles.countText}>{demoMode ? 'DEMO' : 'LIVE OFF'}</Text></View>
        </View>
        {requests.length ? requests.map((request) => (
          <View key={request.id} style={styles.requestPanel}>
            <View style={styles.sampleHeader}>
              <View style={styles.sampleIcon}><MaterialCommunityIcons name="map-marker-path" size={21} color={colors.green} /></View>
              <View style={styles.sampleCopy}>
                <Text style={styles.sampleTitle}>Passenger request</Text>
                <Text style={styles.sampleCaption}>LOCAL DEMO · NOT DISPATCHED</Text>
              </View>
              <Text style={styles.sampleFare}>₹{request.estimate}</Text>
            </View>
            <View style={styles.requestRoute}>
              <View style={styles.requestDots}><View style={styles.requestPickupDot} /><View style={styles.requestRouteLine} /><View style={styles.requestDropDot} /></View>
              <View style={styles.requestPlaces}>
                <View style={styles.requestPlace}><Text style={styles.requestPlaceLabel}>PICKUP</Text><Text style={styles.requestPlaceName}>{request.pickup}</Text></View>
                <View style={styles.requestPlace}><Text style={styles.requestPlaceLabel}>DROP</Text><Text style={styles.requestPlaceName}>{request.destination}</Text></View>
              </View>
            </View>
            <View style={styles.requestMeta}>
              <Text style={styles.requestMetaText}>Passenger •••• {request.passengerMobile.slice(-4)}</Text>
              <Text style={styles.requestMetaText}>{request.vehicle}</Text>
            </View>
            <View style={styles.requestActions}>
              <Pressable accessibilityRole="button" style={styles.dismissButton} onPress={() => { void rejectDemoRide(request.id).then(() => setDemoMessage('Demo request dismissed locally.')); }}>
                <Text style={styles.dismissText}>Dismiss</Text>
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityState={{ disabled: !demoMode || !demoOnline }} style={[styles.acceptDisabled, demoMode && demoOnline && styles.acceptEnabled]} disabled={!demoMode || !demoOnline} onPress={() => void acceptRequest(request.id)}>
                <Text style={styles.acceptDisabledText}>{!demoMode ? 'Live dispatch unavailable' : demoOnline ? 'Accept demo request' : 'Go online to accept'}</Text>
              </Pressable>
            </View>
            <Text style={styles.sampleDisclaimer}>Local demo only. No real dispatch, route tracking, or payment is connected.</Text>
          </View>
        )) : (
          <View style={styles.emptyPanel}>
            <View style={styles.emptyIcon}><MaterialCommunityIcons name="inbox-outline" size={28} color={colors.mint} /></View>
            <Text style={styles.emptyTitle}>No pending requests</Text>
            <Text style={styles.emptyDescription}>{demoMode ? 'Requests from a local demo passenger appear here.' : 'Live ride dispatch is not configured.'}</Text>
          </View>
        )}
        {!!demoMessage && <Text accessibilityLiveRegion="polite" style={styles.demoMessage}>{demoMessage}</Text>}

        <Text style={styles.sectionTitle}>Your work</Text>
        <View style={styles.actionList}>
          <WorkspaceAction icon="history" label="Ride history" onPress={openRideHistory} />
          <WorkspaceAction icon="cash-multiple" label="Earnings" onPress={() => Alert.alert('Demo earnings', demoMode ? `${completedRides.length} completed demo rides\nIllustrative total: ₹${demoEarnings}\nNo payout has been made.` : 'Earnings are not available from the configured service.')} />
          <WorkspaceAction icon="file-document-outline" label="Registration and verification" onPress={() => unavailable('Driver registration')} />
        </View>

        <Pressable accessibilityRole="button" style={styles.signOut} onPress={signOut}>
          <MaterialCommunityIcons name="logout" size={18} color={colors.muted} />
          <Text style={styles.signOutText}>Sign in with another account</Text>
        </Pressable>
      </ScrollView>
      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.navItem}><MaterialCommunityIcons name="inbox-outline" size={20} color={colors.mint} /><Text style={styles.navActive}>Inbox</Text></View>
        <Pressable accessibilityRole="button" style={styles.navItem} onPress={openRideHistory}><MaterialCommunityIcons name="history" size={20} color={colors.muted} /><Text style={styles.navText}>History</Text></Pressable>
        <Pressable accessibilityRole="button" style={styles.navItem} onPress={() => Alert.alert('Driver demo profile', `Role: Driver Partner\nMobile: •••• ${driverMobile.slice(-4)}\nVerification: Not submitted`)}><MaterialCommunityIcons name="account-outline" size={20} color={colors.muted} /><Text style={styles.navText}>Profile</Text></Pressable>
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

const colors = { ink: '#FFFFFF', background: '#F4F7F3', panel: '#FFFFFF', elevated: '#EEF3EE', line: '#DCE5DE', text: '#183A32', muted: '#718078', mint: '#087F68', green: '#087F68', amber: '#9A6D16' };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 20, paddingBottom: 30 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  brandMark: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#D3F279', alignItems: 'center', justifyContent: 'center' },
  brandText: { flex: 1, marginLeft: 10 },
  brand: { color: colors.text, fontSize: 16, fontWeight: '900' },
  kicker: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1, marginTop: 3 },
  profileButton: { width: 42, height: 42, borderWidth: 1, borderColor: colors.line, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  heading: { color: colors.text, fontSize: 29, fontWeight: '900', marginTop: 19 },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 5, marginBottom: 16 },
  summaryRow: { minHeight: 76, flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 13, marginTop: 12, marginBottom: 12, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 12 },
  summaryItem: { flex: 1 },
  summaryLabel: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 0.5 },
  summaryValue: { color: colors.text, fontSize: 17, fontWeight: '900', marginTop: 5 },
  summaryDivider: { width: 1, height: 34, backgroundColor: colors.line },
  offlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 6, backgroundColor: colors.elevated, borderRadius: 14 },
  onlineBadge: { backgroundColor: '#E6F3EC' },
  offlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.muted },
  onlineDot: { backgroundColor: colors.mint },
  offlineText: { color: colors.muted, fontSize: 8, fontWeight: '900' },
  onlineText: { color: colors.mint },
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
  requestPanel: { backgroundColor: colors.panel, borderRadius: 12, borderWidth: 1, borderColor: colors.line, padding: 15 },
  sampleHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sampleIcon: { width: 40, height: 40, borderRadius: 11, backgroundColor: '#E6F3EC', alignItems: 'center', justifyContent: 'center' },
  sampleCopy: { flex: 1 },
  sampleTitle: { color: colors.text, fontSize: 14, fontWeight: '900' },
  sampleCaption: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 0.5, marginTop: 4 },
  sampleFare: { color: colors.text, fontSize: 17, fontWeight: '900' },
  requestRoute: { flexDirection: 'row', marginTop: 15 },
  requestDots: { width: 17, alignItems: 'center', paddingTop: 5, paddingBottom: 4 },
  requestPickupDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.green },
  requestRouteLine: { flex: 1, width: 1, backgroundColor: colors.line, marginVertical: 4 },
  requestDropDot: { width: 9, height: 9, backgroundColor: '#D3F279' },
  requestPlaces: { flex: 1, gap: 12, marginLeft: 8 },
  requestPlace: { minHeight: 33 },
  requestPlaceLabel: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 0.6 },
  requestPlaceName: { color: colors.text, fontSize: 12, fontWeight: '700', marginTop: 3 },
  requestMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 11, marginTop: 9 },
  requestMetaText: { color: colors.muted, fontSize: 10, fontWeight: '700' },
  requestActions: { flexDirection: 'row', gap: 9, marginTop: 13 },
  dismissButton: { minHeight: 43, flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: 9 },
  dismissText: { color: colors.text, fontSize: 11, fontWeight: '800' },
  acceptDisabled: { minHeight: 43, flex: 1.5, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.mint, borderRadius: 9, opacity: 0.48 },
  acceptEnabled: { opacity: 1 },
  acceptDisabledText: { color: '#FFFFFF', fontSize: 11, fontWeight: '900' },
  sampleDisclaimer: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 9 },
  demoMessage: { color: colors.amber, fontSize: 11, lineHeight: 16, marginTop: 10 },
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