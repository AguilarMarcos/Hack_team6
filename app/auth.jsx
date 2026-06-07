import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, UserCircle, Sparkles, BadgeCheck } from 'lucide-react-native';
import { useAuth } from '../src/context/AuthContext';
import { colors, radius, spacing, shadow } from '../src/theme/theme';

const TASTES = ['Comida local', 'Museos', 'Mercados', 'Artesanias', 'Rutas cortas', 'Naturaleza', 'Cafes', 'Experiencias familiares'];
const GENDERS = ['Mujer', 'Hombre', 'No binario', 'Prefiero no decirlo'];

export default function AuthScreen() {
  const { loginAsGuest, createAccount, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState('choice');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', gender: '', interests: [] });
  const [error, setError] = useState('');

  const update = (k, v) => { setError(''); setForm((c) => ({ ...c, [k]: v })); };
  const toggleTaste = (t) => {
    setError('');
    setForm((c) => ({
      ...c,
      interests: c.interests.includes(t) ? c.interests.filter((i) => i !== t) : [...c.interests, t],
    }));
  };

  const handleGuest = async () => {
    setLoading(true);
    await loginAsGuest();
    router.replace('/(tabs)');
  };

  const handleCreate = async () => {
    if (!form.username.trim() || !form.email.trim() || !form.gender || form.interests.length === 0) {
      setError('Completa todos los campos y selecciona al menos un gusto.');
      return;
    }
    setLoading(true);
    await createAccount(form);
    router.replace('/(tabs)');
  };

  const handleGoogle = async () => {
    setLoading(true);
    await loginWithGoogle();
    router.replace('/(tabs)');
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <LinearGradient
        colors={['rgba(233,95,42,0.10)', 'transparent']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <View style={s.header}>
            <View style={s.logoRow}>
              <MapPin size={28} color={colors.secondary} />
              <Text style={s.logoText}>Durango Guide</Text>
            </View>
            <Text style={s.title}>Descubre Durango{'\n'}con confianza</Text>
            <Text style={s.subtitle}>Comida, museos, mercados y rutas accesibles para todos.</Text>
          </View>

          {mode === 'choice' && (
            <View style={s.card}>
              <TouchableOpacity style={s.btnPrimary} onPress={() => setMode('register')}>
                <UserCircle size={22} color={colors.white} />
                <Text style={s.btnPrimaryText}>Crear cuenta</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[s.btnOutline, { marginTop: spacing.sm }]} onPress={handleGoogle}>
                <Sparkles size={20} color={colors.primary} />
                <Text style={s.btnOutlineText}>Continuar con Google</Text>
              </TouchableOpacity>

              <View style={s.divider}>
                <View style={s.dividerLine} />
                <Text style={s.dividerText}>o</Text>
                <View style={s.dividerLine} />
              </View>

              <TouchableOpacity style={s.btnGhost} onPress={handleGuest}>
                <BadgeCheck size={18} color={colors.textSecondary} />
                <Text style={s.btnGhostText}>Explorar sin cuenta</Text>
              </TouchableOpacity>
            </View>
          )}

          {mode === 'register' && (
            <View style={s.card}>
              <Text style={s.sectionTitle}>Crea tu cuenta</Text>

              <TextInput
                style={s.input}
                placeholder="Nombre de usuario"
                placeholderTextColor={colors.textSecondary}
                value={form.username}
                onChangeText={(v) => update('username', v)}
                autoCapitalize="none"
              />
              <TextInput
                style={[s.input, { marginTop: spacing.sm }]}
                placeholder="Correo electronico"
                placeholderTextColor={colors.textSecondary}
                value={form.email}
                onChangeText={(v) => update('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
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

              <Text style={[s.label, { marginTop: spacing.md }]}>Tus gustos</Text>
              <View style={s.chipRow}>
                {TASTES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[s.chip, form.interests.includes(t) && s.chipSecondary]}
                    onPress={() => toggleTaste(t)}
                  >
                    <Text style={[s.chipText, form.interests.includes(t) && s.chipTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {!!error && <Text style={s.error}>{error}</Text>}

              <TouchableOpacity style={[s.btnPrimary, { marginTop: spacing.lg }]} onPress={handleCreate}>
                <Text style={s.btnPrimaryText}>Crear cuenta</Text>
              </TouchableOpacity>

              <TouchableOpacity style={s.btnGhost} onPress={() => setMode('choice')}>
                <Text style={s.btnGhostText}>Volver</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  scroll: { padding: spacing.lg, paddingBottom: 48 },
  header: { marginBottom: spacing.xl },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  logoText: { fontFamily: 'Outfit_700Bold', fontSize: 22, color: colors.primary },
  title: { fontFamily: 'Outfit_700Bold', fontSize: 34, color: colors.primary, lineHeight: 40, marginBottom: spacing.sm },
  subtitle: { fontFamily: 'Outfit_400Regular', fontSize: 16, color: colors.textSecondary, lineHeight: 24 },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.xl,
    padding: spacing.lg, borderWidth: 1, borderColor: colors.border, ...shadow.md,
  },
  sectionTitle: { fontFamily: 'Outfit_700Bold', fontSize: 22, color: colors.primary, marginBottom: spacing.md },
  btnPrimary: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    height: 52, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: spacing.sm,
  },
  btnPrimaryText: { fontFamily: 'Outfit_700Bold', fontSize: 16, color: colors.white },
  btnOutline: {
    borderRadius: radius.md, height: 52,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  btnOutlineText: { fontFamily: 'Outfit_700Bold', fontSize: 16, color: colors.primary },
  btnGhost: {
    height: 48, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6, marginTop: spacing.sm,
  },
  btnGhostText: { fontFamily: 'Outfit_600SemiBold', fontSize: 15, color: colors.textSecondary },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.md, gap: spacing.sm },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontFamily: 'Outfit_400Regular', color: colors.textSecondary, fontSize: 14 },
  input: {
    height: 52, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border,
    paddingHorizontal: spacing.md, fontFamily: 'Outfit_400Regular', fontSize: 16,
    color: colors.textPrimary, backgroundColor: colors.white,
  },
  label: { fontFamily: 'Outfit_700Bold', fontSize: 14, color: colors.textSecondary, marginBottom: spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipSecondary: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  chipText: { fontFamily: 'Outfit_600SemiBold', fontSize: 13, color: colors.textPrimary },
  chipTextActive: { color: colors.white },
  error: { fontFamily: 'Outfit_400Regular', fontSize: 13, color: colors.secondary, marginTop: spacing.sm },
});
