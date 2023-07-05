import * as THREE from 'three'

console.log(THREE)

import Stats from 'https://unpkg.com/three@0.140.2/examples/jsm/libs/stats.module.js'
import { GUI } from 'https://unpkg.com/three@0.140.2/examples/jsm/libs/lil-gui.module.min.js'
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

const stats = new Stats()

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

//Camera and Controls

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 1000)
camera.position.set(0,0,-25)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0,10,0)
controls.update()
controls.enablePan = true
controls.enableDamping = true

scene.add(camera)

//Helper

const axesHelper = new THREE.AxesHelper(1)
scene.add(axesHelper)
const gridHelper = new THREE.GridHelper(2)
scene.add(gridHelper)

/*
//GUI

const gui = new GUI({width: 310})

const options = {
    wireframe: false
}

gui.add(options, 'wireframe').onChange(function(e){
    loader.material.wireframe = e
})
*/

//Loading

const loading = new THREE.LoadingManager()

/*
loading.onStart = function(url, item, total){
    console.log('Started...')
}
loading.onError = function(){
    console.log('Error...')
}
*/

const progressBar = document.getElementById('progress-bar')

loading.onProgress = function(url, loaded, total){
    progressBar.value = (loaded/total) * 100
    //console.log('Loading...')
}

const progressBarContainer = document.querySelector('.progress-bar-container')

loading.onLoad = function(){
    progressBarContainer.style.display = 'none'
    //console.log('Done')
}

//Geometry

const dracoLoader = new DRACOLoader(loading)
dracoLoader.setDecoderPath('js/libs/draco/gltf/')

const loader = new GLTFLoader(loading)
loader.setDRACOLoader(dracoLoader)

loader.load('public/models/untitled.gltf', function(gltf){
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
loader.load('public/models/body.gltf', function(gltf){
    console.log(gltf)   
    const debug = gltf.scene
    debug.position.set(0,0,0)
    debug.scale.set(1,1,1)
    scene.add(debug)
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

const light = new THREE.DirectionalLight(0xffffff,2)
light.position.set(0,10,0)
scene.add(light)


const sphere = new THREE.SphereGeometry(0.05, 16, 12)
const light1 = new THREE.PointLight(0xffffff,1.5,25)
const light2 = new THREE.PointLight(0xffffff,1.5,25)
const light3 = new THREE.PointLight(0xffffff,1.5,25)
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
    light1.position.x = Math.sin(time * 0.5) * 10
    light1.position.y = Math.cos(time * 0.5) * 10
    light1.position.z = Math.cos(time * 0.5) * 10

    //Light2 Animate
    light2.position.x = Math.cos(time * 0.4) * 10
    light2.position.y = Math.sin(time * 0.4) * 10
    light2.position.z = Math.cos(time * 0.4) * 10

    //Light3 Animate
    light3.position.x = Math.cos(time * 0.3) * 10
    light3.position.y = Math.cos(time * 0.3) * 10
    light3.position.z = Math.sin(time * 0.3) * 10

    renderer.render(scene, camera)
}

animate()