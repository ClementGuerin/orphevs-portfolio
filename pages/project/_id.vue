<template>
  <section class="project-page">
    <div class="header" :style="headerBackground"></div>
    <div class="page">
      <div class="content">
        <div class="container">
          <div class="head-content row justify-content-between">
            <div class="col-md-4">
              <h1 class="project-title">{{ project.title }}</h1>
              <ul class="project-list">
                <li>Type : {{ project.category }}</li>
                <li>
                  <span>Date :</span>
                  <span>{{ project.created }}</span>
                </li>
              </ul>
            </div>
            <div class="col-md-7">
              <vue-markdown class="project-description">{{ project.description }}</vue-markdown>
            </div>
          </div>
          <div class="body-content" v-for="image in project.gallery" :key="image.id">
            <img class="img-fluid" :src="image.url" :alt="image.id">
          </div>
        </div>
      </div>
      <div class="next-project">
        <nuxt-link to="/">Back to Home</nuxt-link>
      </div>
    </div>
  </section>
</template>

<script>
import VueMarkdown from "vue-markdown";
import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.apiUrl;
const strapi = new Strapi(apiUrl);
export default {
  data() {
    return {
      project: this.$store.getters["projects/list"][0]
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    headerBackground() {
      var result;

      if (this.project.header) {
        result = `background-image: url("${this.project.header.url}");`;
      } else {
        result = null;
      }

      return result;
    }
  },
  async fetch({ store, params }) {
    const self = this;

    store.commit("projects/emptyList");
    const response = await strapi.request("post", "/graphql", {
      data: {
        query: `query {
            projects(where: {
              slug: "${params.id}"
            }) {
              _id
              slug
              title
              category
              description
              created
              thumbnail {
                url
              }
              header {
                url
              }
              gallery {
                url
              }
            }
          }
          `
      }
    });
    response.data.projects.forEach(project => {
      store.commit("projects/add", {
        id: project.id || project._id,
        ...project
      });
    });
  },
  components: {
    VueMarkdown
  }
};
</script>
