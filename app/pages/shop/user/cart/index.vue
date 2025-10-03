<script>
import { NForm, NInputNumber, NInput, NFormItem } from 'naive-ui'
import gsap from 'gsap'
</script>

<script setup>
definePageMeta({
  layout: 'shop-layout',
  requireLoginCheck: true,
  requireLogin: true
})

const userStore = useUserStore()
const { user, isUserLogin } = storeToRefs(userStore)

const { queryMyCartApi, updateCartApi, removeFromCartApi, emptyCartApi, createOrderApi } =
  useUserApi()

const myCart = ref([])
const cartSummary = reactive({ totalQuantity: 0, grandTotal: 0 })

// 查詢我的購物車
function queryMyCart() {
  if (!isUserLogin.value) return

  queryMyCartApi().then((res) => {
    if (res.status === 'success') {
      const data = res.data.products

      data.forEach((f) => {
        f.reqMsg = ''
        f.reqResult = false
      })
      myCart.value = [...data]

      cartSummary.totalQuantity = res.data.summary.totalQuantity
      cartSummary.grandTotal = res.data.summary.grandTotal
    }
  })
}

// 預設查詢
if (import.meta.client) {
  queryMyCart()
}

// 更新購物車
function updateCart(v, productId, index) {
  if (!isUserLogin.value) {
    navigateTo('/shop/products')
    return
  }

  const query = {
    productId,
    quantity: v
  }

  updateCartApi(query)
    .then((res) => {
      if (res.status === 'success') {
        queryMyCart()
      }
    })
    .catch((err) => {
      if (err.status === 401) {
        navigateTo('/shop/products')
      } else {
        myCart.value[index].reqMsg = err.data.message
        myCart.value[index].reqResult = false

        setTimeout(() => {
          myCart.value[index].reqMsg = ''
          myCart.value[index].reqResult = false
        }, 3000)
      }
    })
}

// 移除購物車商品
function removeFromCart(cartId, index) {
  if (!isUserLogin.value) {
    navigateTo('/shop/products')
    return
  }

  const query = { cartId }

  removeFromCartApi(query)
    .then((res) => {
      if (res.status === 'success') {
        queryMyCart()
      }
    })
    .catch((err) => {
      if (err.status === 401) {
        navigateTo('/shop/products')
      } else {
        myCart.value[index].reqMsg = err.data.message
        myCart.value[index].reqResult = false

        setTimeout(() => {
          myCart.value[index].reqMsg = ''
          myCart.value[index].reqResult = false
        }, 3000)
      }
    })
}

// 清空購物車
function emptyCart() {
  if (!isUserLogin.value) {
    navigateTo('/shop/products')
    return
  }

  emptyCartApi()
    .then((res) => {
      if (res.status === 'success') {
        navigateTo('/shop/products')
      }
    })
    .catch((err) => {
      if (err.status === 401) {
        navigateTo('/shop/products')
      }
    })
}

// 下訂單
const orderFormRef = ref(null)

const orderQuery = reactive({
  productsOrdered: [],
  receiver: '',
  receiverAddress: '',
  receiverPhoneNumber: '',
  note: ''
})

const isValidatedPass = reactive({
  receiver: false,
  receiverAddress: user.value.address ? true : false,
  receiverPhoneNumber: user.value.phoneNumber ? true : false
})

const serverErrors = reactive({
  receiver: '',
  receiverPhoneNumber: ''
})

function clearServerError(field) {
  serverErrors[field] = ''
}

const showOrderForm = ref(false)

function toggleOrderForm(v) {
  if (!isUserLogin.value) {
    navigateTo('/shop/products')
    return
  }

  if (!user.value.active) return

  showOrderForm.value = v

  orderQuery.receiverAddress = user.value.address
  orderQuery.receiverPhoneNumber = user.value.phoneNumber

  nextTick(() => {
    const orderForm = document.getElementById('order-form')

    if (v && orderForm) {
      gsap.to(orderForm, { opacity: 1, duration: 0.3 })

      orderFormRef.value?.validate()

      return
    }
  })
}

const phoneRule = '手機號碼格式 09xx-xxx-xxx'
const rules = {
  receiver: [
    { required: true, message: '收件人必填', trigger: 'blur' },
    {
      async validator(_, value) {
        if (value.trim().length > 0 && value.trim().length < 2) {
          serverErrors.receiver = '收件人姓名至少兩個字'
          isValidatedPass.receiver = false
        }

        if (value.trim().length >= 2) {
          serverErrors.receiver = ''
          isValidatedPass.receiver = true
        }
      },
      trigger: 'blur'
    }
  ],
  receiverAddress: [
    { required: true, message: '收件人地址必填', trigger: 'blur' },
    {
      async validator(_, value) {
        if (value && value.trim().length > 0) {
          isValidatedPass.receiverAddress = true

          return
        }

        isValidatedPass.receiverAddress = false
      },
      trigger: 'blur'
    }
  ],
  receiverPhoneNumber: [
    { required: true, message: '收件人電話必填', trigger: 'blur' },
    {
      async validator(_, value) {
        if (value && value.trim().length > 0) {
          const check = isValidPhoneNumber(value)

          if (!check) {
            serverErrors.receiverPhoneNumber = phoneRule
            isValidatedPass.receiverPhoneNumber = false

            return
          }

          serverErrors.receiverPhoneNumber = ''
          isValidatedPass.receiverPhoneNumber = true
        }
      },
      trigger: 'blur'
    }
  ]
}

