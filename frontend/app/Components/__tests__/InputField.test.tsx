import { render, screen, fireEvent } from "@testing-library/react";
import type { UseFormRegister, UseFormRegisterReturn } from "react-hook-form";

import InputField from "../InputField";

describe("InputField", () => {
  const mockRegister: UseFormRegister<any> = (<TFieldName extends string>(
    name: TFieldName
  ): UseFormRegisterReturn<TFieldName> => ({
    name,
    onChange: jest.fn(),
    onBlur: jest.fn(),
    ref: jest.fn(),
  })) as UseFormRegister<any>;

  test("renders title and input field", () => {
    render(
      <InputField
        register={mockRegister}
        fieldName="firstName"
        title="First Name"
        type="text"
      />
    );

    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
  });

  test("renders disabled input when disabled is true", () => {
    render(
      <InputField
        register={mockRegister}
        fieldName="email"
        title="Email"
        type="email"
        disabled={true}
      />
    );

    const input = screen.getByPlaceholderText("Email") as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.className).toContain("bg-gray-100");
  });

  test("toggles password visibility when clicking icon", () => {
    render(
      <InputField
        register={mockRegister}
        fieldName="password"
        title="Password"
        type="password"
      />
    );

    const input = screen.getByPlaceholderText("Password") as HTMLInputElement;
    const toggleButton = screen.getByText("visibility_off");

    expect(input.type).toBe("password");

    fireEvent.click(toggleButton);

    expect(input.type).toBe("text");
    expect(screen.getByText("visibility")).toBeInTheDocument();
  });

  test("displays error message when error is provided", () => {
    render(
      <InputField
        register={mockRegister}
        fieldName="email"
        title="Email"
        type="email"
        error={{ message: "Invalid email", type: "validate" } as any}
      />
    );

    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });
});
