import { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";

import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export const ONBOARDING_SUCCESS_DELAY_MS = 5000;

export function OnboardingProgressButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  const { direction } = useLanguage();
  const progress = useRef(new Animated.Value(0)).current;
  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  useEffect(() => {
    const animation = Animated.timing(progress, {
      duration: ONBOARDING_SUCCESS_DELAY_MS,
      toValue: 1,
      useNativeDriver: false,
    });

    animation.start();

    return () => animation.stop();
  }, [progress]);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={{
        minHeight: 52,
        overflow: "hidden",
        justifyContent: "center",
        borderRadius: 18,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: colors.action,
        backgroundColor: colors.surfaceElevated,
      }}
    >
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          alignItems: direction === "rtl" ? "flex-end" : "flex-start",
        }}
      >
        <Animated.View
          style={{
            width,
            height: "100%",
            backgroundColor: colors.actionSoft,
          }}
        />
      </View>
      <Text
        style={{
          ...typography.bodyMedium,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          color: colors.actionPressed,
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
