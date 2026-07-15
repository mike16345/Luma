import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

describe("theme primitives", () => {
  it("defines calm app colors, spacing, and readable typography", () => {
    expect(colors.background).toBe("#F7F5F0");
    expect(colors.action).toBe("#4E7468");
    expect(spacing.screen).toBe(20);
    expect(typography.title.fontSize).toBe(24);
  });
});
