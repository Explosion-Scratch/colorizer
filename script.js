var app = Vue.createApp({
  data() {
    return {
      images: [],
    };
  },
  methods: {
    modal(event) {
      // TODO: Add modal stuff. (called when SVG is clicked.)
    },
    copy(event) {
      var color =
        event.target.getAttribute("data-color") ||
        event.target.closest("[data-color]").getAttribute("data-color");
      var tc = tinycolor(color);
      Snackbar.show({
        showAction: false,
        text: `${color} copied to the clipboard!`,
        backgroundColor: color,
        textColor: tc.isLight() ? "#000" : "#fff",
        pos: "bottom-center",
      });
      var t = document.createElement("textarea");
      t.value = color;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    },
  },
  computed: {
    imageList() {
      return this.images
        .filter((i) => !i.error)
        .sort((item1, item2) => {
          const it = (item) => {
            if (!item.loaded) {
              // If it's not loaded put it last
              return 1000;
            }
            return 1;
          };
          return it(item1) - it(item2);
        });
    },
    sortImages() {
      return this.images
        .filter((i) => !i.error)
        .sort((item1, item2) => {
          // Sort by color, alters colors of squares as loading though
          const it = (item) => {
            if (!item.loaded) {
              // If it's not loaded put it last
              return 1000;
            }
            return item.tc.toHsl().h;
          };
          return it(item1) - it(item2);
        });
    },
    changeColorType(event) {
      var colorType = event.target.value;
      this.images = this.images
        .filter((i) => !(i.error || !i.loaded))
        .map((i) => {
          var out = { ...i };
          var col =
            i.pallette[colorType].rgb ||
            i.pallette.Muted.rgb ||
            i.pallette.DarkMuted.rgb ||
            i.pallette.DarkVibrant.rgb ||
            i.pallette.LightVibrant.rgb;
          out.tc = tinycolor({
            r: col[0],
            g: col[1],
            b: col[2],
          });
          out.color = out.tc.toHexString();
          return out;
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
        if (pallette.error) {
          // Filtered in computed imageList
          return (app.images[index].error = true);
        }
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
        setTimeout(() => {
          tippy("[data-tippy-content]");
        }, 200);
      });
  });
};
