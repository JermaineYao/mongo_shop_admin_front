<script setup>
import { NIcon } from 'naive-ui'

import { LogoFacebook, LogoInstagram, LogoYoutube, LogoTwitter } from '@vicons/ionicons5'
</script>

<template>
  <div class="footer">
    <LogoSmall />

    <div class="footer_container">
      <div class="icons">
        <n-icon size="36" color="rgb(182, 182, 182)">
          <LogoFacebook />
        </n-icon>

        <n-icon size="36" color="rgb(182, 182, 182)">
          <LogoInstagram />
        </n-icon>

        <n-icon size="36" color="rgb(182, 182, 182)">
          <LogoYoutube />
        </n-icon>

        <n-icon size="36" color="rgb(182, 182, 182)">
          <LogoTwitter />
        </n-icon>
      </div>

      <div class="footer-description">
        <span class="alert">⁕ 僅為作品練習用, 非營利用途</span>
        <span class="copy-right">© colored glaze Workshop Corp. All Rights Reserved.</span>
      </div>
    </div>
  </div>
</template>
