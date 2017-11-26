// jshint esversion:6,-W033
import axios from 'axios'

axios.defaults.baseURL = 'https://api.fullstackweekly.com'

axios.interceptors.request.use(config => {
  // neccessary to catch the "unhandled promise rejection"
  if (typeof window === 'undefined') {
    return config
  }
  const token = window.localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const appService = {
  getPosts (categoryId) {
    return new Promise(resolve => {
      axios.get(`/wp-json/wp/v2/posts?categories=${categoryId}&per_page=6`)
        .then(response => {
          resolve(response.data)
        })
    })
  },
  login (credentials) {
    return new Promise((resolve, reject) => {
      axios.post('/services/auth.php', credentials)
        .then(response => {
          // console.log(response.data)
          resolve(response.data)
        })
        .catch(response => {
          // console.log(response.status)
          reject(response.status)
        })
    })
  },
  getProfile () {
    return new Promise(resolve => {
      axios.get('/services/profile.php')
        .then(response => {
          resolve(response.data)
        })
      // without using the interceptor above
      // axios.get('/services/profile.php', {
      //   headers: {
      //     'Authorization': `Bearer ${window.localStorage.getItem('token')}`
      //   }
      // }).then(response => {
      //   resolve(response.data)
      // })
    })
  }
}

export default appService
