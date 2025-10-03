<script>
import { NForm, NFormItem, NInput, NSwitch } from 'naive-ui'
</script>

<script setup>
definePageMeta({
  layout: 'shop-layout',
  requireLoginCheck: true,
  requireLogin: true
})

// 帳號
const userStore = useUserStore()
const { user, isUserLogin } = storeToRefs(userStore)

const {
  queryMyAccountApi,
  uploadMyPhotoApi,
  deleteMyPhotoApi,
  toggleAccountEnabledApi,
  updateContactApi,
  updatePwdApi
} = useUserApi()

function queryMyAccount() {
  queryMyAccountApi().then((res) => {
    if (res.status === 'success') {
      const userData = res.data

      if (userData.createAt) userData.createAt = twTime(userData.createAt)
      if (userData.modifiedAt) userData.modifiedAt = twTime(userData.modifiedAt)

      Object.assign(user.value, userData)
    }
  })
}

// 預設查詢
if (import.meta.client && isUserLogin.value) {
  queryMyAccount()
}

// 圖片
const fileTypes = ['jpg', 'png', 'jpeg', 'gif']

function setPhoto(e) {
  const fileChosen = e.target

  if (fileChosen && fileChosen.files && fileChosen.files.length > 0) {
    const file = fileChosen.files[0]
    const fileType = file.type.split('/')[1]

    if (!fileTypes.includes(fileType)) {
      return
    }

    uploadMyPhoto(file)
  }
}

// 上傳我的圖片
function uploadMyPhoto(file) {
  if (!isUserLogin.value) {
    navigateTo('/shop/products')
    return
  }

  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  uploadMyPhotoApi(formData).then((res) => {
    if (res.status === 'success') {
      const photoData = res.data.photo

      for (const key in user.value.photo) {
        user.value.photo[key] = photoData[key]
      }
    }
  })
}

function triggerUpload() {
  if (!isUserLogin.value) {
    navigateTo('/shop/products')
    return
  }

  const upload = document.getElementById('user-photo-upload')
  upload.value = null
  upload.click()
}

// 刪除我的圖片
function deleteMyPhoto() {
  if (!isUserLogin.value) {
    navigateTo('/shop/products')
    return
  }

  deleteMyPhotoApi().then((res) => {
    if (res.status === 'success') {
      for (const key in user.value.photo) {
        user.value.photo[key] = null
      }
    }
  })
}

// 停用,啟用 帳號
function toggleAccountEnabled(enable) {
  if (!isUserLogin.value) {
    navigateTo('/shop/products')
    return
  }

  const query = { enable }

  toggleAccountEnabledApi(query)
    .then((res) => {
      if (res.status === 'success') user.value.active = enable
    })
    .catch((err) => {
      if (err) user.value.active = !enable
    })
}

// 地址, 電話
const phoneRule = '手機號碼格式 09xx-xxx-xxx'
const editContact = ref(false)
const contactResSuccess = ref('')
const contactResFailed = ref('')

function toggleEditContact(edit) {
  if (!isUserLogin.value) {
    navigateTo('/shop/products')
    return
  }

  editContact.value = edit

  if (!editContact.value) {
    resetContactValidate()
    queryMyAccount()
  }
}

const isContactValidatedPass = reactive({
  phoneNumber: true
})

const serverContactErrors = reactive({
  phoneNumber: ''
})

function clearContactServerError(field) {
  serverContactErrors[field] = ''
}

function resetContactValidate() {
  isContactValidatedPass.phoneNumber = true
  clearContactServerError('phoneNumber')
  contactResSuccess.value = ''
  contactResFailed.value = ''
}

const contactRules = {
  phoneNumber: {
    async validator(_, value) {
      if (value && value.trim().length > 0) {
        const check = isValidPhoneNumber(value)

        if (!check) {
          serverContactErrors.phoneNumber = phoneRule
          isContactValidatedPass.phoneNumber = false
        }
      }

      if (value.trim().length === 0 || !value) {
        serverContactErrors.phoneNumber = ''
        isContactValidatedPass.phoneNumber = true
      }
    },
    trigger: 'blur'
  }
}

