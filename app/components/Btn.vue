<script setup>
const props = defineProps({
  to: String
})

const emit = defineEmits(['click'])

function clickFn() {
  emit('click')
}
</script>

<template>
  <NuxtLink v-if="to" :to="to" class="btn">
    <slot />
  </NuxtLink>

  <div v-else class="btn" @click="clickFn">
    <span>
      <slot />
    </span>
  </div>
</template>
