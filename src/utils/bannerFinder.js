/**
 * BannerFinder class for locating the LinkedIn banner element
 */
class BannerFinder {
  constructor() {
    this.bannerElement = null;
    this.observer = null;
    this.observerActive = false;
    this.selectors = [
      ".profile-background-image",
      ".pv-top-card-profile-picture__container",
      ".profile-background-image--default",
      ".artdeco-card.ember-view.pv-top-card",
      ".pv-profile-section-pager",
    ];
  }

  /**
   * Gets the current banner element if found
   * @returns {HTMLElement|null} The banner element or null
   */
  getBannerElement() {
    return this.bannerElement;
  }

  /**
   * Attempts to find the LinkedIn banner element
   * @returns {HTMLElement|null} The found banner element or null
   */
  findBannerElement() {
    // Try multiple selectors to find the banner
    for (const selector of this.selectors) {
      const element = document.querySelector(selector);
      if (element) {
        this.bannerElement = element;
        return element;
      }
    }

    // If banner not found with known selectors, try to find it based on attributes or structure
    const potentialBanners = [
      // Look for elements that might be the banner based on various attributes
      ...document.querySelectorAll(
        '[data-test-id*="cover"], [data-test-id*="banner"], [data-test-id*="background"]'
      ),
      ...document.querySelectorAll(
        '[class*="background"], [class*="banner"], [class*="cover"], [class*="header-image"]'
      ),
    ];

    // Filter potential banners to find the most likely candidate
    // Check size, position, background properties, etc.
    for (const element of potentialBanners) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);

      // If element has these characteristics, it's likely a banner
      if (
        rect.width > 500 &&
        rect.height > 100 &&
        (style.backgroundImage !== "none" ||
          style.backgroundColor !== "rgba(0, 0, 0, 0)")
      ) {
        this.bannerElement = element;
        return element;
      }
    }

    // If we still haven't found the banner, try one more method
    // Look for large elements near the top of the profile
    const topElements = [...document.querySelectorAll("*")].filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top < 200 && rect.width > 500 && rect.height > 100;
    });

    if (topElements.length > 0) {
      // Use the largest element that's not the body or html
      const largest = topElements
        .sort((a, b) => {
          const aRect = a.getBoundingClientRect();
          const bRect = b.getBoundingClientRect();
          return bRect.width * bRect.height - aRect.width * aRect.height;
        })
        .find((el) => !["body", "html"].includes(el.tagName.toLowerCase()));

      if (largest) {
        this.bannerElement = largest;
        return largest;
      }
    }

    // If still not found
    return null;
  }

  /**
   * Starts a MutationObserver to detect DOM changes and find the banner
   */
  startObserver() {
    if (this.observerActive) return;

    this.observer = new MutationObserver(() => {
      if (!this.bannerElement) {
        this.findBannerElement();
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    this.observerActive = true;
  }

  /**
   * Stops the MutationObserver
   */
  stopObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observerActive = false;
    }
  }
}

export default BannerFinder;
