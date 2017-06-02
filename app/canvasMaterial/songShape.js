const axios = require('axios')

import store from '../store'
import { AUDIO } from '../main'
import { removeCurrentSong, setCurrentSong } from '../reducers/player'
import { hasRendered, setCurrentPlaylist } from '../reducers/playlists'

const THREE = require('three')
const OrbitControls = require('three-orbitcontrols')
const THREEx = require('threex.domevents')
const TWEEN = require('tween.js')

let father = {}
let allObjects = []
let songCatalog = {}
const center = {
  isOccupied: false
}
let currentSync = false
const currentWorld = {
  sphere: {},
  isFogged: true
}
let currentRenderer
let isAll = false

function initialState () {
  father = {}
  allObjects = []
  songCatalog = {}
  currentSync = false
  currentWorld.sphere = {}
  currentRenderer = null
}

// state.playlists.item[19]

/* ========== DEFINE CAMERA  ========== */

export const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 1800)
camera.position.z = 100
camera.position.x = 10

/* ========== DEFINE SCENE  ========== */

const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0xb6b6b6, 0.001)

/* ========== DEFINE LIGHT  ========== */

// const firstLight = new THREE.PointLight(0xFFFF00)
// firstLight.position.set(0, 0, 0)

// scene.add(firstLight)

// const secondLight = new THREE.PointLight(0xFFFF00)
// secondLight.position.set(25, 25, 25)

// scene.add(secondLight)

/* ========== DEFINE RENDERER  ========== */

export const renderer = new THREE.WebGLRenderer({ antialias: false })
renderer.setClearColor(scene.fog.color, .5)
renderer.setSize(window.innerWidth, window.innerHeight)

/* ========== DYNAMIC CANVAS SIZE ========== */

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

/* ========== DEFINE CONTROLLER  ========== */


const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.25
controls.enableZoom = true

/* ========== DEFINE PUBLIC API, INITIATOR  ========== */

let domEvents
const vector = new THREE.Vector3()

export const init = (playlist, constant) => {
  const icosahedronArr = []
  const songList = playlist.songs
  const nucleus = constant
  father[playlist.id] = {
    cells: {},
    nucleus: nucleus,
    currentCenter: null,
    playlistId: playlist.id,
  }

  const createIcosahedron = (currentSong) => {
    const geometry = new THREE.IcosahedronGeometry(3, 0)
    const material = new THREE.MeshBasicMaterial({wireframe: true})
    const icosahedron = new THREE.Mesh(geometry, material)
    icosahedron.song = currentSong
    icosahedron.nucleus = nucleus
    icosahedron.playlistId = playlist.id
    domEvents.addEventListener(icosahedron, 'click', (event) => centerSelect(event.target))
    allObjects.push(icosahedron)
    songCatalog[currentSong.id] = icosahedron
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
        (65 * Math.cos(theta) * Math.sin(phi))+nucleus[0],
        (65 * Math.sin(theta) * Math.sin(phi))+nucleus[1],
        (65 * Math.cos(phi))+nucleus[2]
      ]
      icosahedron.position.set(...position)
      icosahedron.startingPosition = position
      vector.copy(icosahedron.position).multiplyScalar(2)

      icosahedron.lookAt(vector)

      icosahedronArr.push(icosahedron)
      father[playlist.id].cells[currentSong.id] = icosahedron
    }
    addToScene(icosahedronArr)
  }
  sphereIcosahedron(playlist)
}

/* ========== DEFINE INITIALIZATION  ========== */

export const initAll = (playlists, currentPlaylist, allSongs) => {
  domEvents = new THREEx.DomEvents(camera, renderer.domElement)
  for (let i = 0; i < playlists.length; i++) {
    const phi = Math.acos(-1 + (2 * i)/playlists.length)
    const theta = Math.sqrt(playlists.length * Math.PI) * phi
    const nucleus = [
      (20 * playlists.length * Math.cos(theta) * Math.sin(phi))+10,
      (20 * playlists.length * Math.sin(theta) * Math.sin(phi)),
      (20 * playlists.length * Math.cos(phi))
    ]
    init(playlists[i], nucleus)
  }
  store.dispatch(hasRendered())
  sceneRender()
  // if (isAll) {
  //   centerAll()
  // }
}

/* ========== DEFINE TWEEN ANIMATIONS ========== */

function centerAnimation (object) {
  new TWEEN.Tween(object.position).to({
    x: object.nucleus[0],
    y: object.nucleus[1],
    z: object.nucleus[2]
  }, 500)
  .easing(TWEEN.Easing.Circular.Out)
  .start()
}

function uncenterAnimation (object) {
  new TWEEN.Tween(object.position).to({
    x: object.startingPosition[0],
    y: object.startingPosition[1],
    z: object.startingPosition[2]
  }, 1000)
  .easing(TWEEN.Easing.Sinusoidal.Out)
  .start()
}

