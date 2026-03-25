<script setup lang="ts">
import ToastList from "./components/ToastList.vue";
import { useToasts } from "./composables/useToasts";

const { toasts, removeToast } = useToasts();
</script>

<template>
  <main class="h-screen bg-slate-100 p-6 md:p-10">
    <ToastList :items="toasts" @dismiss="removeToast" />
    <RouterView />
  </main>
</template>
