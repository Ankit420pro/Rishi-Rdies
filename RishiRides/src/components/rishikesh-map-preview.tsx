import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function RishikeshMapPreview({
  pickup,
  destination,
}: {
  pickup?: string;
  destination?: string;
}) {
  return (
    <View style={styles.map}>
      <View style={styles.blocks}>
        <View style={[styles.block, styles.blockOne]} />
        <View style={[styles.block, styles.blockTwo]} />
        <View style={[styles.block, styles.blockThree]} />
        <View style={[styles.block, styles.blockFour]} />
        <View style={[styles.block, styles.blockFive]} />
        <View style={[styles.block, styles.blockSix]} />
      </View>
      <View style={styles.river} />
      <View style={[styles.road, styles.roadOne]} />
      <View style={[styles.road, styles.roadTwo]} />
      <View style={[styles.road, styles.roadThree]} />
      <View style={[styles.road, styles.roadFour]} />
      <View style={styles.route} />

      <View style={styles.placeOne}><Text style={styles.placeText}>TRIVENI GHAT</Text></View>
      <View style={styles.placeTwo}><Text style={styles.placeText}>RAM JHULA</Text></View>
      <View style={styles.placeThree}><Text style={styles.placeText}>TAPOVAN</Text></View>

      <View style={styles.pickupPin}>
        <MaterialCommunityIcons name="crosshairs-gps" size={17} color="#FFFFFF" />
      </View>
      <View style={styles.destinationPin}>
        <MaterialCommunityIcons name="map-marker" size={23} color="#087F68" />
      </View>

      <View style={styles.mapBadge}>
        <View style={styles.mapBadgeDot} />
        <Text style={styles.mapBadgeText}>RISHIKESH · MAP PREVIEW</Text>
      </View>
      <View style={styles.mapNote}>
        <MaterialCommunityIcons name="map-marker-outline" size={15} color="#183A32" />
        <Text numberOfLines={1} style={styles.mapNoteText}>
          {pickup || destination ? 'Route preview only' : 'Local map preview'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { height: 300, width: '100%', overflow: 'hidden', position: 'relative', backgroundColor: '#EAF0EA', borderRadius: 18, borderWidth: 1, borderColor: '#DCE5DE' },
  blocks: { ...StyleSheet.absoluteFill },
  block: { position: 'absolute', backgroundColor: '#F7F8F5', borderRadius: 4 },
  blockOne: { left: '8%', top: '15%', width: '25%', height: '22%' },
  blockTwo: { left: '41%', top: '9%', width: '21%', height: '25%' },
  blockThree: { right: '5%', top: '17%', width: '22%', height: '29%' },
  blockFour: { left: '12%', bottom: '14%', width: '26%', height: '22%' },
  blockFive: { left: '48%', bottom: '9%', width: '21%', height: '26%' },
  blockSix: { right: '6%', bottom: '16%', width: '18%', height: '20%' },
  river: { position: 'absolute', width: '135%', height: 45, left: '-15%', top: '49%', backgroundColor: '#CDE6DE', borderTopWidth: 5, borderBottomWidth: 5, borderColor: '#F7F8F5', transform: [{ rotate: '-12deg' }] },
  road: { position: 'absolute', height: 5, backgroundColor: '#FFFFFF', borderRadius: 4 },
  roadOne: { width: '120%', left: '-10%', top: '31%', transform: [{ rotate: '18deg' }] },
  roadTwo: { width: '120%', left: '-12%', top: '70%', transform: [{ rotate: '-20deg' }] },
  roadThree: { width: '95%', left: '12%', top: '48%', transform: [{ rotate: '72deg' }] },
  roadFour: { width: '86%', left: '30%', top: '47%', transform: [{ rotate: '-66deg' }] },
  route: { position: 'absolute', width: '2.5%', height: '37%', left: '49%', top: '24%', borderLeftWidth: 3, borderColor: '#087F68', borderStyle: 'dashed', transform: [{ rotate: '18deg' }] },
  placeOne: { position: 'absolute', left: '7%', top: '42%' },
  placeTwo: { position: 'absolute', right: '8%', top: '58%' },
  placeThree: { position: 'absolute', right: '12%', top: '10%' },
  placeText: { color: '#718078', fontSize: 8, fontWeight: '900', letterSpacing: 0.6 },
  pickupPin: { position: 'absolute', left: '31%', top: '30%', width: 32, height: 32, borderRadius: 16, backgroundColor: '#183A32', borderWidth: 3, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', elevation: 3 },
  destinationPin: { position: 'absolute', right: '26%', bottom: '23%', width: 34, height: 38, alignItems: 'center', justifyContent: 'center' },
  mapBadge: { position: 'absolute', top: 13, left: 13, flexDirection: 'row', alignItems: 'center', gap: 7, minHeight: 30, paddingHorizontal: 10, borderRadius: 16, backgroundColor: '#FFFFFF' },
  mapBadgeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#087F68' },
  mapBadgeText: { color: '#183A32', fontSize: 9, fontWeight: '900', letterSpacing: 0.7 },
  mapNote: { position: 'absolute', right: 12, bottom: 12, flexDirection: 'row', alignItems: 'center', gap: 5, maxWidth: '58%', minHeight: 30, paddingHorizontal: 9, borderRadius: 15, backgroundColor: '#FFFFFF' },
  mapNoteText: { color: '#183A32', fontSize: 10, fontWeight: '700' },
});