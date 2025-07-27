const canvas = document.getElementById('story-canvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.getElementById('generate-btn');
const downloadLink = document.getElementById('download-link');
const imageLoadingSpinner = document.getElementById('image-loading-spinner');
const ageInput = document.getElementById('age');
const genderSelect = document.getElementById('gender');
const usageSelect = document.getElementById('usage');
const languageSelect = document.getElementById('language-select');
const locationToggle = document.getElementById('location-toggle');

// --- Default Values ---
let userCountry = 'default';
let deviceModel = 'unknown';
let userLanguage = 'en';

// Set initial values based on detected language for a more relevant default
let initialCountry = 'US';
let initialCurrency = 'USD';

// --- Helper Functions ---
function getDeviceModel() {
    const ua = navigator.userAgent;
    if (/Android/.test(ua)) {
        return "Android";
    } else if (/iPhone/.test(ua)) {
        return "iPhone";
    }
    return "Desktop";
}

function getGeolocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject("Geolocation is not supported by your browser");
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
                        .then(response => response.json())
                        .then(data => {
                            resolve(data.address.country_code.toUpperCase());
                        })
                        .catch(error => reject(error));
                },
                () => {
                    reject("Unable to retrieve your location");
                }
            );
        }
    });
}

function getCurrency(country) {
    const currencyMap = {
        US: 'USD',
        CA: 'CAD',
        GB: 'GBP',
        AU: 'AUD',
        DE: 'EUR',
        FR: 'EUR',
        JP: 'JPY',
        ES: 'EUR',
        BR: 'BRL',
        // Add more countries and currencies here
        default: 'USD'
    };
    return currencyMap[country] || currencyMap['default'];
}

function calculateValue(country, device, age, gender, usage) {
    let baseValue = 0.27; // Default base value in USD per hour
    let region = regions[country] || regions["default"];

    // Adjust based on region
    if (regionFactors[region]) {
        baseValue *= regionFactors[region];
    }

    // Adjust based on device and region
    if (deviceFactors[region] && deviceFactors[region][device]) {
        baseValue *= deviceFactors[region][device];
    } else if (deviceFactors["default"] && deviceFactors["default"][device]) {
        baseValue *= deviceFactors["default"][device];
    }

    // Adjust based on age
    if (age >= 18 && age <= 24) baseValue *= 0.96;
    else if (age >= 25 && age <= 34) baseValue *= 1.2;
    else if (age >= 35 && age <= 44) baseValue *= 1.08;
    else if (age >= 45 && age <= 54) baseValue *= 1.2;
    else if (age >= 55 && age <= 64) baseValue *= 0.96;
    else if (age >= 65) baseValue *= 0.92;

    // Adjust based on gender
    if (genderFactors[gender]) {
        baseValue *= genderFactors[gender];
    }
    
    // Adjust based on usage
    if (usageFactors[usage]) {
        baseValue *= usageFactors[usage];
    }

    return baseValue;
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    let testLine = '';
    let metrics;
    let testWidth;

    for (let n = 0; n < words.length; n++) {
        testLine = line + words[n] + ' ';
        metrics = context.measureText(testLine);
        testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, currentY);
    return currentY + lineHeight; // Return Y position for the *next* block of text
}

function generateImage(value, currency) {
    const lang = translations[userLanguage] || translations['en'];

    // --- Canvas Setup ---
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // --- Main Text ---
    ctx.fillStyle = 'white';
    ctx.font = 'bold 70px Arial';
    ctx.textAlign = 'center';

    const maxWidth = canvas.width * 0.9; // Increased width
    const lineHeight = 90; // Increased line height
    let yPos = 400; // Starting Y position

    yPos = wrapText(ctx, lang.image_text_top, canvas.width / 2, yPos, maxWidth, lineHeight);

    // --- Highlighted Value ---
    ctx.fillStyle = '#007bff'; // Blue for highlighting
    ctx.font = 'bold 120px Arial';
    const formattedValue = new Intl.NumberFormat(navigator.language, { style: 'currency', currency: currency }).format(value);
    ctx.fillText(formattedValue, canvas.width / 2, yPos + 50); // Adjusted Y position

    // --- Bottom Text ---
    ctx.fillStyle = 'white';
    ctx.font = 'bold 70px Arial';
    wrapText(ctx, lang.image_text_bottom, canvas.width / 2, yPos + 250, maxWidth, lineHeight); // Adjusted Y position and wrapped

    // --- Source Text ---
    ctx.fillStyle = 'grey';
    ctx.font = 'italic 40px Arial';
    ctx.fillText(lang.made_with, canvas.width / 2, 1850);
    
    // --- Show Download Link ---
    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.download = 'instagram_value.png'; // Add this line
    downloadLink.style.display = 'block';
}

function setLanguage() {
    userLanguage = languageSelect.value; // Use selected language
    const lang = translations[userLanguage];
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (lang[key]) {
            // For select options, set innerHTML to allow for empty option values
            if (element.tagName === 'OPTION') {
                element.innerHTML = lang[key];
            } else {
                element.textContent = lang[key];
            }
        }
    });
}

// --- Event Listener ---
generateBtn.addEventListener('click', async () => {
    imageLoadingSpinner.style.display = 'block'; // Show spinner
    downloadLink.style.display = 'none'; // Hide download link
    try {
        if (locationToggle.checked) {
            try {
                userCountry = await getGeolocation();
            } catch (error) {
                console.warn("Geolocation failed, using default country:", error);
                userCountry = initialCountry; // Fallback to initialCountry if geolocation fails
            }
        } else {
            userCountry = initialCountry; // Use initialCountry if toggle is off
        }

        deviceModel = getDeviceModel();
        const age = ageInput.value;
        const gender = genderSelect.value;
        const usage = usageSelect.value;
        const currency = getCurrency(userCountry);

        const estimatedValue = calculateValue(userCountry, deviceModel, age, gender, usage);
        generateImage(estimatedValue, currency);
    } catch (error) {
        console.error('Error generating image:', error);
        alert('An error occurred while generating the image. Please try again.');
    } finally {
        imageLoadingSpinner.style.display = 'none'; // Hide spinner
    }
});

languageSelect.addEventListener('change', () => {
    setLanguage();
    // Re-generate image and update values based on new language
    const age = ageInput.value;
    const gender = genderSelect.value;
    const usage = usageSelect.value;
    const currency = getCurrency(userCountry);
    const estimatedValue = calculateValue(userCountry, deviceModel, age, gender, usage);
    generateImage(estimatedValue, currency);
});

// --- Initial Load ---
// Set initial language based on browser, then update selector
userLanguage = navigator.language.split('-')[0];
if (!translations[userLanguage]) {
    userLanguage = 'en';
}
languageSelect.value = userLanguage;
setLanguage();


// Only attempt geolocation if the toggle is checked on initial load
if (locationToggle.checked) {
    getGeolocation().then(country => {
        initialCountry = country;
        initialCurrency = getCurrency(initialCountry);
        generateImage(calculateValue(initialCountry, 'iPhone', 25, 'female', 'scroller'), initialCurrency);
    }).catch(error => {
        console.warn("Initial geolocation failed:", error);
        generateImage(calculateValue(initialCountry, 'iPhone', 25, 'female', 'scroller'), initialCurrency);
    });
} else {
    generateImage(calculateValue(initialCountry, 'iPhone', 25, 'female', 'scroller'), initialCurrency);
}

