<script>
import gsap from 'gsap'
</script>

<script setup>
const animation = ref(true)
const observer = ref(null)
const target = ref(null)

onMounted(() => {
  nextTick(() => {
    const scrollWrap = document.querySelector('.scroll_wrap')
    const options = {
      root: scrollWrap,
      rootMargin: '1px',
      threshold: 0.1
    }

    observer.value = new IntersectionObserver(callback, options)
    target.value = document.querySelector('.professional')

    function callback(entries) {
      const objObserved = entries[0].isIntersecting

      if (animation.value && objObserved) {
        animation.value = false

        gsap.to('.professional-hr', { x: '0%', duration: 0.5 })

        gsap.to('.professional .letter', {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: function (i) {
            return i * 0.15
          },
          onComplete: function () {
            gsap.to('.professional .caption-en', { opacity: 1, duration: 0.3 })
            gsap.to('.professional .home-img', { x: '0%', opacity: 0.8, duration: 0.5 })
            gsap.to('.professional-item', {
              opacity: 1,
              duration: 0.5,
              delay: function (j) {
                return j * 0.15
              }
            })
          }
        })
      }

      if (objObserved) {
        scrollWrap.addEventListener('scroll', () => {
          gsap.to('.professional .home-img', { y: -1 * scrollWrap.scrollTop * 0.2 })
        })
      }
    }

    observer.value.observe(target.value)
  })
})
</script>

<template>
  <section ref="target" class="home-page professional">
    <div class="caption_container">
      <span class="caption-en">Professional processing</span>
      <span class="caption-ch">加工技法</span>
    </div>

    <hr class="professional-hr" />

    <article class="professional_container">
      <div class="professional_wrap">
        <div class="professional-item">
          <span>在陶工坊，</span>
          <span>我們擁有一支專業的團隊，</span>
          <span>熟練掌握陶瓷製作的各個細節。</span>
        </div>

        <div class="professional-item">
          <span>我們注重所有工序，</span>
          <span>從原材料的選擇到成品的完美呈現，</span>
          <span>我們精心打磨，</span>
          <span>確保作品都符合最高的品質標準。</span>
        </div>

        <div class="professional-item">
          <span>無論客戶是需要定制設計還是現成作品，</span>
          <span>我們都能提供專業的服務和意見，</span>
          <span>讓客戶滿意而歸。</span>
        </div>
      </div>

      <div class="home-img_wrap">
        <div class="home-img"></div>
      </div>
    </article>
  </section>
</template>