const reqResult = ref(false)
const reqMsg = ref('')

function createOrder() {
  if (!isUserLogin.value) {
    navigateTo('/shop/products')
    return
  }

  if (!user.value.active) return

  const check = []

  for (const key in isValidatedPass) {
    if (!isValidatedPass[key]) check.push('failed')
  }

  if (check.length > 0) return

  const productsOrdered = []

  myCart.value.forEach((c) => {
    if (c.product.inStock * 1 > 0 && c.product.enable) {
      productsOrdered.push({
        productId: c.product.productId,
        quantity: c.quantity * 1
      })
    }
  })

  const query = {
    productsOrdered,
    receiver: orderQuery.receiver,
    receiverAddress: orderQuery.receiverAddress,
    receiverPhoneNumber: orderQuery.receiverPhoneNumber,
    note: orderQuery.note
  }

  createOrderApi(query)
    .then((res) => {
      if (res.status === 'success') {
        navigateTo('/shop/products')
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
  <div class="page cart">
    <div class="header">
      <span>我的購物車</span>
    </div>

    <main v-if="cartSummary.grandTotal > 0" class="cart_container">
      <section class="cart-operation">
        <article class="cart-summary">
          <div class="total-quantity_wrap">
            <span>數量</span>
            <span class="total-quantity">{{ cartSummary.totalQuantity }}</span>
            <span>件</span>
          </div>

          <div class="total-price_wrap">
            <span>總價</span>
            <span class="price">{{ formatCurrency(cartSummary.grandTotal) }}</span>
            <span>NTD</span>
          </div>
        </article>

        <article class="action_wrap">
          <div
            v-if="!showOrderForm && user.active"
            class="btn empty-cart"
            @click="toggleOrderForm(true)"
          >
            <span>我要下訂單</span>
          </div>
        </article>
      </section>

      <hr />

      <section v-if="showOrderForm && user.active" id="order-form">
        <n-form ref="orderFormRef" :model="orderQuery" :rules="rules">
          <n-form-item
            label="收件人姓名"
            path="receiver"
            :feedback="serverErrors.receiver"
            :validation-status="serverErrors.receiver ? 'error' : undefined"
          >
            <n-input
              v-model:value="orderQuery.receiver"
              placeholder="收件人姓名至少兩個字"
              @focus="() => clearServerError('receiver')"
              @update:value="() => clearServerError('receiver')"
            />
          </n-form-item>

          <n-form-item
            label="收件人電話"
            path="receiverPhoneNumber"
            :feedback="serverErrors.receiverPhoneNumber"
            :validation-status="serverErrors.receiverPhoneNumber ? 'error' : undefined"
          >
            <n-input
              v-model:value="orderQuery.receiverPhoneNumber"
              :placeholder="phoneRule"
              @focus="() => clearServerError('receiverPhoneNumber')"
              @update:value="() => clearServerError('receiverPhoneNumber')"
            />
          </n-form-item>

          <n-form-item
            label="收件人地址"
            path="receiverAddress"
            :feedback="serverErrors.receiverAddress"
            :validation-status="serverErrors.receiverAddress ? 'error' : undefined"
          >
            <n-input
              v-model:value="orderQuery.receiverAddress"
              placeholder=""
              @focus="() => clearServerError('receiverAddress')"
              @update:value="() => clearServerError('receiverAddress')"
            />
          </n-form-item>

          <n-form-item label="備註" path="note">
            <n-input v-model:value="orderQuery.note" type="textarea" placeholder="" />
          </n-form-item>
        </n-form>

        <div class="action_wrap">
          <span :class="[reqResult ? 'res-msg success' : 'res-msg failed']">{{ reqMsg }}</span>

          <div class="btn" @click="toggleOrderForm(false)">
            <span>取消下單</span>
          </div>

          <div class="btn" @click="createOrder">
            <span>確定下單</span>
          </div>
        </div>
      </section>

      <hr v-if="showOrderForm && user.active" />

      <div class="btn empty-cart" @click="emptyCart">
        <span>清空購物車</span>
      </div>

      <section v-for="(c, index) in myCart" :key="c.cartId" class="cart-item">
        <div class="cart-item_container">
          <ProductItem
            :product="c.product"
            :is-sold-out="c?.product.inStock === 0 ? true : false"
          />

          <div class="user-operation">
            <IconCartRemove @click="removeFromCart(c.cartId, index)" />

            <div class="quantity_wrap">
              <span :class="[c.reqResult ? 'res-msg success' : 'res-msg failed']">{{
                c.reqMsg
              }}</span>

              <n-input-number
                v-if="c?.product.inStock > 0"
                v-model:value="c.quantity"
                size="large"
                min="1"
                :max="c.product.inStock"
                placeholder=""
                @update:value="(val) => updateCart(val, c.product.productId, index)"
              />
            </div>
          </div>
        </div>

        <hr v-if="c?.product.inStock > 0" />

        <div v-if="c?.product.inStock > 0" class="price_wrap">
          <span>小記</span>
          <span class="price">{{ formatCurrency(c.totalPrice) }}</span>
          <span class="price-unit">NTD </span>
        </div>
      </section>
    </main>

    <main v-else class="cart_container empty">
      <span>購物車是空的</span>
    </main>
  </div>
</template>
