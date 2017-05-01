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
	z: targetObj.position.z + 30,
}).easing(TWEEN.Easing.Sinusoidal.EaseInOut)

function switchCameraTo (world) {
	const nucleus = world.nucleus
	control.center.set(0, 0, 0)
	camera.position.copy(control.center).add(New THREE.Vector3(nucleus[0], nucleus[1], nucleus[2]+70))
}

const objetTween = new TWEEN(object.position).to({
	x: object.nucleus[0],
	y: object.nucleus[1],
	z: object.nucleus[2]
}).easing(TWEEN.Easing.Sinusoidal.E)

function pulseObject (object) {
	const originalSize = object.scale
	const targetSize = {
		x: originalSize.x + 1,
		y: originalSize.y + 1,
		z: originalSize.z + 1,
	}
	const upPulse =new TWEEN.tween(object.scale)
	.to(targetSize, 150)
	.easing(Tween.Easing.Elastic.Out)
	const downPulse =new TWEEN.tween(targetSize)
	.to(originalSize, 75)

	upPulse.chain(downPulse)
}