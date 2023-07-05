import * as THREE from 'three'

console.log(THREE)

import Stats from 'https://unpkg.com/three@0.140.2/examples/jsm/libs/stats.module.js'

import { OrbitControls } from 'https://unpkg.com/three@0.140.2/examples/jsm/controls/OrbitControls.js'

import { GLTFLoader } from 'https://unpkg.com/three@0.140.2/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'https://unpkg.com/three@0.140.2/examples/jsm/loaders/DRACOLoader.js'

import { XYZLoader } from 'https://unpkg.com/three@0.140.2/examples/jsm/loaders/XYZLoader.js'

//Boilerplate Code

//let mixer
let points

const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()

const clock = new THREE.Clock()
const container = document.getElementById('container')

const stats = new Stats()
//container.appendChild(stats.dom)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//Renderer

const renderer = new THREE.WebGL1Renderer({
    canvas: canvas,
    antialias: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding
//container.appendChild(renderer.domElement)
//renderer.shadowMap.enabled = true
//renderer.gammaOutput = true

//Camera and Controls

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 100)
camera.position.set(0,0,5)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0,0,0)
controls.update()
controls.enablePan = true
controls.enableDamping = true

scene.add(camera)

//Geometry

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('js/libs/draco/gltf/')

const loader = new GLTFLoader()
loader.setDRACOLoader(dracoLoader)

loader.load('public/models/debug.gltf', function(gltf){
    console.log(gltf)   
    const debug = gltf.scene
    debug.position.set(0,0,0)
    debug.scale.set(1,1,1)
    scene.add(debug)
}, function(xhr){
    console.log((xhr.loaded/xhr.total * 100) + "% loaded")
}, function(error){
    console.log('Error')
})

/*
//Pointcloud

const xyzLoader = new XYZLoader()
xyzLoader.load('models/test.xyz', function(geometry){
    geometry.center()
    //const vertexColors = (geometry.hasAttribute('color') === true)
    const vertexColors = new THREE.Color("rgb(255, 255, 255)")
    const material = new THREE.PointsMaterial({size:100, color: vertexColors})
    //vertexColors: vertexColors
    points = new THREE.Points(geometry, material)
    points.scale.set(1,1,1)
    scene.add(points)
})
*/

//Lighting

const light = new THREE.DirectionalLight(0xffffff,1)
light.position.set(0,5,0)
scene.add(light)

const sphere = new THREE.SphereGeometry(0.1, 16, 12)
const light1 = new THREE.PointLight(0xffffff,1,25)
const light2 = new THREE.PointLight(0xffffff,1,25)
const light3 = new THREE.PointLight(0xffffff,1,25)
light1.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0xffffff})))
light2.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0xffffff})))
light3.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0xffffff})))
scene.add(light1)
scene.add(light2)
scene.add(light3)

//Window

window.onresize = function(){
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
}

//Animate

function animate(){
    requestAnimationFrame(animate)
    //const delta = clock.getDelta()
    controls.update()
    stats.update()

    //Light1 Animate
    const time = Date.now() * 0.0005
    light1.position.x = Math.sin(time * 0.5) * 4
    light1.position.y = Math.cos(time * 0.5) * 4
    light1.position.z = Math.cos(time * 0.5) * 4

    //Light2 Animate
    light2.position.x = Math.cos(time * 0.4) * 4
    light2.position.y = Math.sin(time * 0.4) * 4
    light2.position.z = Math.cos(time * 0.4) * 4

    //Light3 Animate
    light3.position.x = Math.cos(time * 0.3) * 4
    light3.position.y = Math.cos(time * 0.3) * 4
    light3.position.z = Math.sin(time * 0.3) * 4

    renderer.render(scene, camera)
}

animate()