import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Text, View } from "react-native";

import type { BadgeTone } from "@/features/badges/badge-definitions";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

function getToneColor(tone: BadgeTone, colors: ReturnType<typeof useThemeColors>) {
  switch (tone) {
    case "chapter":
      return colors.action;
    case "goal":
      return colors.accentRose;
    case "savings":
      return colors.accentSavings;
    case "time":
      return colors.accentTime;
    case "warm":
      return colors.accentWarm;
  }
}

export function BadgeIcon({
  fallback,
  icon,
  isUnlocked,
  tone,
}: {
  fallback: string;
  icon: SymbolViewProps["name"];
  isUnlocked: boolean;
  tone: BadgeTone;
}) {
  const colors = useThemeColors();
  const toneColor = getToneColor(tone, colors);

  return (
    <View
      style={{
        width: 42,
        height: 42,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        borderWidth: 1,
        borderColor: isUnlocked ? toneColor : colors.border,
        backgroundColor: isUnlocked ? colors.actionSoft : colors.surfaceMuted,
        opacity: isUnlocked ? 1 : 0.76,
      }}
    >
      <View
        style={{
          width: 30,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 999,
          backgroundColor: isUnlocked ? colors.surfaceElevated : colors.surface,
        }}
      >
        <SymbolView
          name={isUnlocked ? icon : { ios: "lock.fill", android: "lock", web: "lock" }}
          size={17}
          tintColor={isUnlocked ? toneColor : colors.textMuted}
          fallback={
            <Text
              style={{
                ...typography.caption,
                color: isUnlocked ? toneColor : colors.textMuted,
                textAlign: "center",
              }}
            >
              {isUnlocked ? fallback : "L"}
            </Text>
          }
        />
      </View>
      {isUnlocked ? (
        <View
          style={{
            position: "absolute",
            right: spacing.xxs,
            bottom: spacing.xxs,
            width: 14,
            height: 14,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            backgroundColor: toneColor,
          }}
        >
          <SymbolView
            name={{
              ios: "checkmark",
              android: "check",
              web: "check",
            }}
            size={10}
            tintColor={colors.actionText}
            fallback={
              <Text
                style={{
                  fontSize: 8,
                  lineHeight: 10,
                  color: colors.actionText,
                  textAlign: "center",
                }}
              >
                OK
              </Text>
            }
          />
        </View>
      ) : null}
    </View>
  );
}
