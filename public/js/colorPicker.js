/** Color Picker Manager for chat webpage */

// Explanation:
//<input type="color" value="#ff0000" class="picker" id="primary-color">

// Color picker DOM elements
const primaryColorPicker = document.getElementById("primary-color");
const secondaryColorPicker = document.getElementById("secondary-color");
const accentColorPicker = document.getElementById("accent-color");
const accentHoverColorPicker = document.getElementById("accent-hover-color");
const btnResetColors = document.getElementById("reset-colors-btn");

// local storage keys
const KEY_PRIMARY_COLOR = 'primary-color';
const KEY_SECONDARY_COLOR = 'secondary-color';
const KEY_ACCENT_COLOR = 'accent-color';
const KEY_ACCENT_HOVER_COLOR = 'accent-hover-color';


// Get root element
const root = document.documentElement;

// Get root element for getting/setting colors
const style = getComputedStyle(root);

// Init default CSS colors for resetting
const defaultPrimary = style.getPropertyValue("--primary-color").trim();
const defaultSecondary = style.getPropertyValue("--secondary-color").trim();
const defaultAccent = style.getPropertyValue("--accent-color").trim();
const defaultAccentHover = style.getPropertyValue("--accent-hover-color").trim();

// Get all pickers
const pickerList = Array.from(document.getElementsByClassName("picker"));

// DOM event IDs
const INPUT_EVENT = "input";
const CLICK_EVENT = "click";

// Event listener to change the related DOM color
pickerList.forEach(picker => {
  picker.addEventListener(INPUT_EVENT, applyColor);
});

// Event listeners to store the colors
primaryColorPicker?.addEventListener(INPUT_EVENT, (e) => {
  localStorage.setItem(KEY_PRIMARY_COLOR, e.target.value);
});

secondaryColorPicker?.addEventListener(INPUT_EVENT, (e) => {
  localStorage.setItem(KEY_SECONDARY_COLOR, e.target.value);
});

accentColorPicker?.addEventListener(INPUT_EVENT, (e) => {
  localStorage.setItem(KEY_ACCENT_COLOR, e.target.value);
});

accentHoverColorPicker?.addEventListener(INPUT_EVENT, (e) => {
  localStorage.setItem(KEY_ACCENT_HOVER_COLOR, e.target.value);
});

// Event listener to reset color
btnResetColors?.addEventListener(CLICK_EVENT, setDefaultColors);

/**
 * Apply a color to the given CSS variable
 * @param {Event} e event that triggered the color change
 */
function applyColor(e) {
  e.preventDefault();

  root.style.setProperty(`--${e.target.id}`, e.target.value);
}

function setDefaultColors(e) {
  localStorage.removeItem(KEY_PRIMARY_COLOR);
  localStorage.removeItem(KEY_SECONDARY_COLOR);
  localStorage.removeItem(KEY_ACCENT_COLOR);
  localStorage.removeItem(KEY_ACCENT_HOVER_COLOR);

  initColorsFromStorage();
}

function initColorPickers() {
  const {primary, secondary, accent, accentHover} = getColorsFromStorage();

  primaryColorPicker.value = primary;
  secondaryColorPicker.value = secondary;
  accentColorPicker.value = accent;
  accentHoverColorPicker.value = accentHover;
}

function initColors() {
  const {primary, secondary, accent, accentHover} = getColorsFromStorage();

  root.style.setProperty('--primary-color', primary);
  root.style.setProperty('--secondary-color', secondary);
  root.style.setProperty('--accent-color', accent);
  root.style.setProperty('--accent-hover-color', accentHover);
}

function initColorsFromStorage() {
  const {primary, secondary, accent, accentHover} = getColorsFromStorage();

  primaryColorPicker.value = primary;
  secondaryColorPicker.value = secondary;
  accentColorPicker.value = accent;
  accentHoverColorPicker.value = accentHover;

  root.style.setProperty(`--${primaryColorPicker.id}`, primaryColorPicker.value);
  root.style.setProperty(`--${secondaryColorPicker.id}`, secondaryColorPicker.value);
  root.style.setProperty(`--${accentColorPicker.id}`, accentColorPicker.value);
  root.style.setProperty(`--${accentHoverColorPicker.id}`, accentHoverColorPicker.value);
}

function getColorsFromStorage() {
  const primary = localStorage.getItem(KEY_PRIMARY_COLOR) || defaultPrimary;
  const secondary = localStorage.getItem(KEY_SECONDARY_COLOR) || defaultSecondary;
  const accent = localStorage.getItem(KEY_ACCENT_COLOR) || defaultAccent;
  const accentHover = localStorage.getItem(KEY_ACCENT_HOVER_COLOR) || defaultAccentHover;

  return {
    primary,
    secondary,
    accent,
    accentHover
  };
}


