<script setup>
// 目前路由
const route = useRoute()
</script>

<template>
  <div class="shop-nav">
    <LogoSmall @click="navigateTo('/')" />
    <LogoMobile @click="navigateTo('/')" />

    <div class="actions_container">
      <div v-if="route.name !== 'shop'" class="icon_wrap" @click="navigateTo('/shop/product_list')">
        <IconShop />
      </div>

      <div v-if="route.name !== 'shop'" class="line-verticle"></div>

      <div class="icon_wrap" @click="navigateTo('/user')">
        <IconUser />
      </div>

      <div class="icon_wrap user-icon" @click="navigateTo('/user')"></div>

      <div class="line-verticle"></div>

      <div class="icon_wrap" @click="navigateTo('/favorite')">
        <IconFavorite />
      </div>

      <div class="icon_wrap" @click="navigateTo('/cart')">
        <IconCart />
      </div>

      <div class="icon_wrap" @click="navigateTo('/order')">
        <IconOrder />
      </div>

      <div class="icon_wrap" @click="logout">
        <IconLogout />
      </div>

      <div class="icon_wrap" @click="navigateTo('/login')">
        <IconLogin />
      </div>
    </div>
  </div>
</template>
