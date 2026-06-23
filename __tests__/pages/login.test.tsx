import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../../pages/login";

jest.mock("next/router", () => ({
  useRouter: () => ({ push: jest.fn(), pathname: "/login" }),
}));

describe("Login Page", () => {
  it("renders correctly — email field, password field, and login button are present", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows both required errors when submitting an empty form", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  it("shows a format error when the email is invalid", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), "notanemail");
    await user.type(screen.getByLabelText(/password/i), "validpassword");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(
      screen.getByText("Enter a valid email address")
    ).toBeInTheDocument();
  });

  it("shows a length error when the password is shorter than 8 characters", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "short");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(
      screen.getByText("Password must be at least 8 characters")
    ).toBeInTheDocument();
  });

  it("clears a field's error when the user begins typing in it", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole("button", { name: /login/i }));
    expect(screen.getByText("Email is required")).toBeInTheDocument();

    await user.type(screen.getByLabelText(/email/i), "a");
    expect(screen.queryByText("Email is required")).not.toBeInTheDocument();
  });

  it("calls onSubmit with the credentials on a valid submission", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();
    render(<LoginPage onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
    });
  });

  it("clears the fields and errors when Reset is clicked", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      /password/i
    ) as HTMLInputElement;

    await user.type(emailInput, "notanemail");
    await user.type(passwordInput, "short");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
    expect(
      screen.getByText("Password must be at least 8 characters")
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /reset/i }));

    expect(emailInput.value).toBe("");
    expect(passwordInput.value).toBe("");
    expect(
      screen.queryByText("Enter a valid email address")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Password must be at least 8 characters")
    ).not.toBeInTheDocument();
  });

  it("validates on blur — blurring an empty email field shows the email error", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.click(emailInput);
    await user.tab();

    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(
      screen.queryByText("Password is required")
    ).not.toBeInTheDocument();
  });
});
