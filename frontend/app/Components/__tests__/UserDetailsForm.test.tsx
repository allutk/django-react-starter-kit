import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import UserDetailsForm from "../UserDetailsForm";
import { useAuth } from "~/Contexts/useAuth";
import {
  mockPatchUserDetails,
  mockUserDetails,
} from "~/Contexts/__mocks__/useAuth";

jest.mock("~/Contexts/useAuth", () => ({
  useAuth: jest.fn(),
}));

describe("UserDetailsForm", () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      userDetails: mockUserDetails,
      patchUserDetails: mockPatchUserDetails,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("prefills form with existing user details", async () => {
    render(<UserDetailsForm />);

    const firstName = await screen.findByPlaceholderText("First name");
    const lastName = await screen.findByPlaceholderText("Last name");

    expect((firstName as HTMLInputElement).value).toBe("John");
    expect((lastName as HTMLInputElement).value).toBe("Doe");
  });

  test("disables submit button when no details are changed", async () => {
    render(<UserDetailsForm />);

    const button = screen.getByText("Save") as HTMLButtonElement;
    expect(button).toBeDisabled();
  });

  test("enables submit button when details are changed and calls patchUserDetails on submit", async () => {
    render(<UserDetailsForm />);

    const firstName = screen.getByPlaceholderText(
      "First name"
    ) as HTMLInputElement;
    const button = screen.getByText("Save") as HTMLButtonElement;

    fireEvent.change(firstName, { target: { value: "Johnny" } });
    expect(button).not.toBeDisabled();

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockPatchUserDetails).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: "Johnny",
          lastName: "Doe",
          onFailCallback: expect.any(Function),
        })
      );
    });
  });

  test("shows error message if API returns error via onFailCallback", async () => {
    mockPatchUserDetails.mockImplementationOnce(async ({ onFailCallback }) => {
      onFailCallback({
        response: { data: { detail: "Something went wrong" } },
      });
    });

    render(<UserDetailsForm />);

    const firstName = screen.getByPlaceholderText("First name");
    fireEvent.change(firstName, { target: { value: "ErrorTest" } });

    fireEvent.click(screen.getByText("Save"));

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
  });
});
