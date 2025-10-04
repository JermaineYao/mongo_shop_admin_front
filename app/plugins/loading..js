export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('loading', {
    getSSRProps() {
      return {}
    },
    updated(el, binding) {
      if (import.meta.server) return

      if (binding.value && !el.__vLoading) {
        console.log('open')
        el.classList.add('loading_container')

        const wrap = document.createElement('div')
        wrap.classList.add('loading_wrap')

        wrap.innerHTML = `
        <div class="loading-box">
          <span class="loading-text">請稍後</span>
        </div>
      `

        el.appendChild(wrap)

        el.__vLoading = wrap

        return
      }

      if (!binding.value && el.__vLoading) {
        el.classList.remove('loading_container')
        el.removeChild(el.__vLoading)
        el.__vLoading = null
      }
    }
  })
})
