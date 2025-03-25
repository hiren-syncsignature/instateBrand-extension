import TEXT_POSITIONS from "../../constants/positions.js";

/**
 * Enhanced TextOverlay class for managing banner text overlays with title and subtitle
 */
class TextOverlay {
  constructor() {
    this.containerElement = null;
    this.titleElement = null;
    this.subtitleElement = null;
    this.bannerElement = null;
  }

  /**
   * Set the banner element to attach text overlay to
   * @param {HTMLElement} bannerElement
   */
  setBannerElement(bannerElement) {
    this.bannerElement = bannerElement;
  }

  /**
   * Creates or updates the text overlay
   * @param {object} options - Text overlay options
   * @param {string} options.title - Main title text
   * @param {string} options.subtitle - Subtitle text
   * @param {string} options.position - Position ID from TEXT_POSITIONS
   * @param {string} options.color - Text color
   * @param {string} options.titleSize - Title font size
   * @param {string} options.subtitleSize - Subtitle font size
   * @param {string} options.fontWeight - Font weight
   * @param {string} options.textShadow - Text shadow CSS
   */
  update(options) {
    if (!this.bannerElement) return;

    const {
      title = "",
      subtitle = "",
      position = "left",
      color = "#ffffff",
      titleSize = "32px",
      subtitleSize = "18px",
      fontWeight = "bold",
      textShadow = "none",
    } = options;

    // Remove existing overlay if it exists
    this.remove();

    // Don't create empty overlays
    if (!title.trim() && !subtitle.trim()) return;

    // Create container element
    this.containerElement = document.createElement("div");
    this.containerElement.className = "lbc-banner-text-overlay";

    // Get position style
    const positionObj =
      TEXT_POSITIONS.find((p) => p.id === position) || TEXT_POSITIONS[1]; // Default to center

    // Apply styles to container
    this.containerElement.style.cssText = positionObj.style;
    this.containerElement.style.color = color;
    this.containerElement.style.fontWeight = fontWeight;
    this.containerElement.style.textShadow = textShadow;
    this.containerElement.style.display = "flex";
    this.containerElement.style.flexDirection = "column";

    // Create title element if text is provided
    if (title.trim()) {
      this.titleElement = document.createElement("div");
      this.titleElement.className = "lbc-banner-title";
      this.titleElement.textContent = title;
      this.titleElement.style.fontSize = titleSize;
      this.titleElement.style.marginBottom = subtitle.trim() ? "8px" : "0";
      this.titleElement.style.fontWeight = fontWeight;
      this.containerElement.appendChild(this.titleElement);
    }

    // Create subtitle element if text is provided
    if (subtitle.trim()) {
      this.subtitleElement = document.createElement("div");
      this.subtitleElement.className = "lbc-banner-subtitle";
      this.subtitleElement.textContent = subtitle;
      this.subtitleElement.style.fontSize = subtitleSize;
      this.subtitleElement.style.fontWeight = "normal";
      this.subtitleElement.style.opacity = "0.9";
      this.containerElement.appendChild(this.subtitleElement);
    }

    // Append to banner
    this.bannerElement.appendChild(this.containerElement);
  }

  /**
   * Removes the text overlay
   */
  remove() {
    if (this.containerElement) {
      this.containerElement.remove();
      this.containerElement = null;
      this.titleElement = null;
      this.subtitleElement = null;
    }
  }
}

export default TextOverlay;
