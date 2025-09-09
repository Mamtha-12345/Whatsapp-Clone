document.addEventListener('DOMContentLoaded', function() {
    const chatList = document.getElementById('chatList');
    const messagesDiv = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const chatTitle = document.getElementById('chatTitle');
    const newChatButton = document.getElementById('newChat');

    let currentChat = null;
    let chats = JSON.parse(localStorage.getItem('chats')) || [
        { id: 1, name: 'John Doe', avatar: 'J', messages: [] },
        { id: 2, name: 'Jane Smith', avatar: 'J', messages: [] }
    ];

    function saveChats() {
        localStorage.setItem('chats', JSON.stringify(chats));
    }

    function renderChatList() {
        chatList.innerHTML = '';
        chats.forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item';
            if (currentChat && currentChat.id === chat.id) {
                chatItem.classList.add('active');
            }
            chatItem.innerHTML = `
                <div class="chat-avatar">${chat.avatar}</div>
                <div class="chat-info">
                    <h4>${chat.name}</h4>
                    <p>${chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : 'No messages yet'}</p>
                </div>
            `;
            chatItem.addEventListener('click', () => selectChat(chat));
            chatList.appendChild(chatItem);
        });
    }

    function selectChat(chat) {
        currentChat = chat;
        chatTitle.textContent = chat.name;
        renderMessages();
        renderChatList();
    }

    function renderMessages() {
        messagesDiv.innerHTML = '';
        if (currentChat) {
            currentChat.messages.forEach(message => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${message.type}`;
                messageDiv.innerHTML = `
                    <div class="message-bubble">${message.text}</div>
                `;
                messagesDiv.appendChild(messageDiv);
            });
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    }

    function sendMessage() {
        const text = messageInput.value.trim();
        if (text && currentChat) {
            const message = { text, type: 'sent', timestamp: new Date().toISOString() };
            currentChat.messages.push(message);
            saveChats();
            renderMessages();
            messageInput.value = '';

            // Simulate received message after a delay
            setTimeout(() => {
                const reply = { text: 'Thanks for your message!', type: 'received', timestamp: new Date().toISOString() };
                currentChat.messages.push(reply);
                saveChats();
                renderMessages();
            }, 1000);
        }
    }

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    newChatButton.addEventListener('click', () => {
        const name = prompt('Enter chat name:');
        if (name) {
            const newChat = {
                id: Date.now(),
                name,
                avatar: name.charAt(0).toUpperCase(),
                messages: []
            };
            chats.push(newChat);
            saveChats();
            renderChatList();
        }
    });

    renderChatList();
    if (chats.length > 0) {
        selectChat(chats[0]);
    }
});
