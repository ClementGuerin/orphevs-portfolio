<template>
  <section class="contact-page contact">
    <div class="container">
      <contact-form :owner-email="about.email"/>
    </div>
  </section>
</template>

<script>
import Strapi from "strapi-sdk-javascript";
import contactForm from "~/components/contact-form";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

export default {
  data() {
    return {
      about: this.$store.getters["about/list"][0]
    };
  },
  async fetch({ store, params }) {
    const self = this;

    store.commit("about/emptyList");
    const response = await strapi.request("post", "/graphql", {
      data: {
        query: `query {
            abouts{
              email
            }
          }
          `
      }
    });
    response.data.abouts.forEach(about => {
      if (about.photo) {
        about.photo.url = `${apiUrl}${about.photo.url}`;
      }
      store.commit("about/add", {
        id: about.id || about._id,
        ...about
      });
    });
  },
  components: {
    contactForm
  }
};
</script>
