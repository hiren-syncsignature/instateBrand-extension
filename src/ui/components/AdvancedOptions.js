import TEXT_POSITIONS from "../../constants/positions.js";
import BANNER_TEMPLATES from "../../constants/templates.js";

/**
 * Redesigned advanced options component for customizing banner text and appearance
 * with real-time preview updates
 */
class AdvancedOptions {
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
    this.isExpanded = true; // Default to expanded
    this.inputs = {}; // Store references to input elements
  }

  /**
   * Creates sidebar with editing options
   * @returns {HTMLElement} The sidebar element
   */
  render() {
    // Create main container
    const sidebar = document.createElement("div");
    sidebar.className = "lbc-editor-sidebar";

    // Add header with toggle
    const header = document.createElement("div");
    header.className = "lbc-editor-header";

    const title = document.createElement("h3");
    title.textContent = "Edit Banner";

    header.appendChild(title);
    sidebar.appendChild(header);

    // Create content container
    const content = document.createElement("div");
    content.className = "lbc-editor-content";

    // Title input
    content.appendChild(
      this.createInputGroup("title", "Title Text", "input", {
        type: "text",
        placeholder: "Enter main title",
      })
    );

    // Subtitle input
    content.appendChild(
      this.createInputGroup("subtitle", "Subtitle Text", "input", {
        type: "text",
        placeholder: "Enter subtitle or tagline",
      })
    );

    // Text position selector
    content.appendChild(
      this.createInputGroup("position", "Text Position", "select", {
        options: TEXT_POSITIONS.map((pos) => ({
          value: pos.id,
          text: pos.name,
        })),
      })
    );

    // Text color input
    content.appendChild(
      this.createInputGroup("color", "Text Color", "input", {
        type: "color",
        value: "#ffffff",
      })
    );

    // Title size select
    content.appendChild(
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
    content.appendChild(
      this.createInputGroup("subtitleSize", "Subtitle Size", "select", {
        options: [
          { value: "14px", text: "Small" },
          { value: "18px", text: "Medium", selected: true },
          { value: "24px", text: "Large" },
        ],
      })
    );

    // Font weight select
    content.appendChild(
      this.createInputGroup("fontWeight", "Text Weight", "select", {
        options: [
          { value: "normal", text: "Normal" },
          { value: "bold", text: "Bold", selected: true },
        ],
      })
    );

    // Text shadow select
    content.appendChild(
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

    // Custom image URL
    content.appendChild(
      this.createInputGroup("imageUrl", "Custom Background URL", "input", {
        type: "text",
        placeholder: "Enter image URL (optional)",
        hint: "For best results use 1584×396 pixels",
      })
    );

    sidebar.appendChild(content);
    this.element = sidebar;

    // Add styles for editor sidebar
    this.addStyles();

    return sidebar;
  }

  /**
   * Add styles for editor sidebar
   */
  addStyles() {
    // Only add styles once
    if (document.getElementById("lbc-editor-styles")) return;

    const styleElement = document.createElement("style");
    styleElement.id = "lbc-editor-styles";
    styleElement.textContent = `
      .lbc-editor-sidebar {
        position: absolute;
        top: 0;
        right: 0;
        width: 280px;
        background: white;
        border-left: 1px solid #ddd;
        height: 100%;
        overflow-y: auto;
        z-index: 2;
        box-shadow: -2px 0 5px rgba(0,0,0,0.1);
      }
      
      .lbc-editor-header {
        padding: 15px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f8f8f8;
      }
      
      .lbc-editor-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }
      
      .lbc-editor-content {
        padding: 15px;
      }
      
      .lbc-input-group {
        margin-bottom: 15px;
      }
      
      .lbc-input-group label {
        display: block;
        font-size: 13px;
        font-weight: 500;
        margin-bottom: 5px;
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
        height: 36px;
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

    // Add change event listener
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

    // Immediately notify about changes for live preview
    this.triggerCustomizationChange();
  }

  /**
   * Trigger the customization change callback
   */
  triggerCustomizationChange() {
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

    // Only set values if they're not already set by user
    if (!this.customizations.title) {
      this.inputs.title.value = template.defaultText || "";
      this.customizations.title = template.defaultText || "";
    }

    if (!this.customizations.subtitle) {
      this.inputs.subtitle.value = template.defaultSubtext || "";
      this.customizations.subtitle = template.defaultSubtext || "";
    }

    if (!this.customizations.position) {
      this.inputs.position.value = template.textPosition || "left";
      this.customizations.position = template.textPosition || "left";
    }

    if (!this.customizations.color) {
      this.inputs.color.value = template.textColor || "#ffffff";
      this.customizations.color = template.textColor || "#ffffff";
    }

    if (!this.customizations.textShadow) {
      this.inputs.textShadow.value = template.textShadow || "none";
      this.customizations.textShadow = template.textShadow || "none";
    }

    // Trigger update
    this.triggerCustomizationChange();
  }

  /**
   * Get current customization values
   * @returns {object} Current customization values
   */
  getCustomizations() {
    return this.customizations;
  }
}

export default AdvancedOptions;
