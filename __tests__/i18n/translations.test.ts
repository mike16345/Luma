import { translate } from "@/i18n/translations";

describe("translations", () => {
  it("returns readable Hebrew strings", () => {
    expect(translate("he", "settings.languageTitle")).toBe(
      "שפת האפליקציה"
    );
  });

  it("interpolates values in translated copy", () => {
    expect(
      translate("he", "goal.amountInCurrency", { currencyCode: "ILS" })
    ).toBe("סכום ב-ILS");
  });
});
