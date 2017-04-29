// const THREE = require('three')
// const OrbitControls = require('three-orbitcontrols')
// const THREEx = require('threex.domevents')
//
// /* ========== DEFINE CAMERA  ========== */
//
// const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 1000)
// camera.position.z = 70
//
// /* ========== DEFINE SCENE  ========== */
//
// const scene = new THREE.Scene()
// scene.fog = new THREE.FogExp2(0xcccccc, 0.002)
//
// /* ========== DEFINE LIGHT  ========== */
//
// const firstLight = new THREE.PointLight(0xFFFF00)
// firstLight.position.set(0, 0, 0)
//
// scene.add(firstLight)
//
// const secondLight = new THREE.PointLight(0xFFFF00)
// secondLight.position.set(25, 25, 25)
//
// scene.add(secondLight)
//
// /* ========== DEFINE RENDERER  ========== */
//
// export const renderer = new THREE.WebGLRenderer({ antialias: false })
// renderer.setClearColor(scene.fog.color, 1)
// renderer.setSize(window.innerWidth, window.innerHeight)
//
// /* ========== DEFINE CONTROLS  ========== */
//
// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true
// controls.dampingFactor = 0.25
// controls.enableZoom = true
//
// const domEvents = new THREEx.DomEvents(camera, renderer.domElement)
//
// /* ========== DEFINE GEOMETRY  ========== */
//
// const icosahedronArr = []
// const center = {
//   isOccupied: false
// }
//
// const createIcosahedron = (size) => {
//   const geometry = new THREE.IcosahedronGeometry(2, 0)
//   const material = new THREE.MeshBasicMaterial({wireframe: true})
//   const icosahedron = new THREE.Mesh(geometry, material)
//   domEvents.addEventListener(icosahedron, 'click', centerSelect)
//   return icosahedron
// }
//
// // const addIcosahedronToScene = (num, z = 0) => {
// //   for (let i = 0; i < num; i++) {
// //     const angle = (i / (num/2)) * Math.PI
// //     const x = (num*0.8 * Math.cos(angle)), y = (num*0.8 * Math.sin(angle))
// //     const icosahedron = createIcosahedron()
// //     icosahedron.isCentered = false
// //     icosahedronArr.push(icosahedron)
// //     icosahedron.position.set(x, y, z)
// //
// //     scene.add(icosahedron)
// //   }
// // }
// const vector = new THREE.Vector3()
// const sphereIcosahedron = (num) => {
//   for (var i = 0; i < num; i++) {
//     const phi = Math.acos(-1 + (2 * i)/num)
//     const theta = Math.sqrt(num * Math.PI) * phi
//     const icosahedron = createIcosahedron()
//     const position = [
//       50 * Math.cos(theta) * Math.sin(phi),
//       50 * Math.sin(theta) * Math.sin(phi),
//       50* Math.cos(phi)
//     ]
//     icosahedron.position.set(...position)
//     icosahedron.startingPosition = position
//     vector.copy(icosahedron.position).multiplyScalar(2)
//
//     icosahedron.lookAt(vector)
//
//     icosahedronArr.push(icosahedron)
//     scene.add(icosahedron)
//   }
// }
//
// // Camera at 100z
// // const createSphereMap = (layerNum, maxNum) => {
// //   const depthLayers = layerNum
// //   const largestLayer = Math.ceil(depthLayers/2) // 5
// //   for (let i = 1; i <= largestLayer; i++) {
// //     // at each layer, mid layer should have all nums
// //     // 10 / 2, 5 is the max
// //     // 1 = 20%, 2 = 40%, 3 = 60%, 4 = 80%, 5 = 100%
// //     const ratio = (maxNum * i)/largestLayer
// //     addIcosahedronToScene(ratio, i*10)
// //     if (i !== largestLayer) {
// //       const counterLayer = 2 * largestLayer - i
// //       addIcosahedronToScene(ratio, counterLayer*10)
// //     }
// //   }
// // }
//
// sphereIcosahedron(400)
// // createSphereMap(9, 40)
//
// /* ========== DEFINE OBJECT MOVEMENT ========== */
// function centerIt(instance) {
//   if (center.isOccupied) {
//     center.instance.position.set(...center.instance.startingPosition)
//     center.instance.isCentered = false
//     center.instance.material.wireframe = true
//   }
//   center.instance = instance
//   center.isOccupied = true
//   instance.position.set(0, 0, 0)
//   camera.position.set(0, 0, 30)
//   instance.isCentered = true
// }
//
// function unCenterIt(instance) {
//   center.instance.position.set(...center.instance.startingPosition)
//   center.isOccupied = false
//   instance.isCentered = false
//   camera.position.set(0, 0, 70)
// }
//
// /* ========== DEFINE EVENT HANDLER ========== */
//
// // renderer.domElement.addEventListener('mousedown', (event) => {
// //   const vector = new THREE.vector3(
// //     renderer.devicePixelRatio * (event.pageX - this.offsetLeft) / this.width * 2 - 1,
// //     -renderer.devicePixelRatio * (event.pageY - this.offsetLeft) / this.width * 2 - 1,
// //   )
// // })
//
// function centerSelect({target}) {
//   if (target.isCentered) {
//     unCenterIt(target)
//   } else {
//     centerIt(target)
//   }
//   target.material.wireframe = !target.isCentered
// }
//
// /* ========== DEFINE TRANSFORM/ANIMATION  ========== */
//
//
//
// /* ========== DEFINE EXECUTION  ========== */
//
// export const sceneRender = function() {
//   window.requestAnimationFrame(sceneRender)
//   renderer.render(scene, camera)
//   icosahedronArr.forEach(shape => {
//     shape.rotation.x += 0.01
//     shape.rotation.y += 0.01
//   })
// }
//
// sceneRender()
