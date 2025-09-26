<script setup>
const props = defineProps({
  width: { type: String, default: '36px' },
  height: { type: String, default: '36px' }
})
</script>

<template>
  <svg
    class="icon"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 32 32"
    :width="props.width"
    :height="props.height"
  >
    <path d="M2 26h28v2H2z" />
    <path
      d="M25.4 9c.8-.8.8-2 0-2.8l-3.6-3.6c-.8-.8-2-.8-2.8 0l-15 15V24h6.4l15-15zm-5-5L24 7.6l-3 3L17.4 7l3-3zM6 22v-3.6l10-10l3.6 3.6l-10 10H6z"
    />
  </svg>
</template>
