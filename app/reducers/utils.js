import axios from 'axios'

export const createUserConfig = user => {
  return axios.create({
    headers: {
      'Authorization': `Bearer ${user.accessToken}`
    },
    responseType: 'json'
  })
}

/*
  store.playlists = {
  href: https://api.spotify.com/v1/users/12183935322/playlists?offset=0&limit=20
  items: array of object playlists, limit to 20
  - playlistItem {
    href: https://api.spotify.com/v1/users/21m4h42ab7wyqssjrztb5pz6i/playlists/3D1ae3TqggVLUAhOObkrus
    id: 3D1ae3TqggVLUAhOObkrus
    images: array of photo url
    name: name of playlist
    tracks: {
      href: https://api.spotify.com/v1/users/21m4h42ab7wyqssjrztb5pz6i/playlists/3D1ae3TqggVLUAhOObkrus/tracks
      total: number of tracks
    }
    uri: spotify:user:21m4h42ab7wyqssjrztb5pz6i:playlist:3D1ae3TqggVLUAhOObkrus
  }
  limit: 20
  offset: 0
  next: "https://api.spotify.com/v1/users/12183935322/playlists?offset=20&limit=20"
  total: 78
}
*/
