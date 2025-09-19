<script>
import { NInput, NSelect, NPagination, NConfigProvider } from 'naive-ui'
import gsap from 'gsap'
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

// 商品分類
const categoryList = [
  {
    label: '全部',
    value: '全部'
  },
  {
    label: '碗',
    value: '0'
  },
  {
    label: '瓶子',
    value: '1'
  },
  {
    label: '杯子',
    value: '2'
  }
]

// 排序
const sortOptions = [
  {
    label: '無',
    value: '0'
  },
  {
    label: '上架日期: 新 -> 舊',
    value: 'a'
  },
  {
    label: '上架日期: 舊 -> 新',
    value: 'A'
  },
  {
    label: '商品價格: 高 -> 低',
    value: 'b'
  },
  {
    label: '商品價格: 低 -> 高',
    value: 'B'
  }
]

// 開啟查詢框
function openSearch() {
  gsap.to('.search-tab_wrap', {
    opacity: 0,
    onComplete: function () {
      gsap.set('.open', { display: 'none' })
      gsap.to('.search_container', {
        left: 0,
        display: 'flex',
        opacity: 1,
        duration: 0.3,
        onComplete: function () {
          gsap.to('.close', { opacity: 1, delay: 0.4, duration: 0.2, display: 'flex' })
        }
      })
    }
  })
}

// 關閉查詢框
function closeSearch() {
  gsap.to('.search-tab_wrap', {
    opacity: 0,
    onComplete: function () {
      gsap.set('.close', { display: 'none' })
      gsap.to('.search_container', { left: '-100%', display: 'none', opacity: 0, duration: 0.3 })
      gsap.to('.open', { opacity: 1, delay: 0.1, duration: 0.2, display: 'flex' })
    }
  })
}
</script>

<template>
  <div class="page">
    <main class="products-list_container">
      <div class="search-tab_wrap open" @click="openSearch">
        <span>查詢條件</span>

        <svg id="search-icon" width="45" height="45">
          <circle cx="11" cy="11" r="1" />
          <circle cx="22" cy="11" r="1" />
          <circle cx="33" cy="11" r="1" />

          <circle cx="11" cy="22" r="1" />
          <circle cx="22" cy="22" r="1" />
          <circle cx="33" cy="22" r="1" />

          <circle cx="11" cy="33" r="1" />
          <circle cx="22" cy="33" r="1" />
          <circle cx="33" cy="33" r="1" />
        </svg>
      </div>

      <section class="search_container">
        <div class="search-tab_wrap close" @click="closeSearch">
          <span>close</span>

          <svg id="search-icon" width="45" height="45">
            <circle cx="11" cy="11" r="1" />
            <circle cx="22" cy="11" r="1" />
            <circle cx="33" cy="11" r="1" />

            <circle cx="11" cy="22" r="1" />
            <circle cx="22" cy="22" r="1" />
            <circle cx="33" cy="22" r="1" />

            <circle cx="11" cy="33" r="1" />
            <circle cx="22" cy="33" r="1" />
            <circle cx="33" cy="33" r="1" />
          </svg>
        </div>

        <div class="search_wrap">
          <article class="search-item">
            <span class="search-item-name">請輸入商品主名稱</span>

            <n-Input size="large" placeholder="" clearable />
          </article>

          <article class="search-item">
            <span class="search-item-name">請輸入商品副名稱</span>

            <n-Input size="large" placeholder="" clearable />
          </article>

          <article class="search-item">
            <span class="search-item-name">價格大於</span>

            <n-Input size="large" placeholder="" clearable />
          </article>

          <article class="search-item">
            <span class="search-item-name">價格小於</span>

            <n-Input size="large" type="number" placeholder="" clearable />
          </article>

          <article class="search-item">
            <span class="search-item-name">請選擇商品分類</span>

            <n-select :options="categoryList" placeholder="" size="large" />
          </article>

          <article class="search-item">
            <span class="search-item-name">請選擇排序方式</span>

            <n-select :options="sortOptions" placeholder="" size="large" />
          </article>
        </div>
      </section>

      <section class="products-list"></section>
    </main>
  </div>
</template>
