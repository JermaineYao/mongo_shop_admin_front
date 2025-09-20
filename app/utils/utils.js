// 貨幣千分位
export function formatCurrency(num) {
  return `${num}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
