/* ── MENU MÓVIL ── */
function openMenu(){
  document.getElementById('mobileNav').classList.add('open')
  document.getElementById('hamburger').setAttribute('aria-expanded','true')
  document.body.style.overflow='hidden'
}
function closeMenu(){
  document.getElementById('mobileNav').classList.remove('open')
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

/* ── HEADER SCROLL ── */
const header=document.getElementById('header')
window.addEventListener('scroll',()=>{
  header.classList.toggle('scrolled',window.scrollY>80)
},{passive:true})

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
if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){
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
