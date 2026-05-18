// Navbar Hamburger Functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Carousel Functionality
    const carousel = {
        track: document.getElementById('carouselTrack'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        currentIndex: 0,
        cardWidth: 0,
        gap: 24,
        
        init: function() {
            // Cegah error jika elemen carousel tidak ditemukan (misal di halaman form-laporan)
            if (!this.track || !this.prevBtn || !this.nextBtn) return;

            this.prevBtn.addEventListener('click', () => this.prev());
            this.nextBtn.addEventListener('click', () => this.next());
            this.updateCardWidth();
            window.addEventListener('resize', () => this.updateCardWidth());
        },
        
        updateCardWidth: function() {
            const cards = this.track.querySelectorAll('.service-card');
            if (cards.length === 0) return;
            
            const containerWidth = this.track.parentElement.offsetWidth;
            
            // Responsive card width calculation
            if (window.innerWidth >= 1024) {
                this.cardWidth = (containerWidth - this.gap * 2) / 3;
            } else if (window.innerWidth >= 768) {
                this.cardWidth = (containerWidth - this.gap) / 2;
            } else {
                this.cardWidth = containerWidth;
            }
            
            this.moveToSlide(this.currentIndex);
        },
        
        getVisibleCards: function() {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 768) return 2;
            return 1;
        },
        
        getMaxIndex: function() {
            const cards = this.track.querySelectorAll('.service-card');
            const visibleCards = this.getVisibleCards();
            return Math.max(0, cards.length - visibleCards);
        },
        
        moveToSlide: function(index) {
            const maxIndex = this.getMaxIndex();
            this.currentIndex = Math.max(0, Math.min(index, maxIndex));
            
            const offset = -(this.currentIndex * (this.cardWidth + this.gap));
            this.track.style.transform = `translateX(${offset}px)`;
            
            this.updateButtonStates();
        },
        
        updateButtonStates: function() {
            const maxIndex = this.getMaxIndex();
            
            this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
            this.prevBtn.style.cursor = this.currentIndex === 0 ? 'not-allowed' : 'pointer';
            
            this.nextBtn.style.opacity = this.currentIndex >= maxIndex ? '0.5' : '1';
            this.nextBtn.style.cursor = this.currentIndex >= maxIndex ? 'not-allowed' : 'pointer';
        },
        
        next: function() {
            if (this.currentIndex < this.getMaxIndex()) {
                this.moveToSlide(this.currentIndex + 1);
            }
        },
        
        prev: function() {
            if (this.currentIndex > 0) {
                this.moveToSlide(this.currentIndex - 1);
            }
        }
    };
    
    carousel.init();

    // Audio Player Functionality
    const bgAudio = document.getElementById('bgAudio');
    const audioToggleBtn = document.getElementById('audioToggleBtn');
    const iconUnmuted = document.getElementById('icon-unmuted');
    const iconMuted = document.getElementById('icon-muted');

    if (bgAudio && audioToggleBtn) {
        bgAudio.volume = 0.5;

        // Coba putar otomatis saat halaman dimuat:
        let playPromise = bgAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Autoplay tertahan oleh browser. Menunggu interaksi user...');
            });
        }
        const playAudioOnInteract = () => {
            if (bgAudio.paused && !audioToggleBtn.classList.contains('muted')) {
                bgAudio.play().catch(e => console.log('Autoplay prevented:', e));
            }
            document.removeEventListener('click', playAudioOnInteract);
        };
        document.addEventListener('click', playAudioOnInteract);

        audioToggleBtn.addEventListener('click', function() {
            if (bgAudio.paused) {
                bgAudio.play();
                audioToggleBtn.classList.remove('muted');
                iconUnmuted.style.display = 'block';
                iconMuted.style.display = 'none';
            } else {
                bgAudio.pause();
                audioToggleBtn.classList.add('muted');
                iconUnmuted.style.display = 'none';
                iconMuted.style.display = 'block';
            }
        });
    }
});
