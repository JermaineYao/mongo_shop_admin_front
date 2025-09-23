export const useUserApi = () => {
  const { $http } = useNuxtApp()

  // 登入
  function signInApi(query) {
    return $http.post('/user/sign_in', query)
  }

  // 登出
  function signOutApi() {
    return $http.get('/user/sign_out')
  }

  // 註冊前檢查帳號 信箱是否已被使用
  function checkAccountEmailApi(query) {
    return $http.post('/user/check_user', query)
  }

  // 註冊
  function resgisterApi(query) {
    return $http.post('/user/sign_up', query)
  }

  return { signInApi, signOutApi, checkAccountEmailApi, resgisterApi }
}
