/**
 * Shadow DOM initialization and management with inline CSS
 */

// Keep a reference to the shadow root
let shadowRootInstance: ShadowRoot | null = null;
let hostElement: HTMLElement | null = null;
let stylesInjected = false;

/**
 * Initialize the shadow DOM container
 * @returns The shadow root or null if already initialized
 */
export function initShadowDOM(): ShadowRoot {
  // If already initialized, return the existing shadow root
  if (shadowRootInstance) {
    return shadowRootInstance;
  }

  // Create a host element
  hostElement = document.createElement('div');
  hostElement.id = 'linkedin-profile-customizer-host';
  hostElement.style.position = 'fixed';
  hostElement.style.top = '0';
  hostElement.style.right = '0';
  hostElement.style.width = '0';
  hostElement.style.height = '0';
  hostElement.style.overflow = 'visible';
  hostElement.style.zIndex = '9999';
  
  // Append to body
  document.body.appendChild(hostElement);
  
  // Create shadow DOM
  shadowRootInstance = hostElement.attachShadow({ mode: 'open' });
  
  return shadowRootInstance;
}

/**
 * Get the shadow root instance
 */
export function getShadowRoot(): ShadowRoot | null {
  return shadowRootInstance;
}

/**
 * Clean up the shadow DOM
 */
export function cleanupShadowDOM(): void {
  if (hostElement && document.body.contains(hostElement)) {
    document.body.removeChild(hostElement);
  }
  shadowRootInstance = null;
  hostElement = null;
  stylesInjected = false;
}

/**
 * Inject styles into the shadow DOM
 * @param css CSS string to inject
 */
export function injectStyles(css: string): void {
  const shadowRoot = getShadowRoot();
  if (!shadowRoot) return;
  
  const style = document.createElement('style');
  style.textContent = css;
  shadowRoot.appendChild(style);
}

/**
 * Inject all necessary styles directly (no external CSS files)
 */
