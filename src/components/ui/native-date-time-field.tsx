import { NativeTextField } from "@/components/ui/native-text-field";

export function NativeDateTimeField({
  error,
  label,
  onChangeValue,
  value,
}: {
  error?: string;
  label: string;
  maximumDate?: Date;
  minimumDate?: Date;
  onChangeValue: (value: string) => void;
  value: string;
}) {
  return (
    <NativeTextField
      label={label}
      value={value}
      onChangeText={onChangeValue}
      placeholder="YYYY-MM-DDTHH:mm"
      error={error}
    />
  );
}
