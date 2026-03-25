import { ref } from "vue";
import type { ToastMessage, ToastType } from "../types/toast";

const AUTO_DISMISS_MS = 2800;

export const useToasts = () => {
  const toasts = ref<ToastMessage[]>([]);

  const removeToast = (toastId: number) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== toastId);
  };

  const pushToast = (text: string, type: ToastType) => {
    const toastId = Date.now() + Math.floor(Math.random() * 1000);
    toasts.value.push({ id: toastId, text, type });

    window.setTimeout(() => {
      removeToast(toastId);
    }, AUTO_DISMISS_MS);
  };

  return {
    toasts,
    pushToast,
    removeToast,
  };
};
