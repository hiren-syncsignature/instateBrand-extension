import TEXT_POSITIONS from "../../constants/positions.js";
import BANNER_TEMPLATES from "../../constants/templates.js";

/**
 * Advanced options popup component that appears at bottom center
 * with live preview capabilities
 */
class AdvancedOptionsPopup {
  constructor(onCustomizationChange) {
    this.onCustomizationChange = onCustomizationChange;

    // Default values
    this.customizations = {
      title: "",
      subtitle: "",
      position: "",
      color: "",
      titleSize: "32px",
      subtitleSize: "18px",
      fontWeight: "bold",
      imageUrl: "",
      textShadow: "none",
    };

    this.element = null;
    this.inputs = {}; // Store references to input elements
    this.isVisible = false;
  }

  /**
   * Shows the popup with options
   */
  show() {
    if (this.element) {
      this.element.style.display = "block";
      this.isVisible = true;
    } else {
      document.body.appendChild(this.render());
      this.isVisible = true;
    }
  }

  /**
   * Hides the popup
   */
  hide() {
    if (this.element) {
      this.element.style.display = "none";
      this.isVisible = false;
    }
  }

  /**
   * Toggles the popup visibility
   */
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Creates popup with editing options
   * @returns {HTMLElement} The popup element
   */
  render() {
    // Create main container
    const popup = document.createElement("div");
    popup.className = "lbc-advanced-popup";

    // Add header with title and close button
    const header = document.createElement("div");
    header.className = "lbc-popup-header";

    const title = document.createElement("h3");
    title.textContent = "Customize Banner";

    const closeButton = document.createElement("button");
    closeButton.className = "lbc-popup-close";
    closeButton.textContent = "×";
    closeButton.addEventListener("click", () => this.hide());

    header.appendChild(title);
    header.appendChild(closeButton);
    popup.appendChild(header);

    // Create content container with fields
    const content = document.createElement("div");
    content.className = "lbc-popup-content";

    // Create a 2-column layout for the form
    const formGrid = document.createElement("div");
    formGrid.className = "lbc-popup-grid";

    // Left column
    const leftColumn = document.createElement("div");
    leftColumn.className = "lbc-popup-column";

    // Title input
    leftColumn.appendChild(
      this.createInputGroup("title", "Title Text", "input", {
        type: "text",
        placeholder: "Enter main title",
      })
    );

    // Subtitle input
    leftColumn.appendChild(
      this.createInputGroup("subtitle", "Subtitle Text", "input", {
        type: "text",
        placeholder: "Enter subtitle or tagline",
      })
    );

    // Text position selector
    leftColumn.appendChild(
      this.createInputGroup("position", "Text Position", "select", {
        options: TEXT_POSITIONS.map((pos) => ({
          value: pos.id,
          text: pos.name,
        })),
      })
    );

    // Text color input
    leftColumn.appendChild(
      this.createInputGroup("color", "Text Color", "input", {
        type: "color",
        value: "#ffffff",
      })
    );

    // Right column
    const rightColumn = document.createElement("div");
    rightColumn.className = "lbc-popup-column";

    // Title size select
    rightColumn.appendChild(
      this.createInputGroup("titleSize", "Title Size", "select", {
        options: [
          { value: "24px", text: "Small" },
          { value: "32px", text: "Medium", selected: true },
          { value: "42px", text: "Large" },
          { value: "56px", text: "Extra Large" },
        ],
      })
    );

    // Subtitle size select
    rightColumn.appendChild(
      this.createInputGroup("subtitleSize", "Subtitle Size", "select", {
        options: [
          { value: "14px", text: "Small" },
          { value: "18px", text: "Medium", selected: true },
          { value: "24px", text: "Large" },
        ],
      })
    );

    // Font weight select
    rightColumn.appendChild(
      this.createInputGroup("fontWeight", "Text Weight", "select", {
        options: [
          { value: "normal", text: "Normal" },
          { value: "bold", text: "Bold", selected: true },
        ],
      })
    );

    // Text shadow select
    rightColumn.appendChild(
      this.createInputGroup("textShadow", "Text Shadow", "select", {
        options: [
          { value: "none", text: "None" },
          {
            value: "0px 1px 2px rgba(0,0,0,0.3)",
            text: "Light",
            selected: true,
          },
          { value: "0px 2px 4px rgba(0,0,0,0.5)", text: "Medium" },
          { value: "0px 3px 6px rgba(0,0,0,0.7)", text: "Heavy" },
        ],
      })
    );

    // Add both columns to the grid
    formGrid.appendChild(leftColumn);
    formGrid.appendChild(rightColumn);
    content.appendChild(formGrid);

    // Custom image URL (full width)
    content.appendChild(
      this.createInputGroup(
        "imageUrl",
        "Custom Background Image URL",
        "input",
        {
          type: "text",
          placeholder: "Enter image URL (optional)",
          hint: "For best results use 1584×396 pixels",
        }
      )
    );

    popup.appendChild(content);

    // Add popup styles
    this.addStyles();

    this.element = popup;
    return popup;
  }

