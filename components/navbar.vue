<template>
  <section class="navbar">
    <div class="left">
      <div class="logo">
        <router-link :to="{name: 'index'}">ORPHEVS</router-link>
      </div>
    </div>
    <div class="right">
      <ul class="menu">
        <li>
          <nuxt-link to="/" class="nuxt-link">Home</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/about" class="nuxt-link">About</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/contact" class="nuxt-link">Contact</nuxt-link>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {};
</script>
