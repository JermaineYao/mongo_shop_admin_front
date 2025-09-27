<script></script>

<script setup>
import ProductItem from '~/components/ProductItem.vue'

definePageMeta({
  layout: 'shop-layout',
  requireLoginCheck: true,
  requireLogin: true
})

const { queryMyFavoriteApi, toggleFavoriteApi, updateCartApi } = useUserApi()

const myFavorite = ref([])

function queryMyFavorite() {
  queryMyFavoriteApi().then((res) => {
    if (res.status === 'success') {
      const data = res.data
      data.forEach((f) => {
        f.reqMsg = ''
        f.reqResult = false
      })
      myFavorite.value = [...res.data]
    }
  })
}

queryMyFavorite()

// 加入購物車
function updateCart(productId, index) {
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
      if (err) {
        myFavorite.value[index].reqMsg = '請稍後再試'
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
  const query = {
    productId
  }

  toggleFavoriteApi(query)
    .then((res) => {
      if (res.status === 'success') {
        queryMyFavorite()
      }
    })
    .catch((err) => {
      if (err) {
        myFavorite.value[index].reqMsg = '請稍後再試'
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
  <div class="page favorite">
    <main class="favorite_container">
      <section v-for="(f, index) in myFavorite" :key="f.favoriteId" class="favorite-item">
        <ProductItem :product="f.product" />

        <div class="user-operation">
          <span :class="[f.reqResult ? 'res-msg success' : 'res-msg failed']">{{ f.reqMsg }}</span>

          <IconFavoriteRemove @click="toggleFavorite(f.product.productId, index)" />

          <IconCartAdd v-if="!f.inCart" @click="updateCart(f.product.productId, index)" />
        </div>
      </section>
    </main>
  </div>
</template>
