import "arrive";
import { OPEN_VIDEO_TAB } from "../actions";

const FEED_SELECTOR = "div[role='feed'] > div";
const ARTICLE_SELECTOR = "div[role='article']";

class DesktopHandler {
  constructor() {
    this.port = null;
  }

  addDownloadButton(link) {
    const root = link.closest("div");
    if (root && !root.querySelector("button")) {
      const button = document.createElement("button");
      button.type = "button";
      button.innerText = "Download";

      const eventBinding = () => {
        this.port.postMessage({
          type: OPEN_VIDEO_TAB,
          data: {
            url: link.getAttribute("href"),
          },
        });
      };
      button.removeEventListener("click", eventBinding);
      button.addEventListener("click", eventBinding);

      root.append(button);
    }
  }

  handlePostLink(event) {
    const { target } = event;
    this.addDownloadButton(target);
    // const linkHref = link.getAttribute("href");
  }

  handleFeedElement(article) {
    const ariaDescribedBy = article.getAttribute("aria-describedby");

    const describedBy = ariaDescribedBy.split(" ");
    const postLinkRoot = article.querySelector(`#${describedBy[0]}`);

    if (postLinkRoot) {
      const eventBind = this.handlePostLink.bind(this);
      postLinkRoot.arrive(
        "a",
        {
          fireOnAttributesModification: true,
        },
        (link) => {
          const href = link.getAttribute("href");
          if (href !== "#") {
            link.removeEventListener("mouseenter", eventBind);
            link.addEventListener("mouseenter", eventBind);

            postLinkRoot.unbindArrive("a");
          }
        }
      );
    }
  }

  handleFeed() {
    document.arrive(FEED_SELECTOR, (post) => {
      post.arrive("video", () => {
        const articleRoot = post.querySelector(ARTICLE_SELECTOR);
        if (articleRoot) this.handleFeedElement(articleRoot);
      });
    });
  }

  init() {
    const port = chrome.runtime.connect({
      name: "fb-video-downloader",
    });

    if (chrome.lastError) {
      throw new Error(chrome.lastError);
    }

    this.port = port;

    this.handleFeed();
  }
}

const desktopHandler = new DesktopHandler();
desktopHandler.init();
