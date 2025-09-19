import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', () => {
  const userDefault = {
    _id: null,
    account: null,
    email: null,
    active: false,
    photo: {
      createAt: null,
      fileKey: null,
      url: null
    },
    phoneNumber: null,
    address: null,
    createAt: null,
    modifiedAt: null
  }

  const user = reactive({
    _id: null,
    account: null,
    email: null,
    active: true,
    photo: {
      createAt: null,
      fileKey: null,
      url: null
    },
    phoneNumber: null,
    address: null,
    createAt: null,
    modifiedAt: null
  })

  const login = ref(false)

  function resetUser() {
    for (const key in userDefault) user[key] = userDefault[key]

    login.value = false
  }

  return { user, login, resetUser }
})
