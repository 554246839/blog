import Vue from 'vue'
import Toast from '../components/toast';

const Instance = new Vue({
  render: h => h(Toast)
});

const component = Instance.$mount();
const instance = Instance.$children[0];

document.body.appendChild(component.$el); // 将组件元素挂载到body

export default (ctx) => {
  Vue.prototype.$toast = instance
  ctx.$toast = instance
}