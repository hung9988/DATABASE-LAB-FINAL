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
      Current Period
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
      :default-index="current_index"
    />

    <div class="mt-16 flex justify-center">
      <UButton
        :loading="pending"
        @click="process_save()"
        :ui="{ font: 'font-bold' }"
        class="py flex justify-center px-10"
        >Save settings</UButton
      >
    </div>
  </div>
</template>

<script setup>
import { getParsedCommandLineOfConfigFile } from "typescript";
import { ref } from "vue";
const items = [
  {
    label: "Pre-registration",
  },
  {
    label: "Open registration",
  },
  {
    label: "Close registration",
  },
  {
    label: "Start semester",
  },
  {
    label: "End semester",
  },
];
const semester = ref("");
const { data } = await useFetch("/api/Admin/GetPeriodStatus", {
  method: "GET",
});
const period = ref(data.value.res[0].current_period);
const current_index = ref();
if (period.value == "pre_registration") {
  current_index.value = 0;
} else if (period.value == "open_registration") {
  current_index.value = 1;
} else if (period.value == "close_registration") {
  current_index.value = 2;
} else if (period.value == "start_semester") {
  current_index.value = 3;
} else if (period.value == "end_semester") {
  current_index.value = 4;
}

async function onChange(index) {
  current_index.value = index;
}
const pending = ref(false);
async function process_save() {
  pending.value = true;
  try {
    await useFetch("/api/Admin/SetSemester", {
      method: "POST",
      body: { semester: semester.value },
    });
    if (current_index.value == 0) {
      await useFetch("/api/Admin/PreRegistration", {
        method: "POST",
      });
    } else if (current_index.value == 1) {
      await useFetch("/api/Admin/OpenRegistration", {
        method: "POST",
      });
    } else if (current_index.value == 2) {
      await useFetch("/api/Admin/CloseRegistration", {
        method: "POST",
      });
    } else if (current_index.value == 3) {
      await useFetch("/api/Admin/StartSemester", {
        method: "POST",
      });
    } else if (current_index.value == 4) {
      await useFetch("/api/Admin/EndSemester", {
        method: "POST",
      });
    }
  } catch (err) {
  } finally {
    pending.value = false;
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
