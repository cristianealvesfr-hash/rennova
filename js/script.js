document.addEventListener('DOMContentLoaded', () => {
    
    // Inicialização do AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('ph-list');
                icon.classList.add('ph-x');
            } else {
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            }
        });
    }

    // Fechar menu mobile ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            }
        });
    });

    // Mudar estilo do Header ao rolar a página
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Destacar o link ativo no menu baseado na seção atual
        updateActiveNavLink();
    });

    // Smooth Scroll para os links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Função para atualizar o link ativo no menu durante o scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + header.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Inicialização da verificação do link ativo ao carregar
    updateActiveNavLink();

    // =========================================================================
    // LGPD Banner Logic
    // =========================================================================
    const lgpdBanner = document.getElementById('lgpdBanner');
    const lgpdAccept = document.getElementById('lgpdAccept');

    if (lgpdBanner && lgpdAccept) {
        // Check if user already accepted
        const hasAccepted = localStorage.getItem('lgpdConsent');
        
        if (!hasAccepted) {
            // Wait a bit before showing to make it smoother
            setTimeout(() => {
                lgpdBanner.classList.add('visible');
            }, 1000);
        }

        lgpdAccept.addEventListener('click', () => {
            localStorage.setItem('lgpdConsent', 'true');
            lgpdBanner.classList.remove('visible');
        });
    }


    // =========================================================================
    // Chat Widget Logic
    // =========================================================================
    const chatBubble = document.getElementById('chatBubble');
    const chatTooltip = document.getElementById('chatTooltip');
    const chatTooltipClose = document.getElementById('chatTooltipClose');
    const chatWindow = document.getElementById('chatWindow');
    const chatWindowClose = document.getElementById('chatWindowClose');
    const chatNewConversation = document.getElementById('chatNewConversation');
    const chatFormWindow = document.getElementById('chatFormWindow');
    const chatFormClose = document.getElementById('chatFormClose');
    const chatBackBtn = document.getElementById('chatBackBtn');
    const chatForm = document.getElementById('chatForm');
    const chatBubbleWrapper = document.getElementById('chatBubbleWrapper');

    // Show tooltip automatically after 2 seconds
    if (chatTooltip) {
        setTimeout(() => {
            chatTooltip.classList.add('visible');
        }, 2000);
    }

    // Close tooltip
    if (chatTooltipClose) {
        chatTooltipClose.addEventListener('click', (e) => {
            e.stopPropagation();
            chatTooltip.classList.remove('visible');
            chatTooltip.classList.add('hidden');
        });
    }

    // Step 1 → Step 2: Click bubble → open chat window
    if (chatBubble) {
        chatBubble.addEventListener('click', () => {
            chatBubbleWrapper.style.display = 'none';
            chatFormWindow.classList.remove('active');
            chatWindow.classList.add('active');
        });
    }

    // Close chat window → back to bubble
    if (chatWindowClose) {
        chatWindowClose.addEventListener('click', () => {
            chatWindow.classList.remove('active');
            chatBubbleWrapper.style.display = 'flex';
        });
    }

    // Step 2 → Step 3: Click "Nova conversa" → open form
    if (chatNewConversation) {
        chatNewConversation.addEventListener('click', () => {
            chatWindow.classList.remove('active');
            chatFormWindow.classList.add('active');
        });
    }

    // Step 3 → Step 2: Click back arrow
    if (chatBackBtn) {
        chatBackBtn.addEventListener('click', () => {
            chatFormWindow.classList.remove('active');
            chatWindow.classList.add('active');
        });
    }

    // Close form window → back to bubble
    if (chatFormClose) {
        chatFormClose.addEventListener('click', () => {
            chatFormWindow.classList.remove('active');
            chatBubbleWrapper.style.display = 'flex';
        });
    }

    // Submit form → redirect to WhatsApp
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('chatName').value.trim();
            const email = document.getElementById('chatEmail').value.trim();
            const message = document.getElementById('chatMessage').value.trim();

            // Build WhatsApp message
            let whatsappMessage = `Olá, Rennova Contabilidade! Meu nome é ${name}.`;
            if (email) {
                whatsappMessage += ` Meu e-mail: ${email}.`;
            }
            if (message) {
                whatsappMessage += ` ${message}`;
            }

            // WhatsApp number: 61 98641-6001
            const whatsappNumber = '5561986416001';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

            window.open(whatsappUrl, '_blank');

            // Reset form and go back to bubble
            chatForm.reset();
            chatFormWindow.classList.remove('active');
            chatBubbleWrapper.style.display = 'flex';
        });
    }
});
