<template>
  <section class="index">
    <div v-swiper:mySwiper="swiperOption">
      <div class="swiper-wrapper projects-list">
        <div
          class="swiper-slide"
          v-for="(project,index) in filteredList"
          :key="project.id"
          :slug="project.slug"
          @click="openProject"
        >
          <img class="project-thumbnail" :src="project.thumbnail.url">
          <span class="project-counter">{{ ('0' + (index+1)).slice(-2) }}</span>
          <h3 class="project-title">{{ project.title }}</h3>
          <h5 class="project-category">{{ project.category }}</h5>
        </div>
      </div>
    </div>
    <div class="project-widgets">
      <div class="left">
        <div class="project-counter">
          <div class="project-counter-active">{{ projectCounter }}</div>
          <div class="project-counter-total">{{ ('0' + filteredList.length).slice(-2) }}</div>
        </div>
      </div>
      <div class="right">
        <div class="project-actions">
          <a class="project-action-prev" @click="changeProject('prev')">
            <i class="fas fa-angle-left"></i>
          </a>
          <a class="project-action-next" @click="changeProject('next')">
            <i class="fas fa-angle-right"></i>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);
export default {
  data() {
    return {
      query: "",
      projectCounter: "01",
      swiperOption: {
        speed: 800,
        grabCursor: true,
        centeredSlides: true,
        spaceBetween: 115,
        slideToClickedSlide: true,
        roundLengths: true,
        slidesPerView: "auto",
        mousewheel: {
          eventsTarged: "body"
        },
        keyboard: {
          enabled: true
        },
        effect: "coverflow",
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true
        }
      }
    };
  },
  mounted: function() {
    const self = this;

    this.resizeProjects();
    this.updateProjectCounter();

    $(window).resize(function() {
      self.resizeProjects();
    });

    this.mySwiper.on("slideChange", function() {
      self.updateProjectCounter();
    });
  },
  computed: {
    filteredList() {
      return this.projects.filter(project => {
        return project.title.toLowerCase().includes(this.query.toLowerCase());
      });
    },
    projects() {
      return this.$store.getters["projects/list"];
    }
  },
  methods: {
    changeProject: function(state) {
      switch (state) {
        case "prev":
          this.mySwiper.slidePrev();
          break;
        case "next":
          this.mySwiper.slideNext();
          break;
      }
    },
    openProject: function() {
      const self = this;
      const target = event.target.offsetParent.getAttribute("slug");
      let wait = setTimeout(function() {
        self.$router.push({
          name: "project-id",
          params: { id: target }
        });
      }, 0);
    },
    updateProjectCounter: function() {
      const self = this;

      let wait = setTimeout(function() {
        let indexProject = self.mySwiper.activeIndex;
        let zero = indexProject < 10 ? "0" : null;

        self.projectCounter = zero + (indexProject + 1);
      }, 100);
    },
    resizeProjects: function() {
      let el = $(".projects-list");
      el.parent().css({
        position: "relative",
        top: window.innerHeight / 2 - el.height() / 2
      });
    }
  },
  async fetch({ store }) {
    store.commit("projects/emptyList");
    const response = await strapi.request("post", "/graphql", {
      data: {
        query: `query {
            projects(where: {
              show: true
            }) {
              _id
              slug
              title
              category
              thumbnail {
                url
              }
            }
          }
          `
      }
    });
    response.data.projects.forEach(project => {
      project.thumbnail.url = `${apiUrl}${project.thumbnail.url}`;
      store.commit("projects/add", {
        id: project.id || project._id,
        ...project
      });
    });
  }
};
</script>
