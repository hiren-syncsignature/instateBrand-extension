import TemplateSelector from "./TemplateSelector.js";
import AdvancedOptionsPopup from "./AdvancedOptionsPopup.js";
import BANNER_TEMPLATES from "../../constants/templates.js";

/**
 * Main customizer component with original design but improved functionality
 */
class Customizer {
  constructor(styleManager, bannerFinder, textOverlay) {
    this.styleManager = styleManager;
    this.bannerFinder = bannerFinder;
    this.textOverlay = textOverlay;

    this.element = null;
    this.statusEl = null;
    this.applyButton = null;
    this.locateButton = null;
    this.editButton = null;

    this.templateSelector = new TemplateSelector(
      this.handleTemplateHover.bind(this),
      this.handleTemplateSelect.bind(this)
    );

    this.advancedOptions = new AdvancedOptionsPopup(
      this.handleCustomizationChange.bind(this)
    );

    this.currentlySelectedTemplateId = "professional-gradient"; // New default
    this.lastAppliedTemplateId = null;
  }

  /**
   * Creates and returns the main customizer UI
   * @returns {HTMLElement} The customizer UI element
   */
  render() {
    // Create main container
    const container = document.createElement("div");
    container.id = "linkedin-banner-customizer";
    container.className = "linkedin-banner-customizer";

    // Create header
    const header = document.createElement("div");
    header.className = "lbc-header";

    const title = document.createElement("h2");
    title.textContent = "LinkedIn Banner Customizer";

    const closeButton = document.createElement("button");
    closeButton.id = "lbc-close";
    closeButton.textContent = "×";
    closeButton.addEventListener("click", this.handleClose.bind(this));

    header.appendChild(title);
    header.appendChild(closeButton);
    container.appendChild(header);

    // Create content container
    const content = document.createElement("div");
    content.className = "lbc-content";

    // Status message
    const status = document.createElement("div");
    status.id = "lbc-status";
    status.className = "lbc-status";
    status.textContent = "Searching for LinkedIn banner...";
    this.statusEl = status;

    content.appendChild(status);

    // Add template selector
    content.appendChild(this.templateSelector.render());

    const actions = document.createElement("div");
    actions.className = "lbc-actions";

    const locateButton = document.createElement("button");
    locateButton.id = "lbc-locate-btn";
    locateButton.className = "lbc-button";
    locateButton.textContent = "Locate Banner";
    locateButton.addEventListener("click", this.handleLocateBanner.bind(this));
    this.locateButton = locateButton;

    // Add edit button
    const editButton = document.createElement("button");
    editButton.id = "lbc-edit-btn";
    editButton.className = "lbc-button lbc-button-secondary";
    editButton.textContent = "Edit Text & Style";
    editButton.addEventListener("click", this.handleEditClick.bind(this));
    editButton.disabled = true; // Initially disabled
    this.editButton = editButton;

    // Add download button
    const downloadButton = document.createElement("button");
    downloadButton.id = "lbc-download-btn";
    downloadButton.className = "lbc-button lbc-button-download";
    downloadButton.textContent = "Download Banner";
    downloadButton.addEventListener(
      "click",
      this.handleDownloadClick.bind(this)
    );
    downloadButton.disabled = true; // Initially disabled
    this.downloadButton = downloadButton;

    actions.appendChild(locateButton);
    actions.appendChild(editButton);
    actions.appendChild(downloadButton);
    content.appendChild(actions);

    container.appendChild(content);

    this.element = container;
    return container;
  }

  /**
   * Initializes the customizer and starts banner detection
   */
  initialize() {
    document.body.appendChild(this.render());
    this.findBanner();
  }

