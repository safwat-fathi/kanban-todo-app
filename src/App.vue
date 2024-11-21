<template>
  <KanbanBoard />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTaskStore } from './store/useTaskStore';
import KanbanBoard from './components/KanbanBoard.vue';

const taskStore = useTaskStore();

onMounted(() => {
  taskStore.loadTasks();
});
</script>
