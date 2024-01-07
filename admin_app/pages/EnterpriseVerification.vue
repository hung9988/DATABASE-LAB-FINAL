<script setup>
import { refDebounced } from "@vueuse/core";
const page = ref(1);
const pageCount = ref(8);
const count = ref(1);
const query = ref("");
const debounced = refDebounced(query, 150);
const columns = [
  {
    key: "user_id",
    label: "ID",
  },
  {
    key: "enterprise_name",
    label: "Name",
  },

  {
    key: "contact",

    label: "Contact",
  },

  {
    key: "email",
    label: "Email",
  },
];

const { data: subjects, refresh } = await useFetch(
  "/api/Admin/GetEnterprises",
  {
    method: "POST",
    body: {
      query: debounced,
      page: page,
      pageCount: pageCount,
    },
  },
);

const selected = ref([]);
function select(row) {
  const index = selected.value.findIndex(
    (item) => item.user_id === row.user_id,
  );
  if (index === -1) {
    selected.value.push(row);
    console.log(selected.value);
  } else {
    selected.value.splice(index, 1);
  }
}

async function handle_verify() {
  selected.value = selected.value.map((item) => item.user_id);
  console.log(selected.value);
  await useFetch("/api/Admin/VerifyEnterprises", {
    method: "POST",
    body: {
      data: selected,
    },
  });
  selected.value = [];
  refresh();
}
</script>
<template>
  <div class="min-h-screen bg-background-900">
    <div class="space-y-10 py-[10vh]">
      <div class="flex justify-center">
        <div class="mb-10 text-4xl font-semibold">Enterprise Verification</div>
      </div>
      <div class="">
        <div class="flex items-center justify-center">
          <UInput
            class="w-1/2"
            size="xl"
            v-model="query"
            placeholder="Search"
            icon="i-heroicons-search"
          />
        </div>
      </div>
      <UTable
        v-model="selected"
        class="mx-10"
        :columns="columns"
        :rows="subjects.subjects"
        @select="select"
      />
      <div class="grid grid-cols-2">
        <div class="col-span-1">
          <UPagination
            class="grid-col mx-10"
            v-if="subjects.totalrows"
            v-model="page"
            :page-count="pageCount"
            :total="subjects.totalrows[0].count"
          />
        </div>
        <div class="col-span-1 flex justify-end">
          <UButton
            :ui="{ font: 'font-bold' }"
            class="mr-10 flex w-1/3 items-center justify-center"
            @click="handle_verify"
            >Submit</UButton
          >
        </div>
      </div>
    </div>
  </div>
</template>
