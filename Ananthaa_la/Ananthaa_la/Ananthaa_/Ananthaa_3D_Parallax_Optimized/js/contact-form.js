console.log("🚀 Google Auth & Backend Script Loaded!");

// ==========================================
// 🔴 CONFIGURATION
// ==========================================
const GOOGLE_CLIENT_ID = "468110163912-3mrhnvqore5hohm8dnl4u1dv9ptdj94i.apps.googleusercontent.com"; 

let userIsSignedIn = false;
let userEmail = "";
let userName = "";

// ==========================================
// 1. INITIALIZE GOOGLE SIGN-IN
// ==========================================
function loadGoogleLibrary() {
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse
        });
        console.log("🔒 Google Sign-In Initialized");
    };
    document.head.appendChild(script);
}

// Handle the login success
function handleCredentialResponse(response) {
    console.log("✅ User Signed In!");
    
    // Decode user info (JWT)
    const responsePayload = decodeJwtResponse(response.credential);
    userIsSignedIn = true;
    userEmail = responsePayload.email;
    userName = responsePayload.name;

    // Remove the login modal if it's open
    const loginModal = document.getElementById("google-login-modal");
    if (loginModal) loginModal.remove();

    // Auto-fill forms with Google data
    autoFillForms();

    alert(`Welcome, ${userName}! You can now proceed.`);
}

