import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import styles from "../styles/Login.module.css";

interface ILoginPageProps {
  onSubmit?: (credentials: { email: string; password: string }) => void;
}

interface IFormErrors {
  email?: string;
  password?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (value: string): string | undefined => {
  if (value.trim() === "") {
    return "Email is required";
  }
  if (!EMAIL_PATTERN.test(value)) {
    return "Enter a valid email address";
  }
  return undefined;
};

const validatePassword = (value: string): string | undefined => {
  if (value === "") {
    return "Password is required";
  }
  if (value.length < 8) {
    return "Password must be at least 8 characters";
  }
  return undefined;
};

const LoginPage: NextPage<ILoginPageProps> = ({ onSubmit }) => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [errors, setErrors] = React.useState<IFormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const handleEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEmail(event.target.value);
    if (errors.email !== undefined) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPassword(event.target.value);
    if (errors.password !== undefined) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleEmailBlur = (): void => {
    setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
  };

  const handlePasswordBlur = (): void => {
    setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
  };

  const handleSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError !== undefined || passwordError !== undefined) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await Promise.resolve(onSubmit?.({ email, password }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login to your account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Login</h1>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={styles.input}
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                aria-invalid={errors.email !== undefined}
                aria-describedby={
                  errors.email !== undefined ? "email-error" : undefined
                }
                required
              />
              {errors.email !== undefined && (
                <p id="email-error" className={styles.error} role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={styles.input}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                aria-invalid={errors.password !== undefined}
                aria-describedby={
                  errors.password !== undefined ? "password-error" : undefined
                }
                required
              />
              {errors.password !== undefined && (
                <p id="password-error" className={styles.error} role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className={styles.button}
              disabled={isSubmitting}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
