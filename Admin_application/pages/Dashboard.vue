<template>
  <div class="min-h-screen bg-background-900">
    <div class="flex justify-center pt-[10vh]">
      <h2 class="text-4xl font-bold text-white"></h2>
    </div>
    <div class="mx-10 flex justify-center pt-20">
      <UFormGroup
        class="w-1/4"
        label="SET SEMESTER"
        :ui="{ label: { base: 'font-bold', wrapper: ' justify-center' } }"
        size="xl"
      >
        <UInput v-model="semester" placeholder="20232..." />
      </UFormGroup>
    </div>
    <div class="mt-16 flex justify-center text-2xl font-bold text-white">
      Current Progress
    </div>
    <UTabs
      @change="onChange"
      :ui="{
        list: {
          marker: { background: 'dark:bg-background-200' },
          tab: { active: 'dark:text-gray-900' },
        },
      }"
      class="mx-64 pt-10"
      :items="items"
      :default-index="state ? 0 : 1"
    />

    <div class="mt-16 flex justify-center">
      <UButton
        @click="process_save()"
        :ui="{ font: 'font-bold' }"
        class="py flex justify-center px-10"
        >Save settings</UButton
      >
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const items = [
  {
    label: "Before semester start",
  },
  {
    label: "During semester",
  },
  {
    label: "Semester end",
  },
];
const semester = ref("");
const { data } = await useFetch("/api/Admin/GetPeriodStatus", {
  method: "GET",
});
const is_open = ref(data.value.res[0].is_open);

async function onChange(index) {
  current_index.value = index;
  console.log(current_index.value);
}
const state = ref(data.value.res[0].is_open);
const current_index = ref(state ? 0 : 1);

async function process_save() {
  await useFetch("/api/Admin/SetSemester", {
    method: "POST",
    body: { semester: semester.value },
  });
  if (current_index.value == 0) {
    await useFetch("/api/Admin/RegisterPeriodStart", {
      method: "POST",
    });
  } else if (current_index.value == 1) {
    await useFetch("/api/Admin/RegisterPeriodEnd", {
      method: "POST",
    });
  } else if (current_index.value == 2) {
    await useFetch("/api/Admin/SemesterEnd", {
      method: "POST",
    });
  }
}
</script>

<style>
.btn {
  padding: 10px 20px;
  border: 1px solid #ccc;
  cursor: pointer;
}
.btn-active {
  background-color: #007bff;
  color: white;
}
</style>
