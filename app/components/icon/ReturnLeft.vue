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
    viewBox="0 0 512 512"
    :width="props.width"
    :height="props.height"
  >
    <path
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="32"
      d="M112 160l-64 64l64 64"
    />
    <path
      d="M64 224h294c58.76 0 106 49.33 106 108v20"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="32"
    />
  </svg>
</template>
