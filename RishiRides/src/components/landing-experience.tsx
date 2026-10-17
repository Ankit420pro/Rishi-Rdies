import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const destinations = [
  {
    name: 'Triveni Ghat',
    category: 'RIVERFRONT',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Ganga_Arti_At_Triveni_Ghat_In_Rishikesh.jpg/960px-Ganga_Arti_At_Triveni_Ghat_In_Rishikesh.jpg',
  },
  {
    name: 'Laxman Jhula',
    category: 'LANDMARK',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/Laxman_Jhula%2C_Rishikesh%2C_Uttarkhand%2C_India.jpg/960px-Laxman_Jhula%2C_Rishikesh%2C_Uttarkhand%2C_India.jpg',
  },
  {
    name: 'Beatles Ashram',
    category: 'HERITAGE',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/I_am_the_Eggman%2C_Beatles_Ashram%2C_Rishikesh%2C_India.jpg/960px-I_am_the_Eggman%2C_Beatles_Ashram%2C_Rishikesh%2C_India.jpg',
  },
];

export default function LandingExperience() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const wide = width >= 760;

  const openSignup = (role: 'passenger' | 'driver', destination?: string) => {
    router.push({ pathname: '/signup', params: { role, ...(destination ? { destination } : {}) } });
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: Math.max(insets.top, 10) }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, wide && styles.headerWide]}>
          <Pressable accessibilityRole="button" accessibilityLabel="RishiRide home" style={styles.brand} onPress={() => router.replace('/landing')}>
            <View style={styles.brandMark}><MaterialCommunityIcons name="navigation-variant" size={20} color={colors.white} /></View>
            <Text style={styles.brandName}>Rishi<Text style={styles.brandAccent}>Ride</Text></Text>
            <Text style={styles.brandCity}>RISHIKESH</Text>
          </Pressable>
          <View style={styles.headerActions}>
            <Pressable accessibilityRole="button" onPress={() => router.push('/login')} style={styles.loginButton}>
              <Text style={styles.loginLabel}>Sign in</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => openSignup('passenger')} style={styles.joinButton}>
              <Text style={styles.joinLabel}>Join</Text>
              <MaterialCommunityIcons name="arrow-up-right" size={16} color={colors.white} />
            </Pressable>
          </View>
        </View>

        <View style={[styles.hero, wide && styles.heroWide]}>
          <View style={[styles.heroCopy, wide && styles.heroCopyWide]}>
            <View style={styles.eyebrow}><View style={styles.eyebrowRule} /><Text style={styles.eyebrowText}>RISHIKESH · UTTARAKHAND</Text></View>
            <Text style={styles.title}>RishiRide</Text>
            <Text style={styles.titleAccent}>Find your way through the valley.</Text>
            <Text style={styles.description}>Local journeys, starting with a clear pickup and a place to go.</Text>
            <Pressable accessibilityRole="button" style={styles.primaryAction} onPress={() => openSignup('passenger')}>
              <Text style={styles.primaryActionText}>Plan a ride</Text>
              <MaterialCommunityIcons name="arrow-right" size={19} color={colors.white} />
            </Pressable>
            <View style={styles.trustLine}>
              <MaterialCommunityIcons name="shield-check-outline" size={16} color={colors.green} />
              <Text style={styles.trustText}>Phone verification before account access</Text>
            </View>
          </View>
          <View style={[styles.heroPhoto, wide && styles.heroPhotoWide]}>
            <Image
              source={destinations[0].image}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              contentPosition="center"
              transition={220}
              accessibilityLabel="Evening lamps at Triveni Ghat in Rishikesh"
            />
            <View style={styles.photoShade} />
            <View style={styles.coordinateStamp}><Text style={styles.coordinateDegree}>30°</Text><Text style={styles.coordinateCity}>RISHIKESH</Text></View>
            <View style={styles.photoCaption}><Text style={styles.photoKicker}>START CLOSE</Text><Text style={styles.photoTitle}>A city of many crossings.</Text></View>
            <View style={styles.photoCredit}><Text style={styles.photoCreditText}>TRIVENI GHAT · WIKIMEDIA COMMONS</Text></View>
          </View>
        </View>

        <View style={styles.destinationSection}>
          <View style={styles.sectionHeading}>
            <View><Text style={styles.sectionEyebrow}>THE RIVER · THE GHATS · THE HILLS</Text><Text style={styles.sectionTitle}>Places worth a stop.</Text></View>
            <MaterialCommunityIcons name="map-outline" size={22} color={colors.green} />
          </View>
          <ScrollView horizontal={!wide} showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.destinationRail, wide && styles.destinationGrid]}>
            {destinations.map((place, index) => (
              <Pressable
                key={place.name}
                accessibilityRole="button"
                accessibilityLabel={`Choose ${place.name} as your destination`}
                style={[styles.destinationCard, wide && styles.destinationCardWide]}
                onPress={() => openSignup('passenger', place.name)}
              >
                <View style={styles.destinationPhotoWrap}>
                  <Image source={place.image} style={styles.destinationPhoto} contentFit="cover" transition={180} accessibilityLabel={`${place.name}, Rishikesh`} />
                  <Text style={styles.destinationIndex}>{`0${index + 1}`}</Text>
                </View>
                <View style={styles.destinationCopy}>
                  <Text style={styles.destinationCategory}>{place.category}</Text>
                  <Text style={styles.destinationName}>{place.name}</Text>
                  <MaterialCommunityIcons name="arrow-top-right" size={17} color={colors.green} style={styles.destinationArrow} />
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.driverInvite, wide && styles.driverInviteWide]}>
          <View style={styles.driverIcon}><MaterialCommunityIcons name="steering" size={21} color={colors.green} /></View>
          <View style={styles.driverCopy}><Text style={styles.driverEyebrow}>DRIVE WITH RISHIRIDE</Text><Text style={styles.driverTitle}>Local drivers start here.</Text><Text style={styles.driverDescription}>Phone signup first. Required checks and secure document review come before activation.</Text></View>
          <Pressable accessibilityRole="button" style={styles.driverAction} onPress={() => openSignup('driver')}>
            <Text style={styles.driverActionText}>Driver signup</Text>
            <MaterialCommunityIcons name="arrow-right" size={17} color={colors.green} />
          </Pressable>
        </View>

        <Text style={styles.footer}>RISHIRIDE · RISHIKESH</Text>
      </ScrollView>
    </View>
  );
}

