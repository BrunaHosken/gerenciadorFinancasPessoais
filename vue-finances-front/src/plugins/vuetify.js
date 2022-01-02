import Vue from "vue";
import Vuetify from "vuetify/lib";
import pt from "vuetify/lib/locale/pt";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { pt },
    current: "pt",
  },
  icons: {
    iconfont: "md",
  },
  theme: {
    dark: true,
  },
});
