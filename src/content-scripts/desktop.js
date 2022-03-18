import "arrive";

const handler = () => {
  const FEED_SELECTOR = "div[role='feed'] > div";
  const ARTICLE_SELECTOR = "div[role='article']";

  const onDownloadClick = (port, videoElement) => {
    console.log(port, videoElement);
  };

  const onPortConnected = (port) => {
    document.arrive(`${FEED_SELECTOR}`, (element) => {
      element.arrive("video", (videoElement) => {
        console.log(videoElement);

        const articleRoot = element.querySelector(ARTICLE_SELECTOR);

        if (articleRoot) {
          console.log(articleRoot);

          const ariaDescribedBy = articleRoot.getAttribute("aria-describedby");
          const ariaLabelledBy = articleRoot.getAttribute("aria-labelledby");

          const describedBy = ariaDescribedBy.split(" ");
          const postLinkRoot = articleRoot.querySelector(`#${describedBy[0]}`);

          if (postLinkRoot) {
            const postLinkEl = postLinkRoot.querySelector("a");
            const postLink = postLinkEl.getAttribute("href");
            console.log(postLink);
          }
        }

        /*
        const descriptionElement = element.querySelector("div[dir='auto']");
        if (descriptionElement) {
          const buttonElement = document.createElement("button");
          buttonElement.textContent = "Download";
          buttonElement.addEventListener("click", () =>
            onDownloadClick(port, videoElement)
          );

          descriptionElement.prepend(buttonElement);
        }
        */
      });
    });
  };

  const init = () => {
    const port = chrome.runtime.connect({
      name: "fb-video-downloader",
    });

    if (chrome.lastError) {
      throw new Error(chrome.lastError);
    }

    onPortConnected(port);
  };

  return {
    init,
  };
};

const facebookContentScript = handler();
facebookContentScript.init();
