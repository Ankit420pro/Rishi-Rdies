import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RishiColors } from '../constants/theme';

export default function LegalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { document, language } = useLocalSearchParams<{ document?: string; language?: string }>();
  const hindi = language === 'hi';
  const privacy = document === 'privacy';

  const title = privacy
    ? (hindi ? 'गोपनीयता नीति' : 'Privacy policy')
    : (hindi ? 'सेवा की शर्तें' : 'Terms of service');
  const paragraphs = privacy
    ? hindi
      ? [
          'RishiRides खाते के लिए आपका नाम, मोबाइल नंबर, चुनी हुई भाषा और सहमति का समय उपयोग करता है। OTP सत्यापन के लिए मोबाइल नंबर SMS सेवा प्रदाता को भेजा जाता है।',
          'सामान्य यात्री खाते के लिए ड्राइविंग लाइसेंस या आधार आवश्यक नहीं है। इस बिल्ड में प्रोफ़ाइल फोटो, आपातकालीन संपर्क, भुगतान, राइड बुकिंग या ड्राइवर दस्तावेज़ अपलोड सक्रिय नहीं हैं। संवेदनशील ड्राइवर दस्तावेज़ या बैंक विवरण अभी दर्ज न करें।',
          'यह लॉन्च-पूर्व मसौदा है। लाइव सेवा से पहले डेटा सुरक्षा, भंडारण अवधि, हटाने के अनुरोध, प्रदाता और उत्तराखंड के लागू नियमों की कानूनी समीक्षा आवश्यक है।',
        ]
      : [
          'RishiRides currently uses your name, mobile number, language choice and consent timestamps for account creation. Your mobile number is sent to the SMS provider for OTP verification.',
          'A driving licence or Aadhaar is not required for an ordinary passenger account. Profile photo, emergency contact, payments, ride booking and driver document uploads are not active in this build. Do not enter sensitive driver documents or bank details here.',
          'This is a pre-launch draft. Data security, retention, deletion requests, providers and applicable Uttarakhand rules require legal review before a live service.',
        ]
    : hindi
      ? [
          'RishiRides इस समय खाते और फोन सत्यापन का पूर्वावलोकन है। राइड अनुरोध, किराया, भुगतान या ड्राइवर उपलब्धता इस बिल्ड में सक्रिय नहीं हैं। कोई राइड भेजी या स्वीकार नहीं की जाती।',
          'खाता बनाने के लिए सही नाम और अपना मोबाइल नंबर दें, SMS कोड से नंबर सत्यापित करें, भाषा चुनें और सेवा शर्तों तथा गोपनीयता नीति को स्वीकार करें।',
          'ड्राइवर आवेदन पूरा करने और ऑनलाइन जाने से पहले लागू दस्तावेज़ों तथा व्यवस्थापक समीक्षा की आवश्यकता होगी। उत्तराखंड लॉन्च से पहले राज्य और वाहन श्रेणी के नियम सत्यापित किए जाने चाहिए।',
          'यह लॉन्च-पूर्व मसौदा है, अंतिम कानूनी शर्त नहीं। लाइव उपयोग से पहले लागू क्षेत्र के लिए इसकी कानूनी समीक्षा आवश्यक है।',
        ]
      : [
          'RishiRides currently provides account creation and phone-verification preview only. Ride requests, fares, payments and driver availability are not active in this build. No ride is sent or accepted.',
          'To create an account, provide your correct name and mobile number, verify the number by SMS, choose a language, and accept these terms and the privacy policy.',
          'Drivers must complete applicable checks and administrator review before going online. Requirements must be verified for the launch state and vehicle category.',
          'This is a pre-launch draft, not final legal terms. Legal review for the launch jurisdiction is required before live use.',
        ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable accessibilityRole="button" accessibilityLabel={hindi ? 'वापस' : 'Back'} style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={21} color={RishiColors.text} />
        </Pressable>
        <Text style={styles.kicker}>{hindi ? 'लॉन्च-पूर्व मसौदा' : 'PRE-LAUNCH DRAFT'}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.version}>Draft 1 · 17 October 2026</Text>
        {paragraphs.map((paragraph) => <Text key={paragraph} style={styles.paragraph}>{paragraph}</Text>)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: RishiColors.background },
  content: { width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: 22, paddingTop: 18, paddingBottom: 40 },
  backButton: { width: 42, height: 42, borderWidth: 1, borderColor: RishiColors.line, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 26 },
  kicker: { color: RishiColors.warning, fontSize: 10, fontWeight: '900' },
  title: { color: RishiColors.text, fontSize: 28, fontWeight: '900', marginTop: 8 },
  version: { color: RishiColors.muted, fontSize: 11, marginTop: 7, marginBottom: 22 },
  paragraph: { color: RishiColors.text, fontSize: 14, lineHeight: 22, marginBottom: 17 },
});