import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useProductStore = defineStore('productStore', () => {
  const productPath = ref('/shop/products')

  return { productPath }
})
