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
      return Promise.reject({
        status: response?.status,
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
