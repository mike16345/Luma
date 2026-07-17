import { Text } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import { useLanguage } from "@/i18n/language-context";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

export function InsightsEmptyState() {
  const { t, textAlign } = useLanguage();

  return (
    <SectionCard title={t("insights.noInsightDataYet")}>
      <Text
        selectable
        style={{
          ...typography.body,
          color: colors.textSecondary,
          textAlign,
        }}
      >
        {t("insights.emptyMessage")}
      </Text>
    </SectionCard>
  );
}
