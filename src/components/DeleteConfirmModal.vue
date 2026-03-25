<script setup lang="ts">
defineProps<{
  visible: boolean;
}>();

defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4">
    <div class="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-lg">
      <h3 class="text-lg font-semibold text-slate-800">Delete Task?</h3>
      <p class="mt-2 text-sm text-slate-600">This action will permanently remove the task from your board.</p>
      <div class="mt-4 flex justify-end gap-2">
        <button
          type="button"
          class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          @click="$emit('cancel')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
          @click="$emit('confirm')"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
</template>
