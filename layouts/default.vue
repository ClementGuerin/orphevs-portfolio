<template>
  <div>
    <navbar/>
    <transition name="fade">
      <nuxt/>
    </transition>
  </div>
</template>

<script>
import navbar from "~/components/navbar";

export default {
  components: {
    navbar
  }
};
</script>
