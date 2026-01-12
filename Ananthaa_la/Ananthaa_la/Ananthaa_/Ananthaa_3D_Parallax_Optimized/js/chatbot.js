// Ananthaa Spaces Chatbot - No History Persistence (Always Fresh Start)
(function () {
  const EL = {
    toggleBtn: null,
    chatWin: null,
    closeBtn: null,
    sendBtn: null,
    inputEl: null,
    inputArea: null,
    msgsEl: null,
    formEl: null,
    submitBtn: null,
    formName: null,
    formPhone: null,
  };

  // CHANGE THIS BACK TO YOUR OLD SERVER LINK
  const API_URL = 'https://anathaa-demo.onrender.com/api/leads';

  const knowledgeBase = {
    // 1. PRICE
    price: {
      keywords: ['price', 'cost', 'rate', 'starting', 'budget', 'lakh', 'crore', 'pricing'],
      answer: 'Our apartments start from ₹1.2 Cr in Gachibowli. Would you like the complete price sheet?'
    },
    // 2. SITE VISIT / BOOKING
    booking: {
      keywords: ['visit', 'tour', 'book', 'schedule', 'slot', 'seeing', 'site visit'],
      answer: 'We would be happy to arrange a site visit for you. Please share your details below to book a slot.'
    },
    // 3. LOCATION
    location: {
      keywords: ['where', 'location', 'address', 'map', 'area', 'district', 'located', 'place'],
      answer: 'We are strategically located in Gachibowli and the Financial District, Hyderabad.'
    },
    amenities: {
      keywords: ['amenities', 'gym', 'pool', 'clubhouse', 'swimming', 'facilities', 'parking'],
      answer: 'We offer world-class amenities including a Clubhouse, Swimming Pool, Gym, and 24/7 Security.'
    },
    contact: {
      keywords: ['contact', 'call', 'phone', 'number', 'email', 'speak', 'talk', 'advisor'],
      answer: 'You can reach us at +91 9538 123 123. Would you like a callback from our team?'
    }
  };

  function qs(id) { return document.getElementById(id); }

  function init() {
    EL.toggleBtn = qs('ananthaaChatToggle');
    EL.chatWin   = qs('ananthaaChatWindow');
    EL.closeBtn  = qs('ananthaaChatClose');
    EL.sendBtn   = qs('ananthaaChatSend');
    EL.inputEl   = qs('ananthaaChatInput');
    EL.inputArea = qs('ananthaaChatInput') ? qs('ananthaaChatInput').closest('.chatbot-input-area') : null;
    EL.msgsEl    = qs('ananthaaChatMessages');
    EL.formEl    = qs('ananthaaChatForm');
    EL.submitBtn = qs('chatbotSubmitBtn');
    EL.formName  = qs('chatbotFormName');
    EL.formPhone = qs('chatbotFormPhone');

    if (!EL.toggleBtn || !EL.chatWin) return;

    EL.toggleBtn.addEventListener('click', openChat);
    if (EL.closeBtn) EL.closeBtn.addEventListener('click', closeChat);
    if (EL.sendBtn) EL.sendBtn.addEventListener('click', handleSend);
    if (EL.inputEl) EL.inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });
    if (EL.submitBtn) EL.submitBtn.addEventListener('click', submitForm);

    console.log('Chatbot initialized successfully!');
  }

  function openChat() {
    EL.chatWin.classList.add('active');
    EL.toggleBtn.classList.add('open');
    
    // Always start fresh - check if messages area is empty
    const hasMessages = EL.msgsEl.children.length > 0;

    if (!hasMessages) {
      // Always show welcome and initial options on first open
      botReply('Welcome to Ananthaa Spaces. How may we assist you?');
      showInitialOptions();
    }
  }

  function closeChat() {
    EL.chatWin.classList.remove('active');
    EL.toggleBtn.classList.remove('open');
    // Reset UI
    if (EL.inputArea) EL.inputArea.classList.remove('hidden');
    if (EL.formEl) EL.formEl.classList.remove('active');
  }

  function addMessage(text, who) {
    const wrapper = document.createElement('div');
    wrapper.className = `chatbot-message ${who}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'chatbot-message-bubble';
    bubble.innerHTML = text;

    wrapper.appendChild(bubble);
    EL.msgsEl.appendChild(wrapper);
    EL.msgsEl.scrollTop = EL.msgsEl.scrollHeight;
  }

  function botReply(text) { addMessage(text, 'bot'); }

  function showInitialOptions() {
    showOptions([
      { text: 'Explore Our Projects', action: 'explore' },
      { text: 'Get Price Details', action: 'price' },
      { text: 'Speak to Sales Advisor', action: 'sales' }
    ]);
  }

  function showOptions(options) {
    // Remove any existing option buttons to prevent duplicates
    const oldOpts = EL.msgsEl.querySelectorAll('.chatbot-options');
    oldOpts.forEach(el => el.remove());

    const div = document.createElement('div');
    div.className = 'chatbot-options';
    
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'chatbot-option-btn';
      btn.textContent = opt.text;
      btn.onclick = () => handleOptionClick(opt.action, opt.text);
      div.appendChild(btn);
    });

    EL.msgsEl.appendChild(div);
    EL.msgsEl.scrollTop = EL.msgsEl.scrollHeight;
  }

  function handleOptionClick(action, text) {
    addMessage(text, 'user');

    // Remove buttons after clicking
    const oldOpts = EL.msgsEl.querySelectorAll('.chatbot-options');
    if (oldOpts.length > 0) oldOpts[oldOpts.length - 1].remove();

    setTimeout(() => {
      if (action === 'explore') {
        botReply('What kind of project are you looking for?');
        showOptions([
          { text: 'Ongoing Projects', action: 'details_ongoing' },
          { text: 'Upcoming Launches', action: 'details_upcoming' }
        ]);
      } 
      else if (action === 'price') {
        botReply('Our apartments start from ₹1.2 Cr. What details do you need?');
        showOptions([
          { text: 'Complete Price Sheet', action: 'form_price' },
          { text: 'Payment Plans', action: 'form_payment' }
        ]);
      } 
      else if (action === 'sales' || action === 'form_price' || action === 'form_payment') {
        botReply('Please provide your details below, and our team will share the information with you.');
        showContactForm();
      }
      else if (action === 'details_ongoing') {
        botReply('<b>Ananthaa NeoCity</b> in Gachibowli is currently in progress. Would you like to visit?');
        showOptions([
          { text: 'Book Site Visit', action: 'sales' }, 
          { text: 'Back to Menu', action: 'restart' }
        ]);
      }
      else if (action === 'details_upcoming') {
        botReply('<b>Ananthaa Towers</b> is our upcoming luxury high-rise. Pre-launch offers available.');
        showOptions([
          { text: 'Get Price Details', action: 'price' }, 
          { text: 'Back to Menu', action: 'restart' }
        ]);
      }
      else if (action === 'restart') {
        showInitialOptions();
      }
    }, 500);
  }

  function handleSend() {
    const text = EL.inputEl.value.trim();
    if (!text) return;
    
    addMessage(text, 'user');
    EL.inputEl.value = '';

    let found = false;
    const lowerText = text.toLowerCase();

    for (const key in knowledgeBase) {
      if (knowledgeBase[key].keywords.some(k => lowerText.includes(k))) {
        setTimeout(() => {
          botReply(knowledgeBase[key].answer);
          if (key === 'booking') showContactForm();
        }, 500);
        found = true;
        break;
      }
    }

    if (!found) {
      setTimeout(() => {
        botReply("I don't have that specific info right now. Please share your details below, and our team will assist you.");
        showContactForm();
      }, 500);
    }
  }

  function showContactForm() {
    if (EL.formEl) {
      EL.formEl.classList.add('active');
      if (EL.inputArea) EL.inputArea.classList.add('hidden');
    }
  }

  function submitForm() {
    const name = EL.formName.value.trim();
    const phone = EL.formPhone.value.trim();

    if (!name || !phone) {
      alert('Please enter both Name and Phone.');
      return;
    }

    EL.submitBtn.textContent = 'Sending...';
    EL.submitBtn.disabled = true;

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        page_source: window.location.pathname,
        inquiry_details: 'Chatbot Lead'
      })
    })
    .then(res => {
      botReply('Thank you! We will contact you shortly.');
      EL.formEl.classList.remove('active');
      if (EL.inputArea) EL.inputArea.classList.remove('hidden'); 
      EL.submitBtn.textContent = 'Send Inquiry';
      EL.submitBtn.disabled = false;
      EL.formName.value = '';
      EL.formPhone.value = '';
    })
    .catch(err => {
      console.error(err);
      botReply('Thank you! Your request is received.');
      EL.submitBtn.textContent = 'Send Inquiry';
      EL.submitBtn.disabled = false;
      EL.formEl.classList.remove('active');
      if (EL.inputArea) EL.inputArea.classList.remove('hidden');
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
