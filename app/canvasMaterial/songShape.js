const axios = require('axios')

import store from '../store'
import {AUDIO} from '../main'
import {removeCurrentSong, setCurrentSong} from '../reducers/player'
import {setCurrentPlaylist} from '../reducers/playlists'

const THREE = require('three')
const OrbitControls = require('three-orbitcontrols')
const THREEx = require('threex.domevents')

const father = {}
const allObjects = []
const objectHash = {}
const center = {
  isOccupied: false
}
let currentSync = false
let currentWorld

// state.playlists.item[19]

/* ========== DEFINE CAMERA  ========== */

export const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 2000)
camera.position.z = 140
camera.position.x = 10

/* ========== DEFINE SCENE  ========== */

const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0xcccccc, 0.002)

/* ========== DEFINE LIGHT  ========== */

const firstLight = new THREE.PointLight(0xFFFF00)
firstLight.position.set(0, 0, 0)

scene.add(firstLight)

const secondLight = new THREE.PointLight(0xFFFF00)
secondLight.position.set(25, 25, 25)

scene.add(secondLight)

/* ========== DEFINE RENDERER  ========== */

export const renderer = new THREE.WebGLRenderer({ antialias: false })
renderer.setClearColor(scene.fog.color, 1)
renderer.setSize(window.innerWidth, window.innerHeight)

/* ========== DEFINE CONTROLLER  ========== */


const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.25
controls.enableZoom = true

/* ========== DEFINE PUBLIC API, INITIATOR  ========== */

const domEvents = new THREEx.DomEvents(camera, renderer.domElement)
const vector = new THREE.Vector3()

export const init = (playlist, constant = 0) => {
  const icosahedronArr = []
  const songList = playlist.songs
  const nucleus = [constant+10, constant+10, constant+10]
  father[playlist.id] = {
    world: {},
    nucleus: nucleus,
    currentCenter: null,
    playlistId: playlist.id,
  }

  const createIcosahedron = (currentSong) => {
    const geometry = new THREE.IcosahedronGeometry(2, 0)
    const material = new THREE.MeshBasicMaterial({wireframe: true})
    const icosahedron = new THREE.Mesh(geometry, material)
    icosahedron.song = currentSong
    icosahedron.nucleus = nucleus
    icosahedron.playlistId = playlist.id
    domEvents.addEventListener(icosahedron, 'click', (event) => centerSelect(event.target))
    allObjects.push(icosahedron)
    objectHash[currentSong.id] = icosahedron
    return icosahedron
  }

  const sphereIcosahedron = (playlist) => {
    const randomizer = 0
    for (var i = 0; i < songList.length; i++) {
      const currentSong = songList[i].track
      const phi = Math.acos(-1 + (2 * i)/playlist.tracks.total)
      const theta = Math.sqrt(playlist.tracks.total * Math.PI) * phi
      const icosahedron = createIcosahedron(currentSong)
      const position = [
        (50 * Math.cos(theta) * Math.sin(phi))+10+constant,
        (50 * Math.sin(theta) * Math.sin(phi))+10+constant,
        (50* Math.cos(phi))+10+constant
      ]
      icosahedron.position.set(...position)
      icosahedron.startingPosition = position
      vector.copy(icosahedron.position).multiplyScalar(2)

      icosahedron.lookAt(vector)

      icosahedronArr.push(icosahedron)
      father[playlist.id].world[currentSong.id] = icosahedron
    }
    addToScene(icosahedronArr)
  }
  sphereIcosahedron(playlist)
}

/* ========== DEFINE INITIALIZATION  ========== */

export const initAll = (playlists, currentPlaylist, allSongs) => {
  playlists.forEach((playlist, i) => {
    init(playlist, i*100)
  })
}



/* ========== DEFINE EVENT HANDLER ========== */

// renderer.domElement.addEventListener('mousedown', (event) => {
//   const vector = new THREE.vector3(
//     renderer.devicePixelRatio * (event.pageX - this.offsetLeft) / this.width * 2 - 1,
//     -renderer.devicePixelRatio * (event.pageY - this.offsetLeft) / this.width * 2 - 1,
//   )
// })
function centerIt(instance) {
  if (center.isOccupied) {
    center.instance.position.set(...center.instance.startingPosition)
    center.instance.isCentered = false
    center.instance.material.wireframe = true
  }
  center.instance = instance
  center.isOccupied = true
  instance.position.set(...instance.nucleus)
  instance.isCentered = true
}

function unCenterIt(instance) {
  center.instance.position.set(...center.instance.startingPosition)
  center.isOccupied = false
  instance.isCentered = false
  // camera.position.set(0, 0, 70)
}

function centerSelect(object) {
  // if(currentWorld.playlistId !== object.playlistId) {
  //   store.dispatch(setCurrentPlaylist(object.playlistId))
  // }
  clearInterval(currentSync)
  if (object.isCentered) {
    store.dispatch(removeCurrentSong())
    unCenterIt(object)
  } else {
    playbackSource(object.song)
    centerIt(object)
  }
  // target.material.wireframe = !target.isCentered
}



function playbackSource(song) {
  console.log(song.preview_url)
  AUDIO.src = song.preview_url
  store.dispatch(setCurrentSong(song))
  .then(() => {
    syncObjectToSong(store.getState().player.currentSongFeatures)
  })
}

function addToScene(arr) {
  arr.forEach(shape => scene.add(shape))
}

export const findBySongId = (songId) => {
  const currentObj = currentWorld.world[songId]
  console.log(currentWorld)
  if(currentObj) centerSelect(currentObj)
}

function switchNucleus(nucleus) {
  camera.position.set(nucleus[0], nucleus[1], nucleus[2]+130)
}

function syncCameraToSong() {}

function syncObjectToSong(currentFeature) {
  currentSync = setInterval(() => {
    if (AUDIO.ended || !AUDIO.src) clearInterval(currentSync)
    allObjects.forEach(shape => {
      shape.rotation.x += 0.1
      shape.rotation.y += 0.1
    })
  }, (currentFeature.track.tempo/60)*1000)
}

function shuffleFromCurrent() {
  const songIds = Object.keys(currentWorld.world)
  const randomObject = currentWorld.world[songIds[Math.floor(Math.random()*songIds.length)]]
  centerSelect(randomObject)
}

export const switchWorld = (currentPlaylist) => {
  currentWorld = father[currentPlaylist.id]
  controls.center.set(...currentWorld.nucleus)
  camera.position.set(currentWorld.nucleus[0], currentWorld.nucleus[0], currentWorld.nucleus[2]+140)
}

export const sceneRender = function() {
  window.requestAnimationFrame(sceneRender)
  renderer.render(scene, camera)
  if (AUDIO.ended) {
    shuffleFromCurrent()
  }
  allObjects.forEach(shape => {
    shape.rotation.x += 0.005
    shape.rotation.y += 0.005
  })
}
