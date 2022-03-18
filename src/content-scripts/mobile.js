import "arrive";

const handler = () => {
  const FEED_SELECTOR = "div[role='feed'] > div";
  const MENU_SELECTOR = "div[aria-haspopup='menu']";

  const onDownloadClick = (videoElement) => {
    console.log(videoElement);
  };

  const init = () => {
    document.arrive(`${FEED_SELECTOR}`, (element) => {
      element.arrive("video", (videoElement) => {
        const descriptionElement = element.querySelector("div[dir='auto']");
        if (descriptionElement) {
          const buttonElement = document.createElement("button");
          buttonElement.textContent = "Download";
          buttonElement.addEventListener("click", () =>
            onDownloadClick(videoElement)
          );

          descriptionElement.prepend(buttonElement);
        }
      });
    });
  };

  return {
    init,
  };
};

const facebookContentScript = handler();
facebookContentScript.init();
