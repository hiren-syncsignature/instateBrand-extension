// Styles for the LinkedIn Banner Customizer UI
const styles = `
.linkedin-banner-customizer {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
  max-height: 80vh;
  overflow-y: auto;
}

.lbc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background: white;
  z-index: 2;
}

.lbc-header h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

#lbc-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.lbc-content {
  padding: 16px;
}

.lbc-status {
  padding: 8px 12px;
  background: #f0f7ff;
  border: 1px solid #cce5ff;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #0073b1;
}

.lbc-template-selection h3 {
  font-size: 14px;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.lbc-templates-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.lbc-template-option {
  border: 2px solid #eee;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
}

.lbc-template-option:hover {
  border-color: #0073b1;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.lbc-template-option.selected {
  border-color: #0073b1;
  box-shadow: 0 0 0 1px #0073b1;
}

.lbc-template-preview {
  height: 60px;
  width: 100%;
}

.lbc-template-name {
  padding: 6px;
  text-align: center;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lbc-advanced-toggle {
  margin-bottom: 16px;
  text-align: center;
}

.lbc-advanced-options {
  background: #f9f9f9;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.lbc-option-group {
  margin-bottom: 12px;
}

.lbc-option-group label {
  display: block;
  font-size: 13px;
  margin-bottom: 4px;
  font-weight: 500;
}

.lbc-text-input, .lbc-select, .lbc-color-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
}

.lbc-color-input {
  height: 30px;
  padding: 0;
  cursor: pointer;
}

.lbc-hint {
  font-size: 11px;
  color: #666;
  margin-top: 2px;
}

.lbc-actions {
  display: flex;
  justify-content: space-between;
}

.lbc-button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  background: #f3f6f8;
  color: #0073b1;
  transition: all 0.2s;
}

.lbc-button:hover:not(:disabled) {
  background: #e1e9ee;
}

.lbc-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.lbc-button-primary {
  background: #0073b1;
  color: white;
}

.lbc-button-primary:hover:not(:disabled) {
  background: #006097;
}

.lbc-button-secondary {
  background: #f3f6f8;
  color: #0073b1;
  width: 100%;
  margin-bottom: 8px;
}

.lbc-banner-text-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  color: white;
  font-weight: bold;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  pointer-events: none;
  z-index: 1;
}
`;

export default styles;
