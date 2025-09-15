<script setup>
definePageMeta({
  layout: 'black-layout'
})

const { sum, plus, minius } = counter()
</script>

<template>
  <div>
    <span>chat</span>

    <hr />

    <span>sum : {{ sum }}</span>

    <hr />

    <Btn @click="plus">+</Btn>
    <Btn @click="minius">-</Btn>
  </div>
</template>
