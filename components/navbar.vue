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
    <div class="menuAnimation"></div>
  </section>
</template>

<script>
import lottie from "lottie-web";
import menuAnimation from "~/assets/animations/menu.json";

export default {
  data() {
    return {
      menuAnim: null,
      menuState: false
    };
  },
  mounted() {
    const self = this;

    this.menuAnim = lottie.loadAnimation({
      container: document.querySelector(".menuAnimation"), // the dom element that will contain the animation
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: menuAnimation,
      rendererSettings: {
        scaleMode: "noScale",
        clearCanvas: false,
        progressiveLoad: false, // Boolean, only svg renderer, loads dom elements when needed. Might speed up initialization for large number of elements.
        hideOnTransparent: true //Boolean, only svg renderer, hides elements when opacity reaches 0 (defaults to true)
      }
    });

    this.menuAnim.setSpeed(2);

    $(".menuAnimation").hide();

    this.menuAnim.addEventListener("enterFrame", function() {
      $(".menuAnimation").show();
    });

    this.menuAnim.addEventListener("complete", function() {
      if (!self.menuState) {
        $(".menuAnimation").hide();
      }
    });

    $(".menuAnimation > svg").attr("viewBox", "");
  },
  methods: {
    toggleMenu: function() {
      if (this.menuState) {
        this.menuAnim.setDirection("-1");
        this.menuAnim.play();
      } else {
        this.menuAnim.setDirection("1");
        this.menuAnim.play();
      }
      this.menuState = !this.menuState;
    }
  }
};
</script>
