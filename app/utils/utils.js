// 驗證帳號
export function isValidAccount(value) {
  const strictRegex = /^[a-zA-Z][a-zA-Z0-9]*$/

  if (typeof value === 'string' && value.trim().length > 0) return strictRegex.test(value.trim())
}

// 驗證 email
export function isValidEmail(value) {
  const strictRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/

  if (typeof value === 'string' && value.trim().length > 0) return strictRegex.test(value.trim())
}

// 驗證密碼
export function isValidPwd(value) {
  const strictRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}|\\,./<>?;:'"~`]).{8,}$/

  if (typeof value === 'string' && value.trim().length > 0) {
    return strictRegex.test(value.trim())
  }
  return false
}

// 驗證電話
export function isValidPhoneNumber(value) {
  const strictRegex = /^09\d{2}-\d{3}-\d{3}$/

  if (typeof value === 'string' && value.trim().length > 0) {
    return strictRegex.test(value.trim())
  } else if (typeof value === 'string' && value.trim().length === 0) {
    return true
  } else if (!value) {
    return true
  }

  return false
}

// 貨幣千分位
export function formatCurrency(num) {
  return `${num}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 台灣時間
export function twTime(dateString, options) {
  const date = new Date(dateString)

  return date.toLocaleString('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    ...options
  })
}

// 商品分類
export function getCategory(v) {
  switch (v) {
    case '0':
      return '碗'

    case '1':
      return '瓶子'

    case '2':
      return '杯子'
  }
}
