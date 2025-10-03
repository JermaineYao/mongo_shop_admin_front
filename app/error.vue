<script setup>
const props = defineProps({
  error: {
    type: Object,
    default: () => null
  }
})

const statusCode = props.error?.statusCode || 500

function returnLastPage() {
  navigateTo('/shop/products')
}
</script>

<template>
  <div class="not-found">
    <Logo />

    <div class="not-found_wrap">
      <span class="not-found-404">
        {{ statusCode === 404 ? '404 Not Found' : 'Something went wrong' }}</span
      >

      <div class="btn-return" @click="returnLastPage">
        <span>回商品清單</span>
      </div>
    </div>
  </div>
</template>
