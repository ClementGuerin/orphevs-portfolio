<template>
  <section class="container">
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      <i class="fab fa-twitter"></i>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <ul v-for="project in filteredList" :key="project.id">
      <li>
        <b>Title :</b>
        {{project.title}}
      </li>
      <li>
        <b>Description :</b>
        {{project.description}}
      </li>
      <li>
        <img :src="project.thumbnail.url" alt="thumbnail project">
      </li>
    </ul>
  </section>
</template>

<script>
import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);
export default {
  data() {
    return {
      query: ""
    };
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
  async fetch({ store }) {
    store.commit("projects/emptyList");
    const response = await strapi.request("post", "/graphql", {
      data: {
        query: `query {
            projects {
              _id
              title
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

<style>
</style>
