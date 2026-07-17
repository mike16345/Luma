import { PropsWithChildren } from "react";
import {
  ScrollView,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { gradientStyle, gradients } from "@/theme/gradients";
import { spacing } from "@/theme/spacing";
import { useTheme } from "@/theme/theme-context";

type ScreenProps = PropsWithChildren<
  Pick<ScrollViewProps, "refreshControl"> & {
    allowRefresh?: boolean;
    contentContainerStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
  }
>;

export function Screen({
  allowRefresh = false,
  children,
  contentContainerStyle,
  refreshControl,
  style,
}: ScreenProps) {
  const { colors, resolvedTheme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={allowRefresh ? refreshControl : undefined}
      style={[
        {
          backgroundColor: colors.background,
          ...gradientStyle(
            resolvedTheme === "dark"
              ? gradients.appBackgroundDark
              : gradients.appBackground
          ),
        },
        style,
      ]}
      contentContainerStyle={[
        {
          flexGrow: 1,
          padding: spacing.screen,
          paddingTop: spacing.xl + insets.top,
          paddingBottom: spacing.xxl + insets.bottom + spacing.md,
          gap: spacing.xl,
        },
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  );
}
