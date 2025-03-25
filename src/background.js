// background.js
chrome.action.onClicked.addListener((tab) => {
  // Only run on LinkedIn domains
  if (tab.url.includes("linkedin.com")) {
    chrome.tabs.sendMessage(
      tab.id,
      { action: "initCustomizer" },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      }
    );
  } else {
    // If not on LinkedIn, show an alert
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        alert("Please navigate to a LinkedIn profile page first");
      },
    });
  }
});
