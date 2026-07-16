import { PropsWithChildren } from "react";
import {
  ScrollView,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

type ScreenProps = PropsWithChildren<
  Pick<ScrollViewProps, "refreshControl"> & {
    contentContainerStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
  }
>;

export function Screen({
  children,
  contentContainerStyle,
  refreshControl,
  style,
}: ScreenProps) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={refreshControl}
      style={[{ backgroundColor: colors.background }, style]}
      contentContainerStyle={[
        {
          flexGrow: 1,
          padding: spacing.screen,
          paddingBottom: spacing.xxl,
          gap: spacing.lg,
        },
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  );
}
