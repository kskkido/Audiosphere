# Audiosphere
Audiosphere is a music streaming web application that uses [Spotify Web API](https://developer.spotify.com/web-api/) and [Three-JS](https://threejs.org/) to create a 3d planetary system with your Spotify playlists. The application is built on top of [Bones scaffolding](https://github.com/FullstackAcademy/bones)

## How it works
When you authorize your Spotify account with Audiosphere, the application fetches your playlists from Spotify and maps each playlist on to a HTML5 canvas. Each playlist is represented as a dynamic spherical cluster of 3D objects that represent a song within that playlist. Each of these objects holds a reference to a song's audio source that plays back upon clicking the object or selecting the corresponding song from the side navigation bar. 

## Demo
Easier done than said. Try it out [here](https://audiosphere.herokuapp.com)

## Instructions
- Click on any object to playback its audio source
- The sidenav represents the playlists fetched from Spotify. 
	- Click any of the playlists to uncollapse its song list. 
	- Click on the song to playback its audio source
	- Playlist highlighted in grey shows the playlist the camera is currently focused on
	- The all songs row will re-orient the objects to the center to create one big cluster
- Click and drag to change the camera angle (the rotation of the camera is set to the center of a playlist cluster)
- Trackpad or mouse scroll to adjust camera zoom
- To change the camera's center of rotation click on an object that belongs to a different cluster or click on a different playlist in the side navigation bar

## Disclaimer
The audio sources are 30 second previews available on the Spotify API