  /**
   * Handles hovering over a template
   * @param {string} templateId - The ID of the template being hovered
   */
  handleTemplateHover(templateId) {
    if (!this.bannerFinder.getBannerElement()) return;

    const template = BANNER_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      this.previewTemplate(template);
    }
  }

  /**
   * Handles selecting a template - applies it immediately
   * @param {string} templateId - The ID of the selected template
   */
  handleTemplateSelect(templateId) {
    this.currentlySelectedTemplateId = templateId;

    // Apply the template immediately on selection
    this.applySelectedTemplate();

    // Update advanced options with the new template
    this.advancedOptions.updateFieldsWithTemplateDefaults(templateId);

    // Update status message
    const template = BANNER_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      this.updateStatus(
        `Applied "${template.name}" template. Click "Edit Text & Style" to customize.`
      );
    }
  }

  /**
   * Handles edit button click
   */
  handleEditClick() {
    // Show/hide advanced options popup
    this.advancedOptions.toggle();

    // Update with current template defaults if not already shown
    if (!this.advancedOptions.isVisible) {
      this.advancedOptions.updateFieldsWithTemplateDefaults(
        this.currentlySelectedTemplateId
      );
    }
  }

  /**
   * Handles customization changes from advanced options
   */
  handleCustomizationChange(customizations) {
    // Apply customizations immediately
    this.applyCustomizations(customizations);
  }

  /**
   * Handles clicking the locate banner button
   */
  handleLocateBanner() {
    this.findBanner();
  }

  /**
   * Handles closing the customizer
   */
  handleClose() {
    if (this.element) {
      this.element.remove();
    }

    // Hide the advanced options popup
    this.advancedOptions.hide();

    // Stop any active observers
    this.bannerFinder.stopObserver();

    // Remove text overlay if present
    this.textOverlay.remove();
  }

  /**
   * Finds the LinkedIn banner element
   */
  findBanner() {
    this.updateStatus("Searching for LinkedIn banner...");

    const banner = this.bannerFinder.findBannerElement();

    if (banner) {
      this.styleManager.backupOriginalStyle(banner);
      this.textOverlay.setBannerElement(banner);
      this.updateStatus(
        "LinkedIn banner found! Select a template to apply it."
      );
      this.editButton.disabled = false;

      // Apply the default template automatically
      this.applySelectedTemplate();
    } else {
      this.updateStatus(
        "LinkedIn banner element not found. The site structure may have changed."
      );
    }
  }

  /**
   * Updates the status message
   * @param {string} message - The status message
   */
  updateStatus(message) {
    if (this.statusEl) {
      this.statusEl.textContent = message;
    }
  }

  /**
   * Previews a template on the banner
   * @param {object} template - The template to preview
   */
  previewTemplate(template) {
    const banner = this.bannerFinder.getBannerElement();
    if (!banner || !template) return;

    // Get template styles
    let styles;
    if (typeof template.getStyles === "function") {
      styles = template.getStyles();
    } else {
      styles = template.styles || {};
    }

    // Apply template styles
    Object.entries(styles).forEach(([property, value]) => {
      banner.style[property] = value;
    });

    // Ensure position is set for text overlay
    if (
      banner.style.position !== "relative" &&
      banner.style.position !== "absolute"
    ) {
      banner.style.position = "relative";
    }

    // Update text overlay with template defaults
    this.textOverlay.update({
      title: template.defaultText || "",
      subtitle: template.defaultSubtext || "",
      position: template.textPosition || "left",
      color: template.textColor || "#ffffff",
      textShadow: template.textShadow || "none",
    });

    // Prevent LinkedIn's default banner click behavior
    this.preventBannerClick(banner);
  }

  // Updated applyCustomizations method
  applyCustomizations(customizations) {
    const banner = this.bannerFinder.getBannerElement();
    const template = BANNER_TEMPLATES.find(
      (t) => t.id === this.currentlySelectedTemplateId
    );

    if (!banner || !template) return;

    // Apply background styles
    if (customizations.imageUrl) {
      // Override with custom image if provided
      banner.style.backgroundImage = `url(${customizations.imageUrl})`;
      banner.style.backgroundSize = "cover";
      banner.style.backgroundPosition = "center";
    } else {
      // Get template styles
      let styles;
      if (typeof template.getStyles === "function") {
        styles = template.getStyles();
      } else {
        styles = template.styles || {};
      }

      // Apply template styles
      Object.entries(styles).forEach(([property, value]) => {
        banner.style[property] = value;
      });
    }

    // Ensure position is set for text overlay
    if (
      banner.style.position !== "relative" &&
      banner.style.position !== "absolute"
    ) {
      banner.style.position = "relative";
    }

    // Update text overlay with customizations
    this.textOverlay.update({
      title: customizations.title || template.defaultText || "",
      subtitle: customizations.subtitle || template.defaultSubtext || "",
      position: customizations.position || template.textPosition || "left",
      color: customizations.color || template.textColor || "#ffffff",
      titleSize: customizations.titleSize || "32px",
      subtitleSize: customizations.subtitleSize || "18px",
      fontWeight: customizations.fontWeight || "bold",
      textShadow: customizations.textShadow || template.textShadow || "none",
    });

    // Prevent LinkedIn's default banner click behavior
    this.preventBannerClick(banner);
  }

  /**
   * Apply customizations from advanced options
   * @param {object} customizations - Object with customization values
   */
  applyCustomizations(customizations) {
    const banner = this.bannerFinder.getBannerElement();
    const template = BANNER_TEMPLATES.find(
      (t) => t.id === this.currentlySelectedTemplateId
    );

    if (!banner || !template) return;

    // Apply background styles
    if (customizations.imageUrl) {
      // Override with custom image if provided
      banner.style.backgroundImage = `url(${customizations.imageUrl})`;
      banner.style.backgroundSize = "cover";
      banner.style.backgroundPosition = "center";
    } else {
      // Apply template styles
      Object.entries(template.styles).forEach(([property, value]) => {
        banner.style[property] = value;
      });
    }

    // Ensure position is set for text overlay
    if (
      banner.style.position !== "relative" &&
      banner.style.position !== "absolute"
    ) {
      banner.style.position = "relative";
    }

    // Update text overlay with customizations
    this.textOverlay.update({
      title: customizations.title || template.defaultText || "",
      subtitle: customizations.subtitle || template.defaultSubtext || "",
      position: customizations.position || template.textPosition || "left",
      color: customizations.color || template.textColor || "#ffffff",
      titleSize: customizations.titleSize || "32px",
      subtitleSize: customizations.subtitleSize || "18px",
      fontWeight: customizations.fontWeight || "bold",
      textShadow: customizations.textShadow || template.textShadow || "none",
    });
  }

  /**
   * Applies the selected template to the banner
   */
  applySelectedTemplate() {
    const banner = this.bannerFinder.getBannerElement();

    if (!banner) {
      this.updateStatus(
        'Banner element not found. Please click "Locate Banner" first.'
      );
      return;
    }

    const selectedTemplate = BANNER_TEMPLATES.find(
      (t) => t.id === this.currentlySelectedTemplateId
    );
    if (!selectedTemplate) {
      this.updateStatus(
        "Error: Template not found. Please try selecting another template."
      );
      return;
    }

    try {
      // Get customizations if they exist
      const customizations = this.advancedOptions.getCustomizations();

      // Apply the template with any existing customizations
      this.applyCustomizations(customizations);

      // Update the last applied template ID
      this.lastAppliedTemplateId = this.currentlySelectedTemplateId;

      // Add a class to mark this element as customized
      banner.classList.add("linkedin-banner-customized");
    } catch (error) {
      console.error("Error applying template:", error);
      this.updateStatus("Error applying template. Please try again.");
    }
  }

  handleDownloadClick() {
    const banner = this.bannerFinder.getBannerElement();

    if (!banner) {
      this.updateStatus(
        "Banner element not found. Please locate the banner first."
      );
      return;
    }

    this.updateStatus("Preparing banner for download...");

    try {
      // Create a canvas to render the banner
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Use standard LinkedIn banner dimensions
      canvas.width = 1584;
      canvas.height = 396;

      // Create an image for the background
      const backgroundImg = new Image();
      backgroundImg.crossOrigin = "Anonymous"; // Allow cross-origin images

      // Get current banner background
      const computedStyle = window.getComputedStyle(banner);
      let backgroundSource = "";

      if (
        computedStyle.backgroundImage &&
        computedStyle.backgroundImage !== "none"
      ) {
        // Extract URL from backgroundImage
        backgroundSource = computedStyle.backgroundImage
          .replace(/^url\(['"]?/, "")
          .replace(/['"]?\)$/, "");
      }

      // If there's no valid image, create a gradient background
      if (!backgroundSource || backgroundSource === "none") {
        // Create a gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, "#2193b0");
        gradient.addColorStop(1, "#6dd5ed");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.renderText(ctx, canvas);
      } else {
        // Load background image
        backgroundImg.onload = () => {
          // Draw background image
          ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
          this.renderText(ctx, canvas);
        };

        backgroundImg.onerror = (err) => {
          console.error("Error loading image:", err);
          // Fallback to gradient
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
          gradient.addColorStop(0, "#2193b0");
          gradient.addColorStop(1, "#6dd5ed");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          this.renderText(ctx, canvas);
        };

        // Set background image source
        backgroundImg.src = backgroundSource;
      }
    } catch (error) {
      console.error("Error creating banner image:", error);
      this.updateStatus("Error creating banner image. Please try again.");
    }
  }

  /**
   * Renders text overlay on canvas and initiates download
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {HTMLCanvasElement} canvas - Canvas element
   */
  renderText(ctx, canvas) {
    try {
      // Get text overlay info
      const textOverlay = document.querySelector(".lbc-banner-text-overlay");
      const title = document.querySelector(".lbc-banner-title");
      const subtitle = document.querySelector(".lbc-banner-subtitle");

      if (textOverlay) {
        // Set text styling
        ctx.textAlign = "left";
        ctx.fillStyle = textOverlay.style.color || "#ffffff";

        // Get text position
        let textX = 40; // default padding
        let textY = canvas.height / 2;

        // Adjust position based on alignment
        if (textOverlay.style.textAlign === "center") {
          textX = canvas.width / 2;
          ctx.textAlign = "center";
        } else if (textOverlay.style.textAlign === "right") {
          textX = canvas.width - 40;
          ctx.textAlign = "right";
        }

        // Draw title
        if (title) {
          ctx.font = `${title.style.fontWeight || "bold"} ${parseInt(
            title.style.fontSize
          ) * 2}px Arial`;
          ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 2;
          ctx.fillText(title.textContent, textX, textY);
        }

        // Draw subtitle
        if (subtitle) {
          ctx.font = `${subtitle.style.fontWeight || "normal"} ${parseInt(
            subtitle.style.fontSize
          ) * 2}px Arial`;
          ctx.globalAlpha = 0.9;
          ctx.fillText(subtitle.textContent, textX, textY + 60);
          ctx.globalAlpha = 1.0;
        }
      }

      // Initialize download
      this.initiateDownload(canvas);
    } catch (error) {
      console.error("Error rendering text:", error);
      this.updateStatus("Error rendering text on banner. Please try again.");
    }
  }

  /**
   * Creates a download link for the canvas image
   * @param {HTMLCanvasElement} canvas - Canvas element with the banner
   */
  initiateDownload(canvas) {
    try {
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL("image/png");

      // Create download link
      const downloadLink = document.createElement("a");
      downloadLink.href = dataUrl;
      downloadLink.download = "linkedin-banner.png";

      // Append, click, and remove
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      this.updateStatus("Banner downloaded successfully!");
    } catch (error) {
      console.error("Error downloading banner:", error);
      this.updateStatus("Error downloading banner. Please try again.");
    }
  }
}

export default Customizer;
