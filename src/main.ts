import { createApp } from 'vue';
import App from '/@/App.vue';
import ElementPlus from 'element-plus';
import VueGridLayout from 'vue-grid-layout';

const app = createApp(App);

app.use(ElementPlus).use(VueGridLayout).mount('#app');
