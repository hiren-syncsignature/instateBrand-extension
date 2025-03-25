/**
 * StyleManager class for handling banner styles
 */
class StyleManager {
  constructor() {
    this.originalBannerStyles = null;
  }

  /**
   * Backs up the original banner styles
   * @param {HTMLElement} bannerElement - The banner element
   */
  backupOriginalStyle(bannerElement) {
    if (bannerElement && !this.originalBannerStyles) {
      // Create a deep copy of important computed styles
      const computedStyle = window.getComputedStyle(bannerElement);

      this.originalBannerStyles = {
        background: bannerElement.style.background || computedStyle.background,
        backgroundColor:
          bannerElement.style.backgroundColor || computedStyle.backgroundColor,
        backgroundImage:
          bannerElement.style.backgroundImage || computedStyle.backgroundImage,
        backgroundSize:
          bannerElement.style.backgroundSize || computedStyle.backgroundSize,
        backgroundPosition:
          bannerElement.style.backgroundPosition ||
          computedStyle.backgroundPosition,
        backgroundRepeat:
          bannerElement.style.backgroundRepeat ||
          computedStyle.backgroundRepeat,
        position: bannerElement.style.position || computedStyle.position,
      };

      console.log("Original styles backed up:", this.originalBannerStyles);
    }
  }

  /**
   * Restores the original banner styles
   * @param {HTMLElement} bannerElement - The banner element
   */
  restoreOriginalStyle(bannerElement) {
    if (bannerElement && this.originalBannerStyles) {
      console.log("Restoring original styles");
      Object.keys(this.originalBannerStyles).forEach((property) => {
        bannerElement.style[property] = this.originalBannerStyles[property];
      });
    }
  }

  /**
   * Checks if original styles have been backed up
   * @returns {boolean} Whether original styles exist
   */
  hasOriginalStyles() {
    return !!this.originalBannerStyles;
  }

  /**
   * Applies banner styles from a template
   * @param {HTMLElement} bannerElement - The banner element
   * @param {object} styles - Style object with CSS properties
   */
  applyStyles(bannerElement, styles) {
    if (!bannerElement || !styles) return;

    Object.entries(styles).forEach(([property, value]) => {
      bannerElement.style[property] = value;
    });
  }
}

export default StyleManager;
