import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAuthenticatedSession } from '../api/session';
import { RishiColors } from '../constants/theme';

const stages = [
  {
    title: 'Personal details',
    subtitle: 'Account and identity',
    icon: 'account-check-outline' as const,
    requirements: ['Full legal name, verified mobile and profile photo', 'Date of birth only where eligibility rules require it', 'Current address and service city', 'Accepted identity-proof details for the launch location', 'Emergency contact recommended'],
  },
  {
    title: 'Driving documents',
    subtitle: 'Documents and checks',
    icon: 'card-account-details-outline' as const,
    requirements: ['Driving licence number, class, validity and document upload', 'Applicable public-service badge or authorization', 'Identity, background or police verification as required', 'Medical fitness checks where required'],
  },
  {
    title: 'Vehicle details',
    subtitle: 'Vehicle-specific documents',
    icon: 'car-outline' as const,
    requirements: ['Vehicle category, registration, make, model, colour and year', 'RC and valid insurance', 'Applicable permit, fitness certificate, PUC and commercial authorization', 'Vehicle photo and owner authorization when needed'],
  },
  {
    title: 'Payout & activation',
    subtitle: 'Review before going online',
    icon: 'bank-outline' as const,
    requirements: ['Bank account and payout verification through a secure provider', 'Service area and working preferences', 'Driver agreement acceptance and document expiry dates', 'Administrator review and approval before any ride acceptance'],
  },
];

