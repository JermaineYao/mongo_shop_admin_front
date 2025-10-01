<script setup>
// 目前路由
const route = useRoute()

const userStore = useUserStore()
const { user, isUserLogin } = storeToRefs(userStore)
const { resetUser } = userStore

const productStore = useProductStore()
const { productPath } = storeToRefs(productStore)

const { signOutApi } = useUserApi()

function logout() {
  signOutApi().then((res) => {
    if (res.status === 'success') {
      resetUser()
    }
  })
}

console.log(route.name)
</script>

<template>
  <div class="shop-nav">
    <LogoSmall @click="navigateTo('/')" />
    <LogoMobile @click="navigateTo('/')" />

    <div class="actions_container">
      <div v-if="route.name !== 'shop-products'" class="icon_wrap" @click="navigateTo(productPath)">
        <IconShop width="33px" />
      </div>

      <div
        v-if="route.name !== 'shop-products' && route.name !== 'shop-login'"
        class="line-verticle"
      ></div>

      <div
        v-if="isUserLogin && user?.photo.url && route.name !== 'shop-user'"
        class="icon_wrap user-icon"
        :style="{
          background: `url(${user.photo.url}) center/cover no-repeat`
        }"
        @click="navigateTo('/shop/user')"
      ></div>

      <div
        v-if="isUserLogin && !user?.photo.url && route.name !== 'shop-user'"
        class="icon_wrap"
        @click="navigateTo('/shop/user')"
      >
        <IconUser />
      </div>

      <div
        v-if="isUserLogin && route.name !== 'shop-user' && route.name !== 'shop-login'"
        class="line-verticle"
      ></div>

      <div
        v-if="isUserLogin && route.name !== 'shop-user-favorite'"
        class="icon_wrap"
        @click="navigateTo('/shop/user/favorite')"
      >
        <IconFavorite />
      </div>

      <div
        v-if="isUserLogin && route.name !== 'shop-user-cart' && user.active"
        class="icon_wrap"
        @click="navigateTo('/shop/user/cart')"
      >
        <IconCart />
      </div>

      <div
        v-if="isUserLogin && route.name !== 'shop-user-order' && user.active"
        class="icon_wrap"
        @click="navigateTo('/shop/user/order')"
      >
        <IconOrder />
      </div>

      <div v-if="isUserLogin && route.name !== 'shop-login'" class="icon_wrap" @click="logout">
        <IconLogout />
      </div>

      <div
        v-if="!isUserLogin && route.name !== 'shop-login'"
        class="icon_wrap"
        @click="navigateTo('/shop/login')"
      >
        <IconLogin />
      </div>
    </div>
  </div>
</template>
