<template>
  <section class="contact-form">
    <h2 class="title" v-if="formState">Contact me</h2>
    <div class="row justify-content-center">
      <div class="col-md-6 form-tocomplete" v-if="formState">
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
          <vue-recaptcha :sitekey="sitekey" @verify="onVerify" ref="recaptcha">
            <button class="btn-send">Send this message</button>
          </vue-recaptcha>
        </div>
      </div>
      <div class="col-md-6 form-send" v-if="!formState">
        <div class="check_mark">
          <div class="sa-icon sa-success animate">
            <span class="sa-line sa-tip animateSuccessTip"></span>
            <span class="sa-line sa-long animateSuccessLong"></span>
            <div class="sa-placeholder"></div>
            <div class="sa-fix"></div>
          </div>
        </div>
        <h3 class="form-send-title">Your message has been sent !</h3>
        <p
          class="form-send-message"
        >I will answer you as soon as possible, you will receive a confirmation mail</p>
      </div>
    </div>
  </section>
</template>

<script>
import VueRecaptcha from "vue-recaptcha";
import Strapi from "strapi-sdk-javascript";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);
const emailInfos = {};

export default {
  props: {
    ownerEmail: String
  },
  data() {
    return {
      sitekey: "6LdjX4EUAAAAAPmAPkwZlnXMcmQ3X-l-NVLG5UUF",
      email: {
        adress: "",
        message: ""
      },
      formState: true
    };
  },
  methods: {
    onVerify: function(response) {
      if (response) {
        if (this.email.adress !== "" && this.email.message !== "") {
          if (
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
              this.email.adress
            )
          ) {
            this.sendMail();
          } else {
            alert("Email address is not correct.");
          }
        } else {
          alert("Please fill all fields correctly.");
        }
        this.resetRecaptcha();
      }
    },
    async sendMail() {
      emailInfos.to = this.ownerEmail;
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

        this.formState = false;
      } catch (err) {
        console.error(err);
        this.formState = true;
      }

      try {
        const reponse = await strapi.request("post", "/email", {
          data: {
            to: emailInfos.from,
            from: emailInfos.to,
            replyTo: emailInfos.to,
            subject: "ORPHEVS - Your message has been sent!",
            html: `<b>Hello ${emailInfos.from} !</b>
            <p>Your message has been sent and I will answer you soon as possible !</p>
            <br>
            <p>Your message : <i>${emailInfos.body}</i></p>
            <br>
            <span>Sincerely, <a href="https://orphevs.fr" target="_blank">Orphevs</a></span>`
          }
        });
      } catch (err) {
        console.error(err);
      }
    },
    resetRecaptcha() {
      this.$refs.recaptcha.reset(); // Direct call reset method
    }
  },
  components: {
    VueRecaptcha
  }
};
</script>
