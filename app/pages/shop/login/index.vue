<script>
import { NForm, NFormItem, NInput } from 'naive-ui'
</script>

<script setup>
definePageMeta({
  layout: 'shop-layout'
})

const productStore = useProductStore()
const { productPath } = storeToRefs(productStore)

const user = reactive({
  account: 'sayoko',
  pwd: '@Test1234'
})

const rules = {
  account: [{ required: true, message: '請輸入帳號', trigger: 'blur' }],
  pwd: [{ required: true, message: '請輸入密碼', trigger: 'blur' }]
}

const serverErrors = reactive({
  account: '',
  pwd: ''
})

function clearServerError() {
  serverErrors.account = ''
  serverErrors.pwd = ''
}

const showPwd = ref(false)
function togglePwd() {
  showPwd.value = !showPwd.value
}

const { signInApi } = useUserApi()

function signIn() {
  if (user.account.trim() === '' || user.pwd.trim() === '') return

  const query = {
    account: user.account.trim(),
    pwd: user.pwd.trim()
  }

  signInApi(query)
    .then((res) => {
      if (res.status === 'success') {
        navigateTo(productPath.value)
      }
    })
    .catch((err) => {
      if (err) {
        const msg = '請檢查帳號, 密碼是否正確'

        serverErrors.account = msg
        serverErrors.pwd = msg
      }
    })
}
</script>

<template>
  <div class="page login">
    <main class="login_container">
      <n-form :model="user" :rules="rules">
        <n-form-item
          label="帳號"
          path="account"
          :feedback="serverErrors.account"
          :validation-status="serverErrors.account ? 'error' : undefined"
        >
          <n-input
            v-model:value="user.account"
            placeholder=""
            @focus="() => clearServerError()"
            @update:value="() => clearServerError()"
          />
        </n-form-item>

        <n-form-item
          label="密碼"
          path="pwd"
          :feedback="serverErrors.pwd"
          :validation-status="serverErrors.pwd ? 'error' : undefined"
        >
          <n-input
            v-model:value="user.pwd"
            :type="showPwd ? 'text' : 'password'"
            placeholder=""
            @focus="() => clearServerError()"
            @update:value="() => clearServerError()"
          >
            <template #suffix>
              <IconEyeClose v-if="showPwd" width="24px" height="24px" @click="togglePwd" />
              <IconEyeOpen v-else width="24px" height="24px" @click="togglePwd" />
            </template>
          </n-input>
        </n-form-item>
      </n-form>

      <div class="action_wrap">
        <div class="btn btn-login" @click="signIn">
          <span>登入</span>
        </div>

        <div class="btn btn-login" @click="navigateTo('/shop/register')">
          <span>沒有帳號 ?</span>
        </div>
      </div>

      <span class="forgot" @click="navigateTo('/shop/forgot/email')">忘記密碼 ?</span>
    </main>
  </div>
</template>
