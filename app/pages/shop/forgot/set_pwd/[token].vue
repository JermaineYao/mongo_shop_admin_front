<script>
import { NForm, NFormItem, NInput } from 'naive-ui'
</script>

<script setup>
definePageMeta({
  layout: 'shop-layout'
})

const pwdRule = '至少8位元、包含一個大寫、小寫英文字母、數字、特殊字元'

const route = useRoute()
const token = route.params.token

const user = reactive({
  newPWD: '',
  confirmNewPWD: ''
})

const isValidatedPass = reactive({
  newPWD: false,
  confirmNewPWD: false
})

const serverErrors = reactive({
  newPWD: '',
  confirmNewPWD: ''
})

function clearServerError(field) {
  serverErrors[field] = ''
}

const rules = {
  newPWD: [
    { required: true, message: '密碼必填', trigger: 'blur' },
    {
      async validator(_, value) {
        user.confirmNewPWD = ''
        serverErrors.confirmNewPWD = ''
        isValidatedPass.confirmNewPWD = false

        if (value.trim().length === 0) {
          isValidatedPass.newPWD = false
        }

        if (value.trim().length > 0) {
          const check = isValidPwd(value)
          if (!check) {
            isValidatedPass.pwd = false
            return (serverErrors.pwd = pwdRule)
          }

          serverErrors.pwd = ''
          isValidatedPass.newPWD = true
        }
      },
      trigger: 'blur'
    }
  ],
  confirmNewPWD: [
    { required: true, message: '新密碼確認必填', trigger: 'blur' },
    {
      async validator(_, value) {
        if (value.trim().length === 0) {
          isValidatedPass.confirmNewPWD = false
        }

        if (value.trim().length > 0) {
          if (value === user.newPWD) {
            serverErrors.confirmNewPWD = ''
            isValidatedPass.confirmNewPWD = true
          } else {
            if (isValidatedPass.newPWD && user.newPWD.trim().length > 0) {
              serverErrors.confirmNewPWD = '與新密碼不一致'
              isValidatedPass.confirmNewPWD = false
            }

            if (!isValidatedPass.newPWD || user.newPWD.trim().length === 0) {
              user.confirmNewPWD = ''
              serverErrors.confirmNewPWD = ''
              isValidatedPass.confirmNewPWD = false
            }
          }
        }
      },
      trigger: 'blur'
    }
  ]
}

const showPwdContent = reactive({
  newPWD: false,
  confirmNewPWD: false
})

function togglePwdContent(field) {
  showPwdContent[field] = !showPwdContent[field]
}

const { resetPwdApi } = useUserApi()

// 註冊
const resetPwdErr = ref('')

function resetPwd() {
  resetPwdErr.value = ''

  const check = []
  for (const key in isValidatedPass) {
    if (!isValidatedPass[key]) check.push(false)
  }

  if (check.length > 0) return

  const query = {
    newPWD: user.newPWD.trim(),
    token
  }

  resetPwdApi(query)
    .then((res) => {
      if (res.status === 'success') {
        navigateTo('/shop/products')
      }
    })
    .catch((err) => {
      const msg = err.message
      resetPwdErr.value = msg
    })
}
</script>

<template>
  <div class="page set-pwd">
    <main class="set-pwd_container">
      <n-form :model="user" :rules="rules">
        <n-form-item
          label="新密碼"
          path="newPWD"
          :feedback="serverErrors.newPWD"
          :validation-status="serverErrors.newPWD ? 'error' : undefined"
        >
          <n-input
            v-model:value="user.newPWD"
            :type="showPwdContent.newPWD ? 'text' : 'password'"
            :placeholder="pwdRule"
            @focus="() => clearServerError('newPWD')"
            @update:value="() => clearServerError('newPWD')"
          >
            <template #suffix>
              <IconEyeClose
                v-if="showPwdContent.newPWD"
                width="24px"
                height="24px"
                @click="togglePwdContent('newPWD')"
              />
              <IconEyeOpen v-else width="24px" height="24px" @click="togglePwdContent('newPWD')" />
            </template>
          </n-input>
        </n-form-item>

        <n-form-item
          label="新密碼確認"
          path="confirmNewPWD"
          :feedback="serverErrors.confirmNewPWD"
          :validation-status="serverErrors.confirmNewPWD ? 'error' : undefined"
        >
          <n-input
            v-model:value="user.confirmNewPWD"
            :type="showPwdContent.confirmNewPWD ? 'text' : 'password'"
            placeholder="必須與新密碼相同"
            @focus="() => clearServerError('confirmNewPWD')"
            @update:value="() => clearServerError('confirmNewPWD')"
          >
            <template #suffix>
              <IconEyeClose
                v-if="showPwdContent.confirmNewPWD"
                width="24px"
                height="24px"
                @click="togglePwdContent('confirmNewPWD')"
              />
              <IconEyeOpen
                v-else
                width="24px"
                height="24px"
                @click="togglePwdContent('confirmNewPWD')"
              />
            </template>
          </n-input>
        </n-form-item>
      </n-form>

      <div class="action_wrap">
        <div class="btn btn-set-pwd" @click="resetPwd">
          <span>設定新密碼</span>
        </div>
      </div>
    </main>
  </div>
</template>
