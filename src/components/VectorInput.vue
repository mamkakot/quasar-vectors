<script setup>
const realPart = defineModel('realPart');
const imaginaryPart = defineModel('imaginaryPart');
</script>

<template>
  <div class="m-5">
    real
    <input v-model="realPart" step="0.1" type="number" class="rounded-lg px-2 ml-1 mr-4 border-gray-300 border-2" />
    im
    <input v-model="imaginaryPart" step="0.1" type="number" class="rounded-lg px-2 ml-1 border-gray-300 border-2" />
  </div>
</template>