function beatRotation (object, tempo) {
  new TWEEN.Tween(object.rotation).to({
    x: object.rotation.x + .7,
    y: object.rotation.y + .7
  }, tempo)
  .start()
}

function pulseObject (object) {
  const originalSize = Object.assign({}, object.scale)
  const targetSize = {
    x: originalSize.x + .07,
    y: originalSize.y + .07,
    z: originalSize.z + .07,
  }
  const upPulse =new TWEEN.Tween(object.scale)
  .to(targetSize, 200)
  .easing(TWEEN.Easing.Sinusoidal.Out)
  .chain(
    new TWEEN.Tween(object.scale)
    .to(originalSize, 100)
  )
  .start()
}

export function centerAll () {
  isAll = true
  controls.target.set(0, 0, 0)
  allObjects.forEach((object, i) => {
    object.originalStartingPosition = object.startingPosition
    object.nucleus = [0, 0, 0]
    const phi = Math.acos(-1 + (2 * i)/allObjects.length)
    const theta = Math.sqrt(allObjects.length * Math.PI) * phi
    let position = [
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
  })
}

function unCenterAll () {
  isAll = false
  allObjects.forEach(object => {
    object.nucleus = father[object.playlistId].nucleus
    object.startingPosition = object.originalStartingPosition
    uncenterAnimation(object)
  })
}



/* ========== DEFINE EVENT CALLBACK ========== */

function centerIt(instance) {
  if (center.isOccupied) {
    uncenterAnimation(center.instance)
    center.instance.isCentered = false
    center.instance.material.wireframe = true
  }
  center.instance = instance
  center.isOccupied = true
  centerAnimation(instance)
  instance.isCentered = true
}

function unCenterIt(instance) {
  uncenterAnimation(center.instance)
  clearInterval(currentSync)
  store.dispatch(removeCurrentSong())
  center.isOccupied = false
  instance.isCentered = false
}

function centerSelect(object) {
  if(!isAll && currentWorld.sphere.playlistId !== object.playlistId) {
    store.dispatch(setCurrentPlaylist(object.playlistId, true))
  }
  clearInterval(currentSync)
  if (object.isCentered) {
    store.dispatch(removeCurrentSong())
    unCenterIt(object)
  } else {
    playbackSource(object.song)
    centerIt(object)
  }
}

function playbackSource(song) {
  AUDIO.src = song.preview_url
  store.dispatch(setCurrentSong(song))
  .then(() => {
    syncObjectToSong(store.getState().player.currentSongFeatures)
  })
}

// UTIL FUNCTIONS

function addToScene(arr) {
  arr.forEach(shape => scene.add(shape))
}

export const findBySongId = songId => {
  const currentObj = currentWorld.sphere.cells[songId]
  if(currentObj) centerSelect(currentObj)
}

export const findFromAll = songId => {
  const currentObj = songCatalog[songId]
  centerSelect(currentObj)
}

function switchNucleus(nucleus) {
  camera.position.set(nucleus[0], nucleus[1], nucleus[2]+130)
}

function syncObjectToSong(currentFeature) {
  clearInterval(currentSync)
  const songIds = Object.keys(currentWorld.sphere.cells)
  const tempo = (currentFeature.track.tempo/60)*1000
  currentSync = setInterval(() => {
    if (AUDIO.ended || !center.isOccupied) {
      clearInterval(currentSync)
    } else {
      songIds.forEach(songId => {
        const shape = currentWorld.sphere.cells[songId]
        pulseObject(shape)
        // beatRotation(shape, tempo/6)
      })
    }
  }, tempo, songIds)
}

function shuffleFromCurrent() {
  if(isAll) {
    centerSelect(allObjects[Math.floor(Math.random(allObjects.length))])
  } else {
    const songIds = Object.keys(currentWorld.sphere.cells)
    const randomObject = currentWorld.sphere.cells[songIds[Math.floor(Math.random()*songIds.length)]]
    centerSelect(randomObject)
  }
}

export const switchToAll = () => {
  isAll ? unCenterAll() : centerAll()
}

export const switchWorld = (currentPlaylist) => {
  if(isAll) unCenterAll()
  currentWorld.sphere = father[currentPlaylist.id]
  controls.target.set(...currentWorld.sphere.nucleus)
  // switchNucleus(currentWorld.sphere.nucleus)
}

export const restartScene = () => {
  allObjects.forEach(object => {
    object.material.dispose()
    object.geometry.dispose()
    scene.remove(object)
    console.log(object)
    object = null
  })
  initialState()
}

export const sceneRender = function() {
  currentRenderer = requestAnimationFrame(sceneRender)
  renderer.render(scene, camera)
  if (AUDIO.ended) {
    shuffleFromCurrent()
  }
  TWEEN.update()
  allObjects.forEach(shape => {
    shape.rotation.x += 0.005
    shape.rotation.y += 0.005
  })
}