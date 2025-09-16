<script>
import gsap from 'gsap'
import Head from '~/components/landingPage/Head.vue'
import About from '~/components/landingPage/About.vue'
import Professional from '@/components/landingPage/Professional.vue'
import Design from '@/components/landingPage/Design.vue'
import Team from '@/components/landingPage/Team.vue'
import Footer from '@/components/Footer.vue'
</script>

<!-- <script setup>
const mainRef = ref(null) // 代替 .main
const wrapRef = ref(null) // 代替 .scroll_wrap
const scrollMax = ref(0)

const scrollData = reactive({
  ease: 0.1,
  curr: 0,
  prev: 0,
  rounded: 0,
  scrollId: null
})

onMounted(async () => {
  // 將 .caption-ch 分字包 span（依你原邏輯）
  // const textWrapper = Array.from(document.querySelectorAll('.caption-ch'))
  // textWrapper.forEach((v) => {
  //   v.innerHTML = v.textContent.replace(/\S/g, "<span class='letter'>$&</span>")
  // })

  await nextTick()
  setScrollMax()
  window.addEventListener('resize', setScrollMax)

  // 開始 rAF
  scrollData.scrollId = requestAnimationFrame(smoothScroll)
})

onUnmounted(() => {
  window.removeEventListener('resize', setScrollMax)
  if (scrollData.scrollId) cancelAnimationFrame(scrollData.scrollId)
})

function smoothScroll() {
  const wrap = wrapRef.value
  const main = mainRef.value
  if (!wrap || !main) return // DOM 還沒就緒或已卸載

  scrollData.curr = wrap.scrollTop
  scrollData.prev += (scrollData.curr - scrollData.prev) * scrollData.ease
  scrollData.rounded = Math.round(scrollData.prev)

  const y = -1 * Math.min(scrollData.rounded, scrollMax.value)

  // 僅在需要時才 set，減少重複 tween 產生
  gsap.to(main, { y, ease: 'expo', overwrite: 'auto', duration: 0.3 })

  // 若超過範圍，將容器捲動鎖在最大值
  if (wrap.scrollTop > scrollMax.value) {
    wrap.scrollTop = scrollMax.value
  }

  scrollData.scrollId = requestAnimationFrame(smoothScroll)
}

function setScrollMax() {
  nextTick(() => {
    const main = mainRef.value
    if (!main) return

    const { height } = main.getBoundingClientRect()
    scrollMax.value = height * 0.5
  })
}
</script> -->

<script setup>
// scroll
const scrollMax = ref(0)

onMounted(() => {
  const textWrapper = Array.from(document.querySelectorAll('.caption-ch'))
  textWrapper.forEach((v) => {
    v.innerHTML = v.textContent.replace(/\S/g, "<span class='letter'>$&</span>")
  })

  nextTick(() => {
    setScrollMax()

    window.addEventListener('resize', setScrollMax)

    requestAnimationFrame(() => smoothScroll())
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', setScrollMax)
  cancelAnimationFrame(data.scrollId)
})

const data = reactive({
  ease: 0.05,
  curr: 0,
  prev: 0,
  rounded: 0,
  scrollId: null
})

// 滾動效果
function smoothScroll() {
  const wrap = document.querySelector('.scroll_wrap')
  data.curr = wrap.scrollTop

  data.prev += (data.curr - data.prev) * data.ease
  data.rounded = (Math.round(data.prev * 100) / 100).toFixed(0)

  if (wrap.scrollTop < scrollMax.value) {
    gsap.to('.main', {
      y: -1 * data.rounded,
      overwrite: 'auto',
      ease: 'expo'
    })
  } else if (wrap.scrollTop >= scrollMax.value) {
    gsap.to('.main', { y: -1 * scrollMax.value, overwrite: 'auto', ease: 'expo' })
    wrap.scrollTop = scrollMax.value
  }

  data.scrollId = requestAnimationFrame(() => smoothScroll())
}

// 設定可滾動範圍
function setScrollMax() {
  nextTick(() => {
    const height = document.querySelector('.main').getBoundingClientRect().height

    scrollMax.value = height * 0.5
  })
}
</script>

<template>
  <div class="view home">
    <div ref="wrapRef" class="scroll_wrap">
      <Head />

      <main ref="mainRef" class="main">
        <About />
        <Professional />
        <Design />
        <Team />
        <Footer />
      </main>
    </div>

    <nav class="nav-home" @click="navigateTo({ path: '/shop/product_list' })">
      <span>前往購物</span>

      <svg width="40" height="40">
        <circle class="circle-base" cx="20" cy="20" r="19" />

        <circle class="circle-active active-1" cx="20" cy="20" r="19" fill="rgba(0, 0, 0, 0)" />

        <text x="8" y="25">GO</text>
      </svg>
    </nav>
  </div>
</template>
