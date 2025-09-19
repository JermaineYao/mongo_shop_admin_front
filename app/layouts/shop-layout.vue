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
    heightMedium: '48px',
    paddingMedium: '0 15px',
    fontSizeMedium: '14px' // $n
  }
}
</script>

<template>
  <div class="shop-layout view">
    <div class="scroll_wrap">
      <n-config-provider :theme-overrides="themeOverrides">
        <slot></slot>
      </n-config-provider>

      <Footer />
    </div>

    <ShopNav />
  </div>
</template>
