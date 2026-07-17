import { screen, waitFor } from "@testing-library/react-native";
import { renderRouter } from "expo-router/testing-library";

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

describe("root route shell", () => {
  it("routes a clean install to onboarding", async () => {
    renderRouter("./app", { initialUrl: "/" });

    await waitFor(() => {
      expect(screen.getByText("Start the chapter you want to protect.")).toBeTruthy();
    });
  });
});
