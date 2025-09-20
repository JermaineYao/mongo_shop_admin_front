<script>
import { NInput, NInputNumber, NSelect, NPagination } from 'naive-ui'
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

// 查詢條件
const searchCondition = reactive({
  productNameMain: '',
  productNameSub: '',
  price: {
    gte: null,
    lte: null
  },
  category: '',
  sort: '',
  currentPage: 1,
  limit: 12
})

const {
  data: resData,
  pending,
  error,
  refresh
} = await useAsyncData(
  () => `products-${route.query.page}`,
  () => {
    const query = {}
    for (const k in searchCondition) query[k] = searchCondition[k]

    for (const k in query.price) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      if (!query.price[k]) delete query.price[k]
    }
    if (Object.keys(query.price).length === 0) delete query.price

    for (const k in query) {
      if (k !== 'price') {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        if (query[k] === '') delete query[k]
      }
    }

    return $http.get('/product/all', query)
  }
)

function queryByUser() {
  const sw = document.querySelector('.scroll_wrap')
  sw.scrollTop = 0

  refresh()
}

const products = computed(() => resData.value?.data ?? [])
console.log('products', products)
// const dataCount = computed(() => resData.value?.dataCount ?? 0)
const totalPages = computed(() => resData.value?.totalPages ?? 0)

const userStore = useUserStore()
const { user, login } = storeToRefs(userStore)

watch(
  () => login.value,
  () => {
    refresh()
  }
)

function checkPrice(field) {
  if (field === 'lte') {
    if (searchCondition.price.lte <= searchCondition.price.gte) {
      searchCondition.price.gte = null
    }
  }

  if (field === 'gte') {
    if (searchCondition.price.lte < searchCondition.price.gte) {
      searchCondition.price.lte = null
    }
  }
}

// 商品分類
const categoryList = [
  {
    label: '全部',
    value: ''
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
    value: ''
  },
  {
    label: '上架日期: 新 -> 舊',
    value: '-createAt'
  },
  {
    label: '上架日期: 舊 -> 新',
    value: 'createAt'
  },
  {
    label: '商品價格: 高 -> 低',
    value: '-price'
  },
  {
    label: '商品價格: 低 -> 高',
    value: 'price'
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
      // gsap.set('.close', { display: 'none' })
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
        <div class="search_wrap">
          <article class="search-item">
            <span class="search-item-name">請輸入商品主名稱</span>

            <n-Input
              v-model:value="searchCondition.productNameMain"
              size="large"
              placeholder=""
              clearable
            />
          </article>

          <article class="search-item">
            <span class="search-item-name">請輸入商品副名稱</span>

            <n-Input
              v-model:value="searchCondition.productNameSub"
              size="large"
              placeholder=""
              clearable
            />
          </article>

          <article class="search-item">
            <span class="search-item-name">價格大於</span>

            <n-input-number
              v-model:value="searchCondition.price.gte"
              size="large"
              placeholder=""
              clearable
              @blur="checkPrice('gte')"
            />
          </article>

          <article class="search-item">
            <span class="search-item-name">價格小於</span>

            <n-input-number
              v-model:value="searchCondition.price.lte"
              size="large"
              type="number"
              placeholder=""
              clearable
              @blur="checkPrice('lte')"
            />
          </article>

          <article class="search-item">
            <span class="search-item-name">請選擇商品分類</span>

            <n-select
              v-model:value="searchCondition.category"
              :options="categoryList"
              placeholder=""
              size="large"
            />
          </article>

          <article class="search-item">
            <span class="search-item-name">請選擇排序方式</span>

            <n-select
              v-model:value="searchCondition.sort"
              :options="sortOptions"
              placeholder=""
              size="large"
            />
          </article>
        </div>

        <div class="action_wrap">
          <div class="btn cancel" @click="closeSearch">
            <span>取消</span>
          </div>

          <div class="btn query" @click="queryByUser">
            <span>查詢</span>
          </div>
        </div>
      </section>

      <section class="products-list_wrap">
        <div v-if="products && products.length > 0" class="products-list">
          <article v-for="p in products" :key="p._id">
            <div class="product_wrap">
              <div class="names">
                <span class="name-main">{{ p.productNameMain }}</span>
                <span class="name-sub">{{ p.productNameSub }}</span>
              </div>

              <div
                class="product-image"
                :style="{
                  background: `url(${p.mainPhoto.url}) center/cover no-repeat`
                }"
              ></div>

              <div class="price_wrap">
                <span class="price">{{ formatCurrency(p.price) }}</span>
                <span class="price-unit">NTD</span>
              </div>
            </div>

            <div v-if="p.inStock === 0" class="sold-out_wrap">
              <span class="sold-out">已售完</span>
            </div>
          </article>
        </div>

        <n-pagination
          v-if="totalPages > 1"
          v-model:page="searchCondition.currentPage"
          v-model:page-size="searchCondition.limit"
          :page-count="totalPages"
          @update:page="queryByUser"
        />
      </section>
    </main>
  </div>
</template>
