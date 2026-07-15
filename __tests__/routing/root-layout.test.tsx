import { screen } from "@testing-library/react-native";
import { renderRouter } from "expo-router/testing-library";

describe("root route shell", () => {
  it("renders the Home tab placeholder", () => {
    renderRouter("./app", { initialUrl: "/" });

    expect(screen.getAllByText("Home").length).toBeGreaterThan(0);
  });
});
