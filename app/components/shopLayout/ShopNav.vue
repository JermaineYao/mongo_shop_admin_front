<script setup>
// 目前路由
const route = useRoute()
console.log(route)

const userStore = useUserStore()
const { user, isUserLogin } = storeToRefs(userStore)
const { resetUser } = userStore

const productStore = useProductStore()
const { productPath } = storeToRefs(productStore)

const { $http } = useNuxtApp()

function logout() {
  $http.get('/user/sign_out').then((res) => {
    if (res.status === 'success') {
      resetUser()
    }
  })
}

function toLogin() {
  productPath.value = route.fullPath
  navigateTo('/shop/login')
}
</script>

<template>
  <div class="shop-nav">
    <LogoSmall @click="navigateTo('/')" />
    <LogoMobile @click="navigateTo('/')" />

    <div class="actions_container">
      <div
        v-if="route.name !== 'shop-products'"
        class="icon_wrap"
        @click="navigateTo('/shop/products')"
      >
        <IconShop />
      </div>

      <div v-if="route.name !== 'shop-products'" class="line-verticle"></div>

      <div v-if="user?.photo.url" class="icon_wrap user-icon" @click="navigateTo('/user')"></div>

      <div v-if="!user?.photo.url" class="icon_wrap" @click="navigateTo('/user')">
        <IconUser />
      </div>

      <div class="line-verticle"></div>

      <div v-if="isUserLogin" class="icon_wrap" @click="navigateTo('/favorite')">
        <IconFavorite />
      </div>

      <div v-if="isUserLogin" class="icon_wrap" @click="navigateTo('/cart')">
        <IconCart />
      </div>

      <div v-if="isUserLogin" class="icon_wrap" @click="navigateTo('/order')">
        <IconOrder />
      </div>

      <div v-if="isUserLogin" class="icon_wrap" @click="logout">
        <IconLogout />
      </div>

      <div v-if="!isUserLogin" class="icon_wrap" @click="toLogin">
        <IconLogin />
      </div>
    </div>
  </div>
</template>
