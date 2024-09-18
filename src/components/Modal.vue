<template>
  <div class="w-dvw h-dvh fixed top-0 left-0">
    <div @click="$emit('closeModal')" class="w-full h-full bg-neutral-800/50"></div>
    <div class="h-dvh w-[35rem] bg-white absolute right-0 top-0 flex flex-col">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineEmits(['closeModal'])
</script>

<style scoped></style>
