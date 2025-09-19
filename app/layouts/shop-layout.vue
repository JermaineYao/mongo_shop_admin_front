<script>
import { NConfigProvider } from 'naive-ui'
import ShopNav from '@/components/shopLayout/ShopNav.vue'
</script>

<script setup>
const themeOverrides = {
  Input: {
    // 背景
    color: 'transparent',
    colorFocus: 'rgba(0, 0, 0, 0.2)',

    // 文字 / 游標 / placeholder
    textColor: 'rgba(218, 201, 166, 0.8)',
    caretColor: 'rgba(218, 201, 166, 0.8)',
    placeholderColor: 'rgb(138, 138, 138)',

    // 邊框 / 狀態
    border: '0px solid rgb(224, 224, 230)',
    borderHover: '0px solid #ff6600',
    borderFocus: '0px solid #ff0000',
    boxShadowFocus: '0 0 0 0 rgba(255, 0, 0, 0.25)',

    // 圓角 / 尺寸 / 內距 / 字級
    borderRadius: '0px',
    heightLarge: '48px',
    paddingMedium: '0 15px',
    fontSizeMedium: '14px' // $n
  },
  Select: {
    peers: {
      InternalSelection: {
        color: 'transparent',
        colorActive: 'rgba(0, 0, 0, 0.2)', // focus 背景
        textColor: 'rgba(218, 201, 166, 0.8)',
        placeholderColor: 'rgb(138, 138, 138)',

        border: '0px solid rgb(224, 224, 230)',
        borderActive: '0px solid rgb(224, 224, 230, 0)',
        boxShadowActive: '0 0 0 0px rgba(0,0,0,0)',
        borderHover: '0px solid #ff6600',
        borderFocus: '0px solid #ff0000',
        boxShadowFocus: '0 0 0 0 rgba(255, 0, 0, 0.25)',

        borderRadius: '0px',
        heightLarge: '46px',
        // 單選模式的左右內距（多選是 paddingMultiple）
        paddingSingle: '0 15px',
        fontSizeLarge: '14px'
      },
      InternalSelectMenu: {
        /* 面板類：這些鍵名不是全都有，但你可以先放，Naive 會吃得懂的就套用 */
        color: 'rgba(10,12,26,.96)', // 面板背景
        borderRadius: '0px',
        boxShadow: '0 16px 40px rgba(0,0,0,.45)',
        boxShadowActive: '0 0 0 0px rgba(0,0,0,0)',
        optionTextColor: 'rgba(218,201,166,.9)',
        optionTextColorActive: '#daf0e6',
        optionTextColorHover: 'rgba(218,201,166,1)',
        optionColorPending: 'rgba(255,255,255,.06)',
        optionColorActive: 'rgba(0,255,170, 0)',
        optionHeight: '36px',
        optionFontSize: '14px',
        optionPadding: '10px 14px',
        optionCheckColor: 'rgba(218,201,166,1)'
      }
    }
  }
}
</script>

<template>
  <div class="shop-layout view">
    <div class="scroll_wrap">
      <n-config-provider abstract :theme-overrides="themeOverrides">
        <slot></slot>
      </n-config-provider>

      <Footer />
    </div>

    <ShopNav />
  </div>
</template>
