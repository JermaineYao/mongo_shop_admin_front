<script></script>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    default: () => null
  }
})

const product = props.product
</script>

<template>
  <article class="product-item_container">
    <div
      class="product-image"
      :style="{
        background: `url(${product?.mainPhoto?.url}) center/cover no-repeat`
      }"
    ></div>

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
