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
            <input
              type="email"
              class="email"
              name="email"
              placeholder="Your email adress"
              v-model="email.adress"
            >
            <textarea
              class="message"
              name="message"
              placeholder="Type your message here..."
              v-model="email.message"
            ></textarea>
            <div class="send">
              <vue-recaptcha :sitekey="sitekey" @verify="onVerify">
                <button class="btn-send">Send this message</button>
              </vue-recaptcha>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import VueMarkdown from "vue-markdown";
import VueRecaptcha from "vue-recaptcha";
import Strapi from "strapi-sdk-javascript";
import axios from "axios";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);
const emailInfos = {};

export default {
  data() {
    return {
      about: this.$store.getters["about/list"][0],
      sitekey: "6LdjX4EUAAAAAPmAPkwZlnXMcmQ3X-l-NVLG5UUF",
      email: {
        adress: "",
        message: ""
      }
    };
  },
  methods: {
    onVerify: function(response) {
      if (response) {
        this.sendMail();
      }
    },
    async sendMail() {
      emailInfos.to = this.about.email;
      emailInfos.from = this.email.adress;
      emailInfos.body = this.email.message;

      try {
        const reponse = await strapi.request("post", "/email", {
          data: {
            to: emailInfos.to,
            from: emailInfos.from,
            replyTo: emailInfos.from,
            subject: "ORPHEVS - Nouveau message",
            text: emailInfos.body
          }
        });
      } catch (err) {
        alert(err);
        console.log(options);
      }

      // axios
      //   .post("https://orphevs.fr/mail.php", {
      //     to: emailInfos.to,
      //     from: emailInfos.from,
      //     subject: "ORPHEVS - Nouveau message",
      //     message: emailInfos.body
      //   })
      //   .then(function(response) {
      //     console.log(response);
      //   })
      //   .catch(function(error) {
      //     alert(error);
      //   });
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
    VueMarkdown,
    VueRecaptcha
  }
};
</script>
