import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App Smoke Test", () => {
  it("renders the main application without crashing", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );

    expect(document.body).toBeTruthy();
  });
});
