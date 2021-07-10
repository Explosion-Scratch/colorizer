var app = Vue.createApp({
    data(){
        return {
            images: [],
        }
    }
}).mount("#app");

const btn = document.querySelector("button");

btn.onclick = async () => {
    var images = await fetch(`/imgsearch?q=${escape(document.querySelector("input").value)}`).then(res => res.json());
    app.images = images.map(i => ({...i, loaded: false}))
    images.forEach((image, index) => {
        fetch(`/color?q=${escape(image.url)}`).then(res => res.json()).then((pallette) => {
            app.images[index].loaded = true;
            app.images[index].pallette = pallette;
        });
    })
}