import { PropsWithChildren } from "react";
import { ScrollView } from "react-native";

export function Screen({ children }: PropsWithChildren) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ flexGrow: 1, padding: 20, gap: 16 }}
    >
      {children}
    </ScrollView>
  );
}
