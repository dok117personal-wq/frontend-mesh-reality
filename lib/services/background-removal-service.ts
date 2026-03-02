"use client";

/**
 * Background removal service using @imgly/background-removal
 * This library removes backgrounds from images directly in the browser
 * without requiring a server or API.
 */

// Import the named function from the package
import { removeBackground } from "@imgly/background-removal";

/**
 * Options for background removal
 */
interface BackgroundRemovalOptions {
  quality?: number; // 0-1, defaults to 0.8
  debug?: boolean; // Enable debug logs
}

/**
 * Removes the background from an image using @imgly/background-removal
 * 
 * @param imageFile The image file to process
 * @param options Options for background removal
 * @returns A Promise that resolves to a Blob of the processed image with transparent background
 */
export async function removeImageBackground(
  imageFile: File,
  options: BackgroundRemovalOptions = {}
): Promise<Blob> {
  try {
    // Configure the background removal
    const config = {
      debug: options.debug || false,
      output: {
        format: "image/png" as "image/png" | "image/jpeg" | "image/webp" | "image/x-rgba8" | "image/x-alpha8",
        quality: options.quality || 0.8
      },
      progress: (key: string, current: number, total: number) => {
        if (options.debug) {
          console.log(`Loading ${key}: ${current} of ${total}`);
        }
      }
    };

    // Process the image using the named export
    const resultBlob = await removeBackground(imageFile, config);
    return resultBlob;
  } catch (error) {
    console.error('Error removing background:', error);
    throw error;
  }
}
