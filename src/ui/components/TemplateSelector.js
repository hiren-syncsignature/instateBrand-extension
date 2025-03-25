import BANNER_TEMPLATES from "../../constants/templates.js";

/**
 * Template selector component that renders the grid of template options
 * Maintains the original design while adding new templates
 */
class TemplateSelector {
  constructor(onTemplateHover, onTemplateSelect) {
    this.onTemplateHover = onTemplateHover;
    this.onTemplateSelect = onTemplateSelect;
    this.element = null;
    this.selectedTemplateId = "professional-gradient"; // New default
  }

  /**
   * Renders the template selector component
   * @returns {HTMLElement} The rendered component
   */
  render() {
    const container = document.createElement("div");
    container.className = "lbc-template-selection";

    const heading = document.createElement("h3");
    heading.textContent = "Select a Template";
    container.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "lbc-templates-grid";
    grid.id = "lbc-templates-grid";

    // Add template options to the grid
    BANNER_TEMPLATES.forEach((template) => {
      const option = document.createElement("div");
      option.className = "lbc-template-option";
      option.dataset.templateId = template.id;

      if (template.id === this.selectedTemplateId) {
        option.classList.add("selected");
      }

      const preview = document.createElement("div");
      preview.className = "lbc-template-preview";

      // Use getPreviewStyles method if available
      if (typeof template.getPreviewStyles === "function") {
        preview.style.cssText = template.getPreviewStyles();
      } else if (template.previewStyles) {
        preview.style.cssText = template.previewStyles;
      }

      const name = document.createElement("div");
      name.className = "lbc-template-name";
      name.textContent = template.name;

      option.appendChild(preview);
      option.appendChild(name);

      // Add event listeners
      option.addEventListener("mouseenter", () => {
        this.onTemplateHover(template.id);
      });

      option.addEventListener("mouseleave", () => {
        // Revert to selected template on mouse leave
        if (this.selectedTemplateId) {
          this.onTemplateHover(this.selectedTemplateId);
        }
      });

      option.addEventListener("click", () => {
        this.selectTemplate(template.id);
      });

      grid.appendChild(option);
    });

    container.appendChild(grid);
    this.element = container;

    return container;
  }

  /**
   * Selects a template and updates the UI
   * @param {string} templateId - ID of the selected template
   */
  selectTemplate(templateId) {
    // Update the UI selection
    const options = this.element.querySelectorAll(".lbc-template-option");
    options.forEach((option) => {
      option.classList.remove("selected");
      if (option.dataset.templateId === templateId) {
        option.classList.add("selected");
      }
    });

    this.selectedTemplateId = templateId;
    this.onTemplateSelect(templateId);
  }

  /**
   * Gets the currently selected template ID
   * @returns {string} The selected template ID
   */
  getSelectedTemplateId() {
    return this.selectedTemplateId;
  }
}

export default TemplateSelector;
