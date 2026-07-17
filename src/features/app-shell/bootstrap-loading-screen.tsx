import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function BootstrapLoadingScreen() {
  const colors = useThemeColors();
  const { t, textAlign } = useLanguage();
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        duration: 360,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        duration: 360,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: spacing.screen,
        paddingTop: spacing.screen + insets.top,
        paddingBottom: spacing.screen + insets.bottom,
        backgroundColor: colors.background,
      }}
    >
      <Animated.View
        style={{
          gap: spacing.md,
          opacity,
          transform: [{ translateY }],
        }}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            borderCurve: "continuous",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.heroSurface,
          }}
        >
          <Text
            style={{
              ...typography.title,
              color: colors.heroText,
            }}
          >
            L
          </Text>
        </View>
        <View style={{ gap: spacing.xs }}>
          <Text
            style={{
              ...typography.title,
              color: colors.textPrimary,
              textAlign,
            }}
          >
            {t("common.openingLuma")}
          </Text>
          <Text
            style={{
              ...typography.body,
              color: colors.textSecondary,
              textAlign,
            }}
          >
            {t("common.checkingPrivateProgress")}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
