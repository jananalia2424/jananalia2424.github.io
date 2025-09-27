// **هام:** رابط خادم Render المنشور.
const RENDER_SERVER = 'https://my-backend-cyj8.onrender.com/api/chat';
// رابط الخادم المحلي (للتطوير فقط)
const LOCAL_SERVER = 'http://localhost:5000/api/chat'; 

// المتغيرات التي تحدد وضع الاتصال
let currentMode = "render"; 
let currentEndpoint = RENDER_SERVER;

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // العناصر الرئيسية
    const chatToggle = document.getElementById('chat-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    // **التصحيح هنا:** استخدام مُحدِّد أكثر دقة لزر الإغلاق 
    const closeChat = document.querySelector('#chatbot-window .chat-header span'); 
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatBody = document.getElementById('chat-body');
    const modeSelect = document.getElementById('modeSelect');
    const googleSearchInput = document.getElementById('google-search-input');
    const googleSearchBtn = document.getElementById('google-search-btn');
    const navButtons = document.querySelectorAll('nav button');

    // ----------------------------------------------------
    // وظيفة لعرض قسم معين

    function showSection(id) {
        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
        const targetSection = document.getElementById(id);
        if (targetSection) {
             targetSection.classList.add('active');
        }
       
        navButtons.forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`nav button[data-section="${id}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
    
    // عند تحميل الصفحة، يتم عرض قسم الصور (photos) تلقائياً.
    showSection('photos'); 
    
    // ربط أزرار التنقل بالوظيفة
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    // ----------------------------------------------------
    // وظائف الدردشة

    // **التصحيح هنا:** تأكيد الربط بـ chatToggle و closeChat
    // فتح نافذة الدردشة
    chatToggle.onclick = (e) => {
        e.preventDefault();
        chatbotWindow.style.display = 'flex';
    };

    // إغلاق نافذة الدردشة
    closeChat.onclick = () => {
        chatbotWindow.style.display = 'none';
    };
    
    function appendMessage(message, sender) {
        const p = document.createElement('p');
        p.textContent = message;
        p.className = (sender === 'user' ? 'user-message' : 'ai-message');
        chatBody.appendChild(p);
        chatBody.scrollTop = chatBody.scrollHeight; 
    }

    // وظيفة تبديل وضع الاتصال
    function changeMode() {
        currentMode = modeSelect.value;
        currentEndpoint = currentMode === "local" ? LOCAL_SERVER : RENDER_SERVER;
        appendMessage(`✅ تم اختيار الوضع: ${currentMode === "local" ? "سيرفر محلي" : "خادم Render"}`, 'ai');
    }

    modeSelect.onchange = changeMode;
    modeSelect.value = "render"; // الافتراضي
    currentEndpoint = RENDER_SERVER;


    // وظيفة إرسال الرسالة إلى الخادم الخلفي
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === "") return;

        appendMessage(message, 'user');
        userInput.value = ''; 

        try {
            const loadingMessage = document.createElement('p');
            loadingMessage.textContent = 'المساعد يكتب...';
            loadingMessage.id = 'loading-msg';
            loadingMessage.className = 'ai-message';
            chatBody.appendChild(loadingMessage);
            chatBody.scrollTop = chatBody.scrollHeight;

            const response = await fetch(currentEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message }),
            });

            const errorElement = document.getElementById('loading-msg');
            if (errorElement) chatBody.removeChild(errorElement);

            const data = await response.json();

            if (response.ok && data.reply) {
                appendMessage(data.reply, 'ai');
            } else {
                appendMessage("عذراً، الخادم لم يستجب بشكل صحيح. (تأكد من رصيد OpenAI)", 'ai');
                console.error('Backend error:', data.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Network or server error:', error);
            appendMessage("حدث خطأ في الاتصال بالشبكة أو الخادم (ربما هو نائم).", 'ai');
        }
    }

    sendBtn.onclick = sendMessage;
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // ----------------------------------------------------
    // وظيفة البحث في جوجل
    function searchGoogle(){
        const query = googleSearchInput.value.trim();
        if(query) window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }

    googleSearchBtn.onclick = searchGoogle;
    googleSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchGoogle();
        }
    });
});
