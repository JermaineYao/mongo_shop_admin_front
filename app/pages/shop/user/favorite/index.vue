<script setup>
definePageMeta({
  layout: 'shop-layout',
  requireLoginCheck: true,
  requireLogin: true
})

const userStore = useUserStore()
const { isUserLogin } = storeToRefs(userStore)

const { queryMyFavoriteApi, toggleFavoriteApi, updateCartApi } = useUserApi()

const myFavorite = ref([])
const loading = ref(false)

function queryMyFavorite(requireLoading = true) {
  if (!isUserLogin.value) return

  if (requireLoading) loading.value = true

  queryMyFavoriteApi()
    .then((res) => {
      if (res.status === 'success') {
        const data = res.data
        data.forEach((f) => {
          f.reqMsg = ''
          f.reqResult = false
        })
        myFavorite.value = [...res.data]
      }
    })
    .finally(() => {
      loading.value = false
    })
}

// 預設查詢
if (import.meta.client) {
  queryMyFavorite()
}

// 加入購物車
function updateCart(productId, index) {
  if (!isUserLogin.value) {
    navigateTo('/shop/products')
    return
  }

  const query = {
    productId,
    quantity: 1
  }

  updateCartApi(query)
    .then((res) => {
      if (res.status === 'success') {
        myFavorite.value[index].reqMsg = res.msg
        myFavorite.value[index].reqResult = true

        myFavorite.value[index].inCart = true

        setTimeout(() => {
          myFavorite.value[index].reqMsg = ''
          myFavorite.value[index].reqResult = false
        }, 3000)
      }
    })
    .catch((err) => {
      const msg = err.data.msg || err.message
      myFavorite.value[index].reqMsg = msg

      if (err.status === 401) {
        navigateTo('/shop/products')
      } else {
        myFavorite.value[index].reqResult = false

        setTimeout(() => {
          myFavorite.value[index].reqMsg = ''
          myFavorite.value[index].reqResult = false
        }, 3000)
      }
    })
}

// 新增,移除 我的最愛
function toggleFavorite(productId, index) {
  if (!isUserLogin.value) {
    navigateTo('/shop/products')
    return
  }

  const query = {
    productId
  }

  toggleFavoriteApi(query)
    .then((res) => {
      if (res.status === 'success') {
        queryMyFavorite(false)
      }
    })
    .catch((err) => {
      const msg = err.data.msg || err.message
      myFavorite.value[index].reqMsg = msg

      if (err.status === 401) {
        navigateTo('/shop/products')
      } else {
        myFavorite.value[index].reqResult = false

        setTimeout(() => {
          myFavorite.value[index].reqMsg = ''
          myFavorite.value[index].reqResult = false
        }, 3000)
      }
    })
}
</script>

<template>
  <div v-loading="loading" class="page favorite">
    <div class="header">
      <span>我的最愛</span>
    </div>

    <main v-if="myFavorite.length > 0" class="favorite_container">
      <section v-for="(f, index) in myFavorite" :key="f.favoriteId" class="favorite-item">
        <div class="product_wrap">
          <ProductItem
            :product="f.product"
            :is-sold-out="f?.product.inStock === 0 ? true : false"
          />
        </div>

        <div class="user-operation">
          <span :class="[f.reqResult ? 'res-msg success' : 'res-msg failed']">{{ f.reqMsg }}</span>

          <IconFavoriteRemove @click="toggleFavorite(f.product.productId, index)" />

          <IconCartAdd
            v-if="!f.inCart && f?.product.inStock > 0"
            @click="updateCart(f.product.productId, index)"
          />
        </div>
      </section>
    </main>

    <main v-else class="favorite_container empty">
      <span>我的最愛是空的</span>
    </main>
  </div>
</template>
