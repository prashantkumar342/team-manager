import { FirebaseError } from "firebase/app";

export type AuthErrorPayload = {
  message: string;
  description?: string;
};

export const mapFirebaseAuthError = (error: unknown): AuthErrorPayload => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      /* -------- LOGIN ERRORS -------- */
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return {
          message: "Invalid credentials",
          description: "The email or password you entered is incorrect.",
        };

      case "auth/email-not-verified":
        return {
          message: "Email not verified",
          description: "Please verify your email before logging in.",
        };

      /* -------- REGISTER ERRORS -------- */
      case "auth/email-already-in-use":
        return {
          message: "Email already registered",
          description:
            "An account with this email already exists. Please login.",
        };

      case "auth/weak-password":
        return {
          message: "Weak password",
          description: "Password should be at least 6 characters long.",
        };

      case "auth/invalid-email":
        return {
          message: "Invalid email",
          description: "Please enter a valid email address.",
        };

      /* -------- COMMON ERRORS -------- */
      case "auth/too-many-requests":
        return {
          message: "Too many attempts",
          description: "Too many attempts. Please try again later.",
        };

      case "auth/network-request-failed":
        return {
          message: "Network error",
          description: "Please check your internet connection and try again.",
        };

      default:
        return {
          message: "Authentication failed",
          description: "Something went wrong. Please try again.",
        };
    }
  }

  return {
    message: "Authentication failed",
    description: "Something went wrong. Please try again.",
  };
};
