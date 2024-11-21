<template>
  <div class="w-1/4 bg-gray-100 p-2 rounded">
    <h2 class="text-xl font-bold mb-2">{{ title }}</h2>
    <draggable
      :list="tasks.value"
      group="tasks"
      @end="onDragEnd"
      class="space-y-2"
      item-key="id"
    >
      <template #item="{ element }">
        <TaskCard
          :task="element"
          @edit-task="$emit('edit-task', element.id)"
          @delete-task="$emit('delete-task', element.id)"
        />
      </template>
    </draggable>
    <button
      class="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded"
      @click="$emit('add-task', status)"
    >
      Add Task
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ComputedRef } from 'vue';
import draggable from 'vuedraggable';
import TaskCard from './TaskCard.vue';
import { Task } from '../types/task';

const props = defineProps<{
  title: string;
  status: Task['status'];
  tasks: ComputedRef<Task[]>;
}>();
const emits = defineEmits([
  'move-task',
  'add-task',
  'edit-task',
  'delete-task',
]);

const onDragEnd = (event: any) => {
  const movedTask = event.item;
  emits('move-task', movedTask.id, props.status);
};
</script>
