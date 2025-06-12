
        // Exam data with specific dates
        const examData = {
            itspecialist: {
                title: "IT SPECIALIST",
                description: "IT Specialist certification demonstrates your proficiency in Microsoft technologies and solutions. This certification validates your technical skills and knowledge in implementing Microsoft solutions in enterprise environments.",
                info: "The IT Specialist certification is designed for professionals who want to demonstrate their expertise in Microsoft technologies. It covers essential skills needed to work effectively with Microsoft platforms and tools.",
                date: new Date('2025-08-25T09:00:00'),
                resources: [
                    { name: "Microsoft Learn Path", url: "https://learn.microsoft.com", icon: "📚" },
                    { name: "Practice Tests", url: "https://www.measureup.com", icon: "✅" },
                    { name: "Study Guide", url: "https://www.microsoft.com/learning", icon: "📖" }
                ]
            },
            az900: {
                title: "AZ-900: Azure Fundamentals",
                description: "Demonstrate foundational knowledge of cloud services and how those services are provided with Microsoft Azure. This exam is intended for candidates with non-technical backgrounds, such as those involved in selling or purchasing cloud-based solutions and services.",
                info: "This is a foundational exam that validates your understanding of cloud concepts, core Azure services, security, privacy, compliance, and trust, as well as Azure pricing and support.",
                date: new Date('2025-09-22T09:00:00'),
                resources: [
                    { name: "Azure Fundamentals Learning Path", url: "https://learn.microsoft.com/en-us/training/paths/azure-fundamentals/", icon: "☁️" },
                    { name: "Azure Portal", url: "https://portal.azure.com", icon: "🌐" },
                    { name: "AZ-900 Practice Tests", url: "https://www.whizlabs.com/microsoft-azure-certification-az-900/", icon: "🎯" }
                ]
            },
            az204: {
                title: "AZ-204: Developing Solutions for Microsoft Azure",
                description: "Demonstrate skills in developing cloud applications and services on Microsoft Azure. This exam measures your ability to accomplish technical tasks like developing Azure compute solutions, storage solutions, and implementing Azure security.",
                info: "This certification validates your expertise in designing, building, testing, and maintaining cloud applications and services on Microsoft Azure. You should be proficient in Azure SDKs, data storage options, and implementing security.",
                date: new Date('2025-10-27T09:00:00'),
                resources: [
                    { name: "Azure Developer Learning Path", url: "https://learn.microsoft.com/en-us/training/paths/create-serverless-applications/", icon: "💻" },
                    { name: "Azure DevOps", url: "https://dev.azure.com", icon: "🔧" },
                    { name: "Azure SDK Documentation", url: "https://docs.microsoft.com/en-us/azure/", icon: "📋" }
                ]
            },
            az400: {
                title: "AZ-400: Designing and Implementing Microsoft DevOps Solutions",
                description: "Demonstrate skills in combining people, process, and technologies to continuously deliver valuable products and services that meet end user needs and business objectives. This exam covers DevOps practices, Azure DevOps services, and implementation strategies.",
                info: "This expert-level certification validates your ability to design and implement DevOps practices for version control, compliance, infrastructure as code, configuration management, build, release, and testing using Azure technologies.",
                date: new Date('2025-12-01T09:00:00'),
                resources: [
                    { name: "DevOps Learning Path", url: "https://learn.microsoft.com/en-us/training/paths/evolve-your-devops-practices/", icon: "🚀" },
                    { name: "Azure DevOps Services", url: "https://azure.microsoft.com/en-us/services/devops/", icon: "⚙️" },
                    { name: "DevOps Best Practices", url: "https://docs.microsoft.com/en-us/azure/devops/", icon: "📊" }
                ]
            }
        };

        const motivationalQuotes = [
            { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
            { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
            { text: "Knowledge is power. Information is liberating.", author: "Kofi Annan" },
            { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
            { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
            { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" }
        ];

        let currentExam = null;
        let timerInterval = null;
        let quoteInterval = null;
        let currentQuoteIndex = 0;

        function showTimerPage() {
            document.getElementById('landingPage').style.display = 'none';
            document.getElementById('timerPage').style.display = 'block';
            startQuoteRotation();
        }

        function showLandingPage() {
            document.getElementById('landingPage').style.display = 'flex';
            document.getElementById('timerPage').style.display = 'none';
            if (timerInterval) {
                clearInterval(timerInterval);
            }
            if (quoteInterval) {
                clearInterval(quoteInterval);
            }
        }

        function toggleTheme() {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            const themeButton = document.querySelector('.theme-toggle');
            themeButton.textContent = isLight ? '☀️' : '🌓';
            
            // Save theme preference
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem('theme', isLight ? 'light' : 'dark');
            }
        }

        function loadThemePreference() {
            if (typeof(Storage) !== "undefined") {
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme === 'light') {
                    document.body.classList.add('light-mode');
                    document.querySelector('.theme-toggle').textContent = '☀️';
                }
            }
        }

        function getExamStatus(examDate) {
            const now = new Date();
            const timeDiff = examDate.getTime() - now.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            if (daysDiff <= 0) return 'completed';
            if (daysDiff <= 7) return 'critical';
            if (daysDiff <= 30) return 'urgent';
            return 'upcoming';
        }

        function getStatusBadge(status) {
            const badges = {
                upcoming: '<span class="status-badge status-upcoming">Upcoming</span>',
                urgent: '<span class="status-badge status-urgent">Urgent</span>',
                critical: '<span class="status-badge status-critical">Critical</span>',
                completed: '<span class="status-badge status-completed">Completed</span>'
            };
            return badges[status] || '';
        }

        function updateMenuBadges() {
            const menuItems = document.querySelectorAll('.menu-item h3');
            const examIds = ['itspecialist', 'az900', 'az204', 'az400'];
            
            menuItems.forEach((item, index) => {
                const examId = examIds[index];
                const exam = examData[examId];
                const status = getExamStatus(exam.date);
                const badge = getStatusBadge(status);
                
                // Remove existing badges
                const existingBadge = item.querySelector('.status-badge');
                if (existingBadge) existingBadge.remove();
                
                // Add new badge
                if (badge) {
                    item.innerHTML += ' ' + badge;
                }
            });
        }

        function toggleMenu() {
            const menu = document.getElementById('hiddenMenu');
            const overlay = document.getElementById('overlay');
            menu.classList.toggle('open');
            overlay.classList.toggle('active');
        }

        function closeMenu() {
            const menu = document.getElementById('hiddenMenu');
            const overlay = document.getElementById('overlay');
            menu.classList.remove('open');
            overlay.classList.remove('active');
        }

        function selectExam(examId) {
            currentExam = examId;
            const exam = examData[examId];
            
            // Save selected exam
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem('selectedExam', examId);
            }
            
            // Generate study resources HTML
            const resourcesHtml = exam.resources.map(resource => 
                `<a href="${resource.url}" class="resource-link" target="_blank" rel="noopener noreferrer">
                    <span>${resource.icon}</span>
                    <span>${resource.name}</span>
                    <span>↗</span>
                </a>`
            ).join('');
            
            // Update exam details
            const examDetails = document.getElementById('examDetails');
            examDetails.innerHTML = `
                <h1>${exam.title}</h1>
                <p>${exam.description}</p>
                <div class="exam-info">
                    <h3>Exam Information</h3>
                    <p>${exam.info}</p>
                    <p><strong>Exam Date:</strong> ${exam.date.toLocaleDateString()} at ${exam.date.toLocaleTimeString()}</p>
                </div>
                <div class="study-resources">
                    <h4>📚 Study Resources</h4>
                    <div class="resource-links">
                        ${resourcesHtml}
                    </div>
                </div>
                <div class="motivational-quote" id="motivationalQuote">
                    <div class="quote-text">"${motivationalQuotes[currentQuoteIndex].text}"</div>
                    <div class="quote-author">— ${motivationalQuotes[currentQuoteIndex].author}</div>
                </div>
            `;
            
            // Start countdown timer
            if (timerInterval) {
                clearInterval(timerInterval);
            }
            
            updateTimer();
            timerInterval = setInterval(updateTimer, 1000);
            
            // Close menu
            closeMenu();
        }

        function startQuoteRotation() {
            if (quoteInterval) clearInterval(quoteInterval);
            
            quoteInterval = setInterval(() => {
                if (currentExam) {
                    currentQuoteIndex = (currentQuoteIndex + 1) % motivationalQuotes.length;
                    const quoteElement = document.getElementById('motivationalQuote');
                    if (quoteElement) {
                        quoteElement.innerHTML = `
                            <div class="quote-text">"${motivationalQuotes[currentQuoteIndex].text}"</div>
                            <div class="quote-author">— ${motivationalQuotes[currentQuoteIndex].author}</div>
                        `;
                    }
                }
            }, 10000); // Change quote every 10 seconds
        }
// Function to update SVG progress ring
function updateProgressRing(elementId, current, max) {
    const circle = document.getElementById(elementId);
    if (!circle) return;

    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const progress = current / max;
    const dashArray = `${circumference * progress} ${circumference}`;
    circle.style.strokeDasharray = dashArray;
}

// Function to display exam details and start countdown
function showExamDetails(exam) {
    const examDetails = document.getElementById('examDetails');
    if (!examDetails) return;

    examDetails.innerHTML = `
        <h1>${exam.title}</h1>
        <p>${exam.description}</p>
        <div class="exam-info">
            <h3>Exam Information</h3>
            <p>${exam.info}</p>
            <p><strong>Exam Date:</strong> ${exam.date.toLocaleDateString()} at ${exam.date.toLocaleTimeString()}</p>
        </div>
    `;

    // Start countdown timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    updateTimer(); // Ensure this function is defined elsewhere
    timerInterval = setInterval(updateTimer, 1000);

    // Close menu
    closeMenu(); // Ensure this function is defined elsewhere
}


        function updateTimer() {
            if (!currentExam) return;
            
            const examDate = examData[currentExam].date;
            const now = new Date().getTime();
            const distance = examDate.getTime() - now;
            
            if (distance < 0) {
                document.getElementById('days').textContent = '00';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        }

        // Initialize with default timer display
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
  