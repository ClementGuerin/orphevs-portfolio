<template>
  <section class="about-page">
    <div class="biography container">
      <div class="row justify-content-between">
        <div class="col-md-12">
          <h1 class="title">{{ about.title }}</h1>
        </div>
        <div class="col-md-5">
          <div class="profil-picture"></div>
        </div>
        <div class="col-md-6">
          <vue-markdown class="description">{{ about.description }}</vue-markdown>
          <ul class="social">
            <li>
              <a href="#">CV</a>
            </li>
            <li>
              <a href="#">Twitter</a>
            </li>
            <li>
              <a href="#">Linkedin</a>
            </li>
            <li>
              <a href="#">Malt</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="contact">
      <div class="container">
        <h2 class="title">Contact me</h2>
      </div>
    </div>
  </section>
</template>

<script>
import VueMarkdown from "vue-markdown";
import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

export default {
  data() {
    return {
      about: this.$store.getters["about/list"][0]
    };
  },
  methods: {
    sendMail: function() {
      const self = this;

      strapi.plugins["email"].services.email.send({
        to: self.about.email,
        from: "robbot@strapi.io",
        replyTo: "no-reply@strapi.io",
        subject: "Use strapi email provider successfully",
        text: "Hello world!"
      });
    }
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
    VueMarkdown
  }
};
</script>
