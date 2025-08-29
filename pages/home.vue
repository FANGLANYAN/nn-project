<template>
  <div>
    <button @click="showLoginModal">Login / Register</button>
    <LoginModal :isVisible="isModalVisible" @close="isModalVisible = false" />
  </div>
</template>

<script setup>
const isModalVisible = ref(false);

const showLoginModal = () => {
  isModalVisible.value = true;
};
</script>
