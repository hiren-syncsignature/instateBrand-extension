/**
 * Utilities for downloading images
 */

/**
 * Download a data URL as a file
 * @param dataUrl The data URL to download
 * @param filename The filename to save as
 */
export const downloadDataUrl = (dataUrl: string, filename: string): void => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  };
  
  /**
   * Capture an element as an image and download it
   * @param element The element to capture
   * @param filename The filename to save as
   * @param options Additional options
   */
  export const captureElementAsImage = async (
    element: HTMLElement, 
    filename: string,
    options: {
      width?: number;
      height?: number;
      backgroundColor?: string;
      scale?: number;
    } = {}
  ): Promise<void> => {
    try {
      // Import html2canvas dynamically
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      
      // Set default options
      const defaultOptions = {
        backgroundColor: null,
        scale: window.devicePixelRatio,
        logging: false,
        ...options
      };
      
      // Create canvas
      const canvas = await html2canvas(element, defaultOptions);
      
      // Get data URL
      const dataUrl = canvas.toDataURL('image/png');
      
      // Download
      downloadDataUrl(dataUrl, filename);
    } catch (error) {
      console.error('Failed to capture element as image:', error);
      throw error;
    }
  };
  
  /**
   * Convert a canvas to a data URL
   * @param canvas The canvas element
   * @param format The image format (default: 'image/png')
   * @param quality The image quality (0-1, default: 0.92)
   */
  export const canvasToDataUrl = (
    canvas: HTMLCanvasElement,
    format: string = 'image/png',
    quality: number = 0.92
  ): string => {
    return canvas.toDataURL(format, quality);
  };
  
  /**
   * Generate a screenshot of the LinkedIn banner with applied customizations
   * @param bannerElement The banner element
   */
  export const captureBanner = async (bannerElement: HTMLElement): Promise<string> => {
    try {
      // Create a clone of the element to avoid modifying the original
      const clone = bannerElement.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.width = '1584px'; // LinkedIn banner standard width
      clone.style.height = '396px';  // LinkedIn banner standard height
      document.body.appendChild(clone);
      
      // Import html2canvas dynamically
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      
      // Create canvas
      const canvas = await html2canvas(clone, {
        backgroundColor: null,
        scale: 1,
        logging: false,
        width: 1584,
        height: 396
      });
      
      // Remove clone
      document.body.removeChild(clone);
      
      // Return data URL
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Failed to capture banner:', error);
      throw error;
    }
  };
  
  /**
   * Generate a filename with timestamp
   * @param prefix The filename prefix
   * @param extension The file extension (default: 'png')
   */
  export const generateFilename = (
    prefix: string,
    extension: string = 'png'
  ): string => {
    const date = new Date();
    const timestamp = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}`;
    return `${prefix}_${timestamp}.${extension}`;
  };