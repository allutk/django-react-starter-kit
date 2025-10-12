import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import PasswordChangeForm from "../PasswordChangeForm";
import { useAuth } from "~/Contexts/useAuth";
import { mockUpdateUserPassword } from "~/Contexts/__mocks__/useAuth";

jest.mock("~/Contexts/useAuth", () => ({
  useAuth: jest.fn(),
}));

describe("PasswordChangeForm", () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      updateUserPassword: mockUpdateUserPassword,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("shows error when passwords do not match", async () => {
    render(<PasswordChangeForm />);

    fireEvent.change(screen.getByPlaceholderText("Current password"), {
      target: { value: "pass" },
    });
    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "pass123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm new password"), {
      target: { value: "pass456" },
    });

    fireEvent.click(screen.getByText("Save"));

    expect(
      await screen.findByText("The passwords do not match")
    ).toBeInTheDocument();
    expect(mockUpdateUserPassword).not.toHaveBeenCalled();
  });

  test("calls updateUserPassword with correct arguments when passwords match", async () => {
    render(<PasswordChangeForm />);

    fireEvent.change(screen.getByPlaceholderText("Current password"), {
      target: { value: "pass" },
    });
    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "pass123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm new password"), {
      target: { value: "pass123" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(mockUpdateUserPassword).toHaveBeenCalledWith(
        "pass",
        "pass123",
        "pass123",
        expect.any(Function),
        expect.any(Function)
      );
    });
  });

  test("disables submit button when fields are empty", async () => {
    render(<PasswordChangeForm />);
    const button = screen.getByText("Save") as HTMLButtonElement;
    expect(button).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText("Current password"), {
      target: { value: "pass" },
    });
    expect(button).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "pass123" },
    });
    expect(button).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText("Confirm new password"), {
      target: { value: "pass123" },
    });
    expect(button).not.toBeDisabled();
  });

  test("resets form after successful password change", async () => {
    mockUpdateUserPassword.mockImplementationOnce(
      async (
        _currentPassword,
        _newPassword,
        _confirmation,
        _onError,
        onSuccess
      ) => {
        onSuccess();
      }
    );

    render(<PasswordChangeForm />);

    const current = screen.getByPlaceholderText(
      "Current password"
    ) as HTMLInputElement;
    const newPass = screen.getByPlaceholderText(
      "New password"
    ) as HTMLInputElement;
    const confirm = screen.getByPlaceholderText(
      "Confirm new password"
    ) as HTMLInputElement;

    fireEvent.change(current, { target: { value: "pass" } });
    fireEvent.change(newPass, { target: { value: "pass123" } });
    fireEvent.change(confirm, { target: { value: "pass123" } });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(mockUpdateUserPassword).toHaveBeenCalled();
      expect(current.value).toBe("");
      expect(newPass.value).toBe("");
      expect(confirm.value).toBe("");
    });
  });

  test("shows API error message when updateUserPassword calls onError", async () => {
    mockUpdateUserPassword.mockImplementationOnce(
      async (
        _currentPassword,
        _newPassword,
        _confirmation,
        onError,
        _onSuccess
      ) => {
        onError({
          response: { data: { detail: "Provided password is incorrect" } },
        });
      }
    );

    render(<PasswordChangeForm />);

    fireEvent.change(screen.getByPlaceholderText("Current password"), {
      target: { value: "pass" },
    });
    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "pass123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm new password"), {
      target: { value: "pass123" },
    });

    fireEvent.click(screen.getByText("Save"));

    expect(
      await screen.findByText("Provided password is incorrect")
    ).toBeInTheDocument();
  });
});
