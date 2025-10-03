export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.meta.requireLoginCheck) return

  const { $http } = useNuxtApp()
  const userStore = useUserStore()
  const { user, isUserLogin } = storeToRefs(userStore)

  try {
    const res = await $http.get('/user/is_login')

    if (res?.status === 'success') {
      Object.assign(user.value, res.data)
      isUserLogin.value = true

      if (to.meta.requireActive && !res.data.active) {
        return navigateTo('/shop/products', { replace: true })
      }
      return
    }

    // 未登入
    userStore.resetUser()
    if (to.meta.requireLogin) {
      return navigateTo('/shop/products', { replace: true })
    }
  } catch (err) {
    if (err) {
      userStore.resetUser()
      if (to.meta.requireLogin) {
        return navigateTo('/shop/products', { replace: true })
      }
    }
  }
})
