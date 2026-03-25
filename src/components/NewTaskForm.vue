<script setup lang="ts">
import { Field, ErrorMessage, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import * as yup from "yup";
import type { TaskStatus } from "../types/task";

const createTaskSchema = toTypedSchema(
  yup.object({
    title: yup
      .string()
      .required("Title is required.")
      .trim()
      .min(3, "Title must be at least 3 characters.")
      .max(80, "Title must be at most 80 characters."),
    description: yup
      .string()
      .default("")
      .max(240, "Description must be at most 240 characters.")
      .transform((value) => value ?? ""),
    status: yup
      .string()
      .oneOf(["todo", "in-progress", "done"] as const, "Select a valid status.")
      .required(),
  })
);

const props = defineProps<{
  isSubmitting: boolean;
}>();

const emit = defineEmits<{
  create: [{ title: string; description: string; status: TaskStatus }];
  cancel: [];
}>();

const { handleSubmit, resetForm } = useForm({
  validationSchema: createTaskSchema,
  initialValues: {
    title: "",
    description: "",
    status: "todo" as TaskStatus,
  },
});

const onSubmit = handleSubmit((values) => {
  if (props.isSubmitting) {
    return;
  }

  emit("create", {
    title: values.title.trim(),
    description: (values.description ?? "").trim(),
    status: values.status as TaskStatus,
  });
});

const onCancel = () => {
  resetForm();
  emit("cancel");
};
</script>

<template>
  <div class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4">
    <form
      class="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-lg"
      @submit.prevent="onSubmit"
    >
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-slate-800">Add New Task</h2>
        <button type="button" class="text-2xl leading-none text-slate-500 hover:text-slate-700" @click="onCancel">
          ×
        </button>
      </div>

      <div class="space-y-3">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700" for="task-title">Title</label>
          <Field id="task-title" name="title" v-slot="{ field, meta }">
            <input
              v-bind="field"
              type="text"
              placeholder="Task title"
              class="w-full rounded-md border px-3 py-2 text-sm outline-none ring-slate-300 focus:ring"
              :class="meta.touched && !meta.valid ? 'border-rose-400' : 'border-slate-300'"
            />
          </Field>
          <ErrorMessage name="title" class="mt-1 block text-xs text-rose-600" />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700" for="task-description">Description</label>
          <Field id="task-description" name="description" v-slot="{ field, meta }">
            <textarea
              v-bind="field"
              rows="3"
              placeholder="Description"
              class="w-full rounded-md border px-3 py-2 text-sm outline-none ring-slate-300 focus:ring"
              :class="meta.touched && !meta.valid ? 'border-rose-400' : 'border-slate-300'"
            />
          </Field>
          <ErrorMessage name="description" class="mt-1 block text-xs text-rose-600" />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700" for="task-status">Status</label>
          <Field id="task-status" name="status" v-slot="{ field, meta }">
            <select
              v-bind="field"
              class="w-full rounded-md border px-3 py-2 text-sm outline-none ring-slate-300 focus:ring"
              :class="meta.touched && !meta.valid ? 'border-rose-400' : 'border-slate-300'"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </Field>
          <ErrorMessage name="status" class="mt-1 block text-xs text-rose-600" />
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
