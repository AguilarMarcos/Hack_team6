import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  StyleSheet, FlatList, Modal, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Star, MapPin, Clock, Phone, Navigation, LockKeyhole, X, Heart } from 'lucide-react-native';
import { businessCategories, businesses, businessReviews } from '../../src/data/durango';
import { useAuth } from '../../src/context/AuthContext';
import { colors, radius, spacing, shadow } from '../../src/theme/theme';

const StarRow = ({ rating, size = 14 }) => (
  <View style={{ flexDirection: 'row', gap: 2 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={size} color={colors.star} fill={s <= Math.round(rating) ? colors.star : 'transparent'} />
    ))}
  </View>
);

const PlaceCard = ({ place, onPress, isFav, onToggleFav }) => (
  <TouchableOpacity style={s.card} onPress={() => onPress(place)} activeOpacity={0.85}>
    <View style={s.cardImgWrap}>
      <Image source={{ uri: place.img }} style={s.cardImg} />
      <TouchableOpacity style={s.favBtn} onPress={() => onToggleFav(place.id)}>
        <Heart size={18} color={isFav ? colors.secondary : colors.white} fill={isFav ? colors.secondary : 'transparent'} />
      </TouchableOpacity>
      <View style={s.cardBadge}>
        <Text style={s.cardBadgeText}>{place.category}</Text>
      </View>
    </View>
    <View style={s.cardBody}>
      <Text style={s.cardName} numberOfLines={1}>{place.name}</Text>
      <Text style={s.cardType} numberOfLines={1}>{place.type}</Text>
      <View style={s.cardMeta}>
        <StarRow rating={place.rating} />
        <Text style={s.cardRating}>{place.rating}</Text>
        <Text style={s.cardDot}>·</Text>
        <Text style={s.cardDistance}>{place.distance}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const isGuest = user?.role === 'guest';
  const [category, setCategory] = useState('Todos');
  const [favs, setFavs] = useState([]);
  const [selected, setSelected] = useState(null);

  const visible = category === 'Todos' ? businesses : businesses.filter((b) => b.category === category);
  const reviews = selected ? businessReviews[selected.id] || [] : [];

  const toggleFav = (id) => setFavs((c) => c.includes(id) ? c.filter((i) => i !== id) : [...c, id]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={s.topbar}>
        <Text style={s.topbarTitle}>Descubre Durango</Text>
        <TouchableOpacity style={s.avatarBtn} onPress={() => router.push('/(tabs)/profile')}>
          <Text style={s.avatarText}>{(user?.name || 'V').charAt(0).toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.filterScroll}
        contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.sm }}
      >
        {businessCategories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[s.filterChip, category === cat && s.filterChipActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[s.filterChipText, category === cat && s.filterChipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={visible}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: spacing.sm, paddingHorizontal: spacing.md }}
        contentContainerStyle={{ paddingBottom: 120, gap: spacing.sm, paddingTop: spacing.sm }}
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <PlaceCard
              place={item}
              onPress={setSelected}
              isFav={favs.includes(item.id)}
              onToggleFav={toggleFav}
            />
          </View>
        )}
      />

      <Modal visible={!!selected} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelected(null)}>
        {selected && (
          <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} bounces={false}>
            <View style={s.modalImgWrap}>
              <Image source={{ uri: selected.img }} style={s.modalImg} />
              <TouchableOpacity style={s.closeBtn} onPress={() => setSelected(null)}>
                <X size={20} color={colors.white} />
              </TouchableOpacity>
            </View>

            <View style={s.modalBody}>
              <View style={s.modalBadgeRow}>
                <View style={s.badge}>
                  <Text style={s.badgeText}>{selected.category}</Text>
                </View>
                <View style={s.ratingRow}>
                  <Star size={14} color={colors.star} fill={colors.star} />
                  <Text style={s.ratingText}>{selected.rating}</Text>
                  <Text style={s.reviewCount}>({selected.reviews})</Text>
                </View>
              </View>

              <Text style={s.modalName}>{selected.name}</Text>
              <Text style={s.modalType}>{selected.type} · {selected.location}</Text>

              <View style={s.infoCard}>
                <View style={s.infoRow}>
                  <Clock size={16} color={colors.primary} />
                  <Text style={s.infoText}>{selected.hours}</Text>
                </View>
                <View style={s.infoRow}>
                  <MapPin size={16} color={colors.primary} />
                  <Text style={s.infoText}>{selected.location} · {selected.distance}</Text>
                </View>
                <View style={s.infoRow}>
                  <Text style={[s.infoText, { fontFamily: 'Outfit_700Bold' }]}>Precio:</Text>
                  <Text style={s.infoText}> {selected.price}</Text>
                </View>
              </View>

              <Text style={s.descText}>{selected.desc}</Text>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.lg }}>
                {selected.tags.map((tag) => (
                  <View key={tag} style={s.tag}>
                    <Text style={s.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              {isGuest ? (
                <View style={s.lockBox}>
                  <LockKeyhole size={20} color={colors.secondary} />
                  <Text style={s.lockText}>Crea una cuenta para ver como llegar, calificar y agregar a rutas.</Text>
                </View>
              ) : (
                <View style={s.actionGrid}>
                  <TouchableOpacity style={s.actionBtn}>
                    <Navigation size={18} color={colors.white} />
                    <Text style={s.actionBtnText}>Como llegar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[s.actionBtn, s.actionBtnOutline]}>
                    <Phone size={18} color={colors.primary} />
                    <Text style={[s.actionBtnText, { color: colors.primary }]}>Llamar</Text>
                  </TouchableOpacity>
                </View>
              )}

              {reviews.length > 0 && (
                <View>
                  <Text style={s.reviewsTitle}>Reseñas ({reviews.length})</Text>
                  {reviews.map((r) => (
                    <View key={r.id} style={s.reviewCard}>
                      <View style={s.reviewHeader}>
                        <View style={s.reviewAvatar}>
                          <Text style={s.reviewAvatarText}>{r.avatar}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={s.reviewUser}>{r.user}</Text>
                          <Text style={s.reviewDate}>{r.date}</Text>
                        </View>
                        <StarRow rating={r.rating} size={12} />
                      </View>
                      <Text style={s.reviewComment}>{r.comment}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  topbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  topbarTitle: { fontFamily: 'Outfit_700Bold', fontSize: 24, color: colors.primary },
  avatarBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontFamily: 'Outfit_700Bold', fontSize: 16, color: colors.white },
  filterScroll: { maxHeight: 52, marginBottom: spacing.sm },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.full,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface,
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { fontFamily: 'Outfit_600SemiBold', fontSize: 13, color: colors.textPrimary },
  filterChipTextActive: { color: colors.white },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden', ...shadow.sm,
  },
  cardImgWrap: { position: 'relative', height: 120 },
  cardImg: { width: '100%', height: '100%' },
  favBtn: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 999, padding: 6,
  },
  cardBadge: {
    position: 'absolute', bottom: 8, left: 8,
    backgroundColor: colors.secondary, borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 3,
  },
  cardBadgeText: { fontFamily: 'Outfit_700Bold', fontSize: 11, color: colors.white },
  cardBody: { padding: 10 },
  cardName: { fontFamily: 'Outfit_700Bold', fontSize: 14, color: colors.textPrimary, marginBottom: 2 },
  cardType: { fontFamily: 'Outfit_400Regular', fontSize: 12, color: colors.textSecondary, marginBottom: 6 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardRating: { fontFamily: 'Outfit_700Bold', fontSize: 12, color: colors.textPrimary },
  cardDot: { color: colors.textSecondary, fontSize: 12 },
  cardDistance: { fontFamily: 'Outfit_400Regular', fontSize: 11, color: colors.textSecondary, flex: 1 },
  modalImgWrap: { position: 'relative', height: 240 },
  modalImg: { width: '100%', height: '100%' },
  closeBtn: {
    position: 'absolute', top: 48, right: 16,
    backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 999, padding: 8,
  },
  modalBody: { padding: spacing.lg, paddingBottom: 100 },
  modalBadgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  badge: { backgroundColor: colors.secondary, borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 4 },
  badgeText: { fontFamily: 'Outfit_700Bold', fontSize: 12, color: colors.white },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontFamily: 'Outfit_700Bold', fontSize: 14, color: colors.textPrimary },
  reviewCount: { fontFamily: 'Outfit_400Regular', fontSize: 13, color: colors.textSecondary },
  modalName: { fontFamily: 'Outfit_700Bold', fontSize: 26, color: colors.primary, marginBottom: 4 },
  modalType: { fontFamily: 'Outfit_400Regular', fontSize: 15, color: colors.textSecondary, marginBottom: spacing.md },
  infoCard: {
    backgroundColor: colors.overlay, borderRadius: radius.md,
    padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  infoText: { fontFamily: 'Outfit_400Regular', fontSize: 14, color: colors.textPrimary, flex: 1 },
  descText: { fontFamily: 'Outfit_400Regular', fontSize: 15, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.md },
  tag: { backgroundColor: colors.overlay, borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: colors.border },
  tagText: { fontFamily: 'Outfit_600SemiBold', fontSize: 12, color: colors.primary },
  lockBox: {
    flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start',
    backgroundColor: 'rgba(233,95,42,0.08)', borderRadius: radius.md,
    padding: spacing.md, borderWidth: 1, borderColor: 'rgba(233,95,42,0.25)',
    marginBottom: spacing.lg,
  },
  lockText: { fontFamily: 'Outfit_400Regular', fontSize: 14, color: colors.textPrimary, flex: 1, lineHeight: 20 },
  actionGrid: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  actionBtn: {
    flex: 1, height: 52, backgroundColor: colors.secondary,
    borderRadius: radius.md, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
  },
  actionBtnOutline: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border },
  actionBtnText: { fontFamily: 'Outfit_700Bold', fontSize: 14, color: colors.white },
  reviewsTitle: { fontFamily: 'Outfit_700Bold', fontSize: 18, color: colors.primary, marginBottom: spacing.md },
  reviewCard: {
    backgroundColor: colors.overlay, borderRadius: radius.md,
    padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 8 },
  reviewAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  reviewAvatarText: { fontFamily: 'Outfit_700Bold', fontSize: 14, color: colors.white },
  reviewUser: { fontFamily: 'Outfit_700Bold', fontSize: 13, color: colors.textPrimary },
  reviewDate: { fontFamily: 'Outfit_400Regular', fontSize: 12, color: colors.textSecondary },
  reviewComment: { fontFamily: 'Outfit_400Regular', fontSize: 14, color: colors.textPrimary, lineHeight: 20 },
});
