import "arrive";

class MobileHandler {
  constructor() {
  }

  handleDownload(inlineVideo: HTMLDivElement) {
    const elementStore = inlineVideo.dataset.store;
    if (!elementStore) return;

    const storeObject = JSON.parse(elementStore);
    if (storeObject.type !== "video") return;

    const { src } = storeObject;
    const videoURL = new URL(src);

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

  init() {
    document.arrive(
      "div.story_body_container",
      {
        existing: true,
        onceOnly: true,
      },
      (root: Element) => {
        root.arrive(
          "div[data-sigil='inlineVideo']",
          {
            existing: true,
            onceOnly: true,
          },
          (element: Element) => {
            const _el = element as HTMLDivElement
            this.handleDownload(_el);
          }
        );
      }
    );
  }
}

const mh = new MobileHandler();
mh.init();
