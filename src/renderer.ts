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

export type editorStateValue = {
  filename: string,
  contents: string
}

document.addEventListener("click", function(e){
    const target = e.target.closest(".filebtns"); // Or any other selector.
  
    if(target){
        $editorState.setKey('filename', target.innerText)
      // Do something with `target`.
    }

    const dir = e.target.closest(".dirbtns")
    if (dir){
        console.log("dir", dir, e.target.closest(".dirdiv"))
    }
  });

// CONTENT TRIGGERS CONTENT CHANGE
// FILENAME CHNAGE TRIGGERS FILENAME CHANGE
// WHOEVER TRIES TO RENAME FILENAME, WILL NEED TO HANDLE THE filesystem rename
// by themselves, and then update the editorState.

export const $editorState = persistentMap<editorStateValue>('editorState', {
  filename: '',
  contents: ''
})

$editorState.listen((currentState, oldState, changedKey) => {

    if (changedKey === 'filename') {
        document.querySelector<HTMLDivElement>('#filenamepin').innerText = currentState[changedKey]
    }

    console.log(`${changedKey} new value ${currentState[changedKey]}`)
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

// state mangagment, need to reset innerHTML
filePathElement.innerHTML = ""


  const allPaths = await window.electronAPI.openFile()
//   console.log(filePath)
  
    allPaths.forEach(async (path) =>{

    if (path[0] == true){
        // filePathElement.innerHTML += "Directory " + path[1] + "<br>"
        filePathElement.innerHTML += `<div class="dirdiv"><button class="dirbtns">dir ${path[1]}</button><div>`

        }
    else{

        // console.log(await window.electronAPI.readFile(`${filePath}/${path[1]}`))

        // button click trigger file change
        // that will be used to render the file in the editor
        // and we pull which button triggered it from the event.
        filePathElement.innerHTML += `<button class="filebtns">${path[1]}</button><br>`
    }
    // filePathElement.innerText += path[0] + "\n" + path[1] + "\n"


  });
})



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

