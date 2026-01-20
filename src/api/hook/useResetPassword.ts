import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { mapFirebaseAuthError } from '@/utils/firebaseError';

export const useResetPassword = () => {
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        message: 'Reset link sent',
        description: 'Check your email to reset your password.',
      };
    } catch (error: unknown) {
      throw mapFirebaseAuthError(error);
    }
  };

  return { resetPassword };
};
