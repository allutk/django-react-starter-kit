import { render, screen, fireEvent } from "@testing-library/react";

import SubmitButton from "../SubmitButton";

describe("SubmitButton", () => {
  test("renders button text", () => {
    render(<SubmitButton text="Submit" />);
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  test("applies disabled styles and attribute when disabled", () => {
    render(<SubmitButton text="Submit" disabled={true} />);
    const button = screen.getByText("Submit") as HTMLButtonElement;

    expect(button).toBeDisabled();
    expect(button.className).toContain("cursor-not-allowed");
    expect(button.className).toContain("opacity-60");
  });

  test("calls onClick when enabled", () => {
    const handleClick = jest.fn();
    render(<SubmitButton text="Submit" onClick={handleClick} />);
    const button = screen.getByText("Submit");

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("does not call onClick when disabled", () => {
    const handleClick = jest.fn();
    render(
      <SubmitButton text="Submit" onClick={handleClick} disabled={true} />
    );
    const button = screen.getByText("Submit");

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test("applies extraClassName when provided", () => {
    render(<SubmitButton text="Submit" extraClassName="bg-blue-500" />);
    const button = screen.getByText("Submit");
    expect(button.className).toContain("bg-blue-500");
  });
});
