<script setup>
import gsap from 'gsap'

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
    target.value = document.querySelector('.design')

    function callback(entries) {
      const objObserved = entries[0].isIntersecting

      if (animation.value && objObserved) {
        animation.value = false

        gsap.to('.design-hr', { x: '0%', duration: 0.5 })

        gsap.to('.design .letter', {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: function (i) {
            return i * 0.15
          },
          onComplete: function () {
            gsap.to('.design .caption-en', { opacity: 1, duration: 0.3 })

            gsap.to('.design .home-img', { x: '0%', opacity: 0.8, duration: 0.5 })
            gsap.to('.design-item', {
              opacity: 1,
              duration: 0.6,
              delay: function (j) {
                return j * 0.15
              }
            })
          }
        })
      }

      if (objObserved) {
        scrollWrap.addEventListener('scroll', () => {
          gsap.to('.design .home-img', { y: -1 * scrollWrap.scrollTop * 0.12 })
        })
      }
    }

    observer.value.observe(target.value)
  })
})
</script>

<template>
  <div ref="target" class="home-page design">
    <div class="caption_container right">
      <span class="caption-en">Design</span>
      <span class="caption-ch">陶藝設計</span>
    </div>

    <hr class="design-hr right" />

    <article class="design_container right">
      <div class="home-img_wrap">
        <div class="home-img"></div>
      </div>

      <div class="design_wrap">
        <div class="design-item">
          <span>在陶工坊，</span>
          <span>我們追求獨特的設計風格。</span>
        </div>

        <div class="design-item">
          <span>我們的設計師精通陶瓷藝術，</span>
          <span>擁有豐富的創作經驗和敏銳的藝術眼光。</span>
          <span>我們將傳統工藝與現代元素相結合，</span>
          <span>創造出充滿生命力和美感的陶瓷作品。</span>
        </div>

        <div class="design-item">
          <span>無論客戶是尋找簡約、精緻還是大膽、前衛的設計，</span>
          <span>我們都能為客戶呈現最符合客戶品味的陶瓷藝術品。</span>
        </div>

        <div class="design-item">
          <span>我們的陶工坊團隊將藝術和工藝相結合，</span>
          <span>追求卓越和創新。</span>
        </div>
      </div>
    </article>
  </div>
</template>
