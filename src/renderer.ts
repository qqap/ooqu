////////////////////////////////////////////////
/////////// Editor CodeMirror Setup ////////////
////////////////////////////////////////////////


var myTextarea = document.querySelector<HTMLTextAreaElement>('#input-box')
// myTextarea.textContent = localStorage.getItem("bloby")
var editor2 = HyperMD.fromTextArea(myTextarea, {
  lineWrapping: true,

  // for code fence highlighting
  // theme: "gruvbox-dark"
//   hmdModeLoader: "https://cdn.jsdelivr.net/npm/codemirror/",
})

// editor2.setValue("")

// and that's all
// now you get a `editor` and you can do whatever you want
editor2.setSize("100%", "calc(100% - 24px)") // set height
editor2.focus()

////////////////////////////////////////////////
/////////// Sidebar State Management ///////////
////////////////////////////////////////////////

import { persistentAtom } from '@nanostores/persistent'

type SidePaneStateValue = 'open' | 'closed'
const $sidePaneState = persistentAtom<SidePaneStateValue>('open')
const pin = document.querySelector<HTMLDivElement>('#filenamepin')

pin.addEventListener('click', () => {
    $sidePaneState.set($sidePaneState.value === 'open' ? 'closed' : 'open')
})

document.addEventListener('keyup', () => {
    window.electronAPI.writeFile($editorState.get().path, editor2.getValue())
})

$sidePaneState.subscribe((value, oldValue) => {
    if (value === 'open') {
        // NEED TO SAVE THE OPEN SIZE OF THE SIDEBAR, as a global value, 
        // or something just to rememebbr
        // just eventlisten when it changes, and store it as a STATE
        // for persistant storage.
        document.querySelector<HTMLDivElement>('.grid').style.gridTemplateColumns = "auto 2px 200px"
    } else {
        document.querySelector<HTMLDivElement>('.grid').style.gridTemplateColumns = "auto 0px 0px"
    }
})

////////////////////////////////////////////////
/////////// Editor State Management ////////////
////////////////////////////////////////////////

import { persistentMap } from '@nanostores/persistent'
import { editor } from 'markzuck/notes/test/src/addon/_base'
import { writeFile } from 'original-fs'

export type editorStateValue = {
  filename: string,
  contents: string,
  path: string
}

document.addEventListener("click", async function(e){

    const target = e.target.closest(".filebtns"); // Or any other selector.
  

    if(target){

        const path = target.getAttribute("path")
        $editorState.setKey('filename', target.innerText)
        $editorState.setKey('path', path)
        $editorState.setKey('contents', await window.electronAPI.readFile(path))
        // console.log("click", target)


      // Do something with `target`.
    }

    const dir = e.target.closest(".dirbtns")
    if (dir){
        console.log("dir", dir, e.target.closest(".dirdiv"))
        const dirdiv = e.target.closest(".dirdiv");
        if (dirdiv.getAttribute("open") == "true"){
          dirdiv.setAttribute("open", false)
          dirdiv.removeChild(dirdiv.querySelector("#contents"))
        } else {
          var folderContents = document.createElement("foldercontent");
          folderContents.id = "contents"
          dirdiv.appendChild(folderContents)


          dirdiv.setAttribute("open", true);
          const path = dir.getAttribute("path")
          // NEEDS TO ABSTRACT TO FUNCTION
          // SOME STATE MANAGEMENT ON OPEN DIRECTORIES?
          const [allPaths, realPath] = await window.electronAPI.readPath(path)
              allPaths.forEach(async (path) =>{
              if (path[0] == true){
                  // filePathElement.innerHTML += "Directory " + path[1] + "<br>"
                  folderContents.innerHTML += 
                      `<div class="dirdiv"><nodebutton class="dirbtns" style="color: wheat"
                      path="${realPath}/${path[1]}">> ${path[1]}</nodebutton><div>`
                  }
              else{
                  folderContents.innerHTML += `<nodebutton path="${realPath}/${path[1]}" class="filebtns">${path[1]}</nodebutton>`
              }
          });
      }
    }
  });

// CONTENT TRIGGERS CONTENT CHANGE
// FILENAME CHNAGE TRIGGERS FILENAME CHANGE
// WHOEVER TRIES TO RENAME FILENAME, WILL NEED TO HANDLE THE filesystem rename
// by themselves, and then update the editorState.

export const $editorState = persistentMap<editorStateValue>('editorState', {
  filename: '-',
  contents: '-',
  path: '-'
})

$editorState.listen((currentState, oldState, changedKey) => {

    if (changedKey === 'filename') {
        document.querySelector<HTMLDivElement>('#filenamepin').innerText = currentState[changedKey]
    }
    console.log(`${changedKey} new value ${currentState[changedKey]}`)

    if (changedKey === 'contents') {
        // console.log()
        editor2.setValue(currentState[changedKey])
        // editor2.setValue()
        // document.querySelector<HTMLTextAreaElement>('#editor').value = currentState[changedKey]
    }

})


////////////////////////////////////////////////
/////////// Sidepane Size Management ///////////
////////////////////////////////////////////////

const gutterdrag = document.querySelector<HTMLDivElement>('.gutter-col-1')
const grid = document.querySelector<HTMLDivElement>('.grid')
// console.log("gutterdrag", gutterdrag)

function move(){

    // transition hacks, need to be resolved.
    setTimeout(() => {
        // document.querySelector<HTMLDivElement>('.grid').style.transition = "300ms"
        document.querySelector<HTMLDivElement>('.grid').style.gridTemplateColumns = "auto 2px 180px"
          }, 200)

 
}


const btn = document.getElementById('btn')
const filePathElement = document.getElementById('filePath')

btn.addEventListener('click', async () => {
  btn.innerHTML = ""
  filePathElement.innerHTML = ""

  const [allPaths, realPath] = await window.electronAPI.openFile()
    allPaths.forEach(async (path) =>{
    if (path[0] == true){
        // filePathElement.innerHTML += "Directory " + path[1] + "<br>"
        filePathElement.innerHTML +=
            `<div class="dirdiv"><nodebutton class="dirbtns" style="color: wheat"
            path="${realPath}/${path[1]}">> ${path[1]}</nodebutton><div>`

        }
    else{
        filePathElement.innerHTML += `<nodebutton path="${realPath}/${path[1]}" class="filebtns">${path[1]}</nodebutton>`
    }
  });
})



let lastClick = 0;
gutterdrag.addEventListener('mousedown', (e) => {
    // document.body.style.backgroundColor = 'red'


    // console.log('click', e)
  const thisClick = Date.now();
  if (thisClick - lastClick < 400) {
    // console.log('quick click detected, returning early');
    move()
    lastClick = thisClick;
    // return;
  }
  lastClick = thisClick;
  console.log('click');
});