export function injectAllStyles(): void {
  if (stylesInjected) return;
  
  // Inject basic reset and utility CSS
  injectStyles(`
    /* Reset */
    :host * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    /* Variables */
    :host {
      --primary: #0A66C2;
      --primary-dark: #004182;
      --secondary: #057642;
      --accent: #E7A33E;
      --background: #1E1E1E;
      --surface: #2D2D2D;
      --surface-light: #3D3D3D;
      --text-primary: #FFFFFF;
      --text-secondary: #B3B3B3;
      --error: #CF6679;
      --success: #4CAF50;
      --border-radius: 8px;
      --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      
      all: initial;
      font-family: var(--font-sans);
    }
    
    /* Basic Utility Classes */
    .hidden {
      display: none !important;
    }
    
    .flex {
      display: flex;
    }
    
    .flex-col {
      flex-direction: column;
    }
    
    .items-center {
      align-items: center;
    }
    
    .justify-between {
      justify-content: space-between;
    }
    
    .space-x-2 > * + * {
      margin-left: 0.5rem;
    }
    
    .space-y-2 > * + * {
      margin-top: 0.5rem;
    }
    
    .p-1 { padding: 0.25rem; }
    .p-2 { padding: 0.5rem; }
    .p-3 { padding: 0.75rem; }
    .p-4 { padding: 1rem; }
    
    .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    
    .m-1 { margin: 0.25rem; }
    .m-2 { margin: 0.5rem; }
    .m-3 { margin: 0.75rem; }
    .m-4 { margin: 1rem; }
    
    .mt-1 { margin-top: 0.25rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mb-1 { margin-bottom: 0.25rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    
    .w-full { width: 100%; }
    .h-full { height: 100%; }
    
    .rounded { border-radius: var(--border-radius); }
    .rounded-full { border-radius: 9999px; }
    
    .bg-primary { background-color: var(--primary); }
    .bg-surface { background-color: var(--surface); }
    .bg-surface-light { background-color: var(--surface-light); }
    
    .text-primary { color: var(--text-primary); }
    .text-secondary { color: var(--text-secondary); }
    
    .shadow { box-shadow: var(--shadow); }
    
    .text-sm { font-size: 0.875rem; }
    .text-lg { font-size: 1.125rem; }
    .font-medium { font-weight: 500; }
    .font-bold { font-weight: 700; }
    
    .transition { transition: all 0.2s; }
    
    /* Button Styles */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }
    
    .btn-primary {
      background-color: var(--primary);
      color: white;
    }
    
    .btn-primary:hover {
      background-color: var(--primary-dark);
    }
    
    .btn-secondary {
      background-color: var(--surface-light);
      color: var(--text-primary);
    }
    
    .btn-secondary:hover {
      background-color: var(--surface);
    }
    
    /* Side Panel */
    .side-panel {
      position: fixed;
      top: 0;
      right: 0;
      height: 100vh;
      width: 320px;
      background-color: var(--background);
      color: var(--text-primary);
      box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease;
      font-family: var(--font-sans);
    }
    
    .side-panel.collapsed {
      width: 60px;
    }
    
    .side-panel.hidden {
      transform: translateX(100%);
    }
    
    .panel-header {
      padding: 1rem;
      background-color: var(--surface);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .panel-content {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
    }
    
    /* Template Selector */
    .lbc-template-selection {
      margin-bottom: 1.5rem;
    }
    
    .lbc-template-selection h3 {
      font-size: 1rem;
      margin-bottom: 0.75rem;
      color: var(--text-secondary);
    }
    
    .lbc-templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    
    .lbc-template-option {
      cursor: pointer;
      transition: transform 0.2s;
      border-radius: var(--border-radius);
      overflow: hidden;
    }
    
    .lbc-template-option:hover {
      transform: scale(1.05);
    }
    
    .lbc-template-option.selected {
      box-shadow: 0 0 0 2px var(--primary);
    }
    
    .lbc-template-preview {
      height: 60px;
      border-radius: var(--border-radius) var(--border-radius) 0 0;
      position: relative;
    }
    
    .lbc-template-name {
      font-size: 0.75rem;
      padding: 0.25rem;
      text-align: center;
      background-color: var(--surface);
      border-radius: 0 0 var(--border-radius) var(--border-radius);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    /* Accordion Component */
    .accordion {
      margin-bottom: 0.75rem;
      border-radius: var(--border-radius);
      overflow: hidden;
      background-color: var(--surface);
    }
    
    .accordion-header {
      padding: 0.75rem 1rem;
      background-color: var(--surface);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .accordion-content {
      padding: 1rem;
      background-color: var(--surface-light);
    }
    
    /* Form Controls */
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-label {
      display: block;
      margin-bottom: 0.25rem;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    
    .form-control {
      width: 100%;
      padding: 0.5rem;
      background-color: var(--surface);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--border-radius);
      color: var(--text-primary);
    }
    
    input[type="range"] {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background-color: var(--surface);
    }
    
    /* Banner Preview */
    .banner-preview {
      width: 100%;
      height: 150px;
      margin-bottom: 1rem;
      border-radius: var(--border-radius);
      overflow: hidden;
      position: relative;
      background-color: var(--surface-light);
    }
    
    /* Toggle Button */
    .toggle-button {
      position: fixed;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      background-color: var(--primary);
      color: white;
      border: none;
      border-radius: 4px 0 0 4px;
      padding: 0.5rem;
      cursor: pointer;
      z-index: 9998;
    }
    
    /* Color picker */
    .color-picker {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }
    
    .color-swatch {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    /* Profile Picture */
    .profile-picture-preview {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin: 0 auto 1rem auto;
      overflow: hidden;
      background-color: var(--surface-light);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: var(--surface);
    }
    
    ::-webkit-scrollbar-thumb {
      background: var(--surface-light);
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: var(--primary);
    }
  `);
  
  stylesInjected = true;
}

/**
 * Create a container element in the shadow DOM
 * @returns The container element
 */
export function createContainer(): HTMLElement {
  const shadowRoot = getShadowRoot() || initShadowDOM();
  
  // Inject styles if not already done
  injectAllStyles();
  
  // Create container if it doesn't exist
  let container = shadowRoot.getElementById('customizer-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'customizer-container';
    container.className = 'customizer-container';
    shadowRoot.appendChild(container);
  }
  
  return container;
}