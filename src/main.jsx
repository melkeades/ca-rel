import './style.styl'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import gsap from 'gsap'

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
const sel = (e) => document.querySelector(e)
const uiW$ = sel('.ui-wrap')
const dim$ = sel('.grad-dim')
let navHidden = false
const vpHeight = window.innerHeight
let activeZoneOn = false
let mouseDown = false
let uiInTl = gsap.timeline({ defaults: {} }).fromTo('.ui', { opacity: 0 }, { opacity: 1 }, 0).fromTo(dim$, { opacity: 0 }, { opacity: 1 }, 0)
uiInTl.seek(uiInTl.endTime())
let navFadeTimer = Timer(200)

sel('body').addEventListener('click', function handler() {
  console.log('f')
  this.removeEventListener('click', handler)
  gsap
    .timeline({ defaults: { ease: 'power4.out', duration: 2 } })
    .to('.init-ui', { opacity: 0 }, 0)
    .to('#app', { clipPath: 'inset(0 0 0% 0%)' }, 0.5)
    .to('.bw-dim', { opacity: 0 }, 0.5)
    .to(uiW$, { opacity: 1 }, 1)
    // .add(uiInTl, 1)
    .to(
      {},
      {
        onComplete: initEvents,
      }
    )
})
function initEvents() {
  // uiInTl

  navFadeTimer.start().then(() => {
    navFadeOut()
  })
  // navFadeIn()
  sel('body').addEventListener('mousedown', () => {
    mouseDown = true
  })
  sel('body').addEventListener('mouseup', () => {
    mouseDown = false
  })
  sel('body').addEventListener('mousemove', (e) => {
    // console.log(navFadeTimer.active())
    const activeZone = 140
    activeZoneOn = e.clientY < activeZone || vpHeight - e.clientY < activeZone
    if (navHidden && activeZoneOn && !mouseDown) {
      navFadeIn()
    } else if (!navHidden && !activeZoneOn && !uiInTl.reversed()) {
      navFadeTimer.start().then(() => {
        navFadeOut()
      })
    }
  })
}

function navFadeOut() {
  if (!activeZoneOn && !uiInTl.reversed()) {
    console.log('out')
    uiInTl.reverse()
    navHidden = true
  }
}
function navFadeIn() {
  if (uiInTl.reversed()) {
    navHidden = false
    uiInTl.play()
    navFadeTimer.start().then(() => {
      navFadeOut()
    })
  }
}
console.log(window.innerHeight)

function Timer(ms) {
  let id

  const start = () =>
    new Promise((resolve) => {
      if (id === -1) {
        throw new Error('Timer already aborted')
      }
      id = setTimeout(resolve, ms)
    })
  const abort = () => {
    if (id !== -1 || id === undefined) {
      clearTimeout(id)
      id = -1
    }
  }
  return {
    start,
    abort,
  }
}
