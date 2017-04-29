const axios = require('axios')

import store from '../store'
import {AUDIO} from '../main'
import {removeCurrentSong, setCurrentSong} from '../reducers/player'

const THREE = require('three')
const OrbitControls = require('three-orbitcontrols')
const THREEx = require('threex.domevents')

const father = {}
const icosahedronArr = []
const center = {
  isOccupied: false
}

// state.playlists.item[19]

/* ========== DEFINE CAMERA  ========== */

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 1000)
camera.position.z = 70

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

/* ========== DEFINE CONTROLLER  ========== */

/* ========== DEFINE PUBLIC API, INITIATOR  ========== */

const domEvents = new THREEx.DomEvents(camera, renderer.domElement)
const vector = new THREE.Vector3()

export const init = (playlist, songList) => {

  const createIcosahedron = (currentSong) => {
    const geometry = new THREE.IcosahedronGeometry(2, 0)
    const material = new THREE.MeshBasicMaterial({wireframe: true})
    const icosahedron = new THREE.Mesh(geometry, material)
    icosahedron.songId = currentSong.id
    domEvents.addEventListener(icosahedron, 'click', centerSelect)
    return icosahedron
  }

  const sphereIcosahedron = (playlist) => {
    const randomizer = 0
    for (var i = 0; i < playlist.tracks.total; i++) {
      const currentSong = songList.items[i]
      const phi = Math.acos(-1 + (2 * i)/playlist.tracks.total)
      const theta = Math.sqrt(playlist.tracks.total * Math.PI) * phi
      const icosahedron = createIcosahedron(currentSong)
      const position = [
        (50 * Math.cos(theta) * Math.sin(phi))+randomizer,
        (50 * Math.sin(theta) * Math.sin(phi))+randomizer,
        (50* Math.cos(phi))+randomizer
      ]
      icosahedron.position.set(...position)
      icosahedron.startingPosition = position
      vector.copy(icosahedron.position).multiplyScalar(2)

      icosahedron.lookAt(vector)

      icosahedronArr.push(icosahedron)
    }
    addToScene(icosahedronArr)
    father[playlist.id] = {
      world: icosahedronArr,
      nucleus: [randomizer, randomizer, randomizer]
    }
  }
  sphereIcosahedron(playlist)
}

// const addIcosahedronToScene = (num, z = 0) => {
//   for (let i = 0; i < num; i++) {
//     const angle = (i / (num/2)) * Math.PI
//     const x = (num*0.8 * Math.cos(angle)), y = (num*0.8 * Math.sin(angle))
//     const icosahedron = createIcosahedron()
//     icosahedron.isCentered = false
//     icosahedronArr.push(icosahedron)
//     icosahedron.position.set(x, y, z)
//
//     scene.add(icosahedron)
//   }
// }
// INTERFACE

function centerIt(instance) {
  if (center.isOccupied) {
    center.instance.position.set(...center.instance.startingPosition)
    center.instance.isCentered = false
    center.instance.material.wireframe = true
  }
  center.instance = instance
  center.isOccupied = true
  instance.position.set(0, 0, 0)
  camera.position.set(0, 0, 30)
  instance.isCentered = true
}

function unCenterIt(instance) {
  center.instance.position.set(...center.instance.startingPosition)
  center.isOccupied = false
  instance.isCentered = false
  camera.position.set(0, 0, 70)
}

/* ========== DEFINE EVENT HANDLER ========== */

// renderer.domElement.addEventListener('mousedown', (event) => {
//   const vector = new THREE.vector3(
//     renderer.devicePixelRatio * (event.pageX - this.offsetLeft) / this.width * 2 - 1,
//     -renderer.devicePixelRatio * (event.pageY - this.offsetLeft) / this.width * 2 - 1,
//   )
// })

function centerSelect({target}) {
  if (target.isCentered) {
    store.dispatch(removeCurrentSong())
    unCenterIt(target)
  } else {
    playbackSource(target.song)
    centerIt(target)
  }
  target.material.wireframe = !target.isCentered
}

function playbackSource(song) {
  AUDIO.src = song.track.preview_url
  store.dispatch(setCurrentSong(song.track))
}

function addToScene(arr) {
  arr.forEach(shape => scene.add(shape))
}

function switchNucleus(nucleus) {
  camera.position.set(nucleus[0], nucleus[1], nucleus[2]+70)
}

function syncCameraToSong() {}

function syncObjectToSong() {}

export const sceneRender = function() {
  window.requestAnimationFrame(sceneRender)
  renderer.render(scene, camera)
  icosahedronArr.forEach(shape => {
    shape.rotation.x += 0.005
    shape.rotation.y += 0.005
  })
}