const colors = {
  ink: '#17352E',
  muted: '#667970',
  line: '#DBE5DE',
  paper: '#F5F8F4',
  white: '#FFFFFF',
  green: '#087760',
  deep: '#123E34',
  mint: '#C8EE78',
  coral: '#E97D62',
  pale: '#E7F1E8',
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  scroll: { paddingBottom: 28 },
  header: { minHeight: 64, width: '92%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: colors.line },
  headerWide: { width: '88%', maxWidth: 1240 },
  brand: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandMark: { width: 36, height: 36, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.green },
  brandName: { color: colors.ink, fontSize: 16, fontWeight: '900' },
  brandAccent: { color: colors.green },
  brandCity: { color: colors.muted, fontSize: 8, fontWeight: '800', marginLeft: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  loginButton: { minHeight: 38, justifyContent: 'center', paddingHorizontal: 10 },
  loginLabel: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  joinButton: { minHeight: 38, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 12, borderRadius: 6, backgroundColor: colors.green },
  joinLabel: { color: colors.white, fontSize: 11, fontWeight: '800' },
  hero: { width: '92%', alignSelf: 'center', paddingTop: 24, paddingBottom: 26 },
  heroWide: { width: '88%', maxWidth: 1240, minHeight: 490, flexDirection: 'row', alignItems: 'stretch', paddingTop: 34, paddingBottom: 34 },
  heroCopy: { paddingHorizontal: 2, paddingBottom: 21 },
  heroCopyWide: { width: '43%', justifyContent: 'center', paddingRight: 42, paddingBottom: 0 },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyebrowRule: { width: 20, height: 1, backgroundColor: colors.coral },
  eyebrowText: { color: colors.green, fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
  title: { color: colors.ink, fontSize: 37, lineHeight: 42, fontWeight: '900', marginTop: 17 },
  titleAccent: { maxWidth: 420, color: colors.green, fontSize: 33, lineHeight: 38, fontFamily: 'serif', marginTop: 1 },
  description: { maxWidth: 380, color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 12 },
  primaryAction: { width: 176, minHeight: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, marginTop: 18, borderRadius: 6, backgroundColor: colors.green },
  primaryActionText: { color: colors.white, fontSize: 12, fontWeight: '800' },
  trustLine: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 13 },
  trustText: { color: colors.muted, fontSize: 10, fontWeight: '700' },
  heroPhoto: { height: 295, overflow: 'hidden', backgroundColor: '#294e48' },
  heroPhotoWide: { flex: 1, height: undefined, minHeight: 420, borderRadius: 7 },
  photoShade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(9, 35, 30, 0.14)' },
  coordinateStamp: { position: 'absolute', top: 14, right: 14, flexDirection: 'row', alignItems: 'baseline', gap: 6, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: colors.mint },
  coordinateDegree: { color: colors.ink, fontSize: 17, fontWeight: '700' },
  coordinateCity: { color: colors.ink, fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  photoCaption: { position: 'absolute', left: 16, bottom: 38 },
  photoKicker: { color: colors.mint, fontSize: 8, fontWeight: '900', letterSpacing: 1.3 },
  photoTitle: { maxWidth: 250, color: colors.white, fontSize: 20, fontWeight: '800', marginTop: 5 },
  photoCredit: { position: 'absolute', left: 0, right: 0, bottom: 0, minHeight: 25, justifyContent: 'center', paddingHorizontal: 11, backgroundColor: 'rgba(18, 62, 52, .74)' },
  photoCreditText: { color: colors.white, fontSize: 7, fontWeight: '800', letterSpacing: 0.8 },
  destinationSection: { paddingTop: 18, paddingBottom: 24, backgroundColor: colors.white, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line },
  sectionHeading: { width: '92%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 },
  sectionEyebrow: { color: colors.green, fontSize: 8, fontWeight: '900', letterSpacing: 0.9 },
  sectionTitle: { color: colors.ink, fontSize: 19, fontWeight: '900', marginTop: 4 },
  destinationRail: { gap: 10, paddingHorizontal: '4%' },
  destinationGrid: { width: '88%', maxWidth: 1240, alignSelf: 'center', flexDirection: 'row', paddingHorizontal: 0 },
  destinationCard: { width: 230, minHeight: 160, overflow: 'hidden', borderRadius: 6, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  destinationCardWide: { flex: 1, width: undefined },
  destinationPhotoWrap: { height: 102, backgroundColor: colors.pale },
  destinationPhoto: { width: '100%', height: '100%' },
  destinationIndex: { position: 'absolute', top: 8, left: 8, width: 24, height: 24, textAlign: 'center', textAlignVertical: 'center', overflow: 'hidden', borderRadius: 12, backgroundColor: colors.mint, color: colors.ink, fontSize: 9, fontWeight: '900', paddingTop: 6 },
  destinationCopy: { minHeight: 56, justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 7 },
  destinationCategory: { color: colors.green, fontSize: 7, fontWeight: '900', letterSpacing: 0.9 },
  destinationName: { color: colors.ink, fontSize: 12, fontWeight: '800', marginTop: 3 },
  destinationArrow: { position: 'absolute', right: 9, bottom: 17 },
  driverInvite: { width: '92%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 18, borderBottomWidth: 1, borderColor: colors.line },
  driverInviteWide: { width: '88%', maxWidth: 1240, minHeight: 104 },
  driverIcon: { width: 38, height: 38, flex: 0, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: colors.pale },
  driverCopy: { flex: 1 },
  driverEyebrow: { color: colors.green, fontSize: 7, fontWeight: '900', letterSpacing: 0.9 },
  driverTitle: { color: colors.ink, fontSize: 13, fontWeight: '900', marginTop: 3 },
  driverDescription: { maxWidth: 520, color: colors.muted, fontSize: 9, lineHeight: 14, marginTop: 4 },
  driverAction: { minHeight: 36, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, borderWidth: 1, borderColor: colors.line, borderRadius: 5 },
  driverActionText: { color: colors.green, fontSize: 9, fontWeight: '800' },
  footer: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 1.1, textAlign: 'center', paddingTop: 17 },
});
