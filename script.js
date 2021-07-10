var app = Vue.createApp({
  data() {
    return {
      images: [],
    };
  },
  computed: {
    imageList() {
      return this.images.sort((i) => {
        if (!i.loaded) {
          return 1000;
        }
        return i.tc.toHsl().h;
      });
    },
  },
}).mount("#app");

const btn = document.querySelector("button");

btn.onclick = async () => {
  var images = await fetch(
    `/imgsearch?q=${escape(document.querySelector("input").value)}`
  ).then((res) => res.json());
  app.images = images.map((i) => ({ ...i, loaded: false }));
  images.forEach((image, index) => {
    fetch(`/color?q=${escape(image.url)}`)
      .then((res) => res.json())
      .then((pallette) => {
        app.images[index].loaded = true;
        app.images[index].pallette = pallette;
        var col = pallette.Muted.rgb;
        app.images[index].tc = tinycolor({
          r: col[0],
          g: col[1],
          b: col[2],
        });
        app.images[index].color = app.images[index].tc.toHexString();
      });
  });
};
