<template>
  <div
    class="p-3 bg-white rounded shadow"
    :class="priorityClass"
    :data-id="task.id"
  >
    <h3 class="font-bold">{{ task.title }}</h3>
    <p class="text-sm">{{ task.description }}</p>
    <div class="flex justify-between items-center mt-2">
      <span class="text-xs text-gray-500">{{ formattedDueDate }}</span>
      <div class="space-x-2">
        <button @click="$emit('edit-task', task.id)" class="text-blue-500">
          Edit
        </button>
        <button @click="$emit('delete-task', task.id)" class="text-red-500">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Task } from '../types/task';

const props = defineProps<{
  task: Task;
}>();

const emits = defineEmits(['edit-task', 'delete-task']);

/**
 * Compute the CSS class based on task priority.
 */
const priorityClass = computed(() => {
  switch (props.task.priority) {
    case 'high':
      return 'border-l-4 border-red-500';
    case 'medium':
      return 'border-l-4 border-yellow-500';
    case 'low':
      return 'border-l-4 border-green-500';
    default:
      return '';
  }
});

/**
 * Format the due date for display.
 */
const formattedDueDate = computed(() => {
  return props.task.dueDate
    ? new Date(props.task.dueDate).toLocaleDateString()
    : '';
});
</script>
