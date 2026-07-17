import { Tabs } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Text, type ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLanguage } from "@/i18n/language-context";
import { useTheme } from "@/theme/theme-context";

const tabIcons = {
  index: { ios: "house", android: "home", web: "home" },
  history: {
    ios: "clock.arrow.circlepath",
    android: "history",
    web: "history",
  },
  insights: {
    ios: "chart.bar.xaxis",
    android: "insights",
    web: "insights",
  },
  settings: { ios: "gearshape", android: "settings", web: "settings" },
} satisfies Record<string, SymbolViewProps["name"]>;

function TabIcon({
  color,
  name,
}: {
  color: ColorValue;
  name: keyof typeof tabIcons;
}) {
  return (
    <SymbolView
      name={tabIcons[name]}
      size={24}
      tintColor={color}
      fallback={
        <Text
          style={{
            color,
            fontSize: 20,
            lineHeight: 24,
            textAlign: "center",
          }}
        >
          {name === "index"
            ? "H"
            : name === "history"
              ? "T"
              : name === "insights"
                ? "i"
                : "S"}
        </Text>
      }
    />
  );
}

export default function TabLayout() {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.action,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color }) => <TabIcon color={color} name="index" />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t("tabs.history"),
          tabBarIcon: ({ color }) => <TabIcon color={color} name="history" />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: t("tabs.insights"),
          tabBarIcon: ({ color }) => <TabIcon color={color} name="insights" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabs.settings"),
          tabBarIcon: ({ color }) => <TabIcon color={color} name="settings" />,
        }}
      />
    </Tabs>
  );
}
