<script>
import { NInput, NSelect, NPagination, NConfigProvider } from 'naive-ui'
</script>

<script setup>
definePageMeta({
  layout: 'shop-layout',
  pageTransition: { name: 'fade', mode: 'out-in', appear: true },
  requireLogin: false
})

const { $http } = useNuxtApp()
const route = useRoute()

// 先定義 useAsyncData
const {
  data: products,
  pending,
  error,
  refresh
} = await useAsyncData(
  () => `products-${route.query.page}`,
  () => {
    return $http.get('/product/all', { currentPage: 1 })
  }
)

// 再定義 store 與監聽
const userStore = useUserStore()
const { user, login } = storeToRefs(userStore)

watch(
  () => login.value,
  () => {
    refresh()
  }
)
</script>

<template>
  <div class="page">
    <main class="products-list_container">
      <section class="search_container">
        <article class="search_wrap">
          <span class="search-item-name">請輸入商品主名稱</span>

          <n-Input size="large" placeholder="請輸入商品主名稱" clearable />
        </article>

        <article class="search_wrap">
          <span class="search-item-name">請輸入商品副名稱</span>

          <n-Input size="large" placeholder="請輸入商品副名稱" clearable />
        </article>
      </section>
    </main>
  </div>
</template>
