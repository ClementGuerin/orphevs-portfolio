<template>
  <section class="about-page">
    <div class="biography container">
      <div class="row justify-content-between">
        <div class="col-md-12">
          <h1 class="title">{{ about.title }}</h1>
        </div>
        <div class="col-md-5">
          <div class="profil-picture" :style="`background-image: url('${about.photo.url}')`"></div>
        </div>
        <div class="col-md-6">
          <vue-markdown class="description">{{ about.description }}</vue-markdown>
          <ul class="social">
            <li>
              <a href="https://orphevs.fr/cv.pdf" target="_blank">CV</a>
            </li>
            <li>
              <a href="https://twitter.com/Orphevs" target="_blank">Twitter</a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/cl%C3%A9ment-gu%C3%A9rin-68a690152/"
                target="_blank"
              >Linkedin</a>
            </li>
            <li>
              <a href="https://www.malt.fr/profile/clementguerin1" target="_blank">Malt</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div id="contact" class="contact">
      <div class="container">
        <contact-form :owner-email="about.email"/>
      </div>
    </div>
  </section>
</template>

<script>
import VueMarkdown from "vue-markdown";
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
              _id
              title
              description
              email
              photo {
                url
              }
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
    VueMarkdown,
    contactForm
  }
};
</script>
