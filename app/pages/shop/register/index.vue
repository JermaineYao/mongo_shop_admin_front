<script>
import { NForm, NFormItem, NInput } from 'naive-ui'
</script>

<script setup>
definePageMeta({
  layout: 'shop-layout',
  requireLogin: false
})

const { checkAccountEmailApi, resgisterApi } = useUserApi()

const user = reactive({
  account: '',
  email: '',
  pwd: '',
  pwdConfirm: '',
  phoneNumber: '',
  address: ''
})

const pwdRule = '至少8位元、包含一個大寫、小寫英文字母、數字、特殊字元'
const phoneRule = '手機號碼格式 09xx-xxx-xxx'

const isValidatedPass = reactive({
  account: false,
  email: false,
  pwd: false,
  pwdConfirm: false,
  phoneNumber: true
})

const serverErrors = reactive({
  account: '',
  email: '',
  pwd: '',
  pwdConfirm: '',
  phoneNumber: ''
})

function clearServerError(field) {
  serverErrors[field] = ''
}

const rules = {
  account: [
    { required: true, message: '帳號必填', trigger: 'blur' },
    {
      async validator(_, value) {
        if (value.trim().length === 0) {
          isValidatedPass.account = false
        }

        if (value.trim().length > 0) {
          const query = { account: value }

          const check = isValidAccount(value)
          if (!check) {
            isValidatedPass.account = false
            return (serverErrors.account = '帳號只能是英文字母開頭，後面可接英文或數字')
          }

          checkAccountEmailApi(query)
            .then((res) => {
              if (res.status === 'success') {
                serverErrors.account = ''
                isValidatedPass.account = true
              }
            })
            .catch((err) => {
              const msg = err.message
              serverErrors.account = msg
              isValidatedPass.account = false
            })
        }
      },
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '信箱必填', trigger: 'blur' },
    {
      async validator(_, value) {
        if (value.trim().length === 0) {
          isValidatedPass.account = false
        }

        if (value.trim().length > 0) {
          const query = { email: value }

          const check = isValidEmail(value)
          if (!check) {
            isValidatedPass.email = false
            return (serverErrors.email = '信箱格式錯誤')
          }

          checkAccountEmailApi(query)
            .then((res) => {
              if (res.status === 'success') {
                serverErrors.email = ''
                isValidatedPass.email = true
              }
            })
            .catch((err) => {
              const msg = err.message
              serverErrors.email = msg
              isValidatedPass.email = false
            })
        }
      },
      trigger: 'blur'
    }
  ],
  pwd: [
    { required: true, message: '密碼必填', trigger: 'blur' },
    {
      async validator(_, value) {
        user.pwdConfirm = ''
        serverErrors.pwdConfirm = ''
        isValidatedPass.pwdConfirm = false

        if (value.trim().length === 0) {
          isValidatedPass.pwd = false
        }

        if (value.trim().length > 0) {
          const check = isValidPwd(value)
          if (!check) {
            isValidatedPass.pwd = false
            return (serverErrors.pwd = pwdRule)
          }

          serverErrors.pwd = ''
          isValidatedPass.pwd = true
        }
      },
      trigger: 'blur'
    }
  ],
  pwdConfirm: [
    { required: true, message: '密碼確認必填', trigger: 'blur' },
    {
      async validator(_, value) {
        if (value.trim().length === 0) {
          isValidatedPass.pwdConfirm = false
        }

        if (value.trim().length > 0) {
          if (value === user.pwd) {
            serverErrors.pwdConfirm = ''
            isValidatedPass.pwdConfirm = true
          } else {
            if (isValidatedPass.pwd && user.pwd.trim().length > 0) {
              serverErrors.pwdConfirm = '與密碼不一致'
              isValidatedPass.pwdConfirm = false
            }

            if (!isValidatedPass.pwd || user.pwd.trim().length === 0) {
              user.pwdConfirm = ''
              serverErrors.pwdConfirm = ''
              isValidatedPass.pwdConfirm = false
            }
          }
        }
      },
      trigger: 'blur'
    }
  ],
  phoneNumber: {
    async validator(_, value) {
      if (value.trim().length > 0) {
        const check = isValidPhoneNumber(value)

        if (!check) {
          serverErrors.phoneNumber = phoneRule
          isValidatedPass.phoneNumber = false
        }
      }

      if (value.trim().length === 0) {
        serverErrors.phoneNumber = ''
        isValidatedPass.phoneNumber = true
      }
    },
    trigger: 'blur'
  }
}

