/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

// import './index.css';
import { persistentAtom } from '@nanostores/persistent'
import { read, readFile } from 'original-fs'
type SidePaneStateValue = 'open' | 'closed'

const $loadingState = persistentAtom<SidePaneStateValue>('open')
// console.log($loadingState)

  
const gutterdrag = document.querySelector<HTMLDivElement>('.gutter-col-1')
const grid = document.querySelector<HTMLDivElement>('.grid')
// console.log("gutterdrag", gutterdrag)

function move(){

    // transition hacks, need to be resolved.
    setTimeout(() => {
        // document.querySelector<HTMLDivElement>('.grid').style.transition = "300ms"
        document.querySelector<HTMLDivElement>('.grid').style.gridTemplateColumns = "auto 2px 200px"
          }, 200)

 
}


const btn = document.getElementById('btn')
const filePathElement = document.getElementById('filePath')

btn.addEventListener('click', async () => {

// state mangagment, need to reset innerHTML
filePathElement.innerHTML = ""


  const [allPaths, filePath] = await window.electronAPI.openFile()
//   console.log(filePath)
  
    allPaths.forEach(async (path) =>{

    if (path[0] == true){
        filePathElement.innerHTML += "Directory " + path[1] + "\n"
        }
    else{

        console.log(await window.electronAPI.readFile(`${filePath}/${path[1]}`))

        // button click trigger file change
        // that will be used to render the file in the editor
        filePathElement.innerHTML += `<button>${path[1]}</button>`
    }
    // filePathElement.innerText += path[0] + "\n" + path[1] + "\n"


  });
})

// let elementsArray = document.querySelectorAll("whatever");

// elementsArray.forEach(function(elem) {
//     elem.addEventListener("input", function() {
//         // This function does stuff
//     });
// });


let lastClick = 0;
gutterdrag.addEventListener('mousedown', (e) => {
    // document.body.style.backgroundColor = 'red'


    // console.log('click', e)
  const thisClick = Date.now();
  if (thisClick - lastClick < 400) {
    console.log('quick click detected, returning early');
    move()
    lastClick = thisClick;
    // return;
  }
  lastClick = thisClick;
  console.log('click');
});

const pin = document.querySelector<HTMLDivElement>('#pin')
console.log(pin)
// global state store with nanostores.
pin.addEventListener('click', () => {
    console.log("clicked")
    console.log(document.querySelector<HTMLDivElement>('.grid').style.gridTemplateAreas)
    document.querySelector<HTMLDivElement>('.grid').style.gridTemplateColumns = "auto 2px 100px"
})


// gutterdrag.addEventListener('dblclick', () => {
//         console.log("double clicked")
//     document.querySelector<HTMLDivElement>('.grid').style.gridTemplateAreas = "auto 2px 200px"
// })

console.log('👋 This message is being logged by "renderer.ts", included via Vite');
