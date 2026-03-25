<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTasks } from "../composables/useTasks";
import type { Task } from "../types/task";

const route = useRoute();
const router = useRouter();
const { getTaskById, isLoadingTaskDetails } = useTasks();

const selectedTask = ref<Task | null>(null);
const notFoundMessage = ref("");

const statusLabel = computed(() => {
  if (!selectedTask.value) {
    return "";
  }

  if (selectedTask.value.status === "todo") {
    return "To Do";
  }
  if (selectedTask.value.status === "in-progress") {
    return "In Progress";
  }
  return "Done";
});

const loadTask = async () => {
  const taskId = route.params.id;
  if (typeof taskId !== "string") {
    notFoundMessage.value = "Invalid task id.";
    return;
  }

  const task = await getTaskById(taskId);
  if (!task) {
    notFoundMessage.value = "Task not found.";
    return;
  }

  selectedTask.value = task;
};

onMounted(loadTask);
</script>

<template>
  <section class="mx-auto flex h-full max-w-4xl flex-col">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-3xl font-bold text-slate-800">Task Details</h1>
      <button
        type="button"
        class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        @click="router.push('/')"
      >
        Back to Board
      </button>
    </div>

    <p v-if="isLoadingTaskDetails" class="rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-600">
      Loading task details...
    </p>

    <p v-else-if="notFoundMessage" class="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-700">
      {{ notFoundMessage }}
    </p>

    <article v-else-if="selectedTask" class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="mb-4 flex items-center justify-between gap-3">
        <h2 class="text-2xl font-semibold text-slate-800">{{ selectedTask.title }}</h2>
        <span class="rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-700">{{ statusLabel }}</span>
      </div>

      <p class="text-base leading-7 text-slate-700">
        {{ selectedTask.description || "No description provided." }}
      </p>
    </article>
  </section>
</template>
