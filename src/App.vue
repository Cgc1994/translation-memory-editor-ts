<template>
  <div v-if="loaded">
    <TableComponent
      :languages="languages"
      :dictionaries="dictionaries"
      @update-text="handleTextUpdate"
      @update-data="handleUpdateData"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TableComponent from './components/TableComponent.vue';
import { getLanguages, getDictionaries, updateDictionaries } from '../apiService';

interface Text {
  id: number;
  language: string;
  text: string;
}

interface DictionaryItem {
  id: number;
  texts: Text[];
}

export default defineComponent({
  name: 'App',
  components: {
    TableComponent,
  },
  data() {
    return {
      languages: [] as { tag: string; name: string }[],
      dictionaries: [] as DictionaryItem[],
      loaded: false,
    };
  },
  async mounted() {
    try {
      await Promise.all([this.getLanguages(), this.getDictionaries()]);
      this.loaded = true;
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    async getLanguages() {
      try {
        this.languages = await getLanguages();
      } catch (error) {
        console.error('Error al obtener idiomas:', error);
      }
    },
    async getDictionaries() {
      try {
        this.dictionaries = await getDictionaries();
      } catch (error) {
        console.error('Error al obtener diccionarios:', error);
      }
    },
    handleTextUpdate({ itemId, newText, targetLanguage }: { itemId: number; newText: string; targetLanguage: string }) {
      const itemIndex = this.dictionaries.findIndex((item) => item.id === itemId);
      if (itemIndex !== -1) {
        const textIndex = this.dictionaries[itemIndex].texts.findIndex((text) => text.language === targetLanguage);
        if (textIndex !== -1) {
          this.dictionaries[itemIndex].texts[textIndex].text = newText;
        }
      }
    },
    async setNewDictionaries(dictionaries: DictionaryItem[]) {
      try {
        await updateDictionaries(dictionaries);
        console.log('Diccionarios actualizados con éxito');
      } catch (error) {
        console.error('Error al actualizar diccionarios:', error);
      }
    },
    async handleUpdateData() {
      try {
        await this.setNewDictionaries(this.dictionaries);
        alert('Datos actualizados con éxito');
      } catch (error) {
        alert('Error al actualizar datos:', error);
      }
    },
  },
});
</script>

<style>
</style>
