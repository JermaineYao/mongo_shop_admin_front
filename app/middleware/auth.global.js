export default defineNuxtRouteMiddleware(async (to) => {
  const { $http } = useNuxtApp()

  const result = await $http
    .get('/user/is_login')
    .then((res) => {})
    .catch((err) => {})
})
