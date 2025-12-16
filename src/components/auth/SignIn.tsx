"use client";

import { useState } from "react";
import styles from "./SignIn.module.css";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useScrollLock } from "@/hooks/useScrollLock";
import { showToast } from "../feedback/Toast";

interface SignInProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignIn({ isOpen, onClose }: SignInProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const { t } = useLanguage();
  useScrollLock(isOpen);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      const message = t("emailPasswordRequired");
      setError(message);
      setLoading(false);
      return;
    }

    try {
      await signIn(email, password);
      showToast(t("signedInSuccessfully"), "success");
      setEmail("");
      setPassword("");
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : t("signInFailed");
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim() || !confirmPassword.trim() || !name.trim()) {
      const message = t("allFieldsRequired");
      setError(message);
      return;
    }

    if (password !== confirmPassword) {
      const message = t("passwordsDoNotMatch");
      setError(message);
      return;
    }

    if (password.length < 6) {
      const message = t("passwordTooShort");
      setError(message);
      return;
    }

    setLoading(true);

    try {
      await signIn(email, password);
      showToast(t("accountCreated"), "success");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : t("signUpFailed");
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSignUp(!isSignUp);
    setError("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div className={styles.overlay} onClick={handleOverlayClick} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{isSignUp ? t("signUp") : t("signIn")}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label={t("close")}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className={styles.form}>
          {isSignUp && (
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>{t("fullName")}</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("fullNamePlaceholder")}
                className={styles.input}
                required
                disabled={loading}
                autoComplete="name"
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>{t("email")}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className={styles.input}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>{t("password")}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
              className={styles.input}
              required
              disabled={loading}
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
          </div>

          {isSignUp && (
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>{t("confirmPassword")}</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("confirmPasswordPlaceholder")}
                className={styles.input}
                required
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (isSignUp ? t("creatingAccount") : t("signingIn")) : (isSignUp ? t("signUp") : t("signIn"))}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            {isSignUp ? t("alreadyHaveAccount") : t("dontHaveAccount")}{" "}
            <button
              type="button"
              className={styles.link}
              onClick={toggleMode}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              {isSignUp ? t("signIn") : t("createOne")}
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
