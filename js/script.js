/* ── MENÚ ── */
function openMenu(){
  document.getElementById('mobileNav').classList.add('open')
  document.getElementById('hamburger').classList.add('is-active')
  document.getElementById('hamburger').setAttribute('aria-expanded','true')
  document.body.style.overflow='hidden'
}
function closeMenu(){
  document.getElementById('mobileNav').classList.remove('open')
  document.getElementById('hamburger').classList.remove('is-active')
  document.getElementById('hamburger').setAttribute('aria-expanded','false')
  document.body.style.overflow=''
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();closeCarta()}})

/* ── CARTA OVERLAY ── */
function openCarta(){
  const p=document.getElementById('carta-page')
  p.classList.add('open')
  p.scrollTop=0
  document.body.style.overflow='hidden'
}
function closeCarta(){
  document.getElementById('carta-page').classList.remove('open')
  document.body.style.overflow=''
}

/* hero video plays automatically, no parallax needed */

/* ── REVEAL ON SCROLL ── */
const revealObs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('visible');revealObs.unobserve(e.target)}
  })
},{threshold:0.1,rootMargin:'0px 0px -40px 0px'})
document.querySelectorAll('.reveal').forEach(el=>revealObs.observe(el))

/* ── COUNT UP ── */
function countUp(el,target,duration){
  let start=0
  const step=target/(duration/16)
  const timer=setInterval(()=>{
    start+=step;el.textContent=Math.round(start)
    if(start>=target){el.textContent=target;clearInterval(timer)}
  },16)
}
const countObs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const t=parseInt(e.target.dataset.target)
      if(t)countUp(e.target,t,1200)
      countObs.unobserve(e.target)
    }
  })
},{threshold:0.5})
document.querySelectorAll('[data-target]').forEach(el=>countObs.observe(el))

/* ── REDUCED MOTION ── */
const reducedMotion=window.matchMedia('(prefers-reduced-motion:reduce)').matches
if(reducedMotion){
  document.querySelectorAll('.reveal').forEach(el=>{el.style.transition='none';el.classList.add('visible')})
}

/* ── HERO VIDEO: reintenta autoplay si el navegador lo bloquea ── */
const heroVideo=document.querySelector('.hero-video')
if(heroVideo){
  const tryPlay=()=>heroVideo.play().catch(()=>{})
  tryPlay()
  document.addEventListener('touchstart',tryPlay,{once:true,passive:true})
  document.addEventListener('click',tryPlay,{once:true})
}

/* ── TOGGLE DÍA / NOCHE — controla el carrusel de "El local" ── */
let currentMode='day'
let oasisSlides=[]
let oasisIndex=0
let oasisTimer=null

function renderOasisSlide(){
  if(!oasisSlides.length)return
  oasisSlides.forEach(s=>s.classList.remove('active'))
  const visible=oasisSlides.filter(s=>s.dataset.mode===currentMode)
  if(!visible.length)return
  if(oasisIndex>=visible.length)oasisIndex=0
  visible[oasisIndex].classList.add('active')
}

function startOasisCycle(){
  clearInterval(oasisTimer)
  oasisTimer=setInterval(()=>{
    const visible=oasisSlides.filter(s=>s.dataset.mode===currentMode)
    if(!visible.length)return
    oasisIndex=(oasisIndex+1)%visible.length
    renderOasisSlide()
  },4500)
}

function setMode(mode){
  currentMode=mode
  oasisIndex=0
  renderOasisSlide()
  if(!reducedMotion)startOasisCycle()

  const dayBtn=document.getElementById('modoBtnDay')
  const nightBtn=document.getElementById('modoBtnNight')
  if(dayBtn&&nightBtn){
    dayBtn.setAttribute('aria-pressed',String(mode==='day'))
    nightBtn.setAttribute('aria-pressed',String(mode==='night'))
  }
  const daySwitch=document.getElementById('daynightSwitch')
  if(daySwitch)daySwitch.setAttribute('aria-pressed',String(mode==='night'))
}

function toggleDayNightSwitch(){
  setMode(currentMode==='day'?'night':'day')
}

const oasisContainer=document.getElementById('oasisSlideshow')
if(oasisContainer){
  oasisSlides=[...oasisContainer.querySelectorAll('.oasis-slide')]
  setMode('day')
}

/* ── SOUNDS OF SALAS — lista de conciertos interactiva ── */
const soundsList=document.getElementById('soundsList')
if(soundsList){
  const items=[...soundsList.querySelectorAll('li')]
  const titleEl=document.getElementById('soundsTitle')
  const subEl=document.getElementById('soundsSub')
  let soundsIndex=items.findIndex(li=>li.classList.contains('is-active'))
  if(soundsIndex<0)soundsIndex=0

  function showConcert(i){
    soundsIndex=(i+items.length)%items.length
    items.forEach(li=>li.classList.remove('is-active'))
    const li=items[soundsIndex]
    li.classList.add('is-active')
    if(titleEl)titleEl.textContent=li.dataset.name
    if(subEl)subEl.textContent=li.dataset.when
  }

  items.forEach((li,i)=>li.addEventListener('click',()=>showConcert(i)))
  document.getElementById('soundsPrev')?.addEventListener('click',()=>showConcert(soundsIndex-1))
  document.getElementById('soundsNext')?.addEventListener('click',()=>showConcert(soundsIndex+1))
}
