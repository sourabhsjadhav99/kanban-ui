<script setup lang="ts">
import type { BoardColumn, Task } from "../types/task";

defineProps<{
  column: BoardColumn;
  tasks: Task[];
}>();

defineEmits<{
  dropTask: [];
  startDrag: [taskId: string];
  deleteTask: [taskId: string];
  openTask: [taskId: string];
}>();
</script>

<template>
  <article
    class="flex h-full min-h-0 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    @dragover.prevent
    @drop="$emit('dropTask')"
  >
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-slate-800">{{ column.title }}</h2>
      <span class="rounded-full px-3 py-1 text-sm font-semibold" :class="column.badgeClass">
        {{ tasks.length }}
      </span>
    </div>

    <div class="custom-scrollbar flex-1 space-y-3 overflow-y-auto rounded-lg bg-slate-50 p-3 pr-2">
      <div
        v-for="task in tasks"
        :key="task._id"
        class="cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm active:cursor-grabbing"
        draggable="true"
        @dragstart="$emit('startDrag', task._id)"
        @click="$emit('openTask', task._id)"
      >
        <div class="flex items-start justify-between gap-2">
          <h3 class="font-medium text-slate-800">{{ task.title }}</h3>
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-rose-300 text-rose-700 transition hover:bg-rose-50"
            title="Delete task"
            @click.stop="$emit('deleteTask', task._id)"
          >
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
            </svg>
          </button>
        </div>
        <p class="mt-1 text-sm text-slate-600">{{ task.description }}</p>
      </div>

      <p
        v-if="tasks.length === 0"
        class="rounded-md border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500"
      >
        Drop tasks here
      </p>
    </div>
  </article>
</template>
