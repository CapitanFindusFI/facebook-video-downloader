const handler = () => {
  const onPortMessage = (message) => {
    console.log("Message received", message);
  };

  const onPortConnected = (port) => {
    console.log("Port connected");

    port.onMessage.removeListener(onPortMessage);
    port.onMessage.addListener(onPortMessage);
  };

  const init = () => {
    chrome.runtime.onConnect.removeListener(onPortConnected);
    chrome.runtime.onConnect.addListener(onPortConnected);

    console.log("Background script ready for connections");
  };

  return {
    init,
  };
};

const backgroundScript = handler();
backgroundScript.init();
