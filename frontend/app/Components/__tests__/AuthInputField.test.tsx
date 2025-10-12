import { render, screen, fireEvent } from "@testing-library/react";
import type { UseFormRegister, UseFormRegisterReturn } from "react-hook-form";

import AuthInputField from "../AuthInputField";

describe("AuthInputField", () => {
  const mockRegister: UseFormRegister<any> = (<TFieldName extends string>(
    name: TFieldName
  ): UseFormRegisterReturn<TFieldName> => ({
    name,
    onChange: jest.fn(),
    onBlur: jest.fn(),
    ref: jest.fn(),
  })) as UseFormRegister<any>;

  test("renders input with placeholder and icon", () => {
    render(
      <AuthInputField
        fieldName="email"
        type="email"
        placeholder="example@mail.com"
        icon="mail"
        register={mockRegister}
      />
    );

    expect(screen.getByPlaceholderText("example@mail.com")).toBeInTheDocument();
    expect(screen.getByText("mail")).toBeInTheDocument();
  });

  test("shows error message when provided", () => {
    render(
      <AuthInputField
        register={mockRegister}
        fieldName="email"
        type="email"
        placeholder="example@mail.com"
        icon="mail"
        error={{ message: "Invalid email", type: "validate" } as any}
      />
    );

    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });

  test("toggles password visibility when clicking icon", () => {
    render(
      <AuthInputField
        register={mockRegister}
        fieldName="password"
        type="password"
        placeholder="Password"
        icon="lock"
      />
    );

    const input = screen.getByPlaceholderText("Password") as HTMLInputElement;
    const toggleButton = screen.getByText("visibility_off");

    expect(input.type).toBe("password");

    fireEvent.click(toggleButton);

    expect(input.type).toBe("text");
    expect(screen.getByText("visibility")).toBeInTheDocument();
  });
});
