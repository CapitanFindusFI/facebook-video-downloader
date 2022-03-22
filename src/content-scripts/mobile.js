import "arrive";

class MobileHandler {
  constructor() {
    console.log("mobile handler ready");
  }

  handleDownload(inlineVideo) {
    const elementStore = inlineVideo.dataset.store;
    const storeObject = JSON.parse(elementStore);
    if (storeObject.type === "video") {
      const { type, src } = storeObject;
      const videoURL = new URL(src);
      console.log(videoURL);

      fetch(videoURL.href)
        .then((r) => r.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");

          link.style.display = "none";
          link.href = url;
          link.download = "video.mp4";

          document.body.appendChild(link);
          link.click();
          window.URL.revokeObjectURL(url);
        });
    }
  }

  init() {
    document.arrive(
      "div.story_body_container",
      {
        existing: true,
        onceOnly: true,
      },
      (root) => {
        console.log(root);
        root.arrive(
          "div[data-sigil='inlineVideo']",
          {
            existing: true,
            onceOnly: true,
          },
          (element) => {
            this.handleDownload(element);
          }
        );
      }
    );
  }
}

const mh = new MobileHandler();
mh.init();
