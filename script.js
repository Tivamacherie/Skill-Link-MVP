// Sample data for the application
let currentUser = {
    name: "You",
    skills: ["JavaScript", "Web Development"],
    wantToLearn: ["Guitar", "Spanish"],
    bio: "Looking to exchange knowledge!"
};

let users = [
    {
        id: 1,
        name: "Martin",
        skills: ["English", "Writing"],
        wantToLearn: ["Guitar", "Music Theory"],
        online: true,
        lastSeen: new Date()
    },
    {
        id: 2,
        name: "Maria",
        skills: ["Guitar", "Piano", "Music Theory"],
        wantToLearn: ["English", "Public Speaking"],
        online: true,
        lastSeen: new Date()
    },
    {
        id: 3,
        name: "Alex",
        skills: ["Programming", "Web Development"],
        wantToLearn: ["Design", "Photography"],
        online: false,
        lastSeen: new Date(Date.now() - 3600000) // 1 hour ago
    },
    {
        id: 4,
        name: "Sophie",
        skills: ["French", "Cooking"],
        wantToLearn: ["Programming", "Data Science"],
        online: true,
        lastSeen: new Date()
    }
];

let appointments = [
    {
        id: 1,
        date: "2025-10-20",
        time: "14:00",
        partner: "Martin",
        details: "English conversation practice & guitar lesson exchange"
    },
    {
        id: 2,
        date: "2025-10-22",
        time: "16:30",
        partner: "Maria",
        details: "Guitar fundamentals for beginners"
    }
];

let chatHistory = [
    {
        userId: 1,
        name: "Martin",
        lastMessage: "See you tomorrow for our session!",
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        messages: [
            { text: "Hi! Ready for tomorrow's session?", sent: false, timestamp: new Date(Date.now() - 600000) },
            { text: "Yes! Looking forward to it.", sent: true, timestamp: new Date(Date.now() - 400000) },
            { text: "See you tomorrow for our session!", sent: false, timestamp: new Date(Date.now() - 300000) }
        ]
    },
    {
        userId: 2,
        name: "Maria",
        lastMessage: "What time works best for you?",
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        messages: [
            { text: "Hi! I'd love to help you with guitar!", sent: false, timestamp: new Date(Date.now() - 7400000) },
            { text: "That would be amazing! Thank you!", sent: true, timestamp: new Date(Date.now() - 7300000) },
            { text: "What time works best for you?", sent: false, timestamp: new Date(Date.now() - 7200000) }
        ]
    }
];

let currentChatUser = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Show loading screen for 2 seconds
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('app').style.display = 'flex';
        initializeApp();
    }, 2000);
});

function initializeApp() {
    setupNavigation();
    loadHomepage();
    loadSearchPage();
    loadChatPage();
    loadProfilePage();
    setupAppointmentModal();
}

// Navigation functionality
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and pages
            navButtons.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            
            // Add active class to clicked button and corresponding page
            btn.classList.add('active');
            const targetPage = btn.getAttribute('data-page');
            document.getElementById(targetPage).classList.add('active');
            
            // Load page-specific content
            if (targetPage === 'homepage') {
                loadHomepage();
            } else if (targetPage === 'search-page') {
                loadSearchPage();
            } else if (targetPage === 'chat-page') {
                loadChatPage();
            } else if (targetPage === 'profile-page') {
                loadProfilePage();
            }
        });
    });
}

// Homepage functionality
function loadHomepage() {
    loadOnlineUsers();
    loadCalendar();
    loadAppointments();
}

function loadOnlineUsers() {
    const usersList = document.getElementById('online-users-list');
    usersList.innerHTML = '';
    
    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = `user-card ${user.online ? 'online' : 'offline'}`;
        userCard.innerHTML = `<strong>${user.name}</strong>`;
        userCard.addEventListener('click', () => openUserProfile(user));
        usersList.appendChild(userCard);
    });
}

function loadCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    // Create calendar header
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.textContent = day;
        dayHeader.style.fontWeight = 'bold';
        dayHeader.style.textAlign = 'center';
        dayHeader.style.padding = '10px';
        dayHeader.style.color = 'var(--loyal-blue)';
        calendar.appendChild(dayHeader);
    });
    
    // Generate calendar days (simplified version)
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        calendar.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const currentDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Check if this day has an appointment
        if (appointments.some(apt => apt.date === currentDate)) {
            dayElement.classList.add('has-appointment');
        }
        
        // Highlight today
        if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            dayElement.classList.add('selected');
        }
        
        dayElement.addEventListener('click', () => {
            // Remove selected class from all days
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            dayElement.classList.add('selected');
            
            // Open appointment modal for this date
            openAppointmentModal(currentDate);
        });
        
        calendar.appendChild(dayElement);
    }
}

