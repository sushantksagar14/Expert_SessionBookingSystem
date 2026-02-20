import axios from 'axios'

const API = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
})

API.interceptors.response.use(
    (res) => res,
    (err) => {
        const message =
            err.response?.data?.message || err.message || 'Something went wrong'
        return Promise.reject(new Error(message))
    }
)

export default API
