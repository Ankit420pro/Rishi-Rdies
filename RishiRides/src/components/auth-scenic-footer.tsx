import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const rishikeshImage = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Ganga_Arti_At_Triveni_Ghat_In_Rishikesh.jpg/960px-Ganga_Arti_At_Triveni_Ghat_In_Rishikesh.jpg';

export default function AuthScenicFooter() {
  return (
    <View style={styles.container}>
      <View style={styles.photo}>
        <Image
          source={rishikeshImage}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          contentPosition="center"
          accessibilityLabel="Evening at Triveni Ghat in Rishikesh"
        />
        <View style={styles.caption}>
          <Text style={styles.kicker}>RISHIKESH · UTTARAKHAND</Text>
          <Text style={styles.title}>Every journey starts close.</Text>
        </View>
      </View>
      <View style={styles.trustRow}>
        <MaterialCommunityIcons name="shield-check-outline" size={18} color="#087F68" />
        <Text style={styles.trustText}>Phone verification · Safer access</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', marginTop: 28, overflow: 'hidden', borderRadius: 12, borderWidth: 1, borderColor: '#DCE5DE', backgroundColor: '#FFFFFF' },
  photo: { height: 130, overflow: 'hidden', justifyContent: 'flex-end', backgroundColor: '#D7E7DE' },
  caption: { paddingHorizontal: 14, paddingBottom: 12, paddingTop: 24, backgroundColor: 'rgba(13, 51, 42, 0.68)' },
  kicker: { color: '#D3F279', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  title: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginTop: 4 },
  trustRow: { minHeight: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingHorizontal: 10 },
  trustText: { color: '#718078', fontSize: 10, fontWeight: '700' },
});