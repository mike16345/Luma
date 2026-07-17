import { Text } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import { useLanguage } from "@/i18n/language-context";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

export function HistoryEmptyState() {
  const { t, textAlign } = useLanguage();

  return (
    <SectionCard title={t("history.noChaptersYet")}>
      <Text
        selectable
        style={{
          ...typography.body,
          color: colors.textSecondary,
          textAlign,
        }}
      >
        {t("history.emptyMessage")}
      </Text>
    </SectionCard>
  );
}
