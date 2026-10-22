import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RishikeshMapPreview from '../../../components/rishikesh-map-preview';

const bookingConfigured = Boolean(process.env.EXPO_PUBLIC_API_URL);

const destinations = [
  'Triveni Ghat',
  'Laxman Jhula',
  'Beatles Ashram',
  'Ram Jhula',
  'Parmarth Niketan',
  'Neer Garh Waterfall',
  'Gita Bhawan',
  'Shivpuri',
];

const rideOptions = [
  { name: 'Bike', icon: 'motorbike' as const, fare: 65, eta: '3 min' },
  { name: 'Auto', icon: 'rickshaw' as const, fare: 110, eta: '5 min' },
  { name: 'Mini', icon: 'car-hatchback' as const, fare: 165, eta: '7 min' },
  { name: 'Sedan', icon: 'car-side' as const, fare: 220, eta: '8 min' },
  { name: 'SUV', icon: 'car-estate' as const, fare: 310, eta: '10 min' },
];

export default function PassengerDashboard() {
  const router = useRouter();
  const { destination: initialDestination } = useLocalSearchParams<{ destination?: string }>();
  const insets = useSafeAreaInsets();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState(initialDestination ?? '');
  const [pickupCoordinates, setPickupCoordinates] = useState<Location.LocationObjectCoords | null>(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const [selectedRide, setSelectedRide] = useState('Auto');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');

  const ride = rideOptions.find((option) => option.name === selectedRide) ?? rideOptions[1];

  const useCurrentLocation = async () => {
    setLocationLoading(true);
    setLocationMessage('');
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setLocationMessage('Location permission was denied. Enter a pickup point manually to continue.');
        setPickupCoordinates(null);
        return;
      }

      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const [address] = await Location.reverseGeocodeAsync(current.coords);
      const name = address
        ? [address.name, address.street, address.district, address.city]
            .filter((part, index, parts) => part && parts.indexOf(part) === index)
            .join(', ')
        : '';

      setPickupCoordinates(current.coords);
      if (name) {
        setPickup(name);
        setLocationMessage('Pickup set from your device location.');
      } else {
        setPickup('');
        setLocationMessage('Location name unavailable. Enter a pickup point manually before booking.');
      }
    } catch {
      setPickupCoordinates(null);
      setLocationMessage('Could not determine your location. Enter a pickup point manually or retry.');
    } finally {
      setLocationLoading(false);
    }
  };

  const submitBooking = () => {
    if (!pickup.trim()) {
      setBookingMessage('Enter or select a pickup point before requesting a ride.');
      return;
    }
    if (!destination.trim()) {
      setBookingMessage('Choose or enter your destination.');
      return;
    }
    setBookingMessage(bookingConfigured
      ? 'Demo preview only. The configured API does not dispatch rides, so no driver was contacted.'
      : 'Demo preview only. Ride dispatch is not configured, so no request was sent.');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.logoMark}>
              <MaterialCommunityIcons name="rickshaw" size={24} color="#071b1b" />
            </View>
            <View>
              <Text style={styles.brandName}>RishiRide</Text>
              <Text style={styles.brandLocation}>RISHIKESH, INDIA</Text>
            </View>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Open profile" style={styles.profileButton} onPress={() => router.push('/login')}>
            <MaterialCommunityIcons name="account-outline" size={22} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.eyebrowRow}>
          <View style={styles.liveDot} />
          <Text style={styles.eyebrow}>LOCAL RIDES, MADE SIMPLE</Text>
        </View>
        <Text style={styles.title}>Where to?</Text>
        <Text style={styles.subtitle}>A ride across the valley, on your terms.</Text>

        <RishikeshMapPreview pickup={pickup} destination={destination} />

        <View style={styles.bookingPanel}>
          <View style={styles.fieldRow}>
            <View style={styles.routeDots}>
              <View style={styles.pickupDot} />
              <View style={styles.routeLine} />
              <View style={styles.destinationDot} />
            </View>
            <View style={styles.fields}>
              <Text style={styles.label}>PICKUP</Text>
              <TextInput
                accessibilityLabel="Pickup location"
                style={styles.input}
                value={pickup}
                onChangeText={(value) => {
                  setPickup(value);
                  setPickupCoordinates(null);
                  setBookingMessage('');
                }}
                placeholder="Enter a pickup point"
                placeholderTextColor={colors.muted}
                returnKeyType="next"
              />
              <View style={styles.fieldDivider} />
              <Text style={styles.label}>DESTINATION</Text>
              <TextInput
                accessibilityLabel="Destination"
                style={styles.input}
                value={destination}
                onChangeText={(value) => {
                  setDestination(value);
                  setBookingMessage('');
                }}
                placeholder="Where are you headed?"
                placeholderTextColor={colors.muted}
                returnKeyType="done"
              />
            </View>
          </View>

          <Pressable accessibilityRole="button" style={[styles.gpsButton, locationLoading && styles.disabled]} onPress={useCurrentLocation} disabled={locationLoading}>
            <MaterialCommunityIcons name="crosshairs-gps" size={19} color={colors.mint} />
            <Text style={styles.gpsText}>{locationLoading ? 'Finding your location…' : 'Use my current location'}</Text>
          </Pressable>
          {!!locationMessage && <Text accessibilityLiveRegion="polite" style={styles.noticeText}>{locationMessage}</Text>}

          <View style={styles.passengerBar}>
            <View>
              <Text style={styles.label}>PASSENGERS</Text>
              <Text style={styles.passengerHint}>Choose the group size</Text>
            </View>
            <View style={styles.stepper}>
              <Pressable accessibilityRole="button" accessibilityLabel="Remove one passenger" style={styles.stepButton} onPress={() => setPassengerCount((count) => Math.max(1, count - 1))}>
                <MaterialCommunityIcons name="minus" size={18} color={colors.text} />
              </Pressable>
              <Text style={styles.count}>{passengerCount}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Add one passenger" style={styles.stepButton} onPress={() => setPassengerCount((count) => Math.min(6, count + 1))}>
                <MaterialCommunityIcons name="plus" size={18} color={colors.text} />
              </Pressable>
            </View>
          </View>

          <View style={styles.rideHeading}>
            <View>
              <Text style={styles.label}>RIDE TYPE</Text>
              <Text style={styles.passengerHint}>Choose a vehicle</Text>
            </View>
            <Text style={styles.demoLabel}>DEMO ESTIMATE</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rideOptions}>
            {rideOptions.map((option) => (
              <Pressable
                key={option.name}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedRide === option.name }}
                style={[styles.rideOption, selectedRide === option.name && styles.rideOptionSelected]}
                onPress={() => setSelectedRide(option.name)}
              >
                <MaterialCommunityIcons name={option.icon} size={23} color={selectedRide === option.name ? colors.green : colors.muted} />
                <Text style={[styles.rideName, selectedRide === option.name && styles.rideNameSelected]}>{option.name}</Text>
                <Text style={styles.rideFare}>₹{option.fare}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.estimateRow}>
            <View style={styles.estimateMetric}>
              <MaterialCommunityIcons name="clock-outline" size={16} color={colors.green} />
              <Text style={styles.estimateText}>{ride.eta} pickup</Text>
            </View>
            <View style={styles.estimateMetric}>
              <MaterialCommunityIcons name="map-marker-distance" size={16} color={colors.green} />
              <Text style={styles.estimateText}>~4.2 km</Text>
            </View>
            <Text style={styles.estimateFare}>₹{ride.fare}</Text>
          </View>
          <Text style={styles.estimateDisclaimer}>Illustrative estimate only. Final route and fare are not available in demo mode.</Text>

          <Pressable accessibilityRole="button" style={styles.bookButton} onPress={submitBooking}>
            <Text style={styles.bookButtonText}>Find a ride</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color={colors.ink} />
          </Pressable>
          {!!bookingMessage && <Text accessibilityRole="alert" style={styles.bookingError}>{bookingMessage}</Text>}
        </View>

        <View style={styles.serviceNote}>
          <MaterialCommunityIcons name="information-outline" size={19} color={colors.amber} />
          <Text style={styles.serviceNoteText}>
            {bookingConfigured
              ? 'Route estimates and ride dispatch are not available from the configured service yet.'
              : 'Secure booking, route estimates, and driver matching are not configured. No ride request will be sent.'}
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionKicker}>A FEW PLACES TO START</Text>
            <Text style={styles.sectionTitle}>Around Rishikesh</Text>
          </View>
          <MaterialCommunityIcons name="map-outline" size={22} color={colors.mint} />
        </View>
        <View style={styles.destinationGrid}>
          {destinations.map((place, index) => (
            <Pressable key={place} accessibilityRole="button" style={styles.destination} onPress={() => setDestination(place)}>
              <View style={styles.destinationIndex}><Text style={styles.destinationNumber}>{String(index + 1).padStart(2, '0')}</Text></View>
              <Text style={styles.destinationName}>{place}</Text>
              <MaterialCommunityIcons name="arrow-top-left" size={17} color={colors.muted} />
            </Pressable>
          ))}
        </View>

        <View style={styles.footerNav}>
          <Pressable accessibilityRole="button" style={styles.navItem} onPress={() => router.push('/login')}>
            <MaterialCommunityIcons name="history" size={20} color={colors.muted} />
            <Text style={styles.navText}>Rides</Text>
          </Pressable>
          <Pressable accessibilityRole="button" style={styles.navItem} onPress={() => Alert.alert('Driver directory unavailable', 'Driver availability and distance must come from a configured secure service.') }>
            <MaterialCommunityIcons name="account-search-outline" size={20} color={colors.muted} />
            <Text style={styles.navText}>Drivers</Text>
          </Pressable>
          <Pressable accessibilityRole="button" style={styles.navItem} onPress={() => router.push('/landing')}>
            <MaterialCommunityIcons name="rickshaw" size={20} color={colors.mint} />
            <Text style={[styles.navText, styles.navTextActive]}>Book</Text>
          </Pressable>
        </View>
        <Text style={styles.footerBrand}>RISHIRIDE  ·  RISHIKESH</Text>
        {pickupCoordinates && <Text style={styles.locationPrivacy}>Your device provided a pickup location; coordinates are not displayed.</Text>}
      </ScrollView>
    </View>
  );
}

