<script setup>
definePageMeta({
  layout: 'shop-layout',
  middleware: () => {
    return navigateTo('/shop/products')
  },
  pageTransition: { name: 'fade', mode: 'out-in', appear: true }
})
</script>
