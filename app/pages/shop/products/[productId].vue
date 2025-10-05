<script>
import { NInputNumber } from 'naive-ui'
import gsap from 'gsap'
</script>

<script setup>
definePageMeta({
  layout: 'shop-layout',
  requireLoginCheck: true,
  requireLogin: false
})

const config = useRuntimeConfig()
const baseUrl = config.public.apiBase

const route = useRoute()
const productId = route.params.productId

const {
  data: product,
  pending,
  refresh
} = await useAsyncData(
  () => `product-${productId}`,
  async () => {
    const reqHeaders = import.meta.server ? useRequestHeaders(['cookie']) : {}

    const res = await $fetch(`${baseUrl}/product/${productId}`, {
      method: 'GET',
      credentials: 'include',
      headers: import.meta.server ? { cookie: reqHeaders.cookie || '' } : undefined
    })

    return res.data
  }
)

const loading = computed(() => pending.value)

const userStore = useUserStore()
const { isUserLogin } = storeToRefs(userStore)
const { updateCartApi, toggleFavoriteApi } = useUserApi()

// 檢視圖片
const imgDisplay = ref(product.value?.mainPhoto.url)

function selectImg(url) {
  const imgDisplayDom = document.getElementById('img-display')
  gsap.set(imgDisplayDom, { opacity: 0 })
  imgDisplay.value = url

  gsap.to(imgDisplayDom, { duration: 0.7, opacity: 1 })
}

// 購物車, 我的最愛請求結果
const reqMsg = reactive({
  cart: '',
  favorite: ''
})
const reqResult = reactive({
  cart: false,
  favorite: false
})

// 加入購物車
const orderCount = ref(1)

function updateCart() {
  if (!isUserLogin.value) {
    navigateTo('/shop/products')
    return
  }

  const query = {
    productId,
    quantity: orderCount.value * 1
  }

  updateCartApi(query)
    .then((res) => {
      if (res.status === 'success') {
        reqMsg.cart = res.msg
        reqResult.cart = true

        setTimeout(() => {
          reqMsg.cart = ''
          reqResult.cart = false
        }, 3000)
      }
    })
    .catch((err) => {
      if (err) {
        const msg = err.data.msg || err.message
        reqMsg.cart = msg
        reqResult.cart = false

        setTimeout(() => {
          reqMsg.cart = ''
          reqResult.cart = false
        }, 3000)
      }
    })
}

// 新增,移除 我的最愛
function toggleFavorite() {
  if (!isUserLogin.value) {
    return
  }

  const query = {
    productId
  }
  toggleFavoriteApi(query)
    .then((res) => {
      if (res.status === 'success') {
        reqMsg.favorite = res.msg
        reqResult.favorite = true

        product.value.addedToFavorite = !product.value.addedToFavorite

        setTimeout(() => {
          reqMsg.favorite = ''
          reqResult.favorite = false
        }, 3000)
      }
    })
    .catch((err) => {
      if (err.status === 401) {
        isUserLogin.value = false
      }

      if (err) {
        const msg = err.data.msg || err.message
        reqMsg.favorite = msg
        reqResult.favorite = false

        setTimeout(() => {
          reqMsg.favorite = ''
          reqResult.favorite = false
        }, 3000)
      }
    })
}

// 回上一頁
const router = useRouter()

function goBack() {
  router.back()
}
</script>

<template>
  <div v-loading="loading" class="page product-detail">
    <main
      class="product-detail_container"
      :style="{
        background: `url(${product?.mainPhoto.url}) center/contain repeat`
      }"
    >
      <div class="page-bg"></div>

      <div class="return_wrap">
        <div class="btn go-back" @click="goBack">
          <IconReturnLeft />
          <span>回上一頁</span>
        </div>
      </div>

      <section class="product-names product-item">
        <article class="names_wrap">
          <span class="name-main">{{ product?.productNameMain }}</span>
          <span class="name-sub">{{ product?.productNameSub }}</span>
        </article>

        <span class="category">{{ getCategory(product?.category) }}</span>
      </section>

      <section class="cart-operation product-item">
        <article class="product-price">
          <div class="price_wrap">
            <span class="price">{{ formatCurrency(product?.price) }}</span>
            <span class="price-unit">NTD / 件</span>
          </div>

          <div v-if="isUserLogin" class="favorite_container">
            <span :class="[reqResult.favorite ? 'res-msg success' : 'res-msg failed']">{{
              reqMsg.favorite
            }}</span>

            <IconFavorite v-if="product.addedToFavorite" @click="toggleFavorite" />

            <IconFaviroteEmpty v-if="!product.addedToFavorite" @click="toggleFavorite" />
          </div>
        </article>

        <hr v-if="isUserLogin && product.inStock > 0" />

        <div v-if="isUserLogin && product.inStock > 0" class="user-operation_wrap">
          <div class="cart_wrap">
            <div class="order-count">
              <span :class="[reqResult.cart ? 'res-msg success' : 'res-msg failed']">{{
                reqMsg.cart
              }}</span>

              <n-input-number
                v-model:value="orderCount"
                size="large"
                min="1"
                :max="product.inStock"
                placeholder=""
                clearable
              />
            </div>

            <div class="user-operation">
              <IconCartAdd @click="updateCart" />
            </div>
          </div>
        </div>
      </section>

      <section class="product-main product-item">
        <article class="product-imgs">
          <div
            id="img-display"
            :style="{
              background: `url(${imgDisplay}) center/cover no-repeat`
            }"
          ></div>
        </article>

        <article class="product-body">
          <div class="img-menu">
            <div
              class="img-menu-item img"
              :style="{
                background: `url(${product?.mainPhoto.url}) center/cover no-repeat`
              }"
              @click="selectImg(product?.mainPhoto.url)"
            ></div>

            <div
              v-for="subPhoto in product?.subPhotos"
              :key="subPhoto.url"
              class="img-menu-item img"
              :style="{
                background: `url(${subPhoto.url}) center/cover no-repeat`
              }"
              @click="selectImg(subPhoto.url)"
            ></div>
          </div>

          <div class="product-descroption">
            <span
              v-for="(description, index) in product?.description"
              :key="index"
              class="description"
            >
              {{ description }}
            </span>
          </div>

          <pre class="size">{{ product?.size }}</pre>
        </article>

        <div v-if="product.inStock === 0" class="sold-out_wrap">
          <span class="sold-out">已售完</span>
        </div>
      </section>
    </main>
  </div>
</template>
