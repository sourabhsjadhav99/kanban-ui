<script setup lang="ts">
defineProps<{
  isFormVisible: boolean;
}>();

defineEmits<{
  toggleForm: [];
}>();
</script>

<template>
  <header class="mb-6 flex flex-wrap items-start justify-between gap-4">
    <div>
      <h1 class="text-3xl font-bold text-slate-800 md:text-4xl">Draggable Kanban Board</h1>
    </div>
<button
  class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-2xl font-semibold text-white shadow-md transition hover:scale-105 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
  type="button"
  :title="isFormVisible ? 'Close add task form' : 'Add task'"
  @click="$emit('toggleForm')"
>
      <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
</button>
  </header>
</template>
