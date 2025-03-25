/**
 * MessageHandler class for handling extension messaging
 */
class MessageHandler {
  constructor(onInitCustomizer) {
    this.onInitCustomizer = onInitCustomizer;
    this.initialized = false;
  }

  /**
   * Sets up the message listener
   */
  setupListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log("Received message:", message);

      if (message.action === "initCustomizer") {
        // Only initialize once
        if (!this.initialized) {
          this.initialized = true;
          this.onInitCustomizer();
          sendResponse({ status: "Customizer initialized" });
        } else {
          sendResponse({ status: "Customizer already exists" });
        }

        return true; // Keep the message channel open for the async response
      }
    });
  }
}

export default MessageHandler;