function loadAppointments() {
    const appointmentsList = document.getElementById('appointments-list');
    appointmentsList.innerHTML = '';
    
    if (appointments.length === 0) {
        appointmentsList.innerHTML = '<p>No upcoming appointments</p>';
        return;
    }
    
    appointments.forEach(appointment => {
        const appointmentItem = document.createElement('div');
        appointmentItem.className = 'appointment-item';
        appointmentItem.innerHTML = `
            <h4>Session with ${appointment.partner}</h4>
            <p><strong>Date:</strong> ${formatDate(appointment.date)}</p>
            <p><strong>Time:</strong> ${appointment.time}</p>
            <p><strong>Details:</strong> ${appointment.details}</p>
        `;
        appointmentsList.appendChild(appointmentItem);
    });
}

// Search functionality
function loadSearchPage() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchResults = document.getElementById('search-results');
    
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        searchResults.innerHTML = '';
        
        if (!query) {
            searchResults.innerHTML = '<p style="color: var(--loyal-blue); text-align: center;">Enter a name or skill to search</p>';
            return;
        }
        
        const filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(query) ||
            user.skills.some(skill => skill.toLowerCase().includes(query)) ||
            user.wantToLearn.some(skill => skill.toLowerCase().includes(query))
        );
        
        if (filteredUsers.length === 0) {
            searchResults.innerHTML = '<p style="color: var(--loyal-blue); text-align: center;">No matches found</p>';
            return;
        }
        
        filteredUsers.forEach(user => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            
            // Check for skill matches
            const matchedSkills = getMatchingSkills(user);
            
            resultItem.innerHTML = `
                <h4>${user.name} ${user.online ? '🟢' : '🔴'}</h4>
                <p><strong>Good at:</strong> ${user.skills.join(', ')}</p>
                <p><strong>Wants to learn:</strong> ${user.wantToLearn.join(', ')}</p>
                ${matchedSkills ? `<p style="color: #4CAF50;"><strong>Perfect Match!</strong> ${matchedSkills}</p>` : ''}
                <button class="match-button" onclick="connectWithUser(${user.id})">Connect & Match</button>
            `;
            
            searchResults.appendChild(resultItem);
        });
    }
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Show all users initially
    performSearch();
}

function getMatchingSkills(user) {
    const mySkills = currentUser.skills.map(s => s.toLowerCase());
    const myWants = currentUser.wantToLearn.map(s => s.toLowerCase());
    const theirSkills = user.skills.map(s => s.toLowerCase());
    const theirWants = user.wantToLearn.map(s => s.toLowerCase());
    
    // Find if I can teach them something they want to learn
    const iCanTeach = mySkills.filter(skill => theirWants.includes(skill));
    // Find if they can teach me something I want to learn
    const theyCanTeach = theirSkills.filter(skill => myWants.includes(skill));
    
    if (iCanTeach.length > 0 && theyCanTeach.length > 0) {
        return `You can teach ${iCanTeach.join(', ')} and learn ${theyCanTeach.join(', ')}`;
    }
    return null;
}

function connectWithUser(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        alert(`Connection request sent to ${user.name}! You can now chat and schedule appointments.`);
        
        // Add to chat history if not already there
        if (!chatHistory.find(chat => chat.userId === userId)) {
            chatHistory.unshift({
                userId: userId,
                name: user.name,
                lastMessage: "Connected! Say hello!",
                timestamp: new Date(),
                messages: []
            });
        }
    }
}

// Chat functionality
function loadChatPage() {
    const chatSearch = document.getElementById('chat-search');
    const chatList = document.getElementById('chat-list');
    
    function displayChats(chats = chatHistory) {
        chatList.innerHTML = '';
        
        if (chats.length === 0) {
            chatList.innerHTML = '<p style="text-align: center; color: var(--loyal-blue); padding: 20px;">No conversations yet</p>';
            return;
        }
        
        chats.forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item';
            chatItem.innerHTML = `
                <div class="chat-avatar">${chat.name.charAt(0)}</div>
                <div class="chat-info">
                    <h4>${chat.name}</h4>
                    <p>${chat.lastMessage}</p>
                    <small>${formatTime(chat.timestamp)}</small>
                </div>
            `;
            
            chatItem.addEventListener('click', () => openChat(chat));
            chatList.appendChild(chatItem);
        });
    }
    
    chatSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredChats = chatHistory.filter(chat => 
            chat.name.toLowerCase().includes(query)
        );
        displayChats(filteredChats);
    });
    
    displayChats();
}

