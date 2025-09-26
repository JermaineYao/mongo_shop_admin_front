import { twTime } from '@/utils/utils'

export default defineNuxtRouteMiddleware(async (to) => {
  const { $http } = useNuxtApp()

  const userStore = useUserStore()
  const { user, isUserLogin } = storeToRefs(userStore)

  if (to.meta.requireLoginCheck) {
    await $http
      .get('/user/is_login')
      .then((res) => {
        if (res.status === 'success') {
          const data = res.data

          if (data.createAt) data.createAt = twTime(res.data.createAt)
          if (data.modifiedAt) data.modifiedAt = twTime(res.data.modifiedAt)

          for (const k in user.value) {
            user.value[k] = data[k]
          }

          isUserLogin.value = true
        }
      })
      .catch((err) => {
        if (err && to.meta.requireLogin) {
          return navigateTo(-1)
        }
      })
  }
})
