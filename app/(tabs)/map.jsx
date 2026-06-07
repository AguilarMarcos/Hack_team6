import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import { X, MapPin, Clock, Star } from 'lucide-react-native';
import { businesses, businessCategories } from '../../src/data/durango';
import { colors, radius, spacing, shadow } from '../../src/theme/theme';

const { width } = Dimensions.get('window');
const DURANGO = { latitude: 24.0277, longitude: -104.6531, latitudeDelta: 0.04, longitudeDelta: 0.04 };

export default function MapScreen() {
  const [category, setCategory] = useState('Todos');
  const [selected, setSelected] = useState(null);

  const visible = category === 'Todos' ? businesses : businesses.filter((b) => b.category === category);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={DURANGO}
        showsUserLocation
        showsMyLocationButton
      >
        {visible.map((place) => (
          <Marker
            key={place.id}
            coordinate={{ latitude: place.pos[0], longitude: place.pos[1] }}
            onPress={() => setSelected(place)}
          >
            <View style={[s.pin, selected?.id === place.id && s.pinActive]}>
              <MapPin size={14} color={colors.white} fill={colors.white} />
            </View>
          </Marker>
        ))}
      </MapView>

      <SafeAreaView style={s.overlay} edges={['top']} pointerEvents="box-none">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.sm, paddingVertical: spacing.sm }}
          style={s.filterBar}
        >
          {businessCategories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[s.chip, category === cat && s.chipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[s.chipText, category === cat && s.chipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>

      {selected && (
        <View style={s.bottomSheet}>
          <View style={s.handle} />
          <View style={s.sheetContent}>
            <Image source={{ uri: selected.img }} style={s.sheetImg} />
            <View style={s.sheetInfo}>
              <View style={s.sheetBadge}>
                <Text style={s.sheetBadgeText}>{selected.category}</Text>
              </View>
              <Text style={s.sheetName} numberOfLines={1}>{selected.name}</Text>
              <Text style={s.sheetType} numberOfLines={1}>{selected.location} · {selected.price}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <Star size={13} color={colors.star} fill={colors.star} />
                <Text style={s.sheetRating}>{selected.rating}</Text>
                <Text style={s.sheetMeta}>· {selected.hours}</Text>
              </View>
            </View>
            <TouchableOpacity style={s.closeBtn} onPress={() => setSelected(null)}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={s.sheetDesc} numberOfLines={2}>{selected.desc}</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  filterBar: {
    backgroundColor: 'rgba(248,243,234,0.9)',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full,
    borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: 'rgba(255,253,248,0.95)',
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontFamily: 'Outfit_600SemiBold', fontSize: 13, color: colors.textPrimary },
  chipTextActive: { color: colors.white },
  pin: {
    backgroundColor: colors.secondary, borderRadius: 999,
    padding: 8, borderWidth: 2.5, borderColor: colors.white, ...shadow.sm,
  },
  pinActive: { backgroundColor: colors.primary, transform: [{ scale: 1.2 }] },
  bottomSheet: {
    position: 'absolute', bottom: 100, left: 12, right: 12,
    backgroundColor: colors.surface, borderRadius: radius.xl,
    padding: spacing.md, borderWidth: 1, borderColor: colors.border, ...shadow.lg,
  },
  handle: {
    width: 36, height: 4, borderRadius: 999,
    backgroundColor: 'rgba(18,49,43,0.18)', alignSelf: 'center', marginBottom: spacing.sm,
  },
  sheetContent: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  sheetImg: { width: 80, height: 80, borderRadius: radius.md },
  sheetInfo: { flex: 1 },
  sheetBadge: { backgroundColor: colors.secondary, borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', marginBottom: 4 },
  sheetBadgeText: { fontFamily: 'Outfit_700Bold', fontSize: 10, color: colors.white },
  sheetName: { fontFamily: 'Outfit_700Bold', fontSize: 16, color: colors.primary },
  sheetType: { fontFamily: 'Outfit_400Regular', fontSize: 13, color: colors.textSecondary },
  sheetRating: { fontFamily: 'Outfit_700Bold', fontSize: 13, color: colors.textPrimary },
  sheetMeta: { fontFamily: 'Outfit_400Regular', fontSize: 12, color: colors.textSecondary },
  closeBtn: { padding: 4 },
  sheetDesc: { fontFamily: 'Outfit_400Regular', fontSize: 13, color: colors.textSecondary, marginTop: 10, lineHeight: 18 },
});
