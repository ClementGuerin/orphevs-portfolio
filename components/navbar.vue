<template>
  <section class="navbar">
    <div class="left">
      <div class="logo">
        <router-link :to="{name: 'index'}">ORPHEVS</router-link>
      </div>
    </div>
    <div class="right">
      <a class="btn-menu" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </a>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    toggleMenu: function() {
      console.log("menu toggled");
    }
  }
};
</script>
