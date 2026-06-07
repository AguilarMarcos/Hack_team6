import { Tabs } from 'expo-router';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MapPinned, Map, Route } from 'lucide-react-native';
import { colors, radius, shadow, spacing } from '../../src/theme/theme';
import { useAuth } from '../../src/context/AuthContext';

function TabBar({ state, descriptors, navigation }) {
  const { user } = useAuth();
  const isGuest = user?.role === 'guest';

  const allTabs = [
    { name: 'index', label: 'Descubre', Icon: MapPinned },
    { name: 'map', label: 'Mapa', Icon: Map },
    { name: 'routes', label: 'Rutas', Icon: Route },
  ];

  const tabs = isGuest ? allTabs.filter((t) => t.name !== 'routes') : allTabs;

  return (
    <View style={s.wrapper}>
      <View style={s.pill}>
        {tabs.map((tab) => {
          const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
          const isFocused = state.index === routeIndex;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: state.routes[routeIndex]?.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(tab.name);
            }
          };

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={onPress}
              activeOpacity={0.8}
              style={[s.tab, isFocused && s.tabActive]}
            >
              <tab.Icon size={20} color={isFocused ? colors.white : colors.textSecondary} />
              {isFocused && <Text style={s.tabLabel}>{tab.label}</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="map" />
      <Tabs.Screen name="routes" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const s = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  pill: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,253,248,0.92)',
    borderRadius: radius.full,
    padding: 6,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
    ...shadow.lg,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.full,
    minWidth: 52,
    gap: 6,
  },
  tabActive: { backgroundColor: colors.primary },
  tabLabel: { fontFamily: 'Outfit_700Bold', fontSize: 14, color: colors.white },
});
