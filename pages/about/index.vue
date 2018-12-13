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
        <div class="form row justify-content-center">
          <div class="col-md-6">
            <input type="email" class="email" placeholder="Your email adress" v-bind="email.adress">
            <textarea
              class="message"
              placeholder="Type your message here..."
              v-bind="email.message"
            ></textarea>
            <div class="send">
              <button class="btn-send" @click="sendMail">Send this message</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import VueMarkdown from "vue-markdown";
import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);
const email = {};

export default {
  data() {
    return {
      about: this.$store.getters["about/list"][0],
      email: {
        adress: "",
        message: ""
      }
    };
  },
  methods: {
    async sendMail() {
      try {
        email.to = this.about.email;
        email.from = this.email.adress;
        email.text = this.email.message;

        console.log(strapi, "strapi");
        console.log(strapi.services, "strapi-services");

        const reponse = await strapi.services.email.send({
          to: email.to,
          from: email.from,
          replyTo: email.from,
          subject: "ORPHEVS.fr - Vous avez reçu un nouveau message",
          text: email.text
        });
      } catch (err) {
        console.error(err.message || "An error occurred.");
      }
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
