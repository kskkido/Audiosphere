import store from './store'
import { AUDIO } from './main'
import { removeCurrentSong, setCurrentSong } from './reducers/player'
import { setCurrentPlaylist } from './reducers/userLibrary'

const THREE = require('three')
const OrbitControls = require('three-orbitcontrols')
const THREEx = require('threex.domevents')
const TWEEN = require('tween.js')

export default (function() {

	class AudioSphere {
		constructor() {

			this.loadInitialState()
			this.loadScene()
			this.loadRenderer()
			this.loadCamera()
			this.loadControls()
			this.loadDomEvents()

			this.sceneRender = this.sceneRender.bind(this)

			// for public API
			this.renderAllPlaylists = this.renderAllPlaylists.bind(this)
			this.switchToAll = this.switchToAll.bind(this)
			this.switchWorld = this.switchWorld.bind(this)
			this.selectFromSideNav = this.selectFromSideNav.bind(this)
		}

		/*========== LOAD METHODS ==========*/

		loadInitialState() {
			this.allObjects = []
			this.songHash = {}
			this.playlistCluster = {}

			this.currentSync = null
			this.currentWorld = {
				sphere: {},
				isFogged: true,
			}
			this.currentRenderer = null

			this.center = {
				songObject: null,
				isOccupied: false,
			}

			this.isAll = false
		}

		loadRenderer() {
			this.renderer = new THREE.WebGLRenderer({ antialias: false })
			this.renderer.setClearColor(this.scene.fog.color, 0.6)
			this.renderer.setSize(window.innerWidth, window.innerHeight)
		}

		loadCamera() {
			this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 1800)
			this.camera.z = 100
			this.camera.x = 10
		}

		loadScene() {
			this.scene = new THREE.Scene()
			this.scene.fog = new THREE.FogExp2(0x4C5760, 0.0005)
		}

		loadControls() {
			this.controls = new OrbitControls(this.camera, this.renderer.domElement)
			this.controls.enableDamping = true
			this.controls.dampingFactor = 0.25
			this.controls.enableZoom = true
		}

		loadDomEvents() {
			this.domEvents = new THREEx.DomEvents(this.camera, this.renderer.domElement)
		}

		loadSettings() {
			$('#canvas').append(this.renderer.domElement)

			window.addEventListener('resize', () => {
			  this.renderer.setSize(window.innerWidth, window.innerHeight)
			  this.camera.aspect = window.innerWidth / window.innerHeight
			  this.camera.updateProjectionMatrix()
			})

			// load materialize css controls
			$('.collapsible').collapsible()
			$(".button-collapse").sideNav({draggable: true})
			$(".dropdown-button").dropdown();
		}


		/*========== DEFINE SCENE RENDER METHOD ==========*/

		sceneRender() {
			this.currentRenderer = requestAnimationFrame(this.sceneRender)
			this.renderer.render(this.scene, this.camera)
			
			if (AUDIO.ended) {
				this.shuffleFromCurrent()
			}

			TWEEN.update()

			this.allObjects.forEach(shape => {
				shape.rotation.x += 0.005
				shape.rotation.y += 0.005
			})
		}


		/*========== CREATE SONG OBJECTS AND PLAYLISTS ==========*/

		renderAllPlaylists(playlists) {
			if (this.allObjects.length > 0) this.restartScene()

			for (let i = 0; i < playlists.length; i++) {
				const phi = Math.acos(-1 + (2 * i)/playlists.length)
				const theta = Math.sqrt(playlists.length * Math.PI) * phi
				const nucleus = [
					(20 * playlists.length * Math.cos(theta) * Math.sin(phi))+10,
					(20 * playlists.length * Math.sin(theta) * Math.sin(phi)),
					(20 * playlists.length * Math.cos(phi))
				]
				this.createPlaylistObject(playlists[i], nucleus)
			}
		
			this.loadSettings()
			this.sceneRender()
		}

		createPlaylistObject(playlist, nucleus) {
			this.playlistCluster[playlist.id] = {
				cells: {},
				nucleus: nucleus,
				currentCenter: null,
				playlistId: playlist.id,
			}

			const songList = playlist.songs

			for (var i = 0; i < songList.length; i++) {
				const currentSong = songList[i].track
				const phi = Math.acos(-1 + (2 * i)/playlist.tracks.total)
				const theta = Math.sqrt(playlist.tracks.total * Math.PI) * phi
				
				const position = [
					(65 * Math.cos(theta) * Math.sin(phi))+nucleus[0],
					(65 * Math.sin(theta) * Math.sin(phi))+nucleus[1],
					(65 * Math.cos(phi))+nucleus[2]
				]

				const songObject = this.createSongObject(currentSong, nucleus, playlist.id)
				songObject.position.set(...position)
				songObject.startingPosition = position

				this.playlistCluster[playlist.id].cells[currentSong.id] = songObject

				this.scene.add(songObject)
			}
		}

		createSongObject(song, nucleus, playlistId) {
		    const geometry = new THREE.IcosahedronGeometry(3, 0)
		    const material = new THREE.MeshBasicMaterial({wireframe: true})
		    const songObject = new THREE.Mesh(geometry, material)

		    songObject.song = song
		    songObject.nucleus = nucleus
		    songObject.playlistId = playlistId
		    this.domEvents.addEventListener(songObject, 'click', (event) => this.centerSelect(event.target))

		    this.allObjects.push(songObject)
		    this.songHash[song.id] = songObject
		    return songObject
		}


		/*========== CENTER ACTIONS ==========*/

		centerAll() {
			this.isAll = true
			this.controls.target.set(0, 0, 0)
			this.allObjects.forEach(this.centerAllAnimation, this)
		}

		unCenterAll() {
			this.isAll = false
			this.allObjects.forEach(songObject => {
				songObject.nucleus = this.playlistCluster[songObject.playlistId].nucleus
				songObject.startingPosition = songObject.originalStartingPosition
				this.uncenterAnimation(songObject)
			})
		}

		centerSong(songObject) {
			if (this.center.isOccupied) {
				this.uncenterAnimation(this.center.songObject)
			}
			this.center.songObject = songObject
			this.center.isOccupied = true
			this.centerAnimation(songObject)
		}

		uncenterSong(songObject) {
			this.uncenterAnimation(this.center.songObject)
			clearInterval(this.currentSync)
			store.dispatch(removeCurrentSong())
			this.center.isOccupied = false
		}

		centerSelect(songObject) {
			if(!this.isAll && this.currentWorld.sphere.playlistId !== songObject.playlistId) {
				store.dispatch(setCurrentPlaylist(songObject.playlistId, true))
			}
			clearInterval(this.currentSync)

			if (songObject === this.center.songObject) {
				store.dispatch(removeCurrentSong())
				this.uncenterSong(songObject)
			} else {
				this.playbackSource(songObject.song)
				this.centerSong(songObject)
			}
		}


		/*========== CENTERING ANIMATIONS ==========*/

		centerAnimation(object) {
			new TWEEN.Tween(object.position).to({
				x: object.nucleus[0],
				y: object.nucleus[1],
				z: object.nucleus[2]
			}, 500)
			.easing(TWEEN.Easing.Circular.Out)
			.start()
		}

		uncenterAnimation(object) {
			new TWEEN.Tween(object.position).to({
				x: object.startingPosition[0],
				y: object.startingPosition[1],
				z: object.startingPosition[2]
			}, 1000)
			.easing(TWEEN.Easing.Sinusoidal.Out)
			.start()
		}

		centerAllAnimation(object, i) {
			object.originalStartingPosition = object.startingPosition
			object.nucleus = [0, 0, 0]

			const phi = Math.acos(-1 + (2 * i)/this.allObjects.length)
			const theta = Math.sqrt(this.allObjects.length * Math.PI) * phi

			const position = [
			  (120 * Math.cos(theta) * Math.sin(phi)),
			  (120 * Math.sin(theta) * Math.sin(phi)),
			  (120 * Math.cos(phi)),
			]

			new TWEEN.Tween(object.position).to({
				x: position[0],
				y: position[1],
				z: position[2],
			}, 1500)
			.easing(TWEEN.Easing.Sinusoidal.InOut)
			.start()

			object.startingPosition = position	
		}

		/*========== AUDIO METHODS ==========*/

		playbackSource(song) {
			AUDIO.src = song.preview_url

			store.dispatch(setCurrentSong(song))
			.then(() => {
			this.syncObjectToSong(store.getState().player.currentSongFeatures)
			})
		}

		shuffleFromCurrent() {
			if(this.isAll) {
				this.centerSelect(this.allObjects[Math.floor(Math.random(this.allObjects.length))])
			} else {
				const songIds = Object.keys(this.currentWorld.sphere.cells)
				const randomObject = this.currentWorld.sphere.cells[songIds[Math.floor(Math.random()*songIds.length)]]
				this.centerSelect(randomObject)
			}
		}

		syncObjectToSong(currentFeature) {
			clearInterval(this.currentSync)
			const songIds = Object.keys(this.currentWorld.sphere.cells)
			const tempo = (currentFeature.track.tempo/60)*1000

			this.currentSync = setInterval(() => {
				if (AUDIO.ended || !this.center.isOccupied) {
				  clearInterval(this.currentSync)
				} else {
				  songIds.forEach(songId => {
				    const shape = this.currentWorld.sphere.cells[songId]
				    if(shape) this.pulseObject(shape)
				    // beatRotation(shape, tempo/6)
				  })
				}
			}, tempo, songIds)
		}


		/*========== AUDIO PLAYBACK ANIMATIONS ==========*/

		beatRotation(songObject, tempo) {
			new TWEEN.Tween(songObject.rotation).to({
				x: songObject.rotation.x + 0.7,
				y: songObject.rotation.y + 0.7
			}, tempo)
			.start()
		}

		pulseObject(songObject) {
			const originalSize = Object.assign({}, songObject.scale)
			const targetSize = {
				x: originalSize.x + 0.07,
				y: originalSize.y + 0.07,
				z: originalSize.z + 0.07,
			}

			new TWEEN.Tween(songObject.scale)
			.to(targetSize, 200)
			.easing(TWEEN.Easing.Sinusoidal.Out)
			.chain(
				new TWEEN.Tween(songObject.scale)
				.to(originalSize, 100)
			)
			.start()
		}


		/*========== SIDENAV METHOD ==========*/
		selectFromSideNav(songId, fromAll = false) {
			fromAll ? this.centerSelect(this.songHash[songId]) : this.centerSelect(this.currentWorld.sphere.cells[songId])
		}

		/*========== CAMERA/PLAYLIST SWITCH METHODS ==========*/

		switchToAll() {
			this.isAll ? this.unCenterAll() : this.centerAll()
		}

		switchWorld(playlistId) {
			if(this.isAll) this.unCenterAll()
			this.currentWorld.sphere = this.playlistCluster[playlistId]
			this.controls.target.set(...this.currentWorld.sphere.nucleus)
		}

		/*========== GARBAGE COLLECTION !NEEDS WORK! ==========*/

		restartScene() {
			if (this.isAll) $('.collapsible').collapsible('close', 0)

			this.allObjects.forEach(songObject => {
				this.scene.remove(songObject)
				songObject.song = null
				songObject.nucleus = null
				songObject.playlistId = null
				songObject.geometry.dispose()
				songObject.material.dispose()
				songObject = null
			}, this)
			this.allObjects.splice(0)

			this.loadInitialState()
			cancelAnimationFrame(this.currentRenderer)
			$('canvas').remove()
		}
	}

	const { renderAllPlaylists
		, selectFromSideNav
		, switchToAll
		, switchWorld } = new AudioSphere()

	// PUBLIC API
	return {
		renderAllPlaylists,
		selectFromSideNav,
		switchToAll,
		switchWorld,
	}
})()


