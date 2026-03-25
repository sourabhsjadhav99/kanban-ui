<script setup lang="ts">
import { computed, reactive } from "vue";
import type { TaskStatus } from "../types/task";

const props = defineProps<{
  isSubmitting: boolean;
}>();

const emit = defineEmits<{
  create: [{ title: string; description: string; status: TaskStatus }];
  cancel: [];
}>();

const formState = reactive({
  title: "",
  description: "",
  status: "todo" as TaskStatus,
});

const validationState = reactive({
  title: "",
  description: "",
});

const resetForm = () => {
  formState.title = "";
  formState.description = "";
  formState.status = "todo";
  validationState.title = "";
  validationState.description = "";
};

const titleLength = computed(() => formState.title.trim().length);
const descriptionLength = computed(() => formState.description.trim().length);

const validate = () => {
  validationState.title = "";
  validationState.description = "";

  if (titleLength.value < 3) {
    validationState.title = "Title must be at least 3 characters.";
  } else if (titleLength.value > 80) {
    validationState.title = "Title must be at most 80 characters.";
  }

  if (descriptionLength.value > 240) {
    validationState.description = "Description must be at most 240 characters.";
  }

  return !validationState.title && !validationState.description;
};

const submitForm = () => {
  if (props.isSubmitting || !validate()) {
    return;
  }

  emit("create", {
    title: formState.title,
    description: formState.description,
    status: formState.status,
  });
  resetForm();
};

const onCancel = () => {
  resetForm();
  emit("cancel");
};
</script>

<template>
  <div class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4">
    <form
      class="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-lg"
      @submit.prevent="submitForm"
    >
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-slate-800">Add New Task</h2>
        <button type="button" class="text-2xl leading-none text-slate-500 hover:text-slate-700" @click="onCancel">
          ×
        </button>
      </div>

      <div class="space-y-3">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Title</label>
          <input
            v-model="formState.title"
            type="text"
            placeholder="Task title"
            class="w-full rounded-md border px-3 py-2 text-sm outline-none ring-slate-300 focus:ring"
            :class="validationState.title ? 'border-rose-400' : 'border-slate-300'"
          />
          <p v-if="validationState.title" class="mt-1 text-xs text-rose-600">{{ validationState.title }}</p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Description</label>
          <textarea
            v-model="formState.description"
            rows="3"
            placeholder="Description"
            class="w-full rounded-md border px-3 py-2 text-sm outline-none ring-slate-300 focus:ring"
            :class="validationState.description ? 'border-rose-400' : 'border-slate-300'"
          />
          <p v-if="validationState.description" class="mt-1 text-xs text-rose-600">
            {{ validationState.description }}
          </p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Status</label>
          <select
            v-model="formState.status"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 focus:ring"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      <div class="mt-4 flex justify-end gap-2">
        <button
          type="button"
          class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          @click="onCancel"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? "Adding..." : "Add Task" }}
        </button>
      </div>
    </form>
  </div>
</template>
