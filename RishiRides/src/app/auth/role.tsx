import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthScenicFooter from '../../components/auth-scenic-footer';

const passengerImage = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/Laxman_Jhula%2C_Rishikesh%2C_Uttarkhand%2C_India.jpg/960px-Laxman_Jhula%2C_Rishikesh%2C_Uttarkhand%2C_India.jpg';
const driverImage = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Ganga_Arti_At_Triveni_Ghat_In_Rishikesh.jpg/960px-Ganga_Arti_At_Triveni_Ghat_In_Rishikesh.jpg';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const wide = width >= 700;

  const openRole = (role: 'passenger' | 'driver') => {
    router.push({ pathname: '/login', params: { role } });
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: Math.max(insets.top, 16), paddingBottom: Math.max(insets.bottom, 24) }]} showsVerticalScrollIndicator={false}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back to RishiRide home" style={styles.brand} onPress={() => router.replace('/landing')}>
          <View style={styles.brandMark}><MaterialCommunityIcons name="navigation-variant" size={20} color="#FFFFFF" /></View>
          <View><Text style={styles.brandName}>RishiRide</Text><Text style={styles.brandCity}>RISHIKESH</Text></View>
        </Pressable>

        <View style={styles.intro}>
          <Text style={styles.eyebrow}>LOCAL JOURNEYS, MADE SIMPLE</Text>
          <Text style={styles.title}>Choose how you want to continue</Text>
          <Text style={styles.subtitle}>Select an option to get started with RishiRide.</Text>
        </View>

        <View style={[styles.cards, wide && styles.cardsWide]}>
          <RoleCard
            title="Passenger"
            description="Book autos, cabs and bikes. Get where you need to go."
            image={passengerImage}
            icon="account-outline"
            button="Continue as Passenger"
            onPress={() => openRole('passenger')}
          />
          <RoleCard
            title="Driver Partner"
            description="Drive with RishiRide and earn on your own time."
            image={driverImage}
            icon="steering"
            button="Continue as Driver"
            onPress={() => openRole('driver')}
          />
        </View>

        <View style={styles.safety}>
          <View style={styles.safetyIcon}><MaterialCommunityIcons name="shield-check-outline" size={20} color="#087F68" /></View>
          <View style={styles.safetyCopy}><Text style={styles.safetyTitle}>Your safety is our priority</Text><Text style={styles.safetyText}>Phone verification and secure trips</Text></View>
        </View>

        <AuthScenicFooter />
        <View style={styles.features}>
          <Feature icon="shield-check" title="Secure & verified" text="Phone verification" />
          <Feature icon="account-group" title="For everyone" text="Separate rider and driver access" />
          <Feature icon="headset" title="Help & support" text="Support options" />
        </View>
      </ScrollView>
    </View>
  );
}

function RoleCard({ title, description, image, icon, button, onPress }: {
  title: string;
  description: string;
  image: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  button: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.roleCard}>
      <Image source={image} style={styles.roleImage} contentFit="cover" accessibilityLabel={`${title} in Rishikesh`} />
      <View style={styles.cardContent}>
        <View style={styles.cardTitleRow}><MaterialCommunityIcons name={icon} size={19} color="#087F68" /><Text style={styles.cardTitle}>{title}</Text></View>
        <Text style={styles.cardDescription}>{description}</Text>
        <Pressable accessibilityRole="button" style={styles.cardButton} onPress={onPress}>
          <Text style={styles.cardButtonText}>{button}</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

function Feature({ icon, title, text }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; title: string; text: string }) {
  return (
    <View style={styles.feature}>
      <MaterialCommunityIcons name={icon} size={20} color="#087F68" />
      <View style={styles.featureCopy}><Text style={styles.featureTitle}>{title}</Text><Text style={styles.featureText}>{text}</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F7F3' },
  scroll: { width: '100%', maxWidth: 860, alignSelf: 'center', paddingHorizontal: 20 },
  brand: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandMark: { width: 36, height: 36, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: '#087F68' },
  brandName: { color: '#183A32', fontSize: 15, fontWeight: '900' },
  brandCity: { color: '#718078', fontSize: 8, fontWeight: '800', letterSpacing: 0.7, marginTop: 2 },
  intro: { maxWidth: 480, alignSelf: 'center', alignItems: 'center', paddingVertical: 28 },
  eyebrow: { color: '#087F68', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  title: { color: '#183A32', fontSize: 28, lineHeight: 34, fontWeight: '900', textAlign: 'center', marginTop: 9 },
  subtitle: { color: '#718078', fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 7 },
  cards: { gap: 13 },
  cardsWide: { flexDirection: 'row' },
  roleCard: { flex: 1, minHeight: 176, flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: '#DCE5DE', borderRadius: 12, backgroundColor: '#FFFFFF', elevation: 2 },
  roleImage: { width: '35%', minWidth: 98, height: '100%', backgroundColor: '#DDEBE3' },
  cardContent: { flex: 1, justifyContent: 'center', padding: 13 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  cardTitle: { color: '#183A32', fontSize: 15, fontWeight: '900' },
  cardDescription: { color: '#718078', fontSize: 11, lineHeight: 16, marginTop: 6 },
  cardButton: { minHeight: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingHorizontal: 11, marginTop: 11, borderRadius: 7, backgroundColor: '#087F68' },
  cardButtonText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900', flexShrink: 1 },
  safety: { minHeight: 65, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 11, marginTop: 15, borderRadius: 10, backgroundColor: '#EAF2EA' },
  safetyIcon: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#FFFFFF' },
  safetyCopy: { flex: 1 },
  safetyTitle: { color: '#183A32', fontSize: 11, fontWeight: '900' },
  safetyText: { color: '#718078', fontSize: 10, marginTop: 3 },
  features: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 13 },
  feature: { minHeight: 62, flex: 1, minWidth: 145, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 9, borderRadius: 8, backgroundColor: '#EAF2EA' },
  featureCopy: { flex: 1 },
  featureTitle: { color: '#183A32', fontSize: 10, fontWeight: '900' },
  featureText: { color: '#718078', fontSize: 9, lineHeight: 13, marginTop: 3 },
});