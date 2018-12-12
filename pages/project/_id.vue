<template>
  <section class="project-page">
    <div class="header" :style="headerBackground"></div>
    <div class="content">
      <div class="container">
        <h1>{{ project.title }}</h1>
        <h3>{{ project.category }}</h3>
        <p>{{ project.description }}</p>
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
      project: this.$store.getters["projects/list"][0]
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    headerBackground() {
      return "background-image: url(" + this.project.thumbnail.url + ");";
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