function decodeJwtResponse(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function autoFillForms() {
    // Fill Booking Form
    if(document.getElementById('visitorName')) document.getElementById('visitorName').value = userName;
    if(document.getElementById('visitorEmail')) document.getElementById('visitorEmail').value = userEmail;
    
    // Fill Contact Form
    if(document.getElementById('contact-name')) document.getElementById('contact-name').value = userName;
    if(document.getElementById('contact-email')) document.getElementById('contact-email').value = userEmail;
}

// ==========================================
// 2. THE "GATE" (Login Popup)
// ==========================================
function showLoginModal(actionCallback) {
    if (userIsSignedIn) {
        actionCallback();
        return;
    }

    if (document.getElementById("google-login-modal")) return;

    // Respect current theme for better contrast in dark mode
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const panelBg = isDark ? '#0f172a' : '#ffffff';
    const panelText = isDark ? '#e2e8f0' : '#1f2937';
    const subtitleText = isDark ? '#cbd5e1' : '#4b5563';
    const shadow = isDark ? '0 20px 60px rgba(0,0,0,0.55)' : '0 20px 60px rgba(0,0,0,0.20)';
    const closeColor = isDark ? '#cbd5e1' : '#1f2937';

    const modalDiv = document.createElement("div");
    modalDiv.id = "google-login-modal";
    modalDiv.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); z-index: 10000;
        display: flex; justify-content: center; align-items: center;
    `;
    
    modalDiv.innerHTML = `
        <div style="background: ${panelBg}; color: ${panelText}; padding: 32px 32px 28px; border-radius: 14px; text-align: center; max-width: 420px; width: calc(100% - 32px); position: relative; box-shadow: ${shadow};">
            <button id="close-login" style="position: absolute; top: 10px; right: 14px; border: none; background: none; font-size: 20px; cursor: pointer; color: ${closeColor};">&times;</button>
            <h2 style="font-family: 'Playfair Display', serif; margin-bottom: 12px; color: #4FAF64; font-size: 22px;">Please Sign In</h2>
            <p style="color: ${subtitleText}; margin-bottom: 20px; font-size: 15px; line-height: 1.6;">To book a site visit or send a message, please verify your identity with Google.</p>
            <div id="google-btn-container" style="display: flex; justify-content: center;"></div>
        </div>
    `;
    
    document.body.appendChild(modalDiv);

    google.accounts.id.renderButton(
        document.getElementById("google-btn-container"),
        { theme: isDark ? "filled_black" : "outline", size: "large", width: 250 }
    );

    document.getElementById("close-login").onclick = () => modalDiv.remove();
}

// ==========================================
// 3. BOOKING SYSTEM (With Gate)
// ==========================================
async function submitBooking(event) {
    event.preventDefault(); 
    
    // GATE CHECK
    if (!userIsSignedIn) {
        showLoginModal(() => submitBooking(event)); 
        return;
    }

    console.log("🖱️ Booking Button Clicked...");
    const confirmBtn = event.target;
    const originalText = confirmBtn.innerText;
    confirmBtn.innerText = "Processing...";
    confirmBtn.disabled = true;

    const bookingData = {
        fullName: document.getElementById('visitorName')?.value || userName,
        email: document.getElementById('visitorEmail')?.value || userEmail,
        phone: document.getElementById('visitorPhone')?.value || "",
        date: document.getElementById('selectedDate')?.value || "No Date",
        timeSlot: document.getElementById('selectedTime')?.value || "No Time"
    };

    try {
        const response = await fetch('https://anathaa-demo.onrender.com/api/book-visit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        if (response.ok) {
            const form = document.getElementById('bookingForm');
            const success = document.getElementById('bookingSuccess');
            if(form) form.style.display = 'none';
            if(success) success.style.display = 'block';
        } else {
            alert("❌ Server Error: Could not save booking.");
        }
    } catch (error) {
        alert("❌ Network Error. Is backend running?");
    } finally {
        confirmBtn.innerText = originalText;
        confirmBtn.disabled = false;
    }
}

// ==========================================
// 4. CONTACT FORM SYSTEM (With Gate)
// ==========================================
async function submitContact(event) {
    event.preventDefault();

    // GATE CHECK
    if (!userIsSignedIn) {
        showLoginModal(() => { 
            alert("Thanks for signing in! Please click 'Send Message' again.");
        });
        return;
    }

    console.log("📩 Send Message Clicked...");
    const sendBtn = event.target.querySelector('button[type="submit"]');
    const originalText = sendBtn ? sendBtn.innerText : "Sending...";
    if(sendBtn) { sendBtn.innerText = "Sending..."; sendBtn.disabled = true; }

    const contactData = {
        name: document.getElementById('contact-name')?.value,
        email: document.getElementById('contact-email')?.value,
        phone: document.getElementById('contact-phone')?.value,
        subject: document.getElementById('contact-subject')?.value,
        message: document.getElementById('contact-message')?.value
    };

    try {
        const response = await fetch('https://anathaa-demo.onrender.com/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });

        if (response.ok) {
            alert("✅ Message Sent Successfully!");
            event.target.reset(); 
        } else {
            alert("❌ Failed to send message.");
        }
    } catch (error) {
        alert("❌ Network Error.");
    } finally {
        if(sendBtn) { sendBtn.innerText = originalText; sendBtn.disabled = false; }
    }
}

// ==========================================
// 5. NEWSLETTER (No Gate)
// ==========================================
async function subscribeToNewsletter() {
    const email = document.getElementById("news-email")?.value;
    const status = document.getElementById("news-status");
    if(!status) return;

    if(!email) {
        status.style.color = "#ff6b6b";
        status.innerText = "Please enter an email.";
        return;
    }

    status.style.color = "#888";
    status.innerText = "Saving...";

    try {
        const response = await fetch('https://anathaa-demo.onrender.com/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            status.style.color = "#4FAF64";
            status.innerText = "✓ Subscribed successfully!";
            document.getElementById("news-email").value = "";
        } else {
            status.style.color = "#ff6b6b";
            status.innerText = "Error subscribing.";
        }
    } catch (error) {
        status.style.color = "#ff6b6b";
        status.innerText = "Network error.";
    }
}

// ==========================================
// 6. INITIALIZATION & LISTENERS
// ==========================================
loadGoogleLibrary();

document.addEventListener('DOMContentLoaded', () => {
    
    // A. Intercept Booking Submit
    const bookingBtn = document.getElementById('submitBooking');
    if (bookingBtn) {
        const newBtn = bookingBtn.cloneNode(true);
        bookingBtn.parentNode.replaceChild(newBtn, bookingBtn);
        newBtn.addEventListener('click', submitBooking);
    }

    // B. Intercept Contact Form Submit
    const contactForm = document.getElementById('home-contact-form');
    if (contactForm) {
        const newForm = contactForm.cloneNode(true);
        contactForm.parentNode.replaceChild(newForm, contactForm);
        newForm.addEventListener('submit', submitContact);
    } 
});