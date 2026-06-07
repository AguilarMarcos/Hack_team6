import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Pencil, CheckCircle, LogOut, ShieldCheck, LockKeyhole } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import { colors, radius, spacing, shadow } from '../../src/theme/theme';

const TASTES = ['Comida local', 'Museos', 'Mercados', 'Artesanias', 'Rutas cortas', 'Naturaleza', 'Cafes', 'Experiencias familiares'];
const GENDERS = ['Mujer', 'Hombre', 'No binario', 'Prefiero no decirlo'];

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();
  const isGuest = user?.role === 'guest';
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || user?.name || '',
    email: user?.email || '',
    gender: user?.gender || '',
    interests: user?.interests || [],
  });

  const update = (k, v) => { setSaved(false); setForm((c) => ({ ...c, [k]: v })); };
  const toggleInterest = (i) => {
    setSaved(false);
    setForm((c) => ({
      ...c,
      interests: c.interests.includes(i) ? c.interests.filter((x) => x !== i) : [...c.interests, i],
    }));
  };

  const save = () => { updateUser(form); setSaved(true); setEditing(false); };
  const cancel = () => {
    setForm({ username: user?.username || '', email: user?.email || '', gender: user?.gender || '', interests: user?.interests || [] });
    setEditing(false);
    setSaved(false);
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesion', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: async () => { await logout(); router.replace('/auth'); } },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }}>
        <View style={s.header}>
          <Text style={s.title}>Perfil</Text>
          {!isGuest && !editing && (
            <TouchableOpacity style={s.editBtn} onPress={() => setEditing(true)}>
              <Pencil size={16} color={colors.primary} />
              <Text style={s.editBtnText}>Editar</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={s.avatarSection}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{(user?.name || 'V').charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={s.userName}>{user?.name || 'Visitante'}</Text>
            <View style={[s.roleBadge, isGuest ? s.roleBadgeGuest : s.roleBadgeUser]}>
              {isGuest ? <LockKeyhole size={13} color={colors.textSecondary} /> : <ShieldCheck size={13} color={colors.success} />}
              <Text style={[s.roleText, isGuest ? s.roleTextGuest : s.roleTextUser]}>
                {isGuest ? 'Modo visitante' : 'Cuenta completa'}
              </Text>
            </View>
          </View>
        </View>

        {isGuest ? (
          <View style={s.guestBox}>
            <LockKeyhole size={22} color={colors.secondary} />
            <View style={{ flex: 1 }}>
              <Text style={s.guestTitle}>Funciones limitadas</Text>
              <Text style={s.guestText}>Crea una cuenta para acceder a rutas, como llegar y calificaciones.</Text>
              <TouchableOpacity style={s.upgradeBtn} onPress={() => router.replace('/auth')}>
                <Text style={s.upgradeBtnText}>Crear cuenta</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={s.infoSection}>
            {editing ? (
              <>
                <Text style={s.label}>Nombre de usuario</Text>
                <TextInput
                  style={s.input}
                  value={form.username}
                  onChangeText={(v) => update('username', v)}
                  placeholderTextColor={colors.textSecondary}
                />
                <Text style={[s.label, { marginTop: spacing.md }]}>Correo</Text>
                <TextInput
                  style={s.input}
                  value={form.email}
                  onChangeText={(v) => update('email', v)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={colors.textSecondary}
                />
                <Text style={[s.label, { marginTop: spacing.md }]}>Genero</Text>
                <View style={s.chipRow}>
                  {GENDERS.map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[s.chip, form.gender === g && s.chipActive]}
                      onPress={() => update('gender', g)}
                    >
                      <Text style={[s.chipText, form.gender === g && s.chipTextActive]}>{g}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={[s.label, { marginTop: spacing.md }]}>Gustos</Text>
                <View style={s.chipRow}>
                  {TASTES.map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[s.chip, form.interests.includes(t) && s.chipSecondary]}
                      onPress={() => toggleInterest(t)}
                    >
                      <Text style={[s.chipText, form.interests.includes(t) && s.chipTextActive]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={s.editActions}>
                  <TouchableOpacity style={s.cancelBtn} onPress={cancel}>
                    <Text style={s.cancelBtnText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.saveBtn} onPress={save}>
                    <CheckCircle size={18} color={colors.white} />
                    <Text style={s.saveBtnText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                {saved && (
                  <View style={s.savedBanner}>
                    <CheckCircle size={16} color={colors.success} />
                    <Text style={s.savedText}>Perfil actualizado</Text>
                  </View>
                )}
                <InfoRow label="Usuario" value={user?.username} />
                <InfoRow label="Correo" value={user?.email} />
                <InfoRow label="Genero" value={user?.gender} />
                {(user?.interests || []).length > 0 && (
                  <View style={s.infoRow}>
                    <Text style={s.infoLabel}>Gustos</Text>
                    <View style={s.chipRow}>
                      {(user.interests || []).map((i) => (
                        <View key={i} style={s.chip}>
                          <Text style={s.chipText}>{i}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        )}

        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color={colors.secondary} />
          <Text style={s.logoutText}>Cerrar sesion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoRow = ({ label, value }) => (
  <View style={s.infoRow}>
    <Text style={s.infoLabel}>{label}</Text>
    <Text style={s.infoValue}>{value || '—'}</Text>
  </View>
);

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  title: { fontFamily: 'Outfit_700Bold', fontSize: 28, color: colors.primary },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border },
  editBtnText: { fontFamily: 'Outfit_600SemiBold', fontSize: 14, color: colors.primary },
  avatarSection: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'Outfit_700Bold', fontSize: 28, color: colors.white },
  userName: { fontFamily: 'Outfit_700Bold', fontSize: 22, color: colors.primary, marginBottom: 6 },
  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full, borderWidth: 1, alignSelf: 'flex-start' },
  roleBadgeGuest: { backgroundColor: 'rgba(91,102,95,0.08)', borderColor: colors.border },
  roleBadgeUser: { backgroundColor: 'rgba(14,124,102,0.08)', borderColor: 'rgba(14,124,102,0.3)' },
  roleText: { fontFamily: 'Outfit_600SemiBold', fontSize: 12 },
  roleTextGuest: { color: colors.textSecondary },
  roleTextUser: { color: colors.success },
  guestBox: {
    flexDirection: 'row', gap: spacing.md, padding: spacing.lg,
    backgroundColor: 'rgba(233,95,42,0.07)', borderRadius: radius.xl,
    borderWidth: 1, borderColor: 'rgba(233,95,42,0.2)', marginBottom: spacing.lg,
  },
  guestTitle: { fontFamily: 'Outfit_700Bold', fontSize: 16, color: colors.primary, marginBottom: 4 },
  guestText: { fontFamily: 'Outfit_400Regular', fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.md },
  upgradeBtn: { backgroundColor: colors.primary, borderRadius: radius.md, height: 44, alignItems: 'center', justifyContent: 'center' },
  upgradeBtnText: { fontFamily: 'Outfit_700Bold', fontSize: 14, color: colors.white },
  infoSection: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg, ...shadow.sm },
  infoRow: { marginBottom: spacing.md },
  infoLabel: { fontFamily: 'Outfit_700Bold', fontSize: 12, color: colors.textSecondary, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { fontFamily: 'Outfit_600SemiBold', fontSize: 16, color: colors.textPrimary },
  label: { fontFamily: 'Outfit_700Bold', fontSize: 13, color: colors.textSecondary, marginBottom: spacing.sm },
  input: { height: 52, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, paddingHorizontal: spacing.md, fontFamily: 'Outfit_400Regular', fontSize: 16, color: colors.textPrimary, backgroundColor: colors.white },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipSecondary: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  chipText: { fontFamily: 'Outfit_600SemiBold', fontSize: 12, color: colors.textPrimary },
  chipTextActive: { color: colors.white },
  editActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  cancelBtn: { flex: 1, height: 48, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  cancelBtnText: { fontFamily: 'Outfit_700Bold', fontSize: 15, color: colors.textSecondary },
  saveBtn: { flex: 1, height: 48, backgroundColor: colors.secondary, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  saveBtnText: { fontFamily: 'Outfit_700Bold', fontSize: 15, color: colors.white },
  savedBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(14,124,102,0.08)', borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.md, borderWidth: 1, borderColor: 'rgba(14,124,102,0.2)' },
  savedText: { fontFamily: 'Outfit_600SemiBold', fontSize: 14, color: colors.success },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, height: 52, borderRadius: radius.md, borderWidth: 1.5, borderColor: 'rgba(233,95,42,0.3)', backgroundColor: 'rgba(233,95,42,0.06)' },
  logoutText: { fontFamily: 'Outfit_700Bold', fontSize: 15, color: colors.secondary },
});
