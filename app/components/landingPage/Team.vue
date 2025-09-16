<script setup>
import gsap from 'gsap'

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
    target.value = document.querySelector('.team')

    function callback(entries) {
      const objObserved = entries[0].isIntersecting

      if (animation.value && objObserved) {
        animation.value = false

        gsap.to('.team-hr', { x: '0%', duration: 0.5 })

        gsap.to('.team .letter', {
          y: 0,
          opacity: 1,
          duration: 0.3,
          delay: function (i) {
            return i * 0.15
          },
          onComplete: function () {
            gsap.to('.team .caption-en', { opacity: 1, duration: 0.3 })
            gsap.to('.team-item', {
              opacity: 1,
              duration: 0.1,

              onComplete: function () {
                gsap.to('.team-member_container', { opacity: 1, duration: 0.1 })
                gsap.to('.team-member_wrap', {
                  opacity: 1,
                  duration: 0.6,
                  delay: function (k) {
                    return k * 0.15
                  }
                })
              }
            })
          }
        })
      }
    }

    observer.value.observe(target.value)
  })
})
</script>

<template>
  <div ref="target" class="home-page team">
    <div class="caption_container">
      <span class="caption-en">Team</span>
      <span class="caption-ch">團隊介紹</span>
    </div>

    <hr class="team-hr" />

    <article class="team_container">
      <div class="team_wrap team-description">
        <div class="team-item">
          <span>陶工坊是由一群專業的人士組成的團隊。</span>
          <span>都對陶瓷藝術充滿熱愛，</span>
          <span>並致力於創造出精美而獨特的陶瓷作品。</span>
        </div>

        <div class="team-item">
          <span>具有創意和藝術眼光。</span>
          <span>融合傳統和現代元素，</span>
          <span>為陶瓷作品注入獨特的風格和個性。</span>
          <span>以創新的設計概念和精湛的技術，</span>
          <span>將作品打造成藝術品。</span>
        </div>
      </div>
    </article>

    <article class="team-member_container">
      <div class="team-member_wrap">
        <div class="team-img_wrap">
          <div class="team-img member-1"></div>
        </div>

        <div class="member_container">
          <span class="member-name">田中美香</span>
          <hr />
          <ul>
            <li>畢業於東京藝術大學，陶瓷藝術專業</li>
            <li>在陶瓷工坊擔任陶藝師十年以上，擅長創作現代風格的陶瓷作品</li>
            <li>曾獲得日本陶藝協會年度優秀作品獎、國際陶瓷藝術比賽銀牌獎等</li>
            <li>多次入選國內外陶藝展覽，包括東京陶瓷藝術展、國際陶瓷博覽會等</li>
          </ul>
        </div>
      </div>

      <div class="team-member_wrap">
        <div class="team-img_wrap">
          <div class="team-img member-2"></div>
        </div>

        <div class="member_container">
          <span class="member-name">Emily Johnson</span>
          <hr />
          <ul>
            <li>美國加州藝術學院陶瓷藝術碩士學位</li>
            <li>在陶瓷工坊擔任陶藝師七年以上，專攻創新陶瓷技術和實驗性作品</li>
            <li>獲得美國陶藝協會創新設計獎、國際現代陶瓷展評審特別獎等</li>
            <li>多次入選國際陶瓷展覽，如加州陶藝藝術博覽會、亞洲陶瓷交流展等</li>
          </ul>
        </div>
      </div>

      <div class="team-member_wrap">
        <div class="team-img_wrap">
          <div class="team-img member-3"></div>
        </div>

        <div class="member_container">
          <span class="member-name">Johnson Smith</span>
          <hr />
          <ul>
            <li>獲得美國紐約藝術學院陶瓷藝術學士學位</li>
            <li>在陶瓷工坊擔任主要陶藝師六年以上，擁有豐富的創作和設計經驗</li>
            <li>獲得美國陶藝協會年度最佳新人獎、國際陶瓷創作比賽銅牌獎等</li>
            <li>多次入選國際陶藝展覽，如紐約現代陶瓷藝術展、國際陶瓷交流展等</li>
          </ul>
        </div>
      </div>

      <div class="team-member_wrap">
        <div class="team-img_wrap">
          <div class="team-img member-4"></div>
        </div>

        <div class="member_container">
          <span class="member-name">張明華</span>
          <hr />
          <ul>
            <li>畢業於國立台北藝術大學，陶瓷藝術學系</li>
            <li>在陶瓷工坊擔任陶藝師四年以上，擁有豐富的創作和設計經驗</li>
            <li>曾獲得台灣陶藝博覽會最佳設計獎、國際陶瓷藝術展優秀作品獎等</li>
            <li>多次入選國內外陶藝展覽，包括亞洲陶瓷藝術交流展、國際陶瓷藝術博覽會等</li>
          </ul>
        </div>
      </div>
    </article>
  </div>
</template>
