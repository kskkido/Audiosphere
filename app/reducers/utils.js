import axios from 'axios'

export const createUserConfig = user => {
  if(user) {
  return axios.create({
    headers: {
      'Authorization': `Bearer ${user.accessToken}`
    },
    responseType: 'json'
  })
  }
}

export const findById = (arr, id) => {
  for (let el of arr) {
    if (el.id === id) {
      return el
    }
  }
}