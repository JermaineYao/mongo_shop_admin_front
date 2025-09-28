<script></script>

<script setup>
definePageMeta({
  layout: 'shop-layout',
  requireLoginCheck: true,
  requireLogin: true
})

const { queryMyOrdersApi } = useUserApi()

const orders = ref([])

function queryMyOrders() {
  queryMyOrdersApi().then((res) => {
    console.log(res)
    if (res.status === 'success') {
      const data = res.data
      data.forEach((d) => {
        d.open = false
      })

      orders.value = [...data]
    }
  })
}

queryMyOrders()
</script>

<template>
  <div class="page order">
    <div class="header">
      <span>我的訂單</span>
    </div>

    <main v-if="orders.length > 0" class="order_container">
      <section v-for="order in orders" :key="order.orderNo" class="order-item">
        <article>
          <div class="order-no_wrap">
            <span>編號</span>
            <span class="order-no">{{ order.orderNo }}</span>
          </div>

          <div class="order-created">
            <span>日期</span>
            <span>{{ twTime(order.createdAt) }}</span>
          </div>

          <div class="order-total_wrap">
            <span>總額</span>
            <span class="order-no">{{ formatCurrency(order.totalAmount) }}</span>
            <span class="unit">NTD </span>
          </div>

          <div class="order-total_wrap">
            <span>狀態</span>
            <span class="order-no">{{ orderStatusName(order.orderStatus) }}</span>
          </div>

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
                <span>x</span>
                <span>{{ p.quantity }}</span>
              </template>
            </div>
          </div>
        </article>
      </section>
    </main>

    <main v-else class="order_container empty">
      <span>尚無訂單</span>
    </main>
  </div>
</template>