function updateContact() {
  if (!isUserLogin.value) {
    navigateTo('/shop/products')
    return
  }

  contactResFailed.value = ''
  const query = {}

  query.phoneNumber =
    user.value.phoneNumber && user.value.phoneNumber.trim().length > 0
      ? user.value.phoneNumber.trim()
      : null

  query.address =
    user.value.address && user.value.address.trim().length > 0 ? user.value.address.trim() : null

  updateContactApi(query)
    .then((res) => {
      if (res.status === 'success') {
        toggleEditContact(false)
        contactResSuccess.value = res.msg

        setTimeout(() => {
          contactResSuccess.value = ''
        }, 3000)
      }
    })
    .catch((err) => {
      if (err) {
        contactResFailed.value = err.message
      }
    })
}

// 密碼
const editPwd = ref(false)
const pwdResSuccess = ref('')
const pwdResFailed = ref('')

const myPwd = reactive({
  pwdCurrent: '',
  newPWD: '',
  newPWDConfirm: ''
})

const isPwdValidatedPass = reactive({
  pwdCurrent: false,
  newPWD: false,
  newPWDConfirm: false
})

function clearPwdServerError(field) {
  serverPwdErrors[field] = ''
}

const serverPwdErrors = reactive({
  pwdCurrent: '',
  newPWD: '',
  newPWDConfirm: ''
})

const showPwdContent = reactive({
  pwdCurrent: false,
  newPWD: false,
  newPWDConfirm: false
})

function togglePwdContent(field) {
  if (!isUserLogin.value) {
    navigateTo('/shop/products')
    return
  }

  showPwdContent[field] = !showPwdContent[field]
}

function resetPwdValidate() {
  for (const key in myPwd) {
    myPwd[key] = ''
  }

  for (const key in isPwdValidatedPass) {
    isPwdValidatedPass[key] = false
  }

  for (const key in serverPwdErrors) {
    serverPwdErrors[key] = ''
  }

  for (const key in showPwdContent) {
    showPwdContent[key] = false
  }

  pwdResSuccess.value = ''
  pwdResFailed.value = ''
}

const pwdRule = '至少8位元、包含一個大寫、小寫英文字母、數字、特殊字元'
const pwdRules = {
  pwdCurrent: [
    { required: true, message: '密碼必填', trigger: 'blur' },
    {
      async validator(_, value) {
        if (value.trim().length === 0) {
          isPwdValidatedPass.pwdCurrent = false
        }

        if (value.trim().length > 0) {
          isPwdValidatedPass.pwdCurrent = true
        }
      },
      trigger: 'blur'
    }
  ],
  newPWD: [
    { required: true, message: '新密碼必填', trigger: 'blur' },
    {
      async validator(_, value) {
        myPwd.newPWDConfirm = ''
        serverPwdErrors.newPWDConfirm = ''
        isPwdValidatedPass.newPWDConfirm = false

        if (value.trim().length === 0) {
          isPwdValidatedPass.newPWD = false
        }

        if (value.trim().length > 0) {
          const check = isValidPwd(value)

          if (!check) {
            isPwdValidatedPass.newPWD = false
            return (serverPwdErrors.newPWD = pwdRule)
          }

          serverPwdErrors.newPWD = ''
          isPwdValidatedPass.newPWD = true
        }
      },
      trigger: 'blur'
    }
  ],
  newPWDConfirm: [
    { required: true, message: '新密碼確認必填', trigger: 'blur' },
    {
      async validator(_, value) {
        if (value.trim().length === 0) {
          isPwdValidatedPass.newPWDConfirm = false
        }

        if (value.trim().length > 0) {
          if (value === myPwd.newPWD) {
            serverPwdErrors.newPWDConfirm = ''
            isPwdValidatedPass.newPWDConfirm = true
          } else {
            if (isPwdValidatedPass.newPWD && myPwd.newPWD.trim().length > 0) {
              serverPwdErrors.newPWDConfirm = '與新密碼不一致'
              isPwdValidatedPass.newPWDConfirm = false
            }

            if (!isPwdValidatedPass.newPWD || myPwd.newPWD.trim().length === 0) {
              myPwd.newPWDConfirm = ''
              serverPwdErrors.newPWDConfirm = ''
              isPwdValidatedPass.newPWDConfirm = false
            }
          }
        }
      },
      trigger: 'blur'
    }
  ]
}

function toggleEditPwd(edit) {
  editPwd.value = edit

  if (!edit) resetPwdValidate()
}

