<script></script>

<script setup>
definePageMeta({
  layout: 'shop-layout',
  requireLoginCheck: true,
  requireLogin: true
})

const userStore = useUserStore()
const { isUserLogin } = storeToRefs(userStore)

const { queryMyOrdersApi } = useUserApi()

const orders = ref([])

function queryMyOrders() {
  if (!isUserLogin.value) return

  queryMyOrdersApi().then((res) => {
    if (res.status === 'success') {
      const data = res.data
      data.forEach((d) => {
        d.open = false
      })

      orders.value = [...data]
    }
  })
}

// 預設查詢
if (import.meta.client) {
  queryMyOrders()
}

// 查看訂單
function toOrder(orderNo) {
  if (!isUserLogin.value) navigateTo('/shop/products')

  navigateTo(`/shop/user/order/${orderNo}`)
}
</script>

<template>
  <div class="page order">
    <div class="header">
      <span>我的訂單</span>
    </div>

    <main v-if="orders.length > 0" class="order_container">
      <section
        v-for="order in orders"
        :key="order.orderNo"
        class="order-item"
        @click="toOrder(order.orderNo)"
      >
        <article class="order-main">
          <div class="order-no_wrap">
            <span class="order-no">{{ order.orderNo }}</span>
            <div :class="orderStatusClass(order.orderStatus)">
              <span>{{ orderStatusName(order.orderStatus) }}</span>
            </div>
          </div>

          <span class="created-date">{{ twTime(order.createdAt) }}</span>

          <div class="order-total_wrap">
            <span class="price">{{ formatCurrency(order.totalAmount) }}</span>
            <span class="unit">NTD </span>
          </div>
        </article>

        <div class="order-products">
          <span>購買商品</span>

          <div class="product_wrap">
            <template v-for="(p, i) in order.productsOrdered" :key="i">
              <div
                class="product"
                :style="{
                  background: `url(${p.mainPhoto.url}) center/cover no-repeat`
                }"
              ></div>
            </template>
          </div>
        </div>
      </section>
    </main>

    <main v-else class="order_container empty">
      <span>尚無訂單</span>
    </main>
  </div>
</template>
