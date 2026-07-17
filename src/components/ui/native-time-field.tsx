import { NativeTextField } from "@/components/ui/native-text-field";

export function NativeTimeField({
  error,
  label,
  onChangeValue,
  value,
}: {
  error?: string;
  label: string;
  onChangeValue: (value: string) => void;
  value: string;
}) {
  return (
    <NativeTextField
      label={label}
      value={value}
      onChangeText={onChangeValue}
      placeholder="20:00"
      keyboardType="numbers-and-punctuation"
      error={error}
    />
  );
}
