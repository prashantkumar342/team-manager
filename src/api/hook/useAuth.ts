import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import axios from "../../lib/axios";

export const useRegisterAuth = () => {
  const register = async (name: string, email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    if (!cred.user.emailVerified) {
      await sendEmailVerification(cred.user);
    }

    // store name temporarily in displayName (Firebase)
    await updateProfile(cred.user, { displayName: name });

    return {
      message: "Verification email sent.",
      description: "Please verify email before login.",
    };
  };

  return { register };
};

export const useLoginAuth = () => {
  const login = async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);

    if (!credential.user.emailVerified) {
      throw new Error("Email not verified");
    }

    const token = await credential.user.getIdToken();

    const res = await axios.post(
      "/auth/sync-user",
      {
        email,
        uid: credential.user.uid,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      },
    );

    return res;
  };

  return { login };
};
