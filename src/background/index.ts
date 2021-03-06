import { OPEN_VIDEO_TAB_ACTION } from "../constants";
import { PortMessage } from "../types";

class BackgroundHandler {
  private port: chrome.runtime.Port | null;

  constructor() {
    this.port = null;
  }

  onOpenVideoTab(videoUrl: string) {
    const fullUrl = new URL(videoUrl);
    const { origin, pathname } = fullUrl;

    const newOrigin = origin.replace("www", "m");
    const newUrl = new URL(`${newOrigin}${pathname}`);

    chrome.tabs
      .create({
        url: newUrl.href,
        active: true,
      })
      .then((tab) => {
        const { id } = tab;
      });
  }

  onPortMessage(message: PortMessage<any>) {
    if (message.type && message.data) {
      const { type, data } = message;
      switch (type) {
        case OPEN_VIDEO_TAB_ACTION: {
          this.onOpenVideoTab(data.url);
          break;
        }
        default: {
          console.log(`Unhandled message type: ${type}`, data);
          break;
        }
      }
    }
  }

  onPortDisconnected(port: chrome.runtime.Port) {
    this.port = null;
  }

  onPortConnected(port: chrome.runtime.Port) {
    console.log("Port connected");

    this.port = port;

    const messageBinding = this.onPortMessage.bind(this);

    this.port.onMessage.removeListener(messageBinding);
    this.port.onMessage.addListener(messageBinding);

    const disconnectBinding = this.onPortDisconnected.bind(this);

    this.port.onDisconnect.removeListener(disconnectBinding);
    this.port.onDisconnect.addListener(disconnectBinding);
  }

  init() {
    const eventBinding = this.onPortConnected.bind(this);

    chrome.runtime.onConnect.removeListener(eventBinding);
    chrome.runtime.onConnect.addListener(eventBinding);

    console.log("Background script ready for connections");
  }
}

const bh = new BackgroundHandler();
bh.init();
