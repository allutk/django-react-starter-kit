import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import LoginForm from "../LoginForm";
import { useAuth } from "~/Contexts/useAuth";
import { mockLoginUser } from "~/Contexts/__mocks__/useAuth";

jest.mock("~/Contexts/useAuth", () => ({
  useAuth: jest.fn(),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      loginUser: mockLoginUser,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders email, password and submit button", () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText("example@mail.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Log In")).toBeInTheDocument();
  });

  test("disables submit button when fields are empty", () => {
    render(<LoginForm />);
    const button = screen.getByText("Log In");
    expect(button).toBeDisabled();
  });

  test("calls loginUser when form is submitted with valid inputs", async () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("example@mail.com");
    const passwordInput = screen.getByPlaceholderText("Password");
    const button = screen.getByText("Log In");

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "pass123" } });

    expect(button).not.toBeDisabled();

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith(
        "user@example.com",
        "pass123",
        expect.any(Function)
      );
    });
  });

  test("shows error message when loginUser triggers an error", async () => {
    mockLoginUser.mockImplementationOnce(async (_email, _password, onError) => {
      onError({ response: { data: { detail: "Invalid credentials" } } });
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("example@mail.com"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByText("Log In"));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });

  test("shows fallback error when error has no response.data.detail", async () => {
    mockLoginUser.mockImplementationOnce(async (_email, _password, onError) => {
      onError({ message: "Network error" });
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("example@mail.com"), {
      target: { value: "any@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "pass123" },
    });

    fireEvent.click(screen.getByText("Log In"));

    expect(await screen.findByText("Network error")).toBeInTheDocument();
  });
});
