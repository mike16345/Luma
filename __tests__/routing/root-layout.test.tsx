import { screen, waitFor } from "@testing-library/react-native";
import { renderRouter } from "expo-router/testing-library";
import type { ReactNode } from "react";

jest.mock("@/lib/storage/local-preferences", () => ({
  preferencesStorage: {
    getBoolean: jest.fn((_key: string, fallback: boolean) => fallback),
    getString: jest.fn((_key: string, fallback: string) => fallback),
    setBoolean: jest.fn(),
    setString: jest.fn(),
  },
}));

jest.mock("@/db/repositories/chapter-repository", () => ({
  chapterRepository: {
    getActiveChapter: jest.fn(async () => null),
    listChapters: jest.fn(async () => []),
  },
}));

jest.mock("@/features/onboarding/start-chapter-form", () => {
  const { Text } = require("react-native");

  return {
    StartChapterForm: () => <Text>Onboarding form</Text>,
  };
});

jest.mock("@/features/privacy/privacy-lock-context", () => ({
  PrivacyLockProvider: ({ children }: { children: ReactNode }) => children,
}));

jest.mock("@/features/reminders/reminder-service", () => ({
  configureNotificationHandling: jest.fn(),
}));

describe("root route shell", () => {
  it("routes a clean install to onboarding", async () => {
    renderRouter("./app", { initialUrl: "/" });

    await waitFor(() => {
      expect(
        screen.getByText("Start the chapter you want to protect.")
      ).toBeTruthy();
    });
  });
});
