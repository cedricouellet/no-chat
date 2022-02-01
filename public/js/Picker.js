/** Color Picker Manager for chat webpage */

// Get root element
const root = document.documentElement;

// Get all pickers
const pickerList = Array.from(document.getElementsByClassName("picker"));

// Apply event listeners
pickerList.forEach(picker => {
    picker.addEventListener("input", applyColor);
});

/**
 * Apply a color to the given CSS variable
 * @param {Event} e event that triggered the color change
 */
function applyColor(e) {
    root.style.setProperty(`--${e.target.id}`, e.target.value);
}

// Explanation:
//<input type="color" value="#ff0000" class="picker" id="primary-color">

