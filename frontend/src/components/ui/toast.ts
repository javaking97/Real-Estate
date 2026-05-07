import { toast } from 'sonner';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export function showToast(message: string, type: ToastType = 'success') {
  toast[type](message);
}
