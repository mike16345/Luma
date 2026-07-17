import { PropsWithChildren } from "react";
import {
  ScrollView,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";

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
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={allowRefresh ? refreshControl : undefined}
      style={[{ backgroundColor: colors.background }, style]}
      contentContainerStyle={[
        {
          flexGrow: 1,
          padding: spacing.screen,
          paddingTop: spacing.screen + insets.top,
          paddingBottom: spacing.xxl + insets.bottom + spacing.md,
          gap: spacing.lg,
        },
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  );
}
