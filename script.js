document.addEventListener('DOMContentLoaded', () => {
    const allButtons = document.querySelectorAll('.quiz-btn');

    allButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentQuizBlock = this.closest('.quiz-block');
            
            if (currentQuizBlock.classList.contains('answered')) return;
            currentQuizBlock.classList.add('answered');

            // 1. Glow green or red
            const isCorrect = this.getAttribute('data-correct') === 'true';
            if (isCorrect) {
                this.classList.add('correct');
            } else {
                this.classList.add('wrong');
            }

            // 2. Determine next quiz
            let nextQuizId = null;
            if (currentQuizBlock.id === 'quiz-1') nextQuizId = 'quiz-2';
            else if (currentQuizBlock.id === 'quiz-2') nextQuizId = 'quiz-3';

            // 3. Unlock and Auto-Scroll
            if (nextQuizId) {
                const nextQuizBlock = document.getElementById(nextQuizId);
                
                // Wait 1 second so they can see their result
                setTimeout(() => {
                    // Remove the lock
                    nextQuizBlock.classList.remove('locked');
                    
                    // Smoothly scroll the page so the next quiz is in the center of the screen
                    nextQuizBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                }, 1000); // 1000 milliseconds = 1 second
            }
        });
    });
});

/* --- UNLOCK QUIZ 1 LOGIC (ONE-TIME UNLOCK) --- */
document.addEventListener('DOMContentLoaded', () => {
    
    const unlockBtn = document.getElementById('unlock-quiz-btn');
    const quiz1 = document.getElementById('quiz-1');

    // 1. CHECK ON PAGE LOAD: Did the user just come from clicking the link?
    if (quiz1 && localStorage.getItem('quiz1Unlocked') === 'true') {
        
        // UNLOCK the quiz for this current view
        quiz1.classList.remove('locked');

        // Remove the key
        localStorage.removeItem('quiz1Unlocked');

        // NEW: Show the Toast Notification!
        const toast = document.getElementById("toast-notification"); // targets the first toast
        if (toast) {
            // Wait half a second for the page to load, then pop it up
            setTimeout(() => {
                toast.classList.add("show");
            }, 500);

            // Hide it again after 4.5 seconds
            setTimeout(() => {
                toast.classList.remove("show");
            }, 4500);
        }
    }

    // 2. WHEN THEY CLICK THE LINK: Provide the "key" for the next load
    if (unlockBtn) {
        unlockBtn.addEventListener('click', () => {
            localStorage.setItem('quiz1Unlocked', 'true');
        });
    }
});

/* --- 6. MIX & MATCH LOGIC (FIXED POSITIONING) --- */
document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable-cloth');
    const dropZone = document.getElementById('mix-match-section');

    let activeItem = null;
    let offsetX = 0;
    let offsetY = 0;

    function startDrag(item, clientX, clientY) {
        if (dropZone.classList.contains('locked')) return;

        activeItem = item;

        const rect = item.getBoundingClientRect();
        const zoneRect = dropZone.getBoundingClientRect();

        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;

        if (!item.classList.contains('freely-placed')) {
            item.classList.add('freely-placed');
            dropZone.appendChild(item);
        }

        item.style.left = `${clientX - zoneRect.left - offsetX}px`;
        item.style.top = `${clientY - zoneRect.top - offsetY}px`;
        item.style.zIndex = 1000;
    }

    function moveDrag(clientX, clientY) {
        if (!activeItem) return;

        const zoneRect = dropZone.getBoundingClientRect();

        let newLeft = clientX - zoneRect.left - offsetX;
        let newTop = clientY - zoneRect.top - offsetY;

        activeItem.style.left = `${newLeft}px`;
        activeItem.style.top = `${newTop}px`;
    }

    function endDrag() {
        activeItem = null;
    }

    draggables.forEach(item => {

        item.addEventListener('dragstart', (e) => e.preventDefault());

        /* DESKTOP */
        item.addEventListener('mousedown', (e) => {
            startDrag(item, e.clientX, e.clientY);
        });

        /* MOBILE */
        item.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startDrag(item, touch.clientX, touch.clientY);
        });

    });

    /* DESKTOP */
    document.addEventListener('mousemove', (e) => {
        moveDrag(e.clientX, e.clientY);
    });

    document.addEventListener('mouseup', endDrag);

    /* MOBILE */
    document.addEventListener('touchmove', (e) => {
    if (!activeItem) return;

    e.preventDefault(); // STOPS PAGE SCROLLING

    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
    }, { passive: false });

    document.addEventListener('touchend', endDrag);
});


