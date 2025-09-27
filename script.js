// **هام:** هذا هو الرابط الحقيقي للخادم الخلفي المنشور على Render.
const BACKEND_ENDPOINT = 'https://my-backend-cyj8.onrender.com/api/chat'; 

document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.getElementById('chat-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChat = document.getElementById('close-chat');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatBody = document.getElementById('chat-body');

    // 1. وظيفة لفتح وإغلاق نافذة المحادثة
    chatToggle.onclick = (e) => {
        e.preventDefault();
        chatbotWindow.style.display = 'flex';
    };

    closeChat.onclick = () => {
        chatbotWindow.style.display = 'none';
    };

    // 2. وظيفة عرض الرسائل في النافذة
    function appendMessage(message, sender) {
        const p = document.createElement('p');
        p.textContent = message;
        p.className = (sender === 'user' ? 'user-message' : 'ai-message');
        chatBody.appendChild(p);
        chatBody.scrollTop = chatBody.scrollHeight; // التمرير للأسفل
    }

    // 3. وظيفة إرسال الرسالة إلى الخادم الخلفي
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === "") return;

        appendMessage(message, 'user');
        userInput.value = ''; // مسح حقل الإدخال

        try {
            // إضافة رسالة "جاري الكتابة..."
            const loadingMessage = document.createElement('p');
            loadingMessage.textContent = 'المساعد يكتب...';
            loadingMessage.id = 'loading-msg';
            loadingMessage.className = 'ai-message';
            chatBody.appendChild(loadingMessage);
            chatBody.scrollTop = chatBody.scrollHeight;

            const response = await fetch(BACKEND_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message }),
            });

            // إزالة رسالة "جاري الكتابة..."
            const errorElement = document.getElementById('loading-msg');
            if (errorElement) chatBody.removeChild(errorElement);

            const data = await response.json();

            if (response.ok && data.reply) {
                appendMessage(data.reply, 'ai');
            } else {
                appendMessage("عذراً، الخادم لم يستجب بشكل صحيح.", 'ai');
                console.error('Backend error:', data.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Network or server error:', error);
            appendMessage("حدث خطأ في الاتصال بالشبكة.", 'ai');
        }
    }

    sendBtn.onclick = sendMessage;
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
