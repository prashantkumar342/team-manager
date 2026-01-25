import { useState } from 'react';
import ConfirmModal from '@/components/ConfirmModal';
import { ConfirmContext } from '@/context/confirm.context';

export type ConfirmOptions = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  loading?: boolean;
};

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<(value: boolean) => void>();

  const confirm = (opts: ConfirmOptions) =>
    new Promise<boolean>((resolve) => {
      setOptions(opts);
      setResolver(() => resolve);
    });

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {options && (
        <ConfirmModal
          open
          onOpenChange={() => {
            resolver?.(false);
            setOptions(null);
          }}
          title={options.title}
          description={options.description}
          confirmText={options.confirmText ?? 'Confirm'}
          cancelText={options.cancelText}
          showCancel={options.showCancel}
          loading={options.loading}
          onConfirm={() => {
            resolver?.(true);
            setOptions(null);
          }}
        />
      )}
    </ConfirmContext.Provider>
  );
}
