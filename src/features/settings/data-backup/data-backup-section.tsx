import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { SectionCard } from "@/components/ui/section-card";
import { useDataBackup } from "@/features/settings/data-backup/use-data-backup";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function DataBackupSection({
  onImportComplete,
}: {
  onImportComplete?: () => Promise<void>;
}) {
  const colors = useThemeColors();
  const { t, textAlign } = useLanguage();
  const {
    errorMessage,
    exportBackup,
    importBackup,
    isExporting,
    isImporting,
    successMessage,
  } = useDataBackup(onImportComplete);

  return (
    <SectionCard
      eyebrow={t("settings.dataBackupEyebrow")}
      title={t("settings.dataBackupTitle")}
    >
      <View style={{ gap: spacing.sm }}>
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.textSecondary,
            textAlign,
          }}
        >
          {t("settings.dataBackupDescription")}
        </Text>
        <Text
          selectable
          style={{
            ...typography.caption,
            color: colors.textMuted,
            textAlign,
          }}
        >
          {t("settings.importBackupWarning")}
        </Text>
      </View>

      <View style={{ gap: spacing.sm }}>
        <NativeActionButton
          disabled={isExporting || isImporting}
          label={
            isExporting
              ? t("settings.exportingBackup")
              : t("settings.exportBackup")
          }
          onPress={exportBackup}
          variant="outlined"
        />
        <NativeActionButton
          disabled={isExporting || isImporting}
          label={
            isImporting
              ? t("settings.importingBackup")
              : t("settings.importBackup")
          }
          onPress={importBackup}
          variant="outlined"
        />
      </View>

      {successMessage ? (
        <Text
          selectable
          style={{
            ...typography.caption,
            color: colors.action,
            textAlign,
          }}
        >
          {successMessage}
        </Text>
      ) : null}
      {errorMessage ? (
        <Text
          selectable
          style={{
            ...typography.caption,
            color: colors.slip,
            textAlign,
          }}
        >
          {errorMessage}
        </Text>
      ) : null}
    </SectionCard>
  );
}
