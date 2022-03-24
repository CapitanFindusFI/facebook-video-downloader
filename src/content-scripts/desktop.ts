import "arrive";
import { EXTENSION_PREFIX, OPEN_VIDEO_TAB_ACTION } from "../constants";

const FEED_SELECTOR = "div[role='feed'] > div";
const ARTICLE_SELECTOR = "div[role='article']";

class DesktopHandler {
  private port: chrome.runtime.Port | null;

  constructor() {
    this.port = null;
  }

  addDownloadButton(link: HTMLSpanElement) {
    const root = link.closest("div");
    if (root && !root.querySelector("button")) {
      const button = document.createElement("button");
      button.type = "button";
      button.innerText = "Download";
      button.className = `${EXTENSION_PREFIX}-button`
      button.disabled = true

      const eventBinding = () => {
        if (!this.port) return
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

  handlePostLink(event: MouseEvent) {
    const { target } = event;
    if (target) {
      const root = (target as HTMLElement).closest("div");
      if (root) {
        const downloadButton = root.querySelector<HTMLButtonElement>(`.${EXTENSION_PREFIX}-button`)
        if (downloadButton) {
          if (downloadButton.disabled) {
            downloadButton.disabled = false;
          }
        }
      }
    }
  }

  handleFeedElement(article: HTMLDivElement) {
    const ariaDescribedBy = article.getAttribute("aria-describedby");
    if (ariaDescribedBy) {
      const describedBy = ariaDescribedBy.split(" ");
      const postLinkRoot = article.querySelector<HTMLSpanElement>(`#${describedBy[0]}`);

      if (postLinkRoot) {
        this.addDownloadButton(postLinkRoot);

        const eventBind = this.handlePostLink.bind(this);
        postLinkRoot.arrive(
          "a",
          {
            fireOnAttributesModification: true,
          },
          (link: Element) => {
            const _el = link as HTMLLinkElement
            const href = _el.getAttribute("href");
            if (href !== "#") {
              _el.removeEventListener("mouseenter", eventBind);
              _el.addEventListener("mouseenter", eventBind);

              postLinkRoot.unbindArrive("a");
            }
          }
        );
      }
    }
  }

  handleFeed() {
    document.arrive(FEED_SELECTOR, (post: Element) => {
      const _el = post as HTMLDivElement
      _el.arrive("video", () => {
        const articleRoot = _el.querySelector<HTMLDivElement>(ARTICLE_SELECTOR);
        if (articleRoot) this.handleFeedElement(articleRoot);
      });
    });
  }

  init() {
    const port: chrome.runtime.Port = chrome.runtime.connect({
      name: "fb-video-downloader",
    });

    if (chrome.runtime.lastError) {
      throw new Error(chrome.runtime.lastError.message);
    }

    this.port = port;

    this.handleFeed();
  }
}

const desktopHandler = new DesktopHandler();
desktopHandler.init();
