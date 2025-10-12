import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import RegisterForm from "../RegisterForm";
import { useAuth } from "~/Contexts/useAuth";
import { mockRegisterUser } from "~/Contexts/__mocks__/useAuth";

jest.mock("~/Contexts/useAuth", () => ({
  useAuth: jest.fn(),
}));

describe("RegisterForm", () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      registerUser: mockRegisterUser,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders email, password, confirm password fields and submit button", () => {
    render(<RegisterForm />);

    expect(screen.getByPlaceholderText("example@mail.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm password")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  test("disables submit button when fields are empty", () => {
    render(<RegisterForm />);
    const button = screen.getByText("Sign Up");
    expect(button).toBeDisabled();
  });

  test("shows validation error when passwords do not match", async () => {
    render(<RegisterForm />);

    fireEvent.change(screen.getByPlaceholderText("example@mail.com"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "pass123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "pass456" },
    });

    fireEvent.click(screen.getByText("Sign Up"));

    expect(
      await screen.findAllByText("The passwords do not match")
    ).toHaveLength(2);
    expect(mockRegisterUser).not.toHaveBeenCalled();
  });

  test("calls registerUser with correct values when form is valid", async () => {
    render(<RegisterForm />);

    fireEvent.change(screen.getByPlaceholderText("example@mail.com"), {
      target: { value: "valid@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "pass123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "pass123" },
    });

    fireEvent.click(screen.getByText("Sign Up"));

    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledWith(
        "valid@example.com",
        "pass123",
        expect.any(Function)
      );
    });
  });

  test("shows error message when registerUser triggers an API error", async () => {
    mockRegisterUser.mockImplementationOnce(
      async (_email, _password, onError) => {
        onError({ response: { data: { detail: "Email already taken" } } });
      }
    );

    render(<RegisterForm />);

    fireEvent.change(screen.getByPlaceholderText("example@mail.com"), {
      target: { value: "duplicate@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "pass123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "pass123" },
    });

    fireEvent.click(screen.getByText("Sign Up"));

    expect(await screen.findByText("Email already taken")).toBeInTheDocument();
  });

  test("shows fallback error when error has no response.data.detail", async () => {
    mockRegisterUser.mockImplementationOnce(
      async (_email, _password, onError) => {
        onError({ message: "Network error" });
      }
    );

    render(<RegisterForm />);

    fireEvent.change(screen.getByPlaceholderText("example@mail.com"), {
      target: { value: "any@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "pass123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "pass123" },
    });

    fireEvent.click(screen.getByText("Sign Up"));

    expect(await screen.findByText("Network error")).toBeInTheDocument();
  });
});
