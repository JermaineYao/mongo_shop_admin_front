<script setup>
const props = defineProps({
  error: {
    type: Object,
    default: () => null
  }
})

const router = useRouter()
const statusCode = props.error?.statusCode || 500

console.log(props.error)

function returnLastPage() {
  router.go(-1)
}
</script>

<template>
  <div class="not-found">
    <Logo />

    <div class="not-found_wrap">
      <span class="not-found-404">
        {{ statusCode === 404 ? '404 Not Found' : 'Something went wrong' }}</span
      >

      <div class="btn-return" @click="returnLastPage">
        <span>回上一頁</span>
      </div>
    </div>
  </div>
</template>