  /**
   * Add styles for popup
   */
  addStyles() {
    // Only add styles once
    if (document.getElementById("lbc-popup-styles")) return;

    const styleElement = document.createElement("style");
    styleElement.id = "lbc-popup-styles";
    styleElement.textContent = `
      .lbc-advanced-popup {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 600px;
        max-width: 90vw;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      }
      
      .lbc-popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid #eee;
        background: #f8f8f8;
        border-radius: 8px 8px 0 0;
      }
      
      .lbc-popup-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }
      
      .lbc-popup-close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #666;
      }
      
      .lbc-popup-content {
        padding: 16px;
      }
      
      .lbc-popup-grid {
        display: flex;
        gap: 16px;
        margin-bottom: 16px;
      }
      
      .lbc-popup-column {
        flex: 1;
      }
      
      .lbc-input-group {
        margin-bottom: 12px;
      }
      
      .lbc-input-group label {
        display: block;
        font-size: 13px;
        font-weight: 500;
        margin-bottom: 4px;
        color: #444;
      }
      
      .lbc-input-group input,
      .lbc-input-group select {
        width: 100%;
        padding: 8px 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 13px;
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      
      .lbc-input-group input:focus,
      .lbc-input-group select:focus {
        border-color: #0073b1;
        box-shadow: 0 0 0 2px rgba(0,115,177,0.2);
        outline: none;
      }
      
      .lbc-input-group input[type="color"] {
        height: 32px;
        padding: 2px;
        cursor: pointer;
      }
      
      .lbc-hint {
        font-size: 11px;
        color: #666;
        margin-top: 4px;
      }
    `;

    document.head.appendChild(styleElement);
  }

  /**
   * Helper method to create input groups
   * @param {string} id - Input field ID
   * @param {string} label - Label text
   * @param {string} type - Input type (input, select)
   * @param {object} options - Additional options
   * @returns {HTMLElement} The option group element
   */
  createInputGroup(id, labelText, type, options = {}) {
    const group = document.createElement("div");
    group.className = "lbc-input-group";

    const label = document.createElement("label");
    label.htmlFor = `lbc-${id}`;
    label.textContent = labelText;
    group.appendChild(label);

    let input;

    if (type === "select") {
      input = document.createElement("select");

      if (options.options) {
        options.options.forEach((opt) => {
          const option = document.createElement("option");
          option.value = opt.value;
          option.textContent = opt.text;
          if (opt.selected) {
            option.selected = true;
          }
          input.appendChild(option);
        });
      }
    } else {
      input = document.createElement("input");
      input.type = options.type || "text";

      if (options.placeholder) {
        input.placeholder = options.placeholder;
      }

      if (options.value) {
        input.value = options.value;
      }
    }

    input.id = `lbc-${id}`;
    group.appendChild(input);

    // Store reference to input
    this.inputs[id] = input;

    // Add hint if provided
    if (options.hint) {
      const hint = document.createElement("div");
      hint.className = "lbc-hint";
      hint.textContent = options.hint;
      group.appendChild(hint);
    }

    // Add input event listener for live preview
    input.addEventListener("input", () => {
      this.handleInputChange(id, input.value);
    });

    return group;
  }

  /**
   * Handle input changes and trigger live preview
   * @param {string} id - Field ID
   * @param {string} value - New value
   */
  handleInputChange(id, value) {
    this.customizations[id] = value;

    // Trigger live preview
    if (typeof this.onCustomizationChange === "function") {
      this.onCustomizationChange(this.customizations);
    }
  }

  /**
   * Update field values based on template
   * @param {string} templateId - The selected template ID
   */
  updateFieldsWithTemplateDefaults(templateId) {
    const template = BANNER_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    // Update inputs with template values
    if (this.inputs.title) {
      this.inputs.title.value = template.defaultText || "";
      this.customizations.title = template.defaultText || "";
    }

    if (this.inputs.subtitle) {
      this.inputs.subtitle.value = template.defaultSubtext || "";
      this.customizations.subtitle = template.defaultSubtext || "";
    }

    if (this.inputs.position) {
      this.inputs.position.value = template.textPosition || "left";
      this.customizations.position = template.textPosition || "left";
    }

    if (this.inputs.color) {
      this.inputs.color.value = template.textColor || "#ffffff";
      this.customizations.color = template.textColor || "#ffffff";
    }

    if (this.inputs.textShadow) {
      this.inputs.textShadow.value = template.textShadow || "none";
      this.customizations.textShadow = template.textShadow || "none";
    }

    // Trigger customization change for immediate preview
    this.onCustomizationChange(this.customizations);
  }

  /**
   * Get current customization values
   * @returns {object} Current customization values
   */
  getCustomizations() {
    return this.customizations;
  }
}

export default AdvancedOptionsPopup;
