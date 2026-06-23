import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../../pages/login";

jest.mock("next/router", () => ({
  useRouter: () => ({ push: jest.fn(), pathname: "/login" }),
}));

describe("Login Page", () => {
  it("renders correctly — email, password, confirm password fields, and login button are present", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows all required errors when submitting an empty form", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(
      screen.getByText("Please confirm your password")
    ).toBeInTheDocument();
  });

  it("shows a format error when the email is invalid", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "notanemail");
    await user.type(screen.getByLabelText("Password"), "validpassword");
    await user.type(screen.getByLabelText("Confirm Password"), "validpassword");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(
      screen.getByText("Enter a valid email address")
    ).toBeInTheDocument();
  });

  it("shows a length error when the password is shorter than 8 characters", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "short");
    await user.type(screen.getByLabelText("Confirm Password"), "short");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(
      screen.getByText("Password must be at least 8 characters")
    ).toBeInTheDocument();
  });

  it("shows a mismatch error when confirm password does not match password", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm Password"), "password999");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });

  it("clears a field's error when the user begins typing in it", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole("button", { name: /login/i }));
    expect(screen.getByText("Email is required")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Email"), "a");
    expect(screen.queryByText("Email is required")).not.toBeInTheDocument();
  });

  it("calls onSubmit with the credentials on a valid submission", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();
    render(<LoginPage onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm Password"), "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
  });

  it("validates on blur — blurring an empty email field shows the email error", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByLabelText("Email");
    await user.click(emailInput);
    await user.tab();

    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(
      screen.queryByText("Password is required")
    ).not.toBeInTheDocument();
  });
});
