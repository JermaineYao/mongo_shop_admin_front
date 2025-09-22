export const useUserApi = () => {
  const { $http } = useNuxtApp()

  // 登入
  function signInApi(query) {
    console.log('query', query)
    return $http.post('/user/sign_in', query)
  }

  return { signInApi }
}
