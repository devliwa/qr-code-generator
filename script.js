let currentQRCode = null;
let currentURL = "";

function generateQRCode() {
    const urlInput = document.getElementById("urlInput");
    const url = urlInput.value.trim();
    const errorMessage = document.getElementById("errorMessage");
    const qrSection = document.getElementById("qrSection");

    // Clear previous messages
    errorMessage.style.display = "none";
    errorMessage.textContent = "";

    // Validation
    if (!url) {
        showError("Please enter a URL");
        return;
    }

    if (!isValidURL(url)) {
        showError("Please enter a valid URL (e.g., https://example.com)");
        return;
    }

    // Clear previous QR code
    const qrContainer = document.getElementById("qrcode");
    qrContainer.innerHTML = "";

    // Generate QR code
    try {
        currentQRCode = new QRCode(qrContainer, {
            text: url,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H,
        });

        currentURL = url;
        document.getElementById("urlDisplay").textContent = "URL: " + url;
        qrSection.style.display = "block";
    } catch (error) {
        showError("Failed to generate QR code. Please try again.");
    }
}

function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function showError(message) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    document.getElementById("qrSection").style.display = "none";
}

function downloadQRCode() {
    if (!currentQRCode) return;

    const canvas = document.querySelector("#qrcode canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function copyToClipboard() {
    if (!currentURL) return;

    navigator.clipboard.writeText(currentURL).then(() => {
        const copyBtn = event.target.closest(".copy-btn");
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = "<span>✓</span> Copied!";
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    }).catch(() => {
        showError("Failed to copy URL");
    });
}

function resetForm() {
    document.getElementById("urlInput").value = "";
    document.getElementById("qrSection").style.display = "none";
    document.getElementById("errorMessage").style.display = "none";
    currentQRCode = null;
    currentURL = "";
    document.getElementById("urlInput").focus();
}

// Allow Enter key to generate QR code
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("urlInput").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            generateQRCode();
        }
    });
    document.getElementById("urlInput").focus();
});