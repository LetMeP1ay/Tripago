import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import Header from "@/components/Header";
import { AuthContext } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  signOut: jest.fn(),
}));

jest.mock("../../firebase-config", () => ({
  auth: {},
}));

function resizeWindow(width: number) {
  window.innerWidth = width;
  window.dispatchEvent(new Event("resize"));
}

describe('Header Component', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });

    (usePathname as jest.Mock).mockReturnValue("/");
  });

  test("renders correctly in desktop view", async () => {
    resizeWindow(1024);

    jest.useFakeTimers();

    render(
      <AuthContext.Provider value={{ user: null }}>
        <Header />
      </AuthContext.Provider>
    );

    act(() => {
      jest.advanceTimersByTime(800);
    });

    await waitFor(() => {
      expect(screen.getByAltText("Tripago Logo")).toBeInTheDocument();
    });

    expect(screen.getByText("Hotels")).toBeInTheDocument();
    expect(screen.getByText("Flights")).toBeInTheDocument();
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Map")).toBeInTheDocument();
    expect(screen.getByText("Cart")).toBeInTheDocument();
    expect(screen.getByText("Signup")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /notifications/i })
    ).toBeInTheDocument();

    jest.useRealTimers();
  });

  test("renders correctly in mobile view", async () => {
    resizeWindow(375);

    jest.useFakeTimers();

    render(
      <AuthContext.Provider value={{ user: null }}>
        <Header />
      </AuthContext.Provider>
    );

    act(() => {
      jest.advanceTimersByTime(800);
    });

    await waitFor(() => {
      expect(screen.getByAltText("Tripago Logo")).toBeInTheDocument();
    });

    expect(screen.getByText("Hotels")).toBeInTheDocument();
    expect(screen.getByText("Flights")).toBeInTheDocument();
    expect(screen.getByText("Food")).toBeInTheDocument();

    expect(screen.queryByText("Map")).not.toBeInTheDocument();
    expect(screen.queryByText("Cart")).not.toBeInTheDocument();
    expect(screen.queryByText("Signup")).not.toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /notifications/i })
    ).toBeInTheDocument();

    jest.useRealTimers();
  });
});
