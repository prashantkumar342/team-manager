import type { ConfirmOptions } from '@/provider/ConfirmProvider';
import { createContext } from 'react';

type ConfirmContextType = {
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
};

export const ConfirmContext = createContext<ConfirmContextType | null>(null);
