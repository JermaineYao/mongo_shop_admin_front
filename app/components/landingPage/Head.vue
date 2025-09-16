<script>
import gsap from 'gsap'
</script>

<script setup>
let canvas = null
const loadingAnimation = ref(false)

onMounted(() => {
  gsap.set('.main', { opacity: 0 })
  gsap.set('.nav-home', { opacity: 0 })
  gsap.set('.poetry_container', { opacity: 0 })
  resetSvgLine()

  /*--------------- cover animation ---------------*/
  loadingAnimation.value = true

  pageAnimation()

  window.addEventListener('resize', pageAnimation)
  window.addEventListener('resize', svgLineAnimation)
})

onUnmounted(() => {
  window.removeEventListener('resize', pageAnimation)
  window.removeEventListener('resize', svgLineAnimation)
})

function pageAnimation() {
  if (loadingAnimation.value) {
    canvas = new DrawPage().setCanvas('.home').init()
    canvas.drawMark()

    setTimeout(() => {
      nextTick(() => {
        canvas.remove()
      })

      showHomeContent()
    }, 2300)
  }
}

function showHomeContent() {
  gsap.to('.header', {
    opacity: 1,
    duration: 0.8,
    onComplete: function () {
      loadingAnimation.value = false
      svgLineAnimation()

      gsap.to('.main', { opacity: 1, duration: 0.8 })
      gsap.to('.nav-home', { opacity: 1, duration: 0.8 })
      gsap.to('.poetry_container', { opacity: 1, duration: 0.8 })
    }
  })
}

function svgLineAnimation() {
  const w = window.innerWidth

  if (w * 1 <= 414) {
    gsap.to('.top-right .line-h', { attr: { x1: 0 }, duration: 0.5 })
    gsap.to('.top-right .line-v', { attr: { y2: 150 }, duration: 0.5 })

    gsap.to('.bottom-left .line-h', { attr: { x1: 150 }, duration: 0.5 })
    gsap.to('.bottom-left .line-v', { attr: { y1: 10 }, duration: 0.5 })
    return
  }

  gsap.to('.top-right .line-h', { attr: { x1: 0 }, duration: 0.5 })
  gsap.to('.top-right .line-v', { attr: { y2: 300 }, duration: 0.5 })

  gsap.to('.bottom-left .line-h', { attr: { x1: 280 }, duration: 0.5 })
  gsap.to('.bottom-left .line-v', { attr: { y1: 0 }, duration: 0.5 })
}

function resetSvgLine() {
  const w = window.innerWidth

  if (w * 1 <= 414) {
    gsap.set('.corner line', { attr: { stroke: 'rgba(255, 255, 255, 0.8)', strokeWidth: 1.5 } })

    gsap.set('.top-right .line-h', { attr: { x1: 150, y1: 20, x2: 150, y2: 20 } })
    gsap.set('.top-right .line-v', { attr: { x1: 140, y1: 10, x2: 140, y2: 10 } })

    gsap.set('.bottom-left .line-h', { attr: { x1: 0, y1: 140, x2: 0, y2: 140 } })
    gsap.set('.bottom-left .line-v', { attr: { x1: 10, y1: 150, x2: 10, y2: 150 } })

    return
  }

  gsap.set('.corner line', { attr: { stroke: 'rgba(255, 255, 255, 1)', strokeWidth: 2 } })

  gsap.set('.top-right .line-h', { attr: { x1: 300, y1: 20, x2: 300, y2: 20 } })
  gsap.set('.top-right .line-v', { attr: { x1: 280, y1: 0, x2: 280, y2: 0 } })

  gsap.set('.bottom-left .line-h', { attr: { x1: 0, y1: 280, x2: 0, y2: 280 } })
  gsap.set('.bottom-left .line-v', { attr: { x1: 20, y1: 300, x2: 20, y2: 300 } })
}
</script>

<template>
  <header class="header">
    <div class="bg-cover"></div>
    <Logo />

    <svg class="corner top-right" xmlns="http://www.w3.org/2000/svg">
      <line class="line-h" />
      <line class="line-v" />
    </svg>

    <svg class="corner bottom-left" xmlns="http://www.w3.org/2000/svg">
      <line class="line-h" />
      <line class="line-v" />
    </svg>

    <div class="poetry_container">
      <span class="poetry">碧釉满瓶光灿灿，</span>
      <span class="poetry">碎花红斗酿香端。</span>
      <span class="poetry">云龙金彩生风起，</span>
      <span class="poetry">画凤仙鹅舞鸣山。</span>

      <div class="poetry name"><span>白居易</span> <span>咏陶瓷</span></div>
    </div>
  </header>
</template>
