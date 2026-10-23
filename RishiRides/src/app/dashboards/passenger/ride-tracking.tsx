import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDemoRides, type DemoRide } from '../../../api/demo-rides';
import { getAuthenticatedSession } from '../../../api/session';
import RishikeshMapPreview from '../../../components/rishikesh-map-preview';

export default function RideTrackingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { rideId } = useLocalSearchParams<{ rideId?: string }>();
  const [ride, setRide] = useState<DemoRide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      const [session, rides] = await Promise.all([getAuthenticatedSession(), getDemoRides()]);
      if (!active) return;
      const acceptedRide = rides.find((item) =>
        item.id === rideId &&
        item.passengerMobile === session?.mobile &&
        item.driverMobile &&
        ['accepted', 'driver_arriving', 'in_progress'].includes(item.status),
      );
      setRide(acceptedRide ?? null);
      setLoading(false);
    };
    void refresh();
    const timer = setInterval(() => void refresh(), 2000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [rideId]);

  const driverCoordinates = ride?.driverLocation;
  const mapLabel = driverCoordinates ? 'Accepted driver location' : 'Driver location not shared';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" accessibilityLabel="Back to passenger dashboard" style={styles.backButton} onPress={() => router.replace('/dashboards/passenger/passenger-dashboard')}>
            <MaterialCommunityIcons name="arrow-left" size={21} color={colors.ink} />
          </Pressable>
          <View>
            <Text style={styles.eyebrow}>RISHIRIDE · TRIP</Text>
            <Text style={styles.title}>Your driver</Text>
          </View>
          <View style={styles.acceptedBadge}><View style={styles.acceptedDot} /><Text style={styles.acceptedText}>ACCEPTED</Text></View>
        </View>

        {loading ? (
          <View style={styles.loading}><ActivityIndicator color={colors.green} /></View>
        ) : !ride ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="car-search-outline" size={30} color={colors.muted} />
            <Text style={styles.emptyTitle}>Ride details unavailable</Text>
            <Text style={styles.emptyText}>This ride may have changed status. Return to the dashboard to refresh it.</Text>
          </View>
        ) : (
          <>
            <RishikeshMapPreview
              centerCoordinates={driverCoordinates}
              markerLabel={mapLabel}
            />
            {!driverCoordinates && (
              <View style={styles.locationNotice}>
                <MaterialCommunityIcons name="map-marker-alert-outline" size={18} color={colors.amber} />
                <Text style={styles.locationNoticeText}>The driver accepted the ride, but their location has not been shared yet.</Text>
              </View>
            )}

            <View style={styles.driverPanel}>
              <View style={styles.avatar}><MaterialCommunityIcons name="account" size={27} color={colors.green} /></View>
              <View style={styles.driverDetails}>
                <Text style={styles.driverLabel}>YOUR DRIVER</Text>
                <Text style={styles.driverName}>{ride.driverName || 'Accepted driver'}</Text>
                {!!ride.driverMobile && <Text style={styles.driverPhone}>•••• {ride.driverMobile.slice(-4)}</Text>}
              </View>
              <View style={styles.rating}>
                <MaterialCommunityIcons name="star" size={17} color={colors.amber} />
                <Text style={styles.ratingText}>{typeof ride.driverRating === 'number' ? ride.driverRating.toFixed(1) : 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.tripPanel}>
              <Text style={styles.sectionLabel}>TRIP DETAILS</Text>
              <View style={styles.routeRow}>
                <View style={styles.routeMarks}><View style={styles.pickupMark} /><View style={styles.routeLine} /><View style={styles.destinationMark} /></View>
                <View style={styles.routeDetails}>
                  <View><Text style={styles.routeLabel}>PICKUP</Text><Text style={styles.routeValue}>{ride.pickup}</Text></View>
                  <View style={styles.routeDivider} />
                  <View><Text style={styles.routeLabel}>DESTINATION</Text><Text style={styles.routeValue}>{ride.destination}</Text></View>
                </View>
              </View>
              <View style={styles.fareRow}>
                <View><Text style={styles.routeLabel}>FARE</Text><Text style={styles.fareNote}>{ride.vehicle} · agreed estimate</Text></View>
                <Text style={styles.fareValue}>₹{ride.estimate}</Text>
              </View>
            </View>

            <Text style={styles.disclaimer}>Driver location and rating appear only when provided by the accepting driver. This demo tracking screen does not receive live GPS updates.</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const colors = {
  background: '#F4F7F3',
  ink: '#183A32',
  green: '#087F68',
  muted: '#718078',
  line: '#DCE5DE',
  amber: '#9A6D16',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 20, paddingBottom: 36 },
  header: { minHeight: 86, flexDirection: 'row', alignItems: 'center', gap: 13 },
  backButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: colors.ink },
  eyebrow: { color: colors.green, fontSize: 9, fontWeight: '900' },
  title: { color: colors.ink, fontSize: 24, fontWeight: '900', marginTop: 2 },
  acceptedBadge: { marginLeft: 'auto', minHeight: 30, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 9, borderRadius: 5, backgroundColor: '#E1F1E8' },
  acceptedDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green },
  acceptedText: { color: colors.green, fontSize: 9, fontWeight: '900' },
  loading: { height: 260, alignItems: 'center', justifyContent: 'center' },
  emptyState: { padding: 24, marginTop: 18, alignItems: 'center', gap: 9, borderWidth: 1, borderColor: colors.line, borderRadius: 10, backgroundColor: '#FFFFFF' },
  emptyTitle: { color: colors.ink, fontSize: 16, fontWeight: '900' },
  emptyText: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center' },
  locationNotice: { flexDirection: 'row', gap: 8, alignItems: 'center', padding: 11, marginTop: 10, borderRadius: 7, backgroundColor: '#FFF7E7' },
  locationNoticeText: { flex: 1, color: colors.amber, fontSize: 12, lineHeight: 17 },
  driverPanel: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, marginTop: 14, borderRadius: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.line },
  avatar: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: '#E6F3EC' },
  driverDetails: { flex: 1 },
  driverLabel: { color: colors.muted, fontSize: 9, fontWeight: '900' },
  driverName: { color: colors.ink, fontSize: 16, fontWeight: '900', marginTop: 3 },
  driverPhone: { color: colors.muted, fontSize: 11, marginTop: 2 },
  rating: { minWidth: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 7, borderRadius: 6, backgroundColor: '#FFF7E7' },
  ratingText: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  tripPanel: { padding: 16, marginTop: 12, borderRadius: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.line },
  sectionLabel: { color: colors.muted, fontSize: 9, fontWeight: '900' },
  routeRow: { flexDirection: 'row', gap: 13, marginTop: 17 },
  routeMarks: { width: 10, alignItems: 'center', paddingTop: 4, paddingBottom: 4 },
  pickupMark: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.green },
  routeLine: { width: 1, flex: 1, minHeight: 22, backgroundColor: colors.line, marginVertical: 5 },
  destinationMark: { width: 9, height: 9, backgroundColor: colors.amber },
  routeDetails: { flex: 1, gap: 13 },
  routeLabel: { color: colors.muted, fontSize: 9, fontWeight: '900' },
  routeValue: { color: colors.ink, fontSize: 13, fontWeight: '700', marginTop: 4 },
  routeDivider: { height: 1, backgroundColor: colors.line },
  fareRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderColor: colors.line, marginTop: 15, paddingTop: 13 },
  fareNote: { color: colors.muted, fontSize: 11, marginTop: 4 },
  fareValue: { color: colors.ink, fontSize: 23, fontWeight: '900' },
  disclaimer: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 12, textAlign: 'center' },
});
