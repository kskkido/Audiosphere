const axios = require('axios')
const TWEEN = require('tween.js')

import store from '../store'
import {camera} from './songShape'
import {removeCurrentSong, setCurrentSong} from '../reducers/player'
import {setCurrentPlaylist} from '../reducers/playlists'

const THREE = require('three')
const THREEx = require('threex.domevents')

const cameraTween = new TWEEN(camera.position).to({
	x: targetObj.position.x,
	y: targetObj.position.y,
	z: targetObj.position.z,
}).easing(TWEEN.Easing.Sinusoidal.EaseInOut)

function switchCameraTo (world) {
	const nucleus = world.nucleus
	control.center.set(0, 0, 0)
	camera.position.copy(control.center).add(New THREE.Vector3(nucleus[0], nucleus[1], nucleus[2]+70))
}