export const useUserApi = () => {
  const { $http } = useNuxtApp()

  // 登入
  function signInApi(query) {
    return $http.post('/user/sign_in', query)
  }

  // 登出
  function signOutApi() {
    return $http.post('/user/sign_out')
  }

  // 註冊前檢查帳號 信箱是否已被使用
  function checkAccountEmailApi(query) {
    return $http.post('/user/check_user', query)
  }

  // 註冊
  function resgisterApi(query) {
    return $http.post('/user/sign_up', query)
  }

  // 忘記密碼(發送密碼設定連結至用戶信箱)
  function forgotPwdApi(query) {
    return $http.post('/user/forgot_pwd', query)
  }

  // 忘記密碼 - 設定新密碼
  function resetPwdApi(query) {
    return $http.post('/user/reset_pwd', query)
  }

  // 我的帳號
  function queryMyAccountApi() {
    return $http.get('/user/my_account')
  }

  // 上傳我的圖片
  function uploadMyPhotoApi(formData) {
    return $http.postFile('/user/upload_user_photo', formData)
  }

  // 刪除我的圖片
  function deleteMyPhotoApi() {
    return $http.delete('/user/delete_my_photo')
  }

  // 停用,啟用 帳號
  function toggleAccountEnabledApi(query) {
    return $http.patch('/user/my_account_enable', query)
  }

  // 更新 地址, 電話
  function updateContactApi(query) {
    return $http.patch('/user/update_my_contact', query)
  }

  // 修改密碼
  function updatePwdApi(query) {
    return $http.patch('/user/update_pwd', query)
  }

  // 加入, 修改購物車
  function updateCartApi(query) {
    return $http.post('/cart/update', query)
  }

  // 商品從購物車中移除
  function deleteFromCartApi(query) {
    return $http.post('/cart/delete', query)
  }

  // 新增,移除 我的最愛
  function toggleFavoriteApi(query) {
    return $http.post('/favorite/toggle', query)
  }

  // 查詢我的最愛
  function queryMyFavoriteApi() {
    return $http.get('/favorite/find')
  }

  // 查詢我的購物車
  function queryMyCartApi() {
    return $http.get('/cart/my_cart')
  }

  // 移除購物車商品
  function removeFromCartApi(query) {
    return $http.post('/cart/delete', query)
  }

  // 清空購物車
  function emptyCartApi() {
    return $http.delete('/cart/clear')
  }

  // 下訂單
  function createOrderApi(query) {
    return $http.post('/order/create', query)
  }

  // 查詢所有訂單
  function queryMyOrdersApi() {
    return $http.get('/order/my_orders')
  }

  // 查看訂單
  function queryOrderApi(orderNo) {
    return $http.get(`/order/my_order/${orderNo}`)
  }

  // 取消訂單
  function cancelOrderApi(orderId) {
    return $http.patch(`/order/${orderId}/status/cancelled`)
  }

  return {
    signInApi,
    signOutApi,
    checkAccountEmailApi,
    resgisterApi,
    forgotPwdApi,
    resetPwdApi,
    queryMyAccountApi,
    uploadMyPhotoApi,
    deleteMyPhotoApi,
    toggleAccountEnabledApi,
    updateContactApi,
    updatePwdApi,
    updateCartApi,
    deleteFromCartApi,
    toggleFavoriteApi,
    queryMyFavoriteApi,
    queryMyCartApi,
    removeFromCartApi,
    emptyCartApi,
    createOrderApi,
    queryMyOrdersApi,
    queryOrderApi,
    cancelOrderApi
  }
}
