import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Star, Clock, Footprints, Wallet, MapPinned, ChevronRight } from 'lucide-react-native';
import { routePlans, businesses, routeDescriptions } from '../../src/data/durango';
import { useAuth } from '../../src/context/AuthContext';
import { colors, radius, spacing, shadow } from '../../src/theme/theme';

const StarRow = ({ rating, size = 13 }) => (
  <View style={{ flexDirection: 'row', gap: 2 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={size} color={colors.star} fill={s <= Math.round(rating) ? colors.star : 'transparent'} />
    ))}
  </View>
);

export default function RoutesScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [active, setActive] = useState(null);

  const selected = active ? routePlans.find((r) => r.id === active) : null;
  const stops = selected ? selected.stops.map((name) => businesses.find((b) => b.name === name)).filter(Boolean) : [];
  const desc = selected ? routeDescriptions?.[selected.id] : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={s.topbar}>
        <Text style={s.title}>Rutas</Text>
        <Text style={s.subtitle}>Planes listos para explorar Durango</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 120, gap: spacing.md }}>
        {routePlans.map((route) => {
          const heroImg = businesses.find((b) => b.name === route.stops[0])?.img;
          const isActive = active === route.id;

          return (
            <TouchableOpacity
              key={route.id}
              style={[s.card, isActive && { borderColor: route.color, borderWidth: 2 }]}
              onPress={() => setActive(isActive ? null : route.id)}
              activeOpacity={0.85}
            >
              {heroImg && (
                <View style={s.imgWrap}>
                  <Image source={{ uri: heroImg }} style={s.img} />
                  <View style={[s.imgOverlay, { backgroundColor: `${route.color}99` }]} />
                  <View style={s.ratingBadge}>
                    <Star size={12} color={colors.star} fill={colors.star} />
                    <Text style={s.ratingBadgeText}>{route.rating}</Text>
                  </View>
                </View>
              )}

              <View style={s.cardBody}>
                <View style={s.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.routeTitle}>{route.title}</Text>
                    <Text style={s.routeDesc} numberOfLines={2}>{route.desc}</Text>
                  </View>
                  <ChevronRight size={20} color={colors.textSecondary} style={{ transform: [{ rotate: isActive ? '90deg' : '0deg' }] }} />
                </View>

                <View style={s.metaRow}>
                  <View style={s.metaItem}>
                    <Clock size={14} color={colors.primary} />
                    <Text style={s.metaText}>{route.duration}</Text>
                  </View>
                  <View style={s.metaItem}>
                    <Footprints size={14} color={colors.primary} />
                    <Text style={s.metaText}>{route.distance}</Text>
                  </View>
                  <View style={s.metaItem}>
                    <Wallet size={14} color={colors.primary} />
                    <Text style={s.metaText}>{route.budget}</Text>
                  </View>
                </View>

                {isActive && (
                  <View style={s.stopsSection}>
                    <Text style={s.stopsTitle}>Paradas ({stops.length})</Text>
                    {stops.map((place, i) => (
                      <View key={place.id} style={s.stopRow}>
                        <View style={[s.stopNum, { backgroundColor: route.color }]}>
                          <Text style={s.stopNumText}>{i + 1}</Text>
                        </View>
                        <Image source={{ uri: place.img }} style={s.stopImg} />
                        <View style={{ flex: 1 }}>
                          <Text style={s.stopName} numberOfLines={1}>{place.name}</Text>
                          <Text style={s.stopMeta}>{place.type} · {place.price}</Text>
                        </View>
                      </View>
                    ))}

                    <TouchableOpacity
                      style={[s.mapBtn, { backgroundColor: route.color }]}
                      onPress={() => router.push('/(tabs)/map')}
                    >
                      <MapPinned size={18} color={colors.white} />
                      <Text style={s.mapBtnText}>Ver en el mapa</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  topbar: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  title: { fontFamily: 'Outfit_700Bold', fontSize: 28, color: colors.primary },
  subtitle: { fontFamily: 'Outfit_400Regular', fontSize: 15, color: colors.textSecondary, marginTop: 2 },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.xl,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden', ...shadow.sm,
  },
  imgWrap: { height: 140, position: 'relative' },
  img: { width: '100%', height: '100%' },
  imgOverlay: { ...StyleSheet.absoluteFillObject },
  ratingBadge: {
    position: 'absolute', bottom: 12, left: 14,
    backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: radius.full,
    paddingHorizontal: 10, paddingVertical: 4,
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  ratingBadgeText: { fontFamily: 'Outfit_700Bold', fontSize: 12, color: colors.textPrimary },
  cardBody: { padding: spacing.md },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.sm },
  routeTitle: { fontFamily: 'Outfit_700Bold', fontSize: 18, color: colors.primary, marginBottom: 4 },
  routeDesc: { fontFamily: 'Outfit_400Regular', fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  metaRow: { flexDirection: 'row', gap: spacing.md, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontFamily: 'Outfit_600SemiBold', fontSize: 13, color: colors.textPrimary },
  stopsSection: { marginTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  stopsTitle: { fontFamily: 'Outfit_700Bold', fontSize: 15, color: colors.primary, marginBottom: spacing.sm },
  stopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  stopNum: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  stopNumText: { fontFamily: 'Outfit_700Bold', fontSize: 13, color: colors.white },
  stopImg: { width: 44, height: 44, borderRadius: radius.sm },
  stopName: { fontFamily: 'Outfit_700Bold', fontSize: 14, color: colors.textPrimary },
  stopMeta: { fontFamily: 'Outfit_400Regular', fontSize: 12, color: colors.textSecondary },
  mapBtn: {
    marginTop: spacing.md, height: 48, borderRadius: radius.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  mapBtnText: { fontFamily: 'Outfit_700Bold', fontSize: 15, color: colors.white },
});