const colors = {
  ink: '#FFFFFF',
  background: '#F4F7F3',
  panel: '#FFFFFF',
  panelRaised: '#EEF3EE',
  line: '#DCE5DE',
  text: '#183A32',
  muted: '#718078',
  mint: '#087F68',
  green: '#087F68',
  amber: '#9A6D16',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 20, paddingBottom: 34 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 17 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoMark: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#D3F279', alignItems: 'center', justifyContent: 'center' },
  brandName: { color: colors.text, fontSize: 17, fontWeight: '900' },
  brandLocation: { color: colors.muted, fontSize: 9, fontWeight: '800', marginTop: 2 },
  profileButton: { width: 42, height: 42, borderWidth: 1, borderColor: colors.line, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.mint },
  eyebrow: { color: colors.mint, fontSize: 10, fontWeight: '900', letterSpacing: 1.1 },
  title: { color: colors.text, fontSize: 34, fontWeight: '900', marginTop: 10 },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 4, marginBottom: 23 },
  bookingPanel: { backgroundColor: colors.panel, borderRadius: 14, borderWidth: 1, borderColor: colors.line, padding: 17, marginTop: 13, elevation: 2 },
  fieldRow: { flexDirection: 'row', gap: 13 },
  routeDots: { width: 14, alignItems: 'center', paddingTop: 27, paddingBottom: 21 },
  pickupDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.mint },
  routeLine: { width: 1, flex: 1, minHeight: 35, backgroundColor: '#516566', marginVertical: 6 },
  destinationDot: { width: 10, height: 10, backgroundColor: colors.amber },
  fields: { flex: 1 },
  label: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  input: { color: colors.text, fontSize: 15, fontWeight: '700', paddingVertical: 9, minHeight: 42 },
  fieldDivider: { height: 1, backgroundColor: colors.line, marginVertical: 9 },
  gpsButton: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 9, borderTopWidth: 1, borderTopColor: colors.line, marginTop: 8, paddingTop: 12 },
  disabled: { opacity: 0.55 },
  gpsText: { color: colors.mint, fontSize: 13, fontWeight: '800' },
  noticeText: { color: colors.amber, fontSize: 12, lineHeight: 17, marginTop: 7 },
  passengerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.line, marginTop: 13, paddingTop: 14 },
  passengerHint: { color: colors.text, fontSize: 13, fontWeight: '700', marginTop: 4 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.panelRaised, alignItems: 'center', justifyContent: 'center' },
  count: { color: colors.text, fontSize: 16, fontWeight: '900', minWidth: 17, textAlign: 'center' },
  rideHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  demoLabel: { color: colors.mint, fontSize: 9, fontWeight: '900', letterSpacing: 0.7 },
  rideOptions: { gap: 8, paddingVertical: 11 },
  rideOption: { width: 82, minHeight: 82, alignItems: 'center', justifyContent: 'center', gap: 3, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 10 },
  rideOptionSelected: { backgroundColor: '#E6F3EC', borderColor: colors.mint },
  rideName: { color: colors.muted, fontSize: 11, fontWeight: '800' },
  rideNameSelected: { color: colors.text },
  rideFare: { color: colors.text, fontSize: 10, fontWeight: '700' },
  estimateRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.line },
  estimateMetric: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  estimateText: { color: colors.muted, fontSize: 10, fontWeight: '700' },
  estimateFare: { color: colors.text, fontSize: 15, fontWeight: '900', marginLeft: 'auto' },
  estimateDisclaimer: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 5 },
  bookButton: { height: 52, backgroundColor: colors.mint, borderRadius: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 14 },
  bookButtonText: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  bookingError: { color: colors.amber, fontSize: 12, lineHeight: 17, marginTop: 10 },
  serviceNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderBottomWidth: 1, borderBottomColor: colors.line, paddingVertical: 15 },
  serviceNoteText: { color: colors.muted, fontSize: 12, lineHeight: 17, flex: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 22, marginBottom: 12 },
  sectionKicker: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  sectionTitle: { color: colors.text, fontSize: 21, fontWeight: '900', marginTop: 5 },
  destinationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  destination: { width: '48%', minHeight: 58, flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: colors.panel, borderBottomWidth: 1, borderBottomColor: colors.line, paddingHorizontal: 10 },
  destinationIndex: { width: 27, height: 27, borderRadius: 8, backgroundColor: colors.panelRaised, alignItems: 'center', justifyContent: 'center' },
  destinationNumber: { color: colors.mint, fontSize: 9, fontWeight: '900' },
  destinationName: { color: colors.text, fontSize: 12, fontWeight: '700', flex: 1 },
  footerNav: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: colors.line, marginTop: 25, paddingTop: 14 },
  navItem: { minWidth: 74, alignItems: 'center', gap: 5, padding: 5 },
  navText: { color: colors.muted, fontSize: 10, fontWeight: '800' },
  navTextActive: { color: colors.mint },
  footerBrand: { color: '#6d8382', fontSize: 9, fontWeight: '900', letterSpacing: 1.4, textAlign: 'center', marginTop: 17 },
  locationPrivacy: { color: colors.muted, fontSize: 10, textAlign: 'center', marginTop: 8 },
});