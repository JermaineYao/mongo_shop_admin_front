<script setup>
function btnClick() {
  console.log(123)
}
</script>

<template>
  <div>
    <span>home</span>

    <Btn @click="btnClick">click</Btn>

    <Btn to="/chat">go to chat</Btn>
  </div>
</template>
