var app = Vue.createApp({
  data() {
    return {
      images: [],
    };
  },
  computed: {
    imageList() {
      return this.images.sort((item1, item2) => {
        const it = (item) => {
          if (!item.loaded) {
            return 1000;
          }
          console.log(item.tc.toHsl());
          return item.tc.toHsl().h;
        };
        return it(item1) - it(item2);
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
        // Get color
        var col =
          pallette.Muted.rgb ||
          pallette.DarkMuted.rgb ||
          pallette.DarkVibrant.rgb ||
          pallette.LightVibrant.rgb;
        app.images[index].tc = tinycolor({
          r: col[0],
          g: col[1],
          b: col[2],
        });
        app.images[index].color = app.images[index].tc.toHexString();
      });
  });
};
