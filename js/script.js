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
  },3000)
}

function setMode(mode){
  currentMode=mode
  oasisIndex=0
  renderOasisSlide()
  if(!reducedMotion)startOasisCycle()

  document.body.classList.toggle('mode-night',mode==='night')

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

/* ── PARALLAX PANORÁMICO ── */
const reduceMotionQuery=window.matchMedia('(prefers-reduced-motion:reduce)')
document.querySelectorAll('.pano').forEach((section)=>{
  const sticky=section.querySelector('.pano__sticky')
  const img=section.querySelector('.pano__img')
  if(!sticky||!img)return
  let distance=0,travel=0,queued=false

  function measure(){
    if(reduceMotionQuery.matches){section.style.height='';img.style.transform='';return}
    const viewH=sticky.clientHeight
    distance=Math.max(0,img.getBoundingClientRect().width-sticky.clientWidth)
    travel=Math.min(Math.max(distance,viewH),viewH*4)
    section.style.height=(viewH+travel)+'px'
    update()
  }

  function update(){
    queued=false
    if(reduceMotionQuery.matches)return
    const top=section.getBoundingClientRect().top
    const p=Math.min(1,Math.max(0,-top/travel||0))
    img.style.transform='translate3d('+(-p*distance)+'px,0,0)'
  }

  window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true})
  new ResizeObserver(measure).observe(sticky)
  reduceMotionQuery.addEventListener('change',measure)
  ;(img.complete?Promise.resolve():(img.decode?img.decode().catch(()=>{}):Promise.resolve())).then(measure)
  img.addEventListener('load',measure)
  window.addEventListener('load',measure)
})

/* ── PLATOS ESTRELLA — carrusel 3D ── */
const platosCarousel=document.getElementById('platosCarousel')
if(platosCarousel){
  const stage=document.getElementById('platosStage')
  const items=[...stage.querySelectorAll('.carousel3d-item')]
  const total=items.length
  let platosIndex=0
  let platosTimer=null

  function renderCarousel(){
    stage.style.transform='rotateY('+(-platosIndex*(360/total))+'deg)'
    items.forEach((item,i)=>item.classList.toggle('is-front',i===platosIndex))
  }

  function goToPlato(i){
    platosIndex=(i+total)%total
    renderCarousel()
  }

  function startPlatosCycle(){
    clearInterval(platosTimer)
    if(reducedMotion)return
    platosTimer=setInterval(()=>goToPlato(platosIndex+1),4500)
  }

  items.forEach((item,i)=>item.addEventListener('click',()=>{goToPlato(i);startPlatosCycle()}))
  document.getElementById('platosPrev').addEventListener('click',()=>{goToPlato(platosIndex-1);startPlatosCycle()})
  document.getElementById('platosNext').addEventListener('click',()=>{goToPlato(platosIndex+1);startPlatosCycle()})

  platosCarousel.addEventListener('keydown',(e)=>{
    if(e.key==='ArrowLeft'){goToPlato(platosIndex-1);startPlatosCycle()}
    if(e.key==='ArrowRight'){goToPlato(platosIndex+1);startPlatosCycle()}
  })

  let touchStartX=null
  platosCarousel.addEventListener('touchstart',(e)=>{touchStartX=e.touches[0].clientX;clearInterval(platosTimer)},{passive:true})
  platosCarousel.addEventListener('touchend',(e)=>{
    if(touchStartX===null)return
    const dx=e.changedTouches[0].clientX-touchStartX
    if(Math.abs(dx)>40)goToPlato(platosIndex+(dx<0?1:-1))
    touchStartX=null
    startPlatosCycle()
  },{passive:true})

  platosCarousel.addEventListener('mouseenter',()=>clearInterval(platosTimer))
  platosCarousel.addEventListener('mouseleave',startPlatosCycle)
  platosCarousel.addEventListener('focusin',()=>clearInterval(platosTimer))
  platosCarousel.addEventListener('focusout',startPlatosCycle)

  renderCarousel()
  startPlatosCycle()
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
