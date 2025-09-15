export default function () {
  const sum = ref(0)

  function plus() {
    sum.value++
  }

  function minius() {
    sum.value--
  }

  return { sum, plus, minius }
}
