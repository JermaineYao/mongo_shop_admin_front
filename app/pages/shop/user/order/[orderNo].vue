<script></script>

<script setup>
definePageMeta({
  layout: 'shop-layout',
  requireLoginCheck: true,
  requireLogin: true
})

const userStore = useUserStore()
const { user, isUserLogin } = storeToRefs(userStore)

const route = useRoute()
const orderNo = route.params.orderNo

const { queryOrderApi, cancelOrderApi } = useUserApi()

const order = reactive({})

function queryOrder() {
  queryOrderApi(orderNo).then((res) => {
    if (res.status === 'success') {
      const data = res.data

      for (const key in data) {
        order[key] = data[key]
      }
    }
  })
}

// 預設查詢
if (import.meta.client) {
  queryOrder()
}

// 取消訂單
const reqResult = ref(false)
const reqMsg = ref('')

function cancelOrder() {
  if (!isUserLogin.value) {
    return navigateTo('/shop/products')
  }

  if (!user.value.active) {
    reqMsg.value = '帳戶未啟用'

    setTimeout(() => {
      user.value.active = false
      reqMsg.value = ''
    }, 3000)

    return
  }

  cancelOrderApi(order._id)
    .then((res) => {
      if (res.status === 'success') {
        queryOrder()
      }
    })
    .catch((err) => {
      reqMsg.value = err.data.message

      if (err.status === 401) {
        navigateTo('/shop/products')
      } else if (err.status === 403) {
        setTimeout(() => {
          user.value.active = false
          reqMsg.value = ''
        }, 3000)
      } else {
        setTimeout(() => {
          reqMsg.value = ''
        }, 3000)
      }
    })
}
</script>

<template>
  <div class="page order-detail">
    <main class="order-detail_container">
      <div class="btn go-back" @click="navigateTo('/shop/user/order')">
        <IconReturnLeft />
        <span>回到我的訂單</span>
      </div>

      <div class="order-detail-head">
        <div class="order-status_wrap">
          <span class="order-no">{{ order?.orderNo }}</span>

          <div :class="orderStatusClass(order.orderStatus)">
            <span>{{ orderStatusName(order.orderStatus) }}</span>
          </div>
        </div>

        <div class="created-date item_wrap">
          <span class="item-name">建立時間</span>
          <span class="item-value">{{ twTime(order?.createdAt) }}</span>
        </div>

        <div class="updated-date item_wrap">
          <span class="item-name">更新時間</span>
          <span class="item-value">{{ twTime(order?.updatedAt) }}</span>
        </div>

        <div class="account item_wrap">
          <span class="item-name">帳號</span>
          <span class="item-value">{{ order?.account }}</span>
        </div>

        <div class="email item_wrap">
          <span class="item-name">信箱</span>
          <span class="item-value">{{ order?.email }}</span>
        </div>

        <hr />

        <div class="action_wrap">
          <span :class="[reqResult ? 'res-msg success' : 'res-msg failed']">{{ reqMsg }}</span>

          <div
            v-if="['pending', 'shipping'].includes(order?.orderStatus) && user.active"
            class="btn"
            @click="cancelOrder"
          >
            <span>取消訂單</span>
          </div>
        </div>
      </div>

      <section class="order-detail-body">
        <article class="receiver_wrap">
          <div class="total item_wrap">
            <span class="item-name">總金額</span>
            <span class="item-value">{{ formatCurrency(order?.totalAmount) }}</span>
            <span class="item-unit">NTD</span>
          </div>

          <div class="quantity item_wrap">
            <span class="item-name">購買件數</span>
            <span class="item-value">{{ order?.sumQuantity }}</span>
            <span class="item-unit">件</span>
          </div>

          <div class="receiver item_wrap">
            <span class="item-name">收件人</span>
            <span class="item-value">{{ order?.receiver }}</span>
          </div>

          <div class="receiver-address item_wrap">
            <span class="item-name">收件地址</span>
            <span class="item-value">{{ order?.receiverAddress }}</span>
          </div>

          <div class="receiver-phone item_wrap">
            <span class="item-name">收件人連絡電話</span>
            <span class="item-value">{{ order?.receiverPhoneNumber }}</span>
          </div>
        </article>

        <div v-for="p in order?.productsOrdered" :key="p.productId" class="products-ordered">
          <ProductItem :product="p" />
          <hr />

          <div class="summary">
            <div class="summary-item item_wrap">
              <span class="item-name">購買件數</span>
              <span class="item-value">{{ p.quantity }}</span>
              <span class="item-unit">件</span>
            </div>

            <div class="summary-item item_wrap">
              <span class="item-name">小記 </span>
              <span class="item-value">{{ formatCurrency(p.subtotal) }}</span>
              <span class="item-unit">NTD</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
