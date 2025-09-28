<script></script>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    default: () => null
  },
  isSoldOut: {
    type: Boolean,
    default: false
  }
})

const product = props.product
const isSoldOut = props.isSoldOut
</script>

<template>
  <article
    class="product-item_container"
    @click="navigateTo(`/shop/products/${product.productId}`)"
  >
    <div class="product-img_wrap">
      <div
        class="product-image"
        :style="{
          background: `url(${product?.mainPhoto?.url}) center/cover no-repeat`
        }"
      ></div>

      <div v-if="isSoldOut" class="sold-out_wrap">
        <span class="sold-out">已售完</span>
      </div>
    </div>

    <div class="product-main">
      <div class="names">
        <span class="name-main">{{ product?.productNameMain }}</span>
        <span class="name-sub">{{ product?.productNameSub }}</span>
      </div>

      <span class="category">{{ getCategory(product?.category) }}</span>

      <div class="price_wrap">
        <span class="price">{{ formatCurrency(product?.price) }}</span>
        <span class="price-unit">NTD / 件</span>
      </div>
    </div>
  </article>
</template>
