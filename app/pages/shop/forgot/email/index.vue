<script>
import { NForm, NFormItem, NInput } from 'naive-ui'
</script>

<script setup>
definePageMeta({
  layout: 'shop-layout'
})

const user = reactive({
  email: ''
})

const serverErrors = reactive({
  email: ''
})

function clearServerError() {
  serverErrors.email = ''
}

const isValidatedPass = ref(false)

const rules = {
  email: [
    { required: true, message: '請輸入信箱', trigger: 'blur' },
    {
      async validator(_, value) {
        querySuccessMsg.value = ''

        if (value.trim().length === 0) {
          isValidatedPass.value = false
        }

        if (value.trim().length > 0) {
          const check = isValidEmail(value)
          if (!check) {
            isValidatedPass.value = false
            return (serverErrors.email = '信箱格式錯誤')
          }

          serverErrors.email = ''
          isValidatedPass.value = true
        }
      },
      trigger: 'blur'
    }
  ]
}

const { forgotPwdApi } = useUserApi()
const querySuccessMsg = ref('')
const loading = ref(false)

function queryResetLink() {
  querySuccessMsg.value = ''

  if (!isValidatedPass.value) return

  loading.value = true

  const query = {
    email: user.email
  }

  forgotPwdApi(query)
    .then((res) => {
      if (res.status === 'success') {
        querySuccessMsg.value = '已設定連結發送至信箱'
      }
    })
    .catch((err) => {
      serverErrors.email = '請檢察信箱是否正確'
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<template>
  <div v-loading="loading" class="page forgot">
    <main class="forgot_container">
      <n-form :model="user" :rules="rules">
        <n-form-item
          label="信箱"
          path="email"
          :feedback="serverErrors.email"
          :validation-status="serverErrors.email ? 'error' : undefined"
        >
          <n-input
            v-model:value="user.email"
            placeholder=""
            clearable
            @focus="() => clearServerError('email')"
            @update:value="() => clearServerError('email')"
          />
        </n-form-item>
      </n-form>

      <div class="action_wrap">
        <div class="btn btn-forgot" @click="queryResetLink">
          <span>取得密碼設定連結</span>
        </div>
      </div>

      <span
        v-show="querySuccessMsg.length > 0"
        :class="[querySuccessMsg.length > 0 ? 'query-success active' : 'query-success']"
        >{{ querySuccessMsg }}</span
      >
    </main>
  </div>
</template>
