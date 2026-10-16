import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RideColors } from '../../../constants/theme';

const serviceConfigured = Boolean(process.env.EXPO_PUBLIC_API_URL);

export default function DriverDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activePreference, setActivePreference] = useState(false);

  const changeAvailability = (next: boolean) => {
    setActivePreference(next);
    if (next) {
      Alert.alert(
        'Availability not published',
        'This setting is only stored on this screen. A secure driver service is not configured, so passengers cannot see you as available.'
      );
    }
  };

  const unavailable = (feature: string) => {
    Alert.alert(feature + ' unavailable', 'This feature needs the secure RishiRide service, which is not configured in this build.');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to home"
            style={styles.backButton}
            onPress={() => router.replace('/landing')}
          >
            <MaterialCommunityIcons name="arrow-left" size={23} color={colors.text} />
          </Pressable>
          <View style={styles.onlineControl}>
            <Text style={styles.onlineLabel}>{activePreference ? 'Online' : 'Go online'}</Text>
            <Switch
              accessibilityLabel="Set driver availability preference"
              value={activePreference}
              onValueChange={changeAvailability}
              trackColor={{ false: '#394b4b', true: colors.mint }}
              thumbColor={activePreference ? '#f4f4ed' : '#aab8b5'}
            />
          </View>
        </View>

        <View style={styles.earnings}>
          <Text style={styles.kicker}>TODAY'S EARNINGS</Text>
          <Text style={styles.earningsAmount}>₹—</Text>
          <Text style={styles.earningsCaption}>Earnings appear here when ride history is connected.</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statNumber}>—</Text>
            <Text style={styles.statLabel}>Completed trips</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statNumber}>—</Text>
            <Text style={styles.statLabel}>Completed today</Text>
            <MaterialCommunityIcons name="check-circle-outline" size={15} color={colors.mint} />
          </View>
        </View>

        <View style={styles.jobCard}>
          <View style={styles.jobHeader}>
            <View style={styles.jobIcon}>
              <MaterialCommunityIcons name="map-marker-path" size={21} color={colors.mint} />
            </View>
            <Text style={styles.jobTitle}>Incoming jobs</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              style={styles.notificationButton}
              onPress={() => unavailable('Ride notifications')}
            >
              <MaterialCommunityIcons name="bell-outline" size={22} color={colors.text} />
            </Pressable>
          </View>
          <View style={styles.routeBlock}>
            <Text style={styles.routeLabel}>PICKUP</Text>
            <Text style={styles.routeValue}>Waiting for a ride request</Text>
          </View>
          <View style={styles.routeBlock}>
            <Text style={styles.routeLabel}>DROPOFF</Text>
            <Text style={styles.routeValueMuted}>Your destination will appear here</Text>
          </View>
          <View style={styles.rule} />
          <View accessibilityState={{ disabled: true }} style={styles.waitingButton}>
            <Text style={styles.waitingButtonText}>Waiting for jobs</Text>
          </View>
          <Text style={styles.infoText}>
            {serviceConfigured
              ? 'The configured service does not provide driver availability or ride requests yet.'
              : 'Ride requests and online status need a secure service. No location or availability is being shared.'}
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const colors = {
  ink: RideColors.background,
  background: RideColors.background,
  panel: RideColors.surface,
  elevated: RideColors.surfaceRaised,
  line: RideColors.border,
  text: RideColors.text,
  muted: RideColors.textMuted,
  mint: RideColors.accent,
  amber: RideColors.warning,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { width: '100%', maxWidth: 460, alignSelf: 'center', paddingHorizontal: 20, paddingBottom: 30 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  backButton: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  onlineControl: { minWidth: 150, height: 46, borderRadius: 24, backgroundColor: colors.mint, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 18, paddingRight: 3 },
  onlineLabel: { color: '#fff', fontSize: 14, fontWeight: '800' },
  kicker: { color: colors.text, fontSize: 14, fontWeight: '700', letterSpacing: 0, marginTop: 3 },
  earnings: { marginTop: 33, marginBottom: 19 },
  earningsAmount: { color: colors.mint, fontSize: 39, fontWeight: '900', letterSpacing: -1, marginTop: 5 },
  earningsCaption: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 3 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statPill: { minHeight: 44, borderRadius: 24, backgroundColor: colors.panel, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingHorizontal: 15 },
  statNumber: { color: colors.mint, fontSize: 15, fontWeight: '900' },
  statLabel: { color: colors.text, fontSize: 12, fontWeight: '600' },
  jobCard: { backgroundColor: colors.panel, borderRadius: 19, padding: 17, marginBottom: 26 },
  jobHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 17 },
  jobIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.elevated, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  jobTitle: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '800' },
  notificationButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  routeBlock: { marginBottom: 15 },
  routeLabel: { color: colors.mint, fontSize: 12, fontWeight: '800', marginBottom: 3 },
  routeValue: { color: colors.text, fontSize: 16, fontWeight: '800' },
  routeValueMuted: { color: colors.muted, fontSize: 14, fontWeight: '600' },
  rule: { height: 1, backgroundColor: colors.line, marginTop: 12, marginBottom: 14 },
  waitingButton: { minHeight: 48, borderRadius: 24, backgroundColor: RideColors.accentStrong, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  waitingButtonText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  infoText: { color: colors.muted, fontSize: 11, lineHeight: 16, textAlign: 'center' },
});