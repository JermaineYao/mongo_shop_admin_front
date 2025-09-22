// plugins/api.js
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBase || '/api/v1',
    credentials: 'include',
    retry: 0,
    timeout: 15000,

    onRequest({ options }) {
      if (import.meta.server) {
        const headers = useRequestHeaders(['cookie', 'user-agent'])
        options.headers = { ...(options.headers || {}), ...headers }
      }
      if (options.method === 'GET' && options.query && typeof options.query === 'object') {
        const q = { ...options.query }
        for (const k in q) if (q[k] === '' || q[k] == null) delete q[k]
        options.query = q
      }
    },

    onResponse({ response }) {
      return response._data
    },

    onResponseError({ request, response, options }) {
      // const tried = options._triedRefresh === true

      // if (response?.status === 401 && !tried) {
      //   // 1) 先刷新
      //   await api('/auth/refresh', { method: 'POST' })
      //   // 2) 標記避免無限重試
      //   options._triedRefresh = true
      //   // 3) 重送原請求（⚠️ 這裡不要用 TS 的 `as any`）
      //   return await api(request, { ...options })
      // }

      // if (response?.status === 401 && import.meta.client) {
      //   // 在 plugin 內拿當前路由較保險的寫法：
      //   const current = nuxtApp.$router?.currentRoute?.value?.fullPath || '/'
      //   navigateTo(`/login?redirect=${encodeURIComponent(current)}`)
      // }

      throw createError({
        statusCode: response?.status || 500,
        messag:
          response?._data?.msg ||
          response?._data?.message ||
          response?.statusText ||
          'Unknown Error',
        data: response?._data
      })
    }
  })

  const http = {
    get(url, query, opts) {
      return api(url, { method: 'GET', query, ...opts })
    },
    post(url, body, opts) {
      return api(url, { method: 'POST', body, ...opts })
    },
    patch(url, body, opts) {
      return api(url, { method: 'PATCH', body, ...opts })
    },
    put(url, body, opts) {
      return api(url, { method: 'PUT', body, ...opts })
    },
    delete(url, body, opts) {
      return api(url, { method: 'DELETE', body, ...opts })
    },
    postFile(url, formData, opts) {
      return api(url, { method: 'POST', body: formData, ...opts })
    }
  }

  return { provide: { api, http } }
})
