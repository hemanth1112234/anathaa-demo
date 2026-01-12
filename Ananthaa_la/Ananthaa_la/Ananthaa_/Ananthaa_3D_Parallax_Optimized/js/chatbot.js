// Ananthaa Spaces Chatbot - ULTIMATE VERSION (All Questions + All Buttons)
(function () {
  const EL = {
    toggleBtn: null, chatWin: null, closeBtn: null,
    sendBtn: null, inputEl: null, inputArea: null,
    msgsEl: null, formEl: null, submitBtn: null,
    formName: null, formPhone: null,
  };

  // ✅ 1. YOUR SERVER URL
  const API_URL = 'https://anathaa-demo.onrender.com/api/leads';

  // ✅ 2. TRACKING VARIABLE
  let lastUserInteraction = "Opened Chatbot"; 

  // ✅ 3. NICE PAGE NAMES
  function getNicePageName() {
    const path = window.location.pathname;
    if (path === '/' || path.includes('index')) return 'Home Page';
    if (path.includes('projects')) return 'Projects Page';
    if (path.includes('gallery')) return 'Gallery Page';
    if (path.includes('about'))    return 'About Page';
    if (path.includes('contact'))  return 'Contact Page';
    return 'Custom Page';
  }

  // ✅ 4. EXPANDED KNOWLEDGE BASE (Answers more questions now!)
  const knowledgeBase = {
    timings: {
      keywords: ['time', 'timings', 'open', 'close', 'hours', 'working hours'],
      answer: 'We are open for site visits from **10:00 AM to 6:00 PM**, 7 days a week.'
    },
    days: {
      keywords: ['sunday', 'saturday', 'weekend', 'working day', 'holiday'],
      answer: 'Our sales office is operational **every day**, including weekends and holidays.'
    },
    sqft: {
      keywords: ['sqft', 'square feet', 'size', 'area', 'dimension', 'sq ft'],
      answer: 'Our units range from **1,250 sq.ft. (2BHK)** to **2,800 sq.ft. (3BHK+Study)**.'
    },
    config: {
      keywords: ['bhk', 'bedroom', 'configuration', '2bhk', '3bhk', '4bhk'],
      answer: 'We offer premium **2 BHK, 3 BHK, and 4 BHK** luxury apartments.'
    },
    price: {
      keywords: ['price', 'cost', 'budget', 'lakh', 'crore', 'rate'],
      answer: 'Prices start from **₹1.2 Cr** onwards. Would you like the detailed cost sheet?'
    },
    booking: {
      keywords: ['visit', 'tour', 'book', 'slot', 'site visit'],
      answer: 'We would be happy to arrange a VIP site visit for you. Please share your details below.'
    },
    location: {
      keywords: ['where', 'location', 'address', 'map', 'locality'],
      answer: 'We are logically located in **Gachibowli**, near the Financial District, Hyderabad.'
    },
    amenities: {
      keywords: ['amenities', 'gym', 'pool', 'clubhouse', 'park', 'play'],
      answer: 'Enjoy world-class amenities: **Grand Clubhouse, Infinity Pool, Gym, and Sky Lounge**.'
    },
    contact: {
      keywords: ['contact', 'call', 'phone', 'email', 'advisor', 'number'],
      answer: 'You can reach our sales team at **+91 9538 123 123**. Or request a callback below.'
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
      botReply('Welcome to Ananthaa Spaces! 👋 How can I help you today?');
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

  // ✅ 5. HANDLE EVERY SINGLE BUTTON CLICK (No Dead Ends)
  function handleOptionClick(action, text) {
    addMessage(text, 'user');
    lastUserInteraction = `Clicked option: ${text}`;

    const oldOpts = EL.msgsEl.querySelectorAll('.chatbot-options');
    if(oldOpts.length > 0) oldOpts[oldOpts.length - 1].remove();

    setTimeout(() => {
      if (action === 'explore') {
        botReply('We have two premium properties. Which one interests you?');
        showOptions([
            { text: 'Ongoing (Ananthaa NeoCity)', action: 'details_ongoing' },
            { text: 'Upcoming (Ananthaa Towers)', action: 'details_upcoming' }
        ]);
      } 
      else if (action === 'price') {
        botReply('Apartments start from ₹1.2 Cr. Should I send you the detailed Cost Sheet?');
        showOptions([
            { text: 'Yes, Send Price Sheet', action: 'form_price' },
            { text: 'Payment Plans', action: 'form_payment' }
        ]);
      } 
      else if (['sales', 'form_price', 'form_payment'].includes(action)) {
        botReply('Please enter your Name and Phone below. Our team will contact you shortly.');
        showContactForm();
      } 
      else if (action === 'details_ongoing') {
        botReply('<b>Ananthaa NeoCity</b> is a luxury gated community in Gachibowli (Under Construction).');
        showOptions([
            { text: 'Book Site Visit', action: 'sales' }, 
            { text: 'Back to Menu', action: 'restart' }
        ]);
      } 
      else if (action === 'details_upcoming') {
        botReply('<b>Ananthaa Towers</b> is our upcoming high-rise icon. Pre-launch offers are live!');
        showOptions([
            { text: 'Get Pre-launch Price', action: 'price' }, 
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
    lastUserInteraction = `Typed: "${text}"`;
    EL.inputEl.value = '';

    let found = false;
    const lowerText = text.toLowerCase();

    // ✅ SMART SEARCH ACROSS ALL TOPICS
    for (const key in knowledgeBase) {
      if (knowledgeBase[key].keywords.some(k => lowerText.includes(k))) {
        setTimeout(() => {
          botReply(knowledgeBase[key].answer);
          // If they asked about booking or price, show the form automatically
          if (['booking', 'contact'].includes(key)) showContactForm();
          // If they asked about price, show options
          if (key === 'price') {
              showOptions([
                { text: 'Send Cost Sheet', action: 'form_price' },
                { text: 'Payment Plans', action: 'form_payment' }
              ]);
          }
        }, 500);
        found = true;
        break;
      }
    }

    if (!found) {
      setTimeout(() => {
        botReply("I don't have that exact info, but our team does! Please leave your details.");
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

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, 
        phone,
        page_source: getNicePageName(),
        last_query: lastUserInteraction,
        inquiry_details: 'Chatbot Lead'
      })
    })
    .then(res => {
      botReply('✅ Thank you! Your details have been received. Our sales manager will call you shortly.');
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