// Ananthaa Spaces Chatbot - Old Server + New Features
(function () {
  const EL = {
    toggleBtn: null, chatWin: null, closeBtn: null,
    sendBtn: null, inputEl: null, inputArea: null,
    msgsEl: null, formEl: null, submitBtn: null,
    formName: null, formPhone: null,
  };

  // ✅ 1. USING YOUR OLD SERVER URL
  const API_URL = 'https://anathaa-demo.onrender.com/api/leads';

  // ✅ 2. NEW VARIABLE TO TRACK USER ACTIONS
  let lastUserInteraction = "Opened Chatbot"; 

  // ✅ 3. TRANSLATOR FUNCTION FOR NICE PAGE NAMES
  function getNicePageName() {
    const path = window.location.pathname;
    if (path === '/' || path.includes('index')) return 'Home Page';
    if (path.includes('projects')) return 'Projects Page';
    if (path.includes('gallery')) return 'Gallery Page';
    if (path.includes('about'))    return 'About Page';
    if (path.includes('contact'))  return 'Contact Page';
    return 'Custom Page';
  }

  const knowledgeBase = {
    price: {
      keywords: ['price', 'cost', 'budget', 'lakh', 'crore'],
      answer: 'Our apartments start from ₹1.2 Cr in Gachibowli. Would you like the complete price sheet?'
    },
    booking: {
      keywords: ['visit', 'tour', 'book', 'slot', 'site visit'],
      answer: 'We would be happy to arrange a site visit for you. Please share your details below.'
    },
    location: {
      keywords: ['where', 'location', 'address', 'map'],
      answer: 'We are strategically located in Gachibowli and the Financial District, Hyderabad.'
    },
    amenities: {
      keywords: ['amenities', 'gym', 'pool', 'clubhouse'],
      answer: 'We offer world-class amenities including a Clubhouse, Swimming Pool, and Gym.'
    },
    contact: {
      keywords: ['contact', 'call', 'phone', 'email', 'advisor'],
      answer: 'You can reach us at +91 9538 123 123. Would you like a callback?'
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
    if(EL.closeBtn) EL.closeBtn.addEventListener('click', closeChat);
    if(EL.sendBtn) EL.sendBtn.addEventListener('click', handleSend);
    if(EL.inputEl) EL.inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });
    if(EL.submitBtn) EL.submitBtn.addEventListener('click', submitForm);
  }

  function openChat() {
    EL.chatWin.classList.add('active');
    EL.toggleBtn.classList.add('open');
    if (EL.msgsEl.children.length === 0) {
      botReply('Welcome to Ananthaa Spaces. How may we assist you?');
      showInitialOptions();
    }
  }

  function closeChat() {
    EL.chatWin.classList.remove('active');
    EL.toggleBtn.classList.remove('open');
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
    
    // ✅ RECORD THE ACTION
    lastUserInteraction = `Clicked option: ${text}`;

    const oldOpts = EL.msgsEl.querySelectorAll('.chatbot-options');
    if(oldOpts.length > 0) oldOpts[oldOpts.length - 1].remove();

    setTimeout(() => {
      if (action === 'explore') {
        botReply('What kind of project are you looking for?');
        showOptions([
            { text: 'Ongoing Projects', action: 'details_ongoing' },
            { text: 'Upcoming Launches', action: 'details_upcoming' }
        ]);
      } else if (action === 'price') {
        botReply('Our apartments start from ₹1.2 Cr. Need the full price sheet?');
        showOptions([
            { text: 'Yes, Send Price Sheet', action: 'form_price' },
            { text: 'Payment Plans', action: 'form_payment' }
        ]);
      } else if (['sales', 'form_price', 'form_payment'].includes(action)) {
        botReply('Please enter your details below. Our team will contact you shortly.');
        showContactForm();
      } else if (action === 'details_ongoing') {
        botReply('<b>Ananthaa NeoCity</b> is currently in progress.');
        showOptions([{ text: 'Book Site Visit', action: 'sales' }, { text: 'Back', action: 'restart' }]);
      } else if (action === 'restart') {
        showInitialOptions();
      }
    }, 500);
  }

  function handleSend() {
    const text = EL.inputEl.value.trim();
    if (!text) return;
    
    addMessage(text, 'user');
    
    // ✅ RECORD THE TYPED TEXT
    lastUserInteraction = `Typed: "${text}"`;
    
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
        botReply("I don't have that info right now. Please share your details below.");
        showContactForm();
      }, 500);
    }
  }

  function showContactForm() {
    if (EL.formEl) {
      EL.formEl.classList.add('active');
      if (EL.inputArea) EL.inputArea.classList.add('hidden');
      EL.msgsEl.scrollTop = EL.msgsEl.scrollHeight;
    }
  }

  function submitForm() {
    const name = EL.formName.value.trim();
    const phone = EL.formPhone.value.trim();

    if (!name || !phone) {
      alert('Please enter Name and Phone.');
      return;
    }

    EL.submitBtn.textContent = 'Sending...';
    EL.submitBtn.disabled = true;

    // ✅ SENDING THE NEW DATA FIELDS
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, 
        phone,
        page_source: getNicePageName(), // <--- Converts "/" to "Home Page"
        last_query: lastUserInteraction, // <--- Sends the user's last action
        inquiry_details: 'Chatbot Lead'
      })
    })
    .then(res => {
      botReply('Thank you! Your details have been sent.');
      if (EL.inputArea) EL.inputArea.classList.remove('hidden'); 
      if (EL.formEl) EL.formEl.classList.remove('active');       
      EL.submitBtn.textContent = 'Send Inquiry';
      EL.submitBtn.disabled = false;
      EL.formName.value = '';
      EL.formPhone.value = '';
    })
    .catch(err => {
      console.error(err);
      botReply('Thank you! We received your request.');
      EL.submitBtn.textContent = 'Send Inquiry';
      EL.submitBtn.disabled = false;
      if (EL.inputArea) EL.inputArea.classList.remove('hidden');
      if (EL.formEl) EL.formEl.classList.remove('active');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();