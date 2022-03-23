import "arrive";
import { EXTENSION_PREFIX, OPEN_VIDEO_TAB_ACTION } from "../constants";

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
      button.className = `${EXTENSION_PREFIX}-button`
      button.disabled = true

      const eventBinding = () => {
        this.port.postMessage({
          type: OPEN_VIDEO_TAB_ACTION,
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
    const root = target.closest("div");
    if (root) {
      const downloadButton = root.querySelector(`.${EXTENSION_PREFIX}-button`)
      if (downloadButton.getAttribute('disabled') === true) {
        downloadButton.disabled = false;
      }
    }
  }

  handleFeedElement(article) {
    const ariaDescribedBy = article.getAttribute("aria-describedby");

    const describedBy = ariaDescribedBy.split(" ");
    const postLinkRoot = article.querySelector(`#${describedBy[0]}`);

    if (postLinkRoot) {
      this.addDownloadButton(postLinkRoot);

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