function openChat(chat) {
    currentChatUser = chat;
    const chatWindow = document.getElementById('chat-window');
    const chatMessages = document.getElementById('chat-messages');
    
    chatWindow.style.display = 'flex';
    
    // Display messages
    chatMessages.innerHTML = '';
    chat.messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sent ? 'sent' : 'received'}`;
        messageDiv.textContent = message.text;
        chatMessages.appendChild(messageDiv);
    });
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Setup message sending
    setupMessageSending(chat);
}

function setupMessageSending(chat) {
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const callBtn = document.getElementById('call-btn');
    const videoBtn = document.getElementById('video-btn');
    
    function sendMessage() {
        const text = messageInput.value.trim();
        if (!text) return;
        
        const message = {
            text: text,
            sent: true,
            timestamp: new Date()
        };
        
        chat.messages.push(message);
        chat.lastMessage = text;
        chat.timestamp = new Date();
        
        // Update chat display
        openChat(chat);
        messageInput.value = '';
        
        // Simulate response after 1-2 seconds
        setTimeout(() => {
            const responses = [
                "That sounds great!",
                "I'm looking forward to it!",
                "Thanks for the message!",
                "Let me know when you're free.",
                "Absolutely! See you then."
            ];
            const response = {
                text: responses[Math.floor(Math.random() * responses.length)],
                sent: false,
                timestamp: new Date()
            };
            chat.messages.push(response);
            chat.lastMessage = response.text;
            chat.timestamp = new Date();
            openChat(chat);
        }, 1500);
    }
    
    sendBtn.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    callBtn.addEventListener('click', () => {
        alert(`Calling ${chat.name}... (Voice call feature)`);
    });
    
    videoBtn.addEventListener('click', () => {
        alert(`Starting video call with ${chat.name}... (Video call feature)`);
    });
}

// Profile functionality
function loadProfilePage() {
    const nameInput = document.getElementById('name-input');
    const skillsInput = document.getElementById('skills-input');
    const wantLearnInput = document.getElementById('want-learn-input');
    const bioInput = document.getElementById('bio-input');
    const saveBtn = document.getElementById('save-profile-btn');
    
    // Load current user data
    nameInput.value = currentUser.name || '';
    skillsInput.value = currentUser.skills ? currentUser.skills.join(', ') : '';
    wantLearnInput.value = currentUser.wantToLearn ? currentUser.wantToLearn.join(', ') : '';
    bioInput.value = currentUser.bio || '';
    
    saveBtn.addEventListener('click', () => {
        currentUser.name = nameInput.value || 'You';
        currentUser.skills = skillsInput.value.split(',').map(s => s.trim()).filter(s => s);
        currentUser.wantToLearn = wantLearnInput.value.split(',').map(s => s.trim()).filter(s => s);
        currentUser.bio = bioInput.value;
        
        alert('Profile updated successfully!');
    });
    
    // Profile picture functionality
    document.getElementById('change-pic-btn').addEventListener('click', () => {
        alert('Profile picture upload feature would be implemented here');
    });
}

// Appointment modal functionality
function setupAppointmentModal() {
    const modal = document.getElementById('appointment-modal');
    const closeBtn = document.querySelector('.close');
    const appointmentForm = document.getElementById('appointment-form');
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const date = document.getElementById('appointment-date').value;
        const time = document.getElementById('appointment-time').value;
        const details = document.getElementById('appointment-details').value;
        
        if (date && time) {
            const newAppointment = {
                id: appointments.length + 1,
                date: date,
                time: time,
                partner: 'Selected User', // This would be dynamic based on selected user
                details: details || 'No additional details'
            };
            
            appointments.push(newAppointment);
            loadAppointments();
            loadCalendar();
            modal.style.display = 'none';
            alert('Appointment booked successfully!');
        }
    });
}

function openAppointmentModal(date) {
    const modal = document.getElementById('appointment-modal');
    const dateInput = document.getElementById('appointment-date');
    
    dateInput.value = date;
    modal.style.display = 'block';
}

function openUserProfile(user) {
    alert(`${user.name}'s Profile:\n\nSkills: ${user.skills.join(', ')}\nWants to learn: ${user.wantToLearn.join(', ')}\nStatus: ${user.online ? 'Online' : 'Offline'}`);
}

// Utility functions
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
}

// Simulate real-time updates
setInterval(() => {
    // Randomly update user online status
    users.forEach(user => {
        if (Math.random() < 0.1) { // 10% chance to change status
            user.online = !user.online;
            user.lastSeen = user.online ? new Date() : new Date(Date.now() - Math.random() * 3600000);
        }
    });
    
    // Reload online users if on homepage
    if (document.getElementById('homepage').classList.contains('active')) {
        loadOnlineUsers();
    }
}, 30000); // Update every 30 seconds