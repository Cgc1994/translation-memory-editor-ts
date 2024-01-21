<template>
  <button class="update-button" @click="handleUpdate">Update</button>
  <div class="table-container">
    <table class="custom-table">
      <thead>
        <tr>
          <th>
            <select v-model="sourceLanguage">
              <option v-for="lang in languages" :key="lang.tag" :value="lang.tag">
                {{ lang.name }}
              </option>
            </select>
          </th>
          <th>
            <select v-model="targetLanguage">
              <option v-for="lang in languages" :key="lang.tag" :value="lang.tag">
                {{ lang.name }}
              </option>
            </select>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in dictionaries" :key="item.id">
          <td>{{ getTextBySourceLanguage(item.texts, sourceLanguage) }}</td>
          <td :contenteditable="isEditable()" @input="updateText($event, item.id)">{{ getTextByTargetLanguage(item.texts, targetLanguage) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface Language {
tag: string;
name: string;
}

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
name: 'TableComponent',
props: {
  languages: Array as () => Language[],
  dictionaries: Array as () => DictionaryItem[],
},
data() {
  return {
    sourceLanguage: 'en-es',
    targetLanguage: 'en-gb',
  };
},
methods: {
  isEditable(): boolean {
    return this.targetLanguage === 'en-gb' && this.sourceLanguage === 'en-es';
  },
  getTextBySourceLanguage(texts: Text[], language: string): string {
    if (language === 'en-es' && this.targetLanguage === 'en-gb') {
      const textObj = texts.find((text) => text.language === language);
      return textObj ? textObj.text : '';
    }
    return '';
  },
  getTextByTargetLanguage(texts: Text[], language: string): string {
    if (language === 'en-gb' && this.sourceLanguage === 'en-es') {
      const textObj = texts.find((text) => text.language === language);
      return textObj ? textObj.text : '';
    }
    return '';
  },
  updateText(event: InputEvent, itemId: number): void {
    const newText = (event.target as HTMLTableCellElement).innerText;
    const targetLanguage = this.targetLanguage;
    this.$emit('update-text', { itemId, newText, targetLanguage });
  },
  handleUpdate(): void {
    this.$emit('update-data');
  },
},
});
</script>

<style>
.table-container {
  max-width: 100%;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  border-bottom: 3px solid black;
  border-top: 3px solid black;
}

.custom-table th, .custom-table td {
  border: 1px solid gray;
  padding: 8px;
  width: 50%;
}

.custom-table th:first-child, .custom-table td:first-child {
  border-left: 3px solid black;
}

.custom-table th:last-child, .custom-table td:last-child {
  border-right: 3px solid black;
}

.sticky-column {
  position: sticky;
  left: 0;
  background-color: #fff;
  z-index: 1;
}

.update-button {
  display: block;
  float: right;
  margin-bottom: 1em;
}
</style>