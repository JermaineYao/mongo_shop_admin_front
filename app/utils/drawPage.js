import gsap from 'gsap'

export function DrawPage() {
  this.height = 0
  this.width = 0
  this.angle = 0
  this.opacity = 0
  this.ctx = null
  this.tween = null //  tween
  this.fadeTween = null // 淡出 tween
  this.timeoutId = null //  setTimeout
}

const pi = Math.PI

DrawPage.prototype.setCanvas = function (target) {
  const canvas = document.createElement('canvas')
  canvas.style.fontFamily = 'Liu Jian Mao Cao'

  const targetDom = document.querySelector(`${target}`)

  targetDom.append(canvas)
  canvas.id = 'page-animation'

  return this
}

DrawPage.prototype.init = function () {
  if (this.ctx) this.ctx = null
  const canvas = document.getElementById('page-animation')

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  this.height = window.innerHeight
  this.width = window.innerWidth

  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true // 抗拒齒

  this.ctx = ctx

  return this
}

DrawPage.prototype.drawCircle = function (angle, opacity) {
  this.ctx.clearRect(0, 0, this.width, this.height)
  this.ctx.fillText('陶', this.width + 100, this.height + 100)
  this.ctx.fillStyle = 'rgba(0, 0, 0, 0)'
  this.ctx.fillRect(0, 0, this.width, this.height)

  this.ctx.beginPath()
  this.ctx.arc(this.width * 0.5, this.height * 0.5, 50, 0, angle, false)
  this.ctx.lineWidth = 2
  this.ctx.strokeStyle = `rgba(218, 201, 166, ${opacity})`
  this.ctx.stroke()

  this.ctx.beginPath()
  this.ctx.fillStyle = `rgba(218, 201, 166, ${opacity})`
  this.ctx.font = '80px "Liu Jian Mao Cao"'
  this.ctx.textAlign = 'center'
  this.ctx.fillText('陶', this.width * 0.5 - 5, this.height * 0.5 + 25)
  this.ctx.stroke()

  return this
}

DrawPage.prototype.drawStaticMark = function () {
  this.drawCircle(pi * 2, 0.8)
}

DrawPage.prototype.drawMark = function (animationFn = null) {
  // 若已存在舊 tween，先砍掉
  if (this.tween) this.tween.kill()

  this.angle = 0
  this.opacity = 0

  gsap.to(this, 2, {
    duration: 2,
    angle: pi * 2,
    opacity: 0.8,
    ease: 'power2.out',
    onUpdate: () => this.drawCircle(this.angle, this.opacity),
    onComplete: () => {
      this.drawStaticMark()

      if (animationFn) {
        setTimeout(() => {
          this.remove()

          animationFn()
        }, 1000)
      }
    }
  })
}

DrawPage.prototype.remove = function () {
  gsap.to('#page-animation', {
    opacity: 0,
    duration: 0.2,
    onComplete: function () {
      const canvas = document.getElementById('page-animation')
      canvas.remove()
      this.height = 0
      this.width = 0
      this.ctx = null
    }
  })
}

DrawPage.prototype.destroy = function () {
  if (this.tween) {
    this.tween.kill()
    this.tween = null
  }
  if (this.fadeTween) {
    this.fadeTween.kill()
    this.fadeTween = null
  }
  if (this.timeoutId) {
    clearTimeout(this.timeoutId)
    this.timeoutId = null
  }
  const canvas = document.getElementById('page-animation')
  if (canvas) canvas.remove()
  this.ctx = null
}