const showPwdContent = reactive({
  pwd: false,
  pwdConfirm: false
})

function togglePwdContent(field) {
  showPwdContent[field] = !showPwdContent[field]
}

// 註冊
const registerErr = ref('')

function resgister() {
  registerErr.value = ''

  const check = []
  for (const key in isValidatedPass) {
    if (!isValidatedPass[key]) check.push(false)
  }

  if (check.length > 0) return

  const query = {}

  for (const key in user) {
    if (key !== 'pwdConfirm' && user[key].trim().length > 0) {
      query[key] = user[key].trim()
    }
  }

  resgisterApi(query)
    .then((res) => {
      if (res.status === 'success') {
        navigateTo('/shop/login')
      }
    })
    .catch((err) => {
      const msg = err.message
      registerErr.value = msg
    })
}
</script>

<template>
  <div class="page register">
    <main class="register_container">
      <n-form :model="user" :rules="rules">
        <n-form-item
          label="帳號"
          path="account"
          :feedback="serverErrors.account"
          :validation-status="serverErrors.account ? 'error' : undefined"
        >
          <n-input
            v-model:value="user.account"
            placeholder="英文字母開頭，後面可接英文或數字"
            @focus="() => clearServerError('account')"
            @update:value="() => clearServerError('account')"
          />
        </n-form-item>

        <n-form-item
          label="信箱"
          path="email"
          :feedback="serverErrors.email"
          :validation-status="serverErrors.email ? 'error' : undefined"
        >
          <n-input
            v-model:value="user.email"
            placeholder=""
            @focus="() => clearServerError('email')"
            @update:value="() => clearServerError('email')"
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
            :type="showPwdContent.pwd ? 'text' : 'password'"
            :placeholder="pwdRule"
            @focus="() => clearServerError('pwd')"
            @update:value="() => clearServerError('pwd')"
          >
            <template #suffix>
              <IconEyeClose
                v-if="showPwdContent.pwd"
                width="24px"
                height="24px"
                @click="togglePwdContent('pwd')"
              />
              <IconEyeOpen v-else width="24px" height="24px" @click="togglePwdContent('pwd')" />
            </template>
          </n-input>
        </n-form-item>

        <n-form-item
          label="密碼確認"
          path="pwdConfirm"
          :feedback="serverErrors.pwdConfirm"
          :validation-status="serverErrors.pwdConfirm ? 'error' : undefined"
        >
          <n-input
            v-model:value="user.pwdConfirm"
            :type="showPwdContent.pwdConfirm ? 'text' : 'password'"
            placeholder="必須與密碼相同"
            @focus="() => clearServerError('pwdConfirm')"
            @update:value="() => clearServerError('pwdConfirm')"
          >
            <template #suffix>
              <IconEyeClose
                v-if="showPwdContent.pwdConfirm"
                width="24px"
                height="24px"
                @click="togglePwdContent('pwdConfirm')"
              />
              <IconEyeOpen
                v-else
                width="24px"
                height="24px"
                @click="togglePwdContent('pwdConfirm')"
              />
            </template>
          </n-input>
        </n-form-item>

        <n-form-item
          label="手機號碼"
          path="phoneNumber"
          :feedback="serverErrors.phoneNumber"
          :validation-status="serverErrors.phoneNumber ? 'error' : undefined"
        >
          <n-input
            v-model:value="user.phoneNumber"
            :placeholder="phoneRule"
            @focus="() => clearServerError('phoneNumber')"
            @update:value="() => clearServerError('phoneNumber')"
          />
        </n-form-item>

        <n-form-item label="地址">
          <n-input v-model:value="user.address" placeholder="" />
        </n-form-item>
      </n-form>

      <div class="action_wrap">
        <div class="btn btn-signup" @click="resgister">
          <span>註冊</span>
        </div>

        <!-- <span v-if="registerErr.length > 0" class="register-err">{{ registerErr }}</span> -->
        <span class="register-err">註冊失敗，請稍後再試</span>
      </div>
    </main>
  </div>
</template>
