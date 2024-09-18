<template>
  <section class="w-full max-w-5xl h-full flex flex-col items-center justify-center mx-auto">
    <div class="w-full border-1 border-neutral-300 rounded-md overflow-hidden bg-white">
      <span class="flex flex-row py-4 px-6 justify-between items-center">
        <h1>
          Aktuálne datasety
        </h1>
        <button class="btn-primary" @click="openModal">Pridať dataset</button>
      </span>
      <table class="w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>status</th>
            <th>keywords</th>
            <th></th>
          </tr>
        </thead>
        <tr v-for="dataset in mockData" :key="id">
          <td>{{ dataset.id }}</td>
          <td>{{ dataset.status }}</td>
          <td>{{ dataset.keywords.join(", ") }}</td>
          <td class="text-right text-nowrap">
            <button v-if="dataset.status === 'completed'" class="btn-secondary inline"
              @click="downloadDataset(dataset.id)">Download</button>
            <IconTrash class="w-5 cursor-pointer inline ml-3" @click="deleteDataset(dataset)" />
          </td>
        </tr>
      </table>
    </div>
    <Modal @close-modal="closeModal" v-if="modalState.open">
      <div class="px-7 py-4 border-b-1 border-neutral-200">
        <h1>Nový dataset</h1>
      </div>
      <div class="grow flex flex-col items-stretch overflow-auto">
        <div class="p-6 flex flex-col items-stretch border-b-1 gap-2">
          <h2>Krajina</h2>
          <select name="krajina" id="krajina" class="grow border-1 rounded-md px-3 py-2 appearance-none"
            v-model="modalState.country">
            <option v-for="country in geoTargets" :value="country.value" :key="country.value">{{ country.label }}
            </option>
          </select>
        </div>
        <div class="p-6 flex flex-col items-stretch gap-3">
          <h2>Keywords</h2>
          <div class="flex flex-row gap-3" v-for="(keyword, index) in modalState.keywords" :key="index">
            <input @paste="handlePaste" class="grow border-1 rounded-md px-3 py-2" type="text" v-model="keyword.value"
              placeholder="dexfinity">
            <IconX v-if="modalState.keywords.length > 1" class="w-5 cursor-pointer" @click="removeKeyword(index)" />
          </div>
          <button class="btn-secondary" @click="addKeyword">Add keyword</button>
        </div>
      </div>
      <div class="px-7 py-4 border-t-1 border-neutral-200 flex justify-end gap-3">
        <button @click="closeModal" class="btn-secondary">Zrušiť</button>
        <button :class="['btn-primary', { 'opacity-60 cursor-not-allowed': modalValidation }]"
          @click="addDataset">Vytvoriť
          dataset</button>
      </div>
    </Modal>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { supabase } from '@/services/supabase'
import { toCSV, downloadFile } from './utils/misc';
import { geoTargets } from './utils/countries';

import Modal from '@/components/Modal.vue'

import { IconX, IconTrash } from '@tabler/icons-vue';

const mockData = ref([]);

const modalState = ref({
  open: false,
  country: 2703,
  keywords: [{ value: "" }]
})

const modalValidation = computed(() => {
  return !modalState.value.keywords.map(kw => kw.value).join("").length > 0;
})

const downloadDataset = async (datasetId) => {

  const { data, error } = await supabase
    .from("dataset_volumes")
    .select('...monthly_search_volumes(...keywords(keyword), month, year, monthly_searches)')
    .eq('dataset_id', datasetId);

  const parsedData = data.map(record => {
    return {
      keyword: record.keyword,
      date: `${record.month}/${record.year}`,
      monthly_searches: record.monthly_searches
    }
  });

  if (!error) downloadFile(toCSV(parsedData), 'text/csv', `dataset_${datasetId}.csv`);
}

const handlePaste = (evt) => {
  const split = evt.clipboardData.getData('text').split("\n")
  if (split.length > 1) {
    evt.preventDefault();
    modalState.value.keywords = split.map(chunk => { return { value: chunk } });
  }
}

const addKeyword = () => {
  modalState.value.keywords.push({ value: "" })
}

const removeKeyword = (index) => {
  modalState.value.keywords.splice(index, 1)
}

const resetKeywords = () => {
  modalState.value.keywords = [{ value: "" }];
}

const addDataset = async () => {

  if (modalValidation.value) return

  const { data, error } = await supabase
    .from("datasets")
    .insert({ keywords: modalState.value.keywords.filter(keyword => keyword.value.length).map(keyword => keyword.value), country_code: modalState.value.country })
    .select();

  mockData.value.push(...data);

  if (!error) closeModal();
}

const deleteDataset = async (dataset) => {

  const { data, error } = await supabase
    .from("datasets")
    .delete()
    .eq('id', dataset.id)
    .select();

  const index = mockData.value.indexOf(dataset);
  if (!error) mockData.value.splice(index, 1);
}

const openModal = () => {
  modalState.value.open = true;
  resetKeywords();
}

const closeModal = () => {
  modalState.value.open = false;
}

onMounted(async () => {
  // Load the data
  const { data, error } = await supabase.from("datasets").select();
  if (!error) mockData.value = data;
})
</script>

<style scoped></style>
