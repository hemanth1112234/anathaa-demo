console.log("🚀 Custom Backend Script Loaded!");

// ==========================================
// 1. BOOKING SYSTEM (Modal)
// ==========================================
async function submitBooking(event) {
    event.preventDefault(); 
    console.log("🖱️ Booking Button Clicked...");

    const confirmBtn = event.target;
    const originalText = confirmBtn.innerText;
    confirmBtn.innerText = "Processing...";
    confirmBtn.disabled = true;

    // Grab data from the standard IDs we set up
    const bookingData = {
        fullName: document.getElementById('visitorName')?.value || "Guest",
        email: document.getElementById('visitorEmail')?.value || "no-email@test.com",
        phone: document.getElementById('visitorPhone')?.value || "0000000000",
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
            // Hide Form & Show Success Message
            const form = document.getElementById('bookingForm');
            const success = document.getElementById('bookingSuccess');
            if(form) form.style.display = 'none';
            if(success) success.style.display = 'block';
            console.log("✅ Booking saved!");
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
// 2. CONTACT FORM SYSTEM (Home/Contact Page)
// ==========================================
async function submitContact(event) {
    event.preventDefault();
    console.log("📩 Send Message Clicked...");

    const sendBtn = event.target.querySelector('button[type="submit"]');
    const originalText = sendBtn ? sendBtn.innerText : "Sending...";
    if(sendBtn) {
        sendBtn.innerText = "Sending...";
        sendBtn.disabled = true;
    }

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
            console.log("✅ Contact message saved!");
        } else {
            alert("❌ Failed to send message.");
        }
    } catch (error) {
        alert("❌ Network Error. Is backend running?");
    } finally {
        if(sendBtn) {
            sendBtn.innerText = originalText;
            sendBtn.disabled = false;
        }
    }
}

// ==========================================
// 3. NEWSLETTER SUBSCRIPTION (Shared)
// ==========================================
async function subscribeToNewsletter() {
    const email = document.getElementById("news-email")?.value;
    const status = document.getElementById("news-status");

    if(!status) return; // If footer not present, skip silently

    if(!email) {
        status.style.color = "#ff6b6b";
        status.innerText = "Please enter an email.";
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
        status.style.color = "#ff6b6b";
        status.innerText = "Please enter a valid email address.";
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
            const emailInput = document.getElementById("news-email");
            if (emailInput) emailInput.value = "";
        } else {
            status.style.color = "#ff6b6b";
            status.innerText = "Error subscribing. Please try again.";
        }
    } catch (error) {
        console.error("Newsletter error:", error);
        status.style.color = "#ff6b6b";
        status.innerText = "Network error. Please check your connection.";
    }
}

// ==========================================
// 4. ATTACH LISTENERS (The Clean Version)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // A. Search for Booking Button (Exists on ALL pages)
    const bookingBtn = document.getElementById('submitBooking');
    if (bookingBtn) {
        // Clone to clear old events
        const newBtn = bookingBtn.cloneNode(true);
        bookingBtn.parentNode.replaceChild(newBtn, bookingBtn);
        newBtn.addEventListener('click', submitBooking);
        console.log("✅ Booking system active.");
    }

    // B. Search for Contact Form (Only exists on Home & Contact pages)
    const contactForm = document.getElementById('home-contact-form');
    if (contactForm) {
        const newForm = contactForm.cloneNode(true);
        contactForm.parentNode.replaceChild(newForm, contactForm);
        newForm.addEventListener('submit', submitContact);
        console.log("✅ Contact form active.");
    } 
    // We removed the 'else' block here, so no more red warnings on Gallery/About page!
});