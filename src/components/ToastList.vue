<script setup lang="ts">
import type { ToastMessage } from "../types/toast";

defineProps<{
  items: ToastMessage[];
}>();

defineEmits<{
  dismiss: [toastId: number];
}>();

const toastClassMap: Record<ToastMessage["type"], string> = {
  success: "border-emerald-300 bg-emerald-50 text-emerald-800",
  error: "border-rose-300 bg-rose-50 text-rose-800",
  info: "border-sky-300 bg-sky-50 text-sky-800",
  warning: "border-amber-300 bg-amber-50 text-amber-800",
};
</script>

<template>
  <div class="pointer-events-none fixed bottom-4 right-4 z-50 w-full max-w-sm space-y-2">
    <div
      v-for="toast in items"
      :key="toast.id"
      class="pointer-events-auto rounded-lg border px-4 py-3 shadow-md"
      :class="toastClassMap[toast.type]"
    >
      <div class="flex items-start justify-between gap-4">
        <p class="text-sm font-medium">{{ toast.text }}</p>
        <button
          type="button"
          class="text-lg leading-none opacity-70 transition hover:opacity-100"
          @click="$emit('dismiss', toast.id)"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>
