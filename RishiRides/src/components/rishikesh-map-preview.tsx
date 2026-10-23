import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { Coordinates } from '../domain/ride-rules';

const TILE_SIZE = 256;
const ZOOM = 14;
const CENTER = { latitude: 30.0869, longitude: 78.2676 };
const TILE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile';

function worldPixel(latitude: number, longitude: number) {
  const scale = TILE_SIZE * 2 ** ZOOM;
  const sinLatitude = Math.sin((latitude * Math.PI) / 180);
  return {
    x: ((longitude + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)) * scale,
  };
}

export default function RishikeshMapPreview({
  pickup: _pickup,
  destination: _destination,
  centerCoordinates,
  markerLabel = 'Rishikesh',
}: {
  pickup?: string;
  destination?: string;
  centerCoordinates?: Coordinates;
  markerLabel?: string;
}) {
  const [mapWidth, setMapWidth] = useState(0);
  const mapHeight = 260;
  const center = worldPixel(
    centerCoordinates?.latitude ?? CENTER.latitude,
    centerCoordinates?.longitude ?? CENTER.longitude,
  );
  const left = center.x - mapWidth / 2;
  const top = center.y - mapHeight / 2;
  const firstColumn = Math.floor(left / TILE_SIZE);
  const firstRow = Math.floor(top / TILE_SIZE);
  const columns = Math.ceil(mapWidth / TILE_SIZE) + 1;
  const rows = Math.ceil(mapHeight / TILE_SIZE) + 1;

  const tiles = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const tileX = firstColumn + column;
      const tileY = firstRow + row;
      tiles.push(
        <Image
          key={`${tileX}-${tileY}`}
          source={{ uri: `${TILE_URL}/${ZOOM}/${tileY}/${tileX}` }}
          style={{
            position: 'absolute',
            left: tileX * TILE_SIZE - left,
            top: tileY * TILE_SIZE - top,
            width: TILE_SIZE,
            height: TILE_SIZE,
          }}
          resizeMode="stretch"
        />
      );
    }
  }

  return (
    <View style={styles.map} onLayout={(event) => setMapWidth(event.nativeEvent.layout.width)}>
      {tiles}
      <View pointerEvents="none" style={styles.centerPin}>
        <View style={styles.pinHalo} />
        <MaterialCommunityIcons name="map-marker" size={30} color="#087F68" />
      </View>
      <View pointerEvents="none" style={styles.markerLabel}>
        <Text numberOfLines={1} style={styles.markerLabelText}>{markerLabel}</Text>
      </View>
      <View pointerEvents="none" style={styles.mapBadge}>
        <MaterialCommunityIcons name="satellite-variant" size={15} color="#FFFFFF" />
        <Text style={styles.mapBadgeText}>RISHIKESH · SATELLITE</Text>
      </View>
      <View pointerEvents="none" style={styles.mapAttribution}>
        <Text style={styles.attributionText}>Imagery © Esri, Maxar, Earthstar Geographics</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { height: 260, width: '100%', overflow: 'hidden', position: 'relative', backgroundColor: '#52675B', borderRadius: 12, borderWidth: 1, borderColor: '#DCE5DE' },
  centerPin: { position: 'absolute', left: '50%', top: '50%', width: 32, height: 38, marginLeft: -16, marginTop: -32, alignItems: 'center', justifyContent: 'center' },
  pinHalo: { position: 'absolute', width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFFFFF', opacity: 0.85 },
  markerLabel: { position: 'absolute', left: '50%', top: '50%', marginLeft: 14, marginTop: -28, maxWidth: '45%', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 5, backgroundColor: 'rgba(17, 37, 32, 0.9)' },
  markerLabelText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  mapBadge: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', alignItems: 'center', gap: 7, minHeight: 32, paddingHorizontal: 11, borderRadius: 5, backgroundColor: 'rgba(17, 37, 32, 0.88)' },
  mapBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
  mapAttribution: { position: 'absolute', right: 5, bottom: 4, paddingHorizontal: 5, paddingVertical: 3, backgroundColor: 'rgba(255, 255, 255, 0.88)' },
  attributionText: { color: '#26352F', fontSize: 8 },
});