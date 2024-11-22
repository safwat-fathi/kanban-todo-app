<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white p-6 rounded w-96">
      <h2 class="text-xl font-bold mb-4">{{ isEditText }}</h2>
      <form @submit.prevent="onSubmit">
        <!-- Title -->
        <!-- Title -->
        <div class="mb-4">
          <label class="block text-gray-700">Title</label>
          <input
            v-model="formData.title"
            type="text"
            class="w-full px-3 py-2 border rounded"
          />
          <span class="text-red-500">{{ titleError }}</span>
        </div>
        <!-- Description -->
        <div class="mb-4">
          <label class="block text-gray-700">Description</label>
          <textarea
            v-model="formData.description"
            class="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>
        <!-- Due Date -->
        <div class="mb-4">
          <label class="block text-gray-700">Due Date</label>
          <input
            v-model="formData.dueDate"
            type="date"
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        <!-- Priority -->
        <div class="mb-4">
          <label class="block text-gray-700">Priority</label>
          <select
            v-model="formData.priority"
            class="w-full px-3 py-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <!-- Buttons -->
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            class="px-4 py-2 bg-gray-500 text-white rounded"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {{ isEditText }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, reactive, ref } from 'vue';
import { Task } from '../types/task';

const { task, isEdit } = defineProps<{
  task: Task | null;
  isEdit: boolean;
}>();

const emits = defineEmits(['save', 'close']);

const isEditText = computed(() => (isEdit ? 'Edit Task' : 'Add Task'));
const titleError = ref('');

const formData = reactive({
  title: '',
  description: '',
  dueDate: '',
  priority: 'low',
});

// Watch for changes in task and update formData
watch(
  () => task,
  newTask => {
    formData.title = newTask?.title || '';
    formData.description = newTask?.description || '';
    formData.dueDate = newTask?.dueDate || '';
    formData.priority = newTask?.priority || 'low';
  },
  { immediate: true }
);

const onSubmit = () => {
  if (!formData.title.trim()) {
    titleError.value = 'Title is required';
    return;
  } else {
    titleError.value = '';
  }

  emits('save', {
    ...task,
    ...formData,
    updatedAt: new Date().toISOString(),
  });
};
</script>