function updatePwd() {
  pwdResFailed.value = ''

  const check = []
  for (const key in isPwdValidatedPass) {
    if (!isPwdValidatedPass[key]) check.push(false)
  }

  if (check.length > 0) return

  const query = {
    pwdCurrent: myPwd.pwdCurrent,
    newPWD: myPwd.newPWD
  }

  updatePwdApi(query)
    .then((res) => {
      if (res.status === 'success') {
        toggleEditPwd(false)
        pwdResSuccess.value = res.msg

        setTimeout(() => {
          pwdResSuccess.value = ''
        }, 3000)
      }
    })
    .catch((err) => {
      if (err) {
        pwdResFailed.value = err.message
      }
    })
}
</script>

<template>
  <div class="page user">
    <main
      class="user_container"
      :style="{
        background: `url(${user.photo.url}) center/cover no-repeat`
      }"
    >
      <div v-if="user.photo.url" class="page-bg"></div>

      <section class="user-main user-item">
        <article class="user-img_container">
          <input id="user-photo-upload" type="file" accept="image/*" @change="setPhoto($event)" />

          <div
            v-if="user.photo.url"
            class="user-img"
            :style="{
              background: `url(${user.photo.url}) center/cover no-repeat`
            }"
            @click="triggerUpload"
          ></div>

          <svg
            v-else
            class="user-img-empty"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 32 32"
            width="200px"
            height="200px"
            @click="triggerUpload"
          >
            <path
              d="M16 22a6 6 0 0 1-5.14-2.92l-1.71 1a8 8 0 0 0 13.7 0l-1.71-1A6 6 0 0 1 16 22z"
            />
            <path d="M30 4h-4V0h-2v4h-4v2h4v4h2V6h4V4z" />
            <path d="M11.5 11a2.5 2.5 0 1 0 2.5 2.5a2.48 2.48 0 0 0-2.5-2.5z" />
            <path d="M20.5 11a2.5 2.5 0 1 0 2.5 2.5a2.48 2.48 0 0 0-2.5-2.5z" />
            <path d="M27.61 13a12.33 12.33 0 0 1 .39 3A12 12 0 1 1 16 4V2a14 14 0 1 0 13.67 11z" />
          </svg>

          <div v-if="user.photo.url" class="img-remove" @click="deleteMyPhoto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512"
              width="40px"
              height="40px"
            >
              <path
                d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48zm75.31 260.69a16 16 0 1 1-22.62 22.62L256 278.63l-52.69 52.68a16 16 0 0 1-22.62-22.62L233.37 256l-52.68-52.69a16 16 0 0 1 22.62-22.62L256 233.37l52.69-52.68a16 16 0 0 1 22.62 22.62L278.63 256z"
              />
            </svg>
          </div>
        </article>

        <article class="user-main-info">
          <span class="account caption">{{ user.account }}</span>
          <span class="email caption">{{ user.email }}</span>
        </article>
      </section>

      <div class="user-active user-item">
        <span :class="[user.active ? '' : 'not-active']">停用</span>
        <n-switch v-model:value="user.active" @update:value="toggleAccountEnabled" />
        <span :class="[user.active ? 'is-active' : '']">啟用</span>
      </div>

      <section class="user-contact user-item">
        <div class="action_wrap">
          <span v-show="contactResSuccess.length > 0" class="query-res success">{{
            contactResSuccess
          }}</span>
          <span v-show="contactResFailed.length > 0" class="query-res failed">{{
            contactResFailed
          }}</span>

          <IconEditOn v-if="!editContact" @click="toggleEditContact(true)" />

          <IconSave v-if="editContact" @click="updateContact" />
          <IconEditOff v-if="editContact" @click="toggleEditContact(false)" />
        </div>

        <n-form :model="user" :rules="contactRules" class="contact-content">
          <article class="contact-item">
            <span class="caption">手機號碼</span>

            <span v-if="!editContact" class="contact-value">{{
              user.phoneNumber ?? '尚未填寫'
            }}</span>

            <n-form-item
              v-else
              :show-label="false"
              path="phoneNumber"
              :feedback="serverContactErrors.phoneNumber"
              :validation-status="serverContactErrors.phoneNumber ? 'error' : undefined"
            >
              <n-input
                v-model:value="user.phoneNumber"
                :placeholder="phoneRule"
                @focus="() => clearContactServerError('phoneNumber')"
                @update:value="() => clearContactServerError('phoneNumber')"
              />
            </n-form-item>
          </article>

          <article class="contact-item">
            <span class="caption">地址</span>

            <span v-if="!editContact" class="contact-value">{{ user.address ?? '尚未填寫' }}</span>

            <n-form-item v-else :show-label="false">
              <n-input v-model:value="user.address" placeholder="" />
            </n-form-item>
          </article>
        </n-form>
      </section>

      <section class="user-pwd user-item">
        <div class="action_wrap">
          <span v-show="pwdResSuccess.length > 0" class="query-res success">{{
            pwdResSuccess
          }}</span>
          <span v-show="pwdResFailed.length > 0" class="query-res failed">{{ pwdResFailed }}</span>

          <IconEditOn v-if="!editPwd" @click="toggleEditPwd(true)" />

          <IconSave v-if="editPwd" @click="updatePwd" />
          <IconEditOff v-if="editPwd" @click="toggleEditPwd(false)" />
        </div>

        <n-form :model="myPwd" :rules="pwdRules" class="pwd-content">
          <article class="pwd-item">
            <span class="caption">密碼</span>

            <span v-if="!editPwd" class="pwd-value">．．．．．．．．</span>

            <n-form-item
              v-else
              :show-label="false"
              path="pwdCurrent"
              :feedback="serverPwdErrors.pwdCurrent"
              :validation-status="serverPwdErrors.pwdCurrent ? 'error' : undefined"
            >
              <n-input
                v-model:value="myPwd.pwdCurrent"
                :type="showPwdContent.pwdCurrent ? 'text' : 'password'"
                placeholder=""
                @focus="() => clearPwdServerError('pwdCurrent')"
                @update:value="() => clearPwdServerError('pwdCurrent')"
              >
                <template #suffix>
                  <IconEyeClose
                    v-if="showPwdContent.pwdCurrent"
                    width="24px"
                    height="24px"
                    @click="togglePwdContent('pwdCurrent')"
                  />
                  <IconEyeOpen
                    v-else
                    width="24px"
                    height="24px"
                    @click="togglePwdContent('pwdCurrent')"
                  />
                </template>
              </n-input>
            </n-form-item>
          </article>

          <article v-if="editPwd" class="pwd-item">
            <span class="caption">新密碼</span>

            <n-form-item
              :show-label="false"
              path="newPWD"
              :feedback="serverPwdErrors.newPWD"
              :validation-status="serverPwdErrors.newPWD ? 'error' : undefined"
            >
              <n-input
                v-model:value="myPwd.newPWD"
                :type="showPwdContent.newPWD ? 'text' : 'password'"
                :placeholder="pwdRule"
                @focus="() => clearPwdServerError('newPWD')"
                @update:value="() => clearPwdServerError('newPWD')"
              >
                <template #suffix>
                  <IconEyeClose
                    v-if="showPwdContent.newPWD"
                    width="24px"
                    height="24px"
                    @click="togglePwdContent('newPWD')"
                  />
                  <IconEyeOpen
                    v-else
                    width="24px"
                    height="24px"
                    @click="togglePwdContent('newPWD')"
                  />
                </template>
              </n-input>
            </n-form-item>
          </article>

          <article v-if="editPwd" class="pwd-item">
            <span class="caption">新密碼確認</span>

            <n-form-item
              :show-label="false"
              path="newPWDConfirm"
              :feedback="serverPwdErrors.newPWDConfirm"
              :validation-status="serverPwdErrors.newPWDConfirm ? 'error' : undefined"
            >
              <n-input
                v-model:value="myPwd.newPWDConfirm"
                :type="showPwdContent.newPWDConfirm ? 'text' : 'password'"
                :placeholder="pwdRule"
                @focus="() => clearPwdServerError('newPWDConfirm')"
                @update:value="() => clearPwdServerError('newPWDConfirm')"
              >
                <template #suffix>
                  <IconEyeClose
                    v-if="showPwdContent.newPWDConfirm"
                    width="24px"
                    height="24px"
                    @click="togglePwdContent('newPWDConfirm')"
                  />
                  <IconEyeOpen
                    v-else
                    width="24px"
                    height="24px"
                    @click="togglePwdContent('newPWDConfirm')"
                  />
                </template>
              </n-input>
            </n-form-item>
          </article>
        </n-form>
      </section>
    </main>
  </div>
</template>
