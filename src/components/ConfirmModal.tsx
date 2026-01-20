import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type ConfirmModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description?: string;

  confirmText: string;
  cancelText?: string;

  onConfirm: () => void;
  onCancel?: () => void;

  showCancel?: boolean;
  loading?: boolean;
};

const ConfirmModal = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText,
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  showCancel = true,
  loading = false,
}: ConfirmModalProps) => {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="flex justify-end gap-2 pt-4">
          {showCancel && (
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              {cancelText}
            </Button>
          )}

          <Button onClick={handleConfirm} disabled={loading}>
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;
