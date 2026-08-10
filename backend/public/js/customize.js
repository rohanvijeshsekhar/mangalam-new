// Customize Popup Functionality
(function() {
    'use strict';

    // State management
    let customizeState = {
        currentStep: 1,
        totalSteps: 6,
        destinationId: null,
        destinationName: null,
        destinationSlug: null,
        data: {
            fromDate: null,
            toDate: null,
            adults: 1,
            children: 0,
            childrenAges: [],
            hotelType: '3 Star',
            hotelRemark: null,
            selectedExperiences: [],
            name: null,
            email: null,
            phone: null
        }
    };

    let customizeOtp = null;

    // DOM Elements
    const popup = document.getElementById('customizePopup');
    const shimmer = document.getElementById('customizeShimmer');
    const closeBtn = document.getElementById('closeCustomizePopup');
    const nextBtn = document.getElementById('customizeNext');
    const prevBtn = document.getElementById('customizePrev');
    const frames = document.querySelectorAll('.customize-frame');
    const frameAnimationTimers = new WeakMap();
    const progressBar = document.getElementById('customizeProgressBar');
    const progressStep = document.getElementById('customizeProgressStep');
    const progressPercent = document.getElementById('customizeProgressPercent');
    const progressLabel = document.getElementById('customizeProgressLabel');
    const popupHeading = document.getElementById('popupHeading');
    const selectedDestinationName = document.getElementById('selectedDestinationName');
    const successPopup = document.getElementById('customizeSuccessPopup');

    // Initialize
    function init() {
        // Close button
        if (closeBtn) {
            closeBtn.addEventListener('click', closePopup);
        }
        if (shimmer) {
            shimmer.addEventListener('click', closePopup);
        }

        // Navigation buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', handleNext);
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', handlePrev);
        }

        // Date inputs
        const fromDate = document.getElementById('fromDate');
        const toDate = document.getElementById('toDate');
        if (fromDate && toDate) {
            fromDate.addEventListener('change', function() {
                toDate.min = this.value;
                if (toDate.value && toDate.value < this.value) {
                    toDate.value = this.value;
                }
            });
        }

        // People counter
        setupPeopleCounter();

        // Hotel selection
        setupHotelSelection();

        // Experience search
        const searchInput = document.getElementById('searchExperiences');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                filterExperiences(this.value.toLowerCase());
            });
        }

        // Edit buttons in overview
        document.querySelectorAll('.customize-edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const goToStep = parseInt(this.getAttribute('data-go'));
                goToStepNumber(goToStep);
            });
        });

        // Success popup close
        const closeSuccessBtn = document.getElementById('closeSuccessPopup');
        if (closeSuccessBtn) {
            closeSuccessBtn.addEventListener('click', function() {
                if (successPopup) {
                    successPopup.classList.add('customize-popup-hidden', 'hidden');
                    successPopup.classList.remove('customize-popup-visible', 'flex');
                }
                document.body.style.overflow = 'auto';
                closePopup();
            });
        }

        if (window.EnquiryOtp) {
            customizeOtp = EnquiryOtp.getInstance('customize');
        }
    }

    // Setup people counter
    function setupPeopleCounter() {
        const adultPlus = document.getElementById('adultPlus');
        const adultMinus = document.getElementById('adultMinus');
        const adultCount = document.getElementById('adultCount');
        const childPlus = document.getElementById('childPlus');
        const childMinus = document.getElementById('childMinus');
        const childCount = document.getElementById('childCount');
        const childrenAgesContainer = document.getElementById('childrenAgesContainer');
        const childrenAgesWrap = document.getElementById('childrenAgesWrap');

        if (adultPlus) {
            adultPlus.addEventListener('click', () => {
                adultCount.value = parseInt(adultCount.value) + 1;
            });
        }
        if (adultMinus) {
            adultMinus.addEventListener('click', () => {
                if (parseInt(adultCount.value) > 1) {
                    adultCount.value = parseInt(adultCount.value) - 1;
                }
            });
        }
        if (childPlus) {
            childPlus.addEventListener('click', () => {
                const currentValue = parseInt(childCount.value) + 1;
                childCount.value = currentValue;
                updateChildrenAges(currentValue);
                if (childrenAgesContainer) childrenAgesContainer.classList.remove('customize-children-ages-hidden', 'hidden');
            });
        }
        if (childMinus) {
            childMinus.addEventListener('click', () => {
                const currentValue = Math.max(0, parseInt(childCount.value) - 1);
                childCount.value = currentValue;
                updateChildrenAges(currentValue);
                if (currentValue === 0 && childrenAgesContainer) {
                    childrenAgesContainer.classList.add('customize-children-ages-hidden', 'hidden');
                }
            });
        }
    }

    // Update children ages inputs
    function updateChildrenAges(count) {
        const childrenAgesWrap = document.getElementById('childrenAgesWrap');
        if (!childrenAgesWrap) return;

        childrenAgesWrap.innerHTML = '';
        for (let i = 1; i <= count; i++) {
            const ageInputDiv = document.createElement('div');
            ageInputDiv.className = 'space-y-2';
            ageInputDiv.innerHTML = `
                <label class="block text-sm font-semibold text-gray-700 font-dm-sans">Child ${i} Age</label>
                <input type="number" id="child-age-${i}" min="3" max="12" 
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-dm-sans" 
                       placeholder="Age (3-12)" required>
            `;
            childrenAgesWrap.appendChild(ageInputDiv);
        }
    }

    // Setup hotel selection
    function setupHotelSelection() {
        const hotelCategories = document.querySelectorAll('.customize-hotel-category');
        const hotelRemark = document.getElementById('hotelRemark');
        const hotelRemarkText = document.getElementById('hotelRemarkText');

        hotelCategories.forEach(category => {
            category.addEventListener('click', function() {
                hotelCategories.forEach(cat => {
                    cat.classList.remove('customize-hotel-category-active', 'border-red-500');
                    cat.classList.add('customize-hotel-category-inactive', 'border-gray-300');
                    // Reset icon color
                    const icon = cat.querySelector('i.fi-sr-hotel');
                    if (icon) {
                        icon.classList.remove('text-red-500');
                        icon.classList.add('text-gray-700');
                    }
                });
                this.classList.add('customize-hotel-category-active', 'border-red-500');
                this.classList.remove('customize-hotel-category-inactive', 'border-gray-300');
                // Set active icon color
                const activeIcon = this.querySelector('i.fi-sr-hotel');
                if (activeIcon) {
                    activeIcon.classList.remove('text-gray-700');
                    activeIcon.classList.add('text-red-500');
                }

                const hotelType = this.getAttribute('data-type');
                customizeState.data.hotelType = hotelType;

                if (this.classList.contains('customize-hotel-remark-trigger')) {
                    if (hotelRemark) hotelRemark.classList.remove('customize-hotel-remark-hidden', 'hidden');
                } else {
                    if (hotelRemark) hotelRemark.classList.add('customize-hotel-remark-hidden', 'hidden');
                    if (hotelRemarkText) hotelRemarkText.value = '';
                }
            });
        });

        if (hotelRemarkText) {
            hotelRemarkText.addEventListener('input', function() {
                customizeState.data.hotelRemark = this.value;
            });
        }
    }

    // Open popup
    function openPopup(destinationSlug, destinationName, destinationId) {
        if (!popup) return;

        // Reset state
        resetState();
        
        // Set destination
        customizeState.destinationSlug = destinationSlug;
        customizeState.destinationName = destinationName;
        customizeState.destinationId = destinationId;

        // Update UI
        if (selectedDestinationName) {
            selectedDestinationName.textContent = destinationName || 'Selected Destination';
        }

        // Show popup
        popup.classList.remove('customize-popup-hidden', 'hidden');
        popup.classList.add('customize-popup-visible', 'flex');
        document.body.style.overflow = 'hidden';

        // Go to step 1 (date selection)
        goToStepNumber(1);

        // Load experiences for the destination
        if (destinationId) {
            loadExperiences(destinationId);
        }
    }

    // Close popup
    function closePopup() {
        if (!popup) return;
        popup.classList.add('customize-popup-hidden', 'hidden');
        popup.classList.remove('customize-popup-visible', 'flex');
        document.body.style.overflow = 'auto';
        resetState();
    }

    // Reset state
    function resetState() {
        customizeState.currentStep = 1;
        customizeState.destinationId = null;
        customizeState.destinationName = null;
        customizeState.destinationSlug = null;
        customizeState.data = {
            fromDate: null,
            toDate: null,
            adults: 1,
            children: 0,
            childrenAges: [],
            hotelType: '3 Star',
            hotelRemark: null,
            selectedExperiences: [],
            name: null,
            email: null,
            phone: null
        };

        if (customizeOtp) customizeOtp.reset();

        // Reset form
        const fromDate = document.getElementById('fromDate');
        const toDate = document.getElementById('toDate');
        const adultCount = document.getElementById('adultCount');
        const childCount = document.getElementById('childCount');
        const childrenAgesContainer = document.getElementById('childrenAgesContainer');

        if (fromDate) fromDate.value = '';
        if (toDate) toDate.value = '';
        if (adultCount) adultCount.value = '1';
        if (childCount) childCount.value = '0';
        if (childrenAgesContainer) {
            childrenAgesContainer.classList.add('customize-children-ages-hidden', 'hidden');
            document.getElementById('childrenAgesWrap').innerHTML = '';
        }

        // Reset hotel selection
        const hotelCategories = document.querySelectorAll('.customize-hotel-category');
        hotelCategories.forEach(cat => {
            cat.classList.remove('customize-hotel-category-active', 'border-red-500');
            cat.classList.add('customize-hotel-category-inactive', 'border-gray-300');
            // Reset icon color
            const icon = cat.querySelector('i.fi-sr-hotel');
            if (icon) {
                icon.classList.remove('text-red-500');
                icon.classList.add('text-gray-700');
            }
        });
        const activeHotel = document.querySelector('.customize-hotel-category[data-type="3 Star"]');
        if (activeHotel) {
            activeHotel.classList.add('customize-hotel-category-active', 'border-red-500');
            activeHotel.classList.remove('customize-hotel-category-inactive', 'border-gray-300');
            // Set active icon color
            const activeIcon = activeHotel.querySelector('i.fi-sr-hotel');
            if (activeIcon) {
                activeIcon.classList.remove('text-gray-700');
                activeIcon.classList.add('text-red-500');
            }
        }
    }

    // Go to step number
    function goToStepNumber(step) {
        if (step < 1 || step > customizeState.totalSteps) return;

        customizeState.currentStep = step;
        updateUI();
    }

    // Update UI
    function updateUI() {
        const currentFrame = document.getElementById(`step${customizeState.currentStep}`);

        frames.forEach(frame => {
            const existingTimer = frameAnimationTimers.get(frame);
            if (existingTimer) {
                clearTimeout(existingTimer);
                frameAnimationTimers.delete(frame);
            }

            if (frame === currentFrame) {
                frame.classList.remove('customize-frame-hidden', 'hidden', 'customize-frame-animate-out');
                frame.classList.add('customize-frame-active', 'customize-frame-animate-in');
                const timerId = setTimeout(() => {
                    frame.classList.remove('customize-frame-animate-in');
                    frameAnimationTimers.delete(frame);
                }, 350);
                frameAnimationTimers.set(frame, timerId);
            } else if (frame.classList.contains('customize-frame-active')) {
                frame.classList.remove('customize-frame-animate-in');
                frame.classList.add('customize-frame-animate-out');
                const timerId = setTimeout(() => {
                    frame.classList.add('customize-frame-hidden', 'hidden');
                    frame.classList.remove('customize-frame-active', 'customize-frame-animate-out');
                    frameAnimationTimers.delete(frame);
                }, 250);
                frameAnimationTimers.set(frame, timerId);
            } else {
                frame.classList.add('customize-frame-hidden', 'hidden');
                frame.classList.remove('customize-frame-active', 'customize-frame-animate-in', 'customize-frame-animate-out');
            }
        });

        let headingText = null;
        if (currentFrame && popupHeading) {
            const heading = currentFrame.getAttribute('data-heading');
            if (heading) {
                headingText = heading;
                popupHeading.textContent = heading;
            }
        }

        if (headingText && progressLabel) {
            progressLabel.textContent = headingText;
        }

        // Update progress
        updateProgress();

        // Update button text
        if (nextBtn) {
            if (customizeState.currentStep === customizeState.totalSteps) {
                nextBtn.textContent = 'Submit';
            } else {
                nextBtn.textContent = 'Continue';
            }
        }

        // Show/hide prev button
        if (prevBtn) {
            if (customizeState.currentStep === 1) {
                prevBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'block';
            }
        }

        // Special handling for step 5 (overview)
        if (customizeState.currentStep === 5) {
            updateOverview();
        }
    }

    // Update progress
    function updateProgress() {
        const ratio = customizeState.totalSteps > 0
            ? customizeState.currentStep / customizeState.totalSteps
            : 0;
        const percent = Math.round(ratio * 100);

        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
        if (progressStep) {
            progressStep.textContent = `Step ${customizeState.currentStep} of ${customizeState.totalSteps}`;
        }
        if (progressPercent) {
            progressPercent.textContent = `${percent}%`;
        }
    }

    // Handle next
    function handleNext() {
        if (!validateCurrentStep()) {
            return;
        }

        collectCurrentStepData();

        if (customizeState.currentStep === customizeState.totalSteps) {
            submitForm();
        } else {
            goToStepNumber(customizeState.currentStep + 1);
        }
    }

    // Handle prev
    function handlePrev() {
        if (customizeState.currentStep === 1) {
            closePopup();
        } else {
            goToStepNumber(customizeState.currentStep - 1);
        }
    }

    // Validate current step
    function validateCurrentStep() {
        const step = customizeState.currentStep;
        
        switch(step) {
            case 1: // Date
                const fromDate = document.getElementById('fromDate').value;
                const toDate = document.getElementById('toDate').value;
                if (!fromDate || !toDate) {
                    alert('Please select both from and to dates');
                    return false;
                }
                if (new Date(toDate) < new Date(fromDate)) {
                    alert('To date must be after from date');
                    return false;
                }
                return true;

            case 2: // People
                const adults = parseInt(document.getElementById('adultCount').value) || 0;
                const children = parseInt(document.getElementById('childCount').value) || 0;
                if (adults <= 0 && children <= 0) {
                    alert('Please select at least one traveler');
                    return false;
                }
                if (children > 0) {
                    const childrenAges = [];
                    for (let i = 1; i <= children; i++) {
                        const ageInput = document.getElementById(`child-age-${i}`);
                        if (!ageInput || !ageInput.value) {
                            alert(`Please enter age for child ${i}`);
                            ageInput?.focus();
                            return false;
                        }
                        const age = parseInt(ageInput.value);
                        if (age < 3 || age > 12) {
                            alert(`Child ${i} age must be between 3 and 12 years`);
                            ageInput.focus();
                            return false;
                        }
                        childrenAges.push(age);
                    }
                }
                return true;

            case 3: // Hotel
                return true; // Already selected

            case 4: // Experiences
                return true; // Optional

            case 5: // Overview
                return true;

            case 6: // Contact
                const name = document.getElementById('customizeName').value.trim();
                const email = document.getElementById('customizeEmail').value.trim();
                const phone = document.getElementById('customizePhone').value.trim();
                
                if (!name || !email || !phone) {
                    alert('Please fill in all required fields');
                    return false;
                }
                if (!isValidEmail(email)) {
                    alert('Please enter a valid email address');
                    return false;
                }
                return customizeOtp ? customizeOtp.requireVerified() : true;

            default:
                return true;
        }
    }

    // Collect current step data
    function collectCurrentStepData() {
        const step = customizeState.currentStep;

        switch(step) {
            case 1: // Date
                customizeState.data.fromDate = document.getElementById('fromDate').value;
                customizeState.data.toDate = document.getElementById('toDate').value;
                break;

            case 2: // People
                customizeState.data.adults = parseInt(document.getElementById('adultCount').value) || 1;
                customizeState.data.children = parseInt(document.getElementById('childCount').value) || 0;
                customizeState.data.childrenAges = [];
                for (let i = 1; i <= customizeState.data.children; i++) {
                    const ageInput = document.getElementById(`child-age-${i}`);
                    if (ageInput && ageInput.value) {
                        customizeState.data.childrenAges.push(parseInt(ageInput.value));
                    }
                }
                break;

            case 3: // Hotel
                const activeHotel = document.querySelector('.customize-hotel-category.customize-hotel-category-active');
                if (activeHotel) {
                    customizeState.data.hotelType = activeHotel.getAttribute('data-type');
                    if (customizeState.data.hotelType === 'false') {
                        customizeState.data.hotelRemark = document.getElementById('hotelRemarkText').value;
                    }
                }
                break;

            case 4: // Experiences
                // Already collected when selected
                break;

            case 6: // Contact
                customizeState.data.name = document.getElementById('customizeName').value.trim();
                customizeState.data.email = document.getElementById('customizeEmail').value.trim();
                customizeState.data.phone = document.getElementById('customizePhone').value.trim();
                break;
        }
    }

    // Load experiences
    function loadExperiences(destinationId) {
        const container = document.getElementById('experiencesContainer');
        const noExperiences = document.getElementById('noExperiences');
        
        if (!container) return;

        container.innerHTML = '<div class="col-span-full text-center py-8"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div></div>';

        fetch(`./action/fetchPlacesPopup.php?id=${destinationId}&search=`)
            .then(response => response.json())
            .then(data => {
                container.innerHTML = '';
                
                if (data && data.length > 0 && (data[0].place || data[0].activity || data[0].ticket)) {
                    const place = data[0].place || [];
                    const activity = data[0].activity || [];
                    const ticket = data[0].ticket || [];

                    [...place, ...activity, ...ticket].forEach(item => {
                        const card = document.createElement('div');
                        card.className = 'customize-experience-card customize-experience-unselected bg-white border-2 border-gray-300 rounded-xl overflow-hidden cursor-pointer hover:border-red-500 transition-all';
                        card.setAttribute('data-id', item.place_id || item.activity_id || item.ticket_id);
                        card.setAttribute('data-type', item.place_id ? 'place' : (item.activity_id ? 'activity' : 'ticket'));
                        card.setAttribute('data-name', item.place_name || item.title);
                        
                        const imageSrc = item.place_id ? 
                            `./admin/files/place/${item.image}` : 
                            (item.activity_id ? 
                                `./admin/files/activities/${item.image}` : 
                                `./admin/files/tickets/${item.image}`);
                        
                        card.innerHTML = `
                            <div class="relative h-32 overflow-hidden">
                                <img src="${imageSrc}" alt="${item.place_name || item.title}" class="w-full h-full object-cover">
                                <div class="customize-experience-check-wrapper absolute top-2 right-2 w-6 h-6 border-2 border-white rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm">
                                    <i class="fi fi-rr-check text-white text-xs customize-experience-check-icon customize-experience-check-hidden"></i>
                                </div>
                            </div>
                            <div class="p-3">
                                <div class="text-xs text-gray-500 font-dm-sans mb-1">${item.place_id ? 'Place' : (item.activity_id ? 'Activity' : 'Ticket')}</div>
                                <div class="text-sm font-semibold text-gray-800 font-dm-sans line-clamp-2">${item.place_name || item.title}</div>
                            </div>
                        `;

                        card.addEventListener('click', function() {
                            toggleExperienceSelection(this);
                        });

                        container.appendChild(card);
                    });

                    if (noExperiences) noExperiences.classList.add('customize-no-experiences-hidden', 'hidden');
                } else {
                    if (noExperiences) noExperiences.classList.remove('customize-no-experiences-hidden', 'hidden');
                }
            })
            .catch(error => {
                console.error('Error loading experiences:', error);
                container.innerHTML = '<div class="col-span-full text-center py-8 text-gray-500">Error loading experiences</div>';
            });
    }

    // Toggle experience selection
    function toggleExperienceSelection(card) {
        const isSelected = card.classList.contains('customize-experience-selected');
        const id = card.getAttribute('data-id');
        const type = card.getAttribute('data-type');
        const name = card.getAttribute('data-name');
        const image = card.querySelector('img').src;

        if (isSelected) {
            // Deselect card
            card.classList.remove('customize-experience-selected', 'customize-experience-selected-active', 'border-red-500');
            card.classList.add('customize-experience-unselected', 'border-gray-300');
            const checkWrapper = card.querySelector('.customize-experience-check-wrapper');
            const checkIcon = card.querySelector('.customize-experience-check-icon');
            if (checkWrapper) {
                checkWrapper.classList.remove('bg-red-500', 'border-red-500');
                checkWrapper.classList.add('bg-white/20', 'border-white');
            }
            if (checkIcon) checkIcon.classList.add('customize-experience-check-hidden', 'hidden');
            customizeState.data.selectedExperiences = customizeState.data.selectedExperiences.filter(
                exp => !(exp.id === id && exp.type === type)
            );
        } else {
            // Select card
            card.classList.add('customize-experience-selected', 'customize-experience-selected-active', 'border-red-500');
            card.classList.remove('customize-experience-unselected', 'border-gray-300');
            const checkWrapper = card.querySelector('.customize-experience-check-wrapper');
            const checkIcon = card.querySelector('.customize-experience-check-icon');
            if (checkWrapper) {
                checkWrapper.classList.remove('bg-white/20', 'border-white');
                checkWrapper.classList.add('bg-red-500', 'border-red-500');
            }
            if (checkIcon) checkIcon.classList.remove('customize-experience-check-hidden', 'hidden');
            customizeState.data.selectedExperiences.push({ id, type, name, image });
        }
    }

    // Filter experiences
    function filterExperiences(searchTerm) {
        const cards = document.querySelectorAll('.customize-experience-card');
        let matchCount = 0;

        cards.forEach(card => {
            const name = card.getAttribute('data-name').toLowerCase();
            if (name.includes(searchTerm)) {
                card.style.display = 'block';
                matchCount++;
            } else {
                card.style.display = 'none';
            }
        });

        const noExperiences = document.getElementById('noExperiences');
        if (noExperiences) {
            if (matchCount === 0) {
                noExperiences.classList.remove('customize-no-experiences-hidden', 'hidden');
            } else {
                noExperiences.classList.add('customize-no-experiences-hidden', 'hidden');
            }
        }
    }

    // Update overview
    function updateOverview() {
        // Destination name
        const overviewDestinationName = document.getElementById('overviewDestinationName');
        if (overviewDestinationName) {
            overviewDestinationName.textContent = customizeState.destinationName || 'Selected Destination';
        }

        // Dates
        const overviewDates = document.getElementById('overviewDates');
        if (overviewDates && customizeState.data.fromDate && customizeState.data.toDate) {
            const from = new Date(customizeState.data.fromDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            const to = new Date(customizeState.data.toDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            overviewDates.textContent = `${from} - ${to}`;
        }

        // Travelers
        const overviewTravelers = document.getElementById('overviewTravelers');
        if (overviewTravelers) {
            let text = `${customizeState.data.adults} Adult${customizeState.data.adults > 1 ? 's' : ''}`;
            if (customizeState.data.children > 0) {
                text += ` & ${customizeState.data.children} Child${customizeState.data.children > 1 ? 'ren' : ''}`;
            }
            overviewTravelers.textContent = text;
        }

        // Hotel
        const overviewHotel = document.getElementById('overviewHotel');
        if (overviewHotel) {
            if (customizeState.data.hotelType === 'false') {
                overviewHotel.textContent = customizeState.data.hotelRemark || 'Custom Preference';
            } else {
                overviewHotel.textContent = customizeState.data.hotelType;
            }
        }

        // Experiences
        const overviewExperiences = document.getElementById('overviewExperiences');
        if (overviewExperiences) {
            overviewExperiences.innerHTML = '';
            if (customizeState.data.selectedExperiences.length > 0) {
                customizeState.data.selectedExperiences.forEach(exp => {
                    const card = document.createElement('div');
                    card.className = 'bg-gray-50 border border-gray-200 rounded-xl overflow-hidden';
                    card.innerHTML = `
                        <div class="relative h-24 overflow-hidden">
                            <img src="${exp.image}" alt="${exp.name}" class="w-full h-full object-cover">
                        </div>
                        <div class="p-2">
                            <div class="text-xs font-semibold text-gray-800 font-dm-sans line-clamp-2">${exp.name}</div>
                        </div>
                    `;
                    overviewExperiences.appendChild(card);
                });
            } else {
                overviewExperiences.innerHTML = '<div class="col-span-full text-center py-4 text-gray-500 text-sm">No experiences selected</div>';
            }
        }
    }

    // Submit form
    function submitForm() {
        // Collect final data
        collectCurrentStepData();

        // Prepare submission data
        const submissionData = {
            destination_id: customizeState.destinationId,
            destination_name: customizeState.destinationName,
            destination_slug: customizeState.destinationSlug,
            from_date: customizeState.data.fromDate,
            to_date: customizeState.data.toDate,
            adults: customizeState.data.adults,
            children: customizeState.data.children,
            children_ages: customizeState.data.childrenAges,
            hotel_type: customizeState.data.hotelType === 'false' ? customizeState.data.hotelRemark : customizeState.data.hotelType,
            selected_experiences: customizeState.data.selectedExperiences,
            name: customizeState.data.name,
            email: customizeState.data.email,
            phone: customizeState.data.phone
        };

        // Show loading
        if (nextBtn) {
            nextBtn.disabled = true;
            nextBtn.textContent = 'Submitting...';
        }

        // Submit
        fetch('./action/submitCustomizeEnquiry.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                closePopup();
                window.location.href = '.thankyou.html';
                return;
            } else {
                alert(data.message || 'An error occurred. Please try again.');
                if (nextBtn) {
                    nextBtn.disabled = false;
                    nextBtn.textContent = 'Submit';
                }
            }
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            alert('An error occurred during submission. Please try again.');
            if (nextBtn) {
                nextBtn.disabled = false;
                nextBtn.textContent = 'Submit';
            }
        });
    }

    // Email validation
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Export openPopup function to window
    window.openCustomizePopup = function(destinationSlug, destinationName, destinationId) {
        openPopup(destinationSlug, destinationName, destinationId);
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