/* --- UNLOCK MIX & MATCH LOGIC (ANY ANSWER) --- */
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Select ALL buttons inside the LAST quiz (quiz-3)
    const finalQuizButtons = document.querySelectorAll('#quiz-3 .quiz-btn'); 
    const mixMatchSection = document.getElementById('mix-match-section');
    const unlockToast = document.getElementById('unlock-toast'); // Targets the second toast

    finalQuizButtons.forEach(button => {
        button.addEventListener('click', () => {
            
            // We want a slight delay so the user sees if they were 
            // right or wrong (green/red) before the section unlocks
            setTimeout(() => {
                if (mixMatchSection) {
                    // 2. Remove the lock regardless of the answer
                    mixMatchSection.classList.remove('locked');

                    // 3. SHOW THE TOAST
                    if (unlockToast) {
                        unlockToast.classList.add('show');
                        
                        // Automatically hide the toast after 5 seconds
                        setTimeout(() => {
                            unlockToast.classList.remove('show');
                        }, 5000); 
                    }

                    // 4. Smoothly scroll down to the game
                    mixMatchSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start' 
                    });
                }
            }, 1000); // 1 second delay for feedback

        });
    });
});

/* --- PROGRESS BAR LOGIC --- */
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").style.width = scrolled + "%";
});

/* --- CATEGORY NAVIGATION & SLIDE ANIMATION LOGIC --- */
document.addEventListener('DOMContentLoaded', () => {
    const categoryButtons = Array.from(document.querySelectorAll('.cat-btn'));
    const allSlots = Array.from(document.querySelectorAll('.cloth-slot'));
    const prevArrow = document.querySelector('.carousel-arrows .arrow:nth-child(1)');
    const nextArrow = document.querySelector('.carousel-arrows .arrow:nth-child(2)');
    const gridContainer = document.querySelector('.outfit-grid-free');

    // Define the order of your categories
    const categories = ['tops', 'pants', 'shoes', 'bags'];
    let currentCategoryIndex = 0; // Starts at 0 ('tops')

    function renderGrid(direction = 'none') {
        const targetCategory = categories[currentCategoryIndex];

        // 1. Update the Pill Menu active button
        categoryButtons.forEach(btn => {
            if (btn.getAttribute('data-target') === targetCategory) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // 2. Handle the Slide Animation
        // Remove old animation classes so they can be re-triggered
        gridContainer.classList.remove('slide-next', 'slide-prev');
        
        // This is a neat trick to force the browser to reset the animation
        void gridContainer.offsetWidth; 

        if (direction === 'next') {
            gridContainer.classList.add('slide-next'); // Slides in from the right
        } else if (direction === 'prev') {
            gridContainer.classList.add('slide-prev'); // Slides in from the left
        }

        // 3. Show the correct clothes slots
        allSlots.forEach(slot => {
            if (slot.getAttribute('data-category') === targetCategory) {
                slot.style.display = 'flex'; 
            } else {
                slot.style.display = 'none'; 
            }
        });
    }

    // --- BUTTON CLICKS ---

    // Pill Menu Clicks
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const newTarget = btn.getAttribute('data-target');
            const newIndex = categories.indexOf(newTarget);
            
            // Determine which way to slide based on menu order
            let direction = 'none';
            if (newIndex > currentCategoryIndex) direction = 'next';
            if (newIndex < currentCategoryIndex) direction = 'prev';
            
            currentCategoryIndex = newIndex;
            renderGrid(direction);
        });
    });

    // Arrow Clicks
    if (prevArrow && nextArrow) {
        prevArrow.addEventListener('click', () => {
            currentCategoryIndex--;
            // If we go past 'tops', loop around to 'bags'
            if (currentCategoryIndex < 0) currentCategoryIndex = categories.length - 1; 
            renderGrid('prev');
        });

        nextArrow.addEventListener('click', () => {
            currentCategoryIndex++;
            // If we go past 'bags', loop around to 'tops'
            if (currentCategoryIndex >= categories.length) currentCategoryIndex = 0; 
            renderGrid('next');
        });
    }

    // Run once on page load
    renderGrid();
});
