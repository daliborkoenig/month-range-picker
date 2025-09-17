import { rgba, shade, tint } from "polished";

export const themeColors = {
  primary: "#FF4C69",
  secondary: "#333651",
  accent: "#479C92",
  buy: "#476BD9", // this should not exist
  success: "#479C92", // might need to be a different shade of green
  error: "#FB4B67", // should be slightly a different shade of red
  terminate: "#464646",
  info: "#FF7600", // should be what buy is now
  // warning: "#FF7600", // this should be what info is
  grey: "#808080",
  low_level: "#70B9B9",
  mid_level: "#E9E2BC",
  high_level: "#646480",
  text: "#4c4c4c",
  text_inverted: "#FFFFFF",
  app_background: "#f6f6f6", // manipulateColor("#808080", 7),
  component_background: "#fcfcfc", // manipulateColor("#808080", 2),
};

/**
 * Utility function to manipulate color based on percentage and optional opacity
 * @param color - Base color to manipulate
 * @param percentage - Percentage (0-100 = tint towards white, 100+ = shade towards black)
 * @param opacity - Optional opacity (0-1)
 * @returns Manipulated color string
 */
export const manipulateColor = (color: string, percentage: number, opacity?: number): string => {
  let result: string;

  if (percentage === 100) {
    // No manipulation needed
    result = color;
  } else if (percentage < 100) {
    // Tint towards white
    const amount = (100 - percentage) / 100;
    result = tint(amount, color);
  } else {
    // Shade towards black
    const amount = (percentage - 100) / 100;
    result = shade(amount, color);
  }

  // Add opacity if provided
  if (opacity !== undefined) {
    result = rgba(result, opacity);
  }

  return result;
};