export default function DriverOnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language } = useLocalSearchParams<{ language?: string }>();
  const hindi = language === 'hi';
  const [authorized, setAuthorized] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const stage = stages[stageIndex];
  const translatedStages = hindi
    ? [
        { title: 'व्यक्तिगत जानकारी', subtitle: 'खाता और पहचान' },
        { title: 'ड्राइविंग दस्तावेज़', subtitle: 'दस्तावेज़ और जाँच' },
        { title: 'वाहन विवरण', subtitle: 'वाहन के दस्तावेज़' },
        { title: 'भुगतान और सक्रियण', subtitle: 'ऑनलाइन होने से पहले समीक्षा' },
      ]
    : stages.map(({ title, subtitle }) => ({ title, subtitle }));
  const translatedRequirements = hindi
    ? [
        ['पूरा कानूनी नाम, सत्यापित मोबाइल और प्रोफ़ाइल फ़ोटो', 'पात्रता नियम माँगें तभी जन्मतिथि', 'वर्तमान पता और सेवा शहर', 'लॉन्च स्थान के लिए स्वीकृत पहचान विवरण', 'आपातकालीन संपर्क की सलाह'],
        ['ड्राइविंग लाइसेंस नंबर, श्रेणी, वैधता और दस्तावेज़ अपलोड', 'लागू सार्वजनिक सेवा बैज या अनुमति', 'आवश्यकतानुसार पहचान, पुलिस या पृष्ठभूमि जाँच', 'आवश्यकतानुसार स्वास्थ्य जाँच'],
        ['वाहन श्रेणी, पंजीकरण, निर्माता, मॉडल, रंग और वर्ष', 'RC और वैध बीमा', 'लागू परमिट, फिटनेस, PUC और वाणिज्यिक अनुमति', 'ज़रूरत पर वाहन फ़ोटो और मालिक की अनुमति'],
        ['सुरक्षित प्रदाता के ज़रिए बैंक और भुगतान सत्यापन', 'सेवा क्षेत्र और काम की प्राथमिकताएँ', 'ड्राइवर समझौता और दस्तावेज़ की समाप्ति तिथियाँ', 'राइड स्वीकारने से पहले व्यवस्थापक की मंज़ूरी'],
      ][stageIndex]
    : stage.requirements;

  useEffect(() => {
    let active = true;
    void getAuthenticatedSession().then((session) => {
      if (!active) return;
      if (session?.role !== 'driver') {
        router.replace('/login');
        return;
      }
      setAuthorized(true);
    }).catch(() => {
      if (active) router.replace('/login');
    });
    return () => { active = false; };
  }, [router]);

  if (!authorized) {
    return (
      <View style={[styles.container, styles.loading, { paddingTop: insets.top }]}>
        <ActivityIndicator color={RishiColors.mint} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back to driver dashboard" style={styles.backButton} onPress={() => router.replace('/dashboards/Drivers/driver-dashboard')}>
          <MaterialCommunityIcons name="arrow-left" size={21} color={RishiColors.text} />
        </Pressable>

        <Text style={styles.kicker}>{hindi ? 'ड्राइवर पंजीकरण' : 'DRIVER REGISTRATION'}</Text>
        <Text style={styles.title}>{hindi ? 'चार चरणों में आवेदन' : 'Your application, in four steps'}</Text>
        <Text style={styles.subtitle}>{hindi ? 'निजी भंडारण और समीक्षा चालू होने तक दस्तावेज़ या भुगतान विवरण यहाँ न दें।' : 'Documents and payout details stay out of this app until private storage and review are configured.'}</Text>

        <View style={styles.statusRow}>
          <MaterialCommunityIcons name="circle-slice-4" size={18} color={RishiColors.warning} />
          <Text style={styles.statusText}>{hindi ? 'अधूरा · मोबाइल सत्यापित' : 'Incomplete · phone verified'}</Text>
        </View>

        <View style={styles.stepRail}>
          {stages.map((item, index) => (
            <Pressable
              key={item.title}
              accessibilityRole="button"
              accessibilityState={{ selected: stageIndex === index }}
              style={[styles.stepItem, stageIndex === index && styles.stepItemActive]}
              onPress={() => setStageIndex(index)}
            >
              <Text style={[styles.stepNumber, stageIndex === index && styles.stepNumberActive]}>{`0${index + 1}`}</Text>
              <Text style={[styles.stepLabel, stageIndex === index && styles.stepLabelActive]}>{translatedStages[index].title}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.stageHeader}>
          <View style={styles.stageIcon}>
            <MaterialCommunityIcons name={stage.icon} size={23} color={RishiColors.mint} />
          </View>
          <View style={styles.stageCopy}>
            <Text style={styles.stageTitle}>{translatedStages[stageIndex].title}</Text>
            <Text style={styles.stageSubtitle}>{translatedStages[stageIndex].subtitle}</Text>
          </View>
          <Text style={styles.stageCount}>{stageIndex + 1}/4</Text>
        </View>

        <View style={styles.requirements}>
          {translatedRequirements.map((item) => (
            <View key={item} style={styles.requirementRow}>
              <MaterialCommunityIcons name="checkbox-blank-circle-outline" size={17} color={RishiColors.muted} />
              <Text style={styles.requirementText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.notice}>
          <MaterialCommunityIcons name="lock-alert-outline" size={21} color={RishiColors.warning} />
          <Text style={styles.noticeText}>{hindi ? 'इस संस्करण में निजी दस्तावेज़ अपलोड, एन्क्रिप्टेड आवेदन भंडारण और व्यवस्थापक समीक्षा चालू नहीं हैं। आवेदन जमा नहीं हुआ है; कोई दस्तावेज़ या बैंक विवरण यहाँ न दें।' : 'Private document upload, encrypted application storage and administrator review are not configured for this deployment. No application has been submitted, and no document or bank detail should be entered here.'}</Text>
        </View>

        <View style={styles.actions}>
          <Pressable accessibilityRole="button" style={[styles.secondaryButton, stageIndex === 0 && styles.buttonDisabled]} disabled={stageIndex === 0} onPress={() => setStageIndex((index) => index - 1)}>
            <Text style={styles.secondaryButtonText}>{hindi ? 'वापस' : 'Back'}</Text>
          </Pressable>
          {stageIndex < stages.length - 1 ? (
            <Pressable accessibilityRole="button" style={styles.primaryButton} onPress={() => setStageIndex((index) => index + 1)}>
              <Text style={styles.primaryButtonText}>{hindi ? 'आगे बढ़ें' : 'Continue'}</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color={RishiColors.background} />
            </Pressable>
          ) : (
            <View style={[styles.primaryButton, styles.buttonDisabled]}>
              <Text style={styles.primaryButtonText}>{hindi ? 'आवेदन उपलब्ध नहीं' : 'Application unavailable'}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: RishiColors.background },
  loading: { alignItems: 'center', justifyContent: 'center' },
  content: { width: '100%', maxWidth: 620, alignSelf: 'center', paddingHorizontal: 22, paddingTop: 18, paddingBottom: 36 },
  backButton: { width: 42, height: 42, borderWidth: 1, borderColor: RishiColors.line, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  kicker: { color: RishiColors.mint, fontSize: 10, fontWeight: '900' },
  title: { color: RishiColors.text, fontSize: 27, lineHeight: 33, fontWeight: '900', marginTop: 8 },
  subtitle: { color: RishiColors.muted, fontSize: 13, lineHeight: 19, marginTop: 7 },
  statusRow: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 9, borderBottomWidth: 1, borderColor: RishiColors.line, marginTop: 16 },
  statusText: { color: RishiColors.warning, fontSize: 12, fontWeight: '800' },
  stepRail: { flexDirection: 'row', gap: 6, marginTop: 18 },
  stepItem: { flex: 1, minHeight: 58, justifyContent: 'center', paddingHorizontal: 8, borderTopWidth: 2, borderColor: RishiColors.line },
  stepItemActive: { borderColor: RishiColors.mint },
  stepNumber: { color: RishiColors.muted, fontSize: 9, fontWeight: '900' },
  stepNumberActive: { color: RishiColors.mint },
  stepLabel: { color: RishiColors.muted, fontSize: 9, lineHeight: 12, fontWeight: '700', marginTop: 4 },
  stepLabelActive: { color: RishiColors.text },
  stageHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 18 },
  stageIcon: { width: 46, height: 46, borderRadius: 12, backgroundColor: RishiColors.surface, alignItems: 'center', justifyContent: 'center' },
  stageCopy: { flex: 1, marginLeft: 12 },
  stageTitle: { color: RishiColors.text, fontSize: 17, fontWeight: '900' },
  stageSubtitle: { color: RishiColors.muted, fontSize: 11, marginTop: 3 },
  stageCount: { color: RishiColors.muted, fontSize: 12, fontWeight: '800' },
  requirements: { marginTop: 17, borderTopWidth: 1, borderColor: RishiColors.line },
  requirementRow: { minHeight: 47, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderColor: RishiColors.line },
  requirementText: { flex: 1, color: RishiColors.text, fontSize: 12, lineHeight: 17 },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 11, backgroundColor: RishiColors.surface, borderLeftWidth: 3, borderColor: RishiColors.warning, padding: 13, marginTop: 17 },
  noticeText: { flex: 1, color: RishiColors.muted, fontSize: 11, lineHeight: 17 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 20 },
  secondaryButton: { minWidth: 95, minHeight: 46, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: RishiColors.line, borderRadius: 9 },
  secondaryButtonText: { color: RishiColors.text, fontSize: 12, fontWeight: '800' },
  primaryButton: { minHeight: 46, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: RishiColors.mint, borderRadius: 9 },
  primaryButtonText: { color: RishiColors.background, fontSize: 12, fontWeight: '900' },
  buttonDisabled: { opacity: 0.45 },
});