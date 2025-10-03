<script>
import gsap from 'gsap'
</script>

<script setup>
const animation = ref(true)
const observer = ref(null)
const target = ref(null)

onMounted(() => {
  nextTick(() => {
    const options = {
      root: document.querySelector('.scroll_wrap'),
      rootMargin: '1px',
      threshold: 0.1
    }

    observer.value = new IntersectionObserver(callback, options)
    target.value = document.querySelector('.about')

    function callback(entries) {
      const objObserved = entries[0].isIntersecting

      if (animation.value && objObserved) {
        animation.value = false

        gsap.to('.about-hr', { x: '0%', duration: 0.5 })

        gsap.to('.about .letter', {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: function (i) {
            return i * 0.15
          },
          onComplete: function () {
            gsap.to('.about .caption-en', { opacity: 1, duration: 0.3 })
            gsap.to('.about-item', {
              opacity: 1,
              duration: 0.75,
              delay: function (j) {
                return j * 0.15
              }
            })
          }
        })
      }
    }

    observer.value.observe(target.value)
  })
})

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect()
    observer.value = null
  }
})
</script>

<template>
  <section ref="target" class="home-page about">
    <div class="caption_container right">
      <span class="caption-en">About us</span>
      <span class="caption-ch">關於我們</span>
    </div>

    <hr class="about-hr right" />

    <article class="about_container">
      <div class="about_wrap">
        <div class="about-item">
          <span>歡迎來到陶釉坊！</span>
          <span>我們是一個致力於陶瓷藝術的工作室。</span>
        </div>

        <div class="about-item">
          <span>陶釉坊成立於 2010 年，</span>
          <span>我們的創立動機是為了將陶瓷的美麗和獨特之處帶給更多的人們。</span>
          <span>我們相信陶瓷是一種融合藝術和工藝的優雅之物，</span>
          <span>它能夠豐富生活、點綴空間，讓人們感受到美的力量和魅力。</span>
        </div>

        <div class="about-item">
          <span>在陶釉坊，</span>
          <span>我們以客戶的滿意度為首要目標。</span>
          <span>不僅追求產品的優質和精湛工藝，</span>
          <span>還注重與客戶的溝通和理解，</span>
          <span>以確保我們創造出完美符合客戶需求和品味的陶瓷作品。</span>
        </div>

        <div class="about-item">
          <span>我們期待呈現令人驚艷的陶瓷藝術。</span>
        </div>

        <div class="about-item">
          <span>創辦人</span>
          <span class="name">史帝芬 周</span>
          <span>2022年6月吉日</span>
        </div>
      </div>
    </article>
  </section>
</template>
