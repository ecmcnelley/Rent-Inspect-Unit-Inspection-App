// Global state
        let currentStep = 1;
        let currentRoomIndex = 0;
        let rooms = [];
        let appliances = [];
        let smokeAlarms = [];
        let allPhotos = {};
        let uploadedLogo = null;
        let brandingText = 'Multi-Family Housing Inspection Services';
        let lockedLogo = null;
        let logoLocked = false;
        let companyName = '';
        
        // Refresh protection
        let hasUnsavedChanges = false;
        
        window.addEventListener('beforeunload', function(e) {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
                
                // Auto-save on refresh attempt
                saveProgressToLocalStorage();
                
                return 'You have unsaved changes. Do you want to save your progress before leaving?';
            }
        });
        
        // Detect accidental refresh gestures
        let touchStartY = 0;
        document.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchmove', function(e) {
            const touchY = e.touches[0].clientY;
            const touchDiff = touchY - touchStartY;
            
            // Detect pull-to-refresh gesture
            if (touchDiff > 50 && window.scrollY === 0) {
                e.preventDefault();
                if (confirm('Are you sure you want to refresh? All unsaved progress will be lost.\n\nYour current progress will be automatically saved. You can load it using the "Load Saved" button on the Property Information page.')) {
                    saveProgressToLocalStorage();
                    location.reload();
                }
            }
        }, { passive: false });

        // Property database
        const propertyDatabase = {
            "Park Village 1 & 2": {
                addresses: ["502 South 5th Street", "554 South 5th Street"],
                cityStateZip: "Selah, WA 98942",
                inspectors: ["Ellie McNelley", "Julian Rubio"],
                email: "parkvillage@quantumres.com"
            },
            "Huntington Court 1 & 2": {
                addresses: ["306 East Manitoba Avenue"],
                cityStateZip: "Ellensburg, WA 98926",
                inspectors: ["Kellen Sims", "Daniel Gottshalk"],
                email: "huntingtoncourt@quantumres.com"
            },
            "Windsor Park": {
                addresses: ["401 East Cherry Lane"],
                cityStateZip: "Ellensburg, WA 98926",
                inspectors: ["Kellen Sims", "Daniel Gottshalk"],
                email: "windsorpark@quantumres.com"
            },
            "Hampton Court": {
                addresses: ["700 North Cle Elum Street"],
                cityStateZip: "Ellensburg, WA 98926",
                inspectors: ["Charity Butler", "Jeremy Kingcade"],
                email: "hamptoncourt@quantumre.com"
            },
            "Spurling Court": {
                addresses: ["1204 Rainier Steet"],
                cityStateZip: "Ellensburg, WA 98926",
                inspectors: ["Charity Butler", "Jeremy Kingcade"],
                email: "spurlingcourt@quantumres.com"
            },
            "Berg Rose": {
                addresses: ["1263 Mine Street"],
                cityStateZip: "Leavenworth, WA 98826",
                inspectors: ["Aneisha Crane", "Melvin Graham"],
                email: "bergrose@quantumres.com"
            },
            "Cashmere Park": {
                addresses: ["302 Fisher Street"],
                cityStateZip: "Cashmere, WA 98815",
                inspectors: ["Aneisha Crane", "Melvin Graham"],
                email: "cashmerepark@quantumres.com"
            },
            "Pennsylvania Place": {
                addresses: ["103 E Pennsylvania Avenue"],
                cityStateZip: "Roslyn, WA 98941",
                inspectors: ["Shenna Redding", "Randy Raney"],
                email: "pennsylvaniaplace@quantumres.com"
            },
            "Westview Villa": {
                addresses: ["400 Denny Avenue"],
                cityStateZip: "Cle Elum, WA 98922",
                inspectors: ["Shenna Redding", "Randy Raney"],
                email: "westviewvilla@quantumres.com"
            },
            "Chestnut Grove": {
                addresses: ["610 S Chestnut Street"],
                cityStateZip: "Moses Lake, WA 98837",
                inspectors: ["Christine Buley", "Jose Tinoco"],
                email: "chestnutgrove@quantumres.com"
            },
            "Vineyard Apartments": {
                addresses: ["405 Nicka Road"],
                cityStateZip: "Grandview, WA 98930",
                inspectors: ["Yesenia Ramos", "Ryan Davis"],
                email: "vineyard@quantumres.com"
            },
            "Vineyard 2 Apartments": {
                addresses: ["810 Grandridge Road"],
                cityStateZip: "Grandview, WA 98930",
                inspectors: ["Yesenia Ramos", "Ryan Davis"],
                email: "vineyard@quantumres.com"
            },
            "Edison Park": {
                addresses: ["2400 E Edison Avenue"],
                cityStateZip: "Sunnyside WA 98944",
                inspectors: ["Halondra Arambula", "Marin Sandova", "Joel Moreno"],
                email: "paisleymgr@quantumres.com"
            },
            "Paragon Apartments": {
                addresses: ["1320 S. 11th St."],
                cityStateZip: "Sunnyside WA 98944",
                inspectors: ["Halondra Arambula", "Marin Sandova", "Joel Moreno"],
                email: "paisleymgr@quantumres.com"
            },
            "Valley Commons 1 Apartments": {
                addresses: ["725 McClain Drive"],
                cityStateZip: "Sunnyside WA 98944",
                inspectors: ["Halondra Arambula", "Marin Sandova", "Joel Moreno"],
                email: "paisleymgr@quantumres.com"
            },
            "Valley Commons 2 Apartments": {
                addresses: ["700 McClain Drive"],
                cityStateZip: "Sunnyside WA 98944",
                inspectors: ["Halondra Arambula", "Marin Sandova", "Joel Moreno"],
                email: "paisleymgr@quantumres.com"
            }
        };

        // Save/Load functionality
        function saveProgressToLocalStorage() {
            const progressData = {
                currentStep,
                currentRoomIndex,
                rooms,
                appliances,
                smokeAlarms,
                allPhotos,
                uploadedLogo,
                brandingText,
                companyName,
                propertyInfo: {
                    propertyNameSelect: document.getElementById('propertyNameSelect').value,
                    propertyNameCustom: document.getElementById('propertyNameCustom').value,
                    unitNumber: document.getElementById('unitNumber').value,
                    propertyAddressSelect: document.getElementById('propertyAddressSelect').value,
                    propertyAddressCustom: document.getElementById('propertyAddressCustom').value,
                    cityStateZip: document.getElementById('cityStateZip').value,
                    cityStateZipCustom: document.getElementById('cityStateZipCustom').value,
                    inspectorNameSelect: document.getElementById('inspectorNameSelect').value,
                    inspectorNameCustom: document.getElementById('inspectorNameCustom').value,
                    inspectorEmail: document.getElementById('inspectorEmail').value,
                    inspectorEmailCustom: document.getElementById('inspectorEmailCustom').value,
                    inspectionDate: document.getElementById('inspectionDate').value,
                    noticeServedDate: document.getElementById('noticeServedDate').value,
                    inspectionType: document.getElementById('inspectionType').value
                },
                colors: {
                    primary: document.getElementById('primaryColor').value,
                    secondary: document.getElementById('secondaryColor').value,
                    dark: document.getElementById('darkColor').value
                }
            };
            
            localStorage.setItem('inspectionProgress', JSON.stringify(progressData));
            hasUnsavedChanges = false;
            alert('Progress saved successfully!');
        }
        
        function loadProgressFromLocalStorage() {
            const saved = localStorage.getItem('inspectionProgress');
            if (!saved) {
                alert('No saved progress found.');
                return;
            }
            
            if (!confirm('Load saved progress? This will replace your current data.')) {
                return;
            }
            
            const progressData = JSON.parse(saved);
            
            // Restore global state
            currentStep = progressData.currentStep || 1;
            currentRoomIndex = progressData.currentRoomIndex || 0;
            rooms = progressData.rooms || [];
            appliances = progressData.appliances || [];
            smokeAlarms = progressData.smokeAlarms || [];
            allPhotos = progressData.allPhotos || {};
            uploadedLogo = progressData.uploadedLogo || null;
            brandingText = progressData.brandingText || 'Multi-Family Housing Inspection Services';
            companyName = progressData.companyName || '';
            
            // Restore property info
            if (progressData.propertyInfo) {
                const pi = progressData.propertyInfo;
                document.getElementById('propertyNameSelect').value = pi.propertyNameSelect || '';
                document.getElementById('propertyNameCustom').value = pi.propertyNameCustom || '';
                document.getElementById('unitNumber').value = pi.unitNumber || '';
                document.getElementById('propertyAddressSelect').value = pi.propertyAddressSelect || '';
                document.getElementById('propertyAddressCustom').value = pi.propertyAddressCustom || '';
                document.getElementById('cityStateZip').value = pi.cityStateZip || '';
                document.getElementById('cityStateZipCustom').value = pi.cityStateZipCustom || '';
                document.getElementById('inspectorNameSelect').value = pi.inspectorNameSelect || '';
                document.getElementById('inspectorNameCustom').value = pi.inspectorNameCustom || '';
                document.getElementById('inspectorEmail').value = pi.inspectorEmail || '';
                document.getElementById('inspectorEmailCustom').value = pi.inspectorEmailCustom || '';
                document.getElementById('inspectionDate').value = pi.inspectionDate || '';
                document.getElementById('noticeServedDate').value = pi.noticeServedDate || '';
                document.getElementById('inspectionType').value = pi.inspectionType || 'Bi-Annual Unit Inspection';
                
                // Trigger property change to populate dropdowns
                if (pi.propertyNameSelect) {
                    handlePropertyChange();
                }
            }
            
            // Restore colors
            if (progressData.colors) {
                document.getElementById('primaryColor').value = progressData.colors.primary;
                document.getElementById('secondaryColor').value = progressData.colors.secondary;
                document.getElementById('darkColor').value = progressData.colors.dark;
                updateColors();
            }
            
            // Restore logo
            if (uploadedLogo) {
                const headerLogo = document.getElementById('headerLogo');
                headerLogo.src = uploadedLogo;
                headerLogo.style.display = 'block';
            }
            
            // Restore company name
            if (companyName && document.getElementById('companyName')) {
                document.getElementById('companyName').value = companyName;
            }
            
            updateHeaderInfo();
            updateDisplay();
            hasUnsavedChanges = false;
            
            alert('Progress loaded successfully!');
        }

        // Initialize
        window.onload = function() {
            document.getElementById('inspectionDate').valueAsDate = new Date();
            updateHeaderInfo();
            
            // Load locked logo if exists
            const savedLogoLocked = localStorage.getItem('logoLocked');
            const savedLogo = localStorage.getItem('lockedLogo');
            
            if (savedLogoLocked === 'true' && savedLogo) {
                logoLocked = true;
                uploadedLogo = savedLogo;
                document.getElementById('logoLockToggle').checked = true;
                const headerLogo = document.getElementById('headerLogo');
                headerLogo.src = savedLogo;
                headerLogo.style.display = 'block';
            }
        };

        // Color customization
        function updateColors() {
            const primary = document.getElementById('primaryColor').value;
            const secondary = document.getElementById('secondaryColor').value;
            const dark = document.getElementById('darkColor').value;
            
            document.documentElement.style.setProperty('--primary-color', primary);
            document.documentElement.style.setProperty('--secondary-color', secondary);
            document.documentElement.style.setProperty('--dark-color', dark);
        }

        // Logo upload
        function handleLogoUpload(input) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    uploadedLogo = e.target.result;
                    const headerLogo = document.getElementById('headerLogo');
                    headerLogo.src = uploadedLogo;
                    headerLogo.style.display = 'block';
                    
                    // If logo is locked, save it
                    if (logoLocked) {
                        localStorage.setItem('lockedLogo', uploadedLogo);
                    }
                };
                reader.readAsDataURL(input.files[0]);
            }
        }
        
        // Logo lock toggle
        function toggleLogoLock() {
            logoLocked = document.getElementById('logoLockToggle').checked;
            
            if (logoLocked && uploadedLogo) {
                localStorage.setItem('lockedLogo', uploadedLogo);
                localStorage.setItem('logoLocked', 'true');
                alert('Logo locked for this device!');
            } else {
                localStorage.removeItem('lockedLogo');
                localStorage.removeItem('logoLocked');
                if (!logoLocked) {
                    alert('Logo unlocked!');
                }
            }
        }
        
        // Company name update
        function updateCompanyName() {
            companyName = document.getElementById('companyName').value;
            const display = document.getElementById('companyNameDisplay');
            if (companyName) {
                display.textContent = companyName + ' - ';
                display.style.display = 'inline';
            } else {
                display.style.display = 'none';
            }
            hasUnsavedChanges = true;
        }
        
        // Toggle pets comments field
        function togglePetsComments() {
            const checkbox = document.getElementById('petsIndicated');
            const comments = document.getElementById('petsComments');
            if (checkbox.checked) {
                comments.classList.remove('hidden');
            } else {
                comments.classList.add('hidden');
                comments.value = '';
            }
            hasUnsavedChanges = true;
        }
        
        // Toggle pest comments field
        function togglePestComments() {
            const checkbox = document.getElementById('pestInfestation');
            const comments = document.getElementById('pestComments');
            if (checkbox.checked) {
                comments.classList.remove('hidden');
            } else {
                comments.classList.add('hidden');
                comments.value = '';
            }
            hasUnsavedChanges = true;
        }

        // Update header information table
        function updateHeaderInfo() {
            const propertyName = getPropertyName();
            const unitNumber = document.getElementById('unitNumber').value;
            const address = getPropertyAddress();
            const cityStateZip = getCityStateZip();
            const inspector = getInspectorName();
            const email = getInspectorEmail();
            const date = document.getElementById('inspectionDate').value;
            const noticeDate = document.getElementById('noticeServedDate').value;
            const inspectionType = document.getElementById('inspectionType').value;

            document.getElementById('headerProperty').textContent = propertyName || '-';
            document.getElementById('headerUnit').textContent = unitNumber || '-';
            document.getElementById('headerAddress').textContent = address && cityStateZip ? `${address}, ${cityStateZip}` : (address || '-');
            document.getElementById('headerInspector').textContent = inspector || '-';
            document.getElementById('headerEmail').textContent = email || '-';
            document.getElementById('headerDate').textContent = date ? formatDateWithoutTimezone(date) : '-';
            document.getElementById('headerNoticeDate').textContent = noticeDate ? formatDateWithoutTimezone(noticeDate) : '-';
            
            // Update branding text with inspection type
            document.getElementById('brandingText').textContent = inspectionType || 'Bi-Annual Unit Inspection';
            
            hasUnsavedChanges = true;
        }

        // Helper function to format date without timezone conversion
        function formatDateWithoutTimezone(dateString) {
            if (!dateString) return '';
            const [year, month, day] = dateString.split('-');
            const date = new Date(year, month - 1, day);
            return date.toLocaleDateString();
        }

        // Property handlers
        function handlePropertyChange() {
            const propertySelect = document.getElementById('propertyNameSelect');
            const propertyCustom = document.getElementById('propertyNameCustom');
            const addressSelect = document.getElementById('propertyAddressSelect');
            const addressCustom = document.getElementById('propertyAddressCustom');
            const cityStateZip = document.getElementById('cityStateZip');
            const cityStateZipCustom = document.getElementById('cityStateZipCustom');
            const inspectorSelect = document.getElementById('inspectorNameSelect');
            const inspectorCustom = document.getElementById('inspectorNameCustom');
            const inspectorEmail = document.getElementById('inspectorEmail');
            const inspectorEmailCustom = document.getElementById('inspectorEmailCustom');

            const selectedProperty = propertySelect.value;

            if (selectedProperty === 'CUSTOM') {
                propertyCustom.classList.remove('hidden');
                addressSelect.classList.add('hidden');
                addressCustom.classList.remove('hidden');
                cityStateZip.classList.add('hidden');
                cityStateZipCustom.classList.remove('hidden');
                inspectorSelect.classList.add('hidden');
                inspectorCustom.classList.remove('hidden');
                inspectorEmail.classList.add('hidden');
                inspectorEmailCustom.classList.remove('hidden');
                
                addressSelect.innerHTML = '<option value="">Select Address</option>';
                inspectorSelect.innerHTML = '<option value="">Select Inspector</option>';
                cityStateZip.value = '';
                inspectorEmail.value = '';
                
            } else if (selectedProperty && propertyDatabase[selectedProperty]) {
                propertyCustom.classList.add('hidden');
                addressSelect.classList.remove('hidden');
                addressCustom.classList.add('hidden');
                cityStateZip.classList.remove('hidden');
                cityStateZipCustom.classList.add('hidden');
                inspectorSelect.classList.remove('hidden');
                inspectorCustom.classList.add('hidden');
                inspectorEmail.classList.remove('hidden');
                inspectorEmailCustom.classList.add('hidden');
                
                const property = propertyDatabase[selectedProperty];
                
                addressSelect.innerHTML = '<option value="">Select Address</option>';
                property.addresses.forEach(address => {
                    const option = document.createElement('option');
                    option.value = address;
                    option.textContent = address;
                    addressSelect.appendChild(option);
                });
                
                cityStateZip.value = property.cityStateZip;
                
                inspectorSelect.innerHTML = '<option value="">Select Inspector</option>';
                property.inspectors.forEach(inspector => {
                    const option = document.createElement('option');
                    option.value = inspector;
                    option.textContent = inspector;
                    inspectorSelect.appendChild(option);
                });
                
                inspectorEmail.value = property.email;
            }
            updateHeaderInfo();
        }

        function handleAddressChange() {
            updateHeaderInfo();
        }

        function handleInspectorChange() {
            updateHeaderInfo();
        }

        function getPropertyName() {
            const select = document.getElementById('propertyNameSelect');
            const custom = document.getElementById('propertyNameCustom');
            return select.value === 'CUSTOM' ? custom.value : select.value;
        }

        function getPropertyAddress() {
            const select = document.getElementById('propertyAddressSelect');
            const custom = document.getElementById('propertyAddressCustom');
            return !custom.classList.contains('hidden') ? custom.value : select.value;
        }

        function getCityStateZip() {
            const regular = document.getElementById('cityStateZip');
            const custom = document.getElementById('cityStateZipCustom');
            return !custom.classList.contains('hidden') ? custom.value : regular.value;
        }

        function getInspectorName() {
            const select = document.getElementById('inspectorNameSelect');
            const custom = document.getElementById('inspectorNameCustom');
            return !custom.classList.contains('hidden') ? custom.value : select.value;
        }

        function getInspectorEmail() {
            const regular = document.getElementById('inspectorEmail');
            const custom = document.getElementById('inspectorEmailCustom');
            return !custom.classList.contains('hidden') ? custom.value : regular.value;
        }

        // Photo handling
        function triggerPhotoUpload(context, title, comment) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.capture = 'environment';
            input.multiple = true;
            input.onchange = function() {
                handlePhotoUpload(this, context, title, comment);
            };
            input.click();
        }

        function handlePhotoUpload(input, context, title, comment) {
            if (!input.files) return;
            
            if (!allPhotos[context]) {
                allPhotos[context] = [];
            }

            Array.from(input.files).forEach(file => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const photoNumber = allPhotos[context].filter(p => p.title === title && p.comment === comment).length + 1;
                    const displayTitle = photoNumber > 1 ? `${title} #${photoNumber}` : title;
                    
                    allPhotos[context].push({
                        data: e.target.result,
                        title: title,
                        comment: comment,
                        displayTitle: displayTitle
                    });
                    
                    renderPhotos(context);
                };
                reader.readAsDataURL(file);
            });
        }

        function renderPhotos(context) {
            const container = document.getElementById(`${context}PhotoPreview`);
            if (!container) return;
            
            container.innerHTML = '';
            
            if (allPhotos[context]) {
                allPhotos[context].forEach((photo, index) => {
                    const photoItem = document.createElement('div');
                    photoItem.className = 'photo-item';
                    photoItem.innerHTML = `
                        <img src="${photo.data}" alt="${photo.displayTitle}">
                        <div class="photo-caption">
                            <strong>${photo.displayTitle}</strong><br>
                            ${photo.comment}
                        </div>
                        <button class="photo-remove" onclick="removePhoto('${context}', ${index})">&times;</button>
                    `;
                    container.appendChild(photoItem);
                });
            }
        }

        function removePhoto(context, index) {
            if (allPhotos[context]) {
                allPhotos[context].splice(index, 1);
                renderPhotos(context);
            }
        }

        // Save/Load
        function saveToLocalStorage() {
            const data = {
                step: currentStep,
                roomIndex: currentRoomIndex,
                rooms: rooms,
                appliances: appliances,
                smokeAlarms: smokeAlarms,
                photos: allPhotos,
                logo: uploadedLogo,
                branding: document.getElementById('brandingText').textContent,
                timestamp: new Date().toISOString()
            };
            
            try {
                localStorage.setItem('quantumInspectionData', JSON.stringify(data));
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    alert('Storage limit exceeded! You have too many photos saved. Please:\n\n1. Generate your report now\n2. Print/save the PDF\n3. Start a new inspection\n\nNote: Each photo takes significant storage space. Consider taking fewer photos or lower resolution photos.');
                    console.error('LocalStorage quota exceeded. Data size:', JSON.stringify(data).length / 1024 / 1024, 'MB');
                }
            }
        }

        function loadFromLocalStorage() {
            const saved = localStorage.getItem('quantumInspectionData');
            if (saved && confirm('Found saved inspection. Continue where you left off?')) {
                try {
                    const data = JSON.parse(saved);
                    currentStep = data.step || 1;
                    currentRoomIndex = data.roomIndex || 0;
                    rooms = data.rooms || [];
                    appliances = data.appliances || [];
                    smokeAlarms = data.smokeAlarms || [];
                    allPhotos = data.photos || {};
                    uploadedLogo = data.logo || null;
                    if (data.branding) document.getElementById('brandingText').textContent = data.branding;
                    if (uploadedLogo) {
                        document.getElementById('headerLogo').src = uploadedLogo;
                        document.getElementById('headerLogo').style.display = 'block';
                    }
                    updateHeaderInfo();
                    updateDisplay();
                } catch (e) {
                    console.error('Error loading saved data:', e);
                }
            }
        }

        // Step navigation
        function nextStep() {
            if (currentStep === 2) buildRoomList();
            if (currentStep === 2) buildApplianceList();
            if (currentStep === 5 && currentRoomIndex < rooms.length - 1) return nextRoom();
            
            currentStep++;
            updateDisplay();
            saveToLocalStorage();
            window.scrollTo(0, 0);
        }

        function previousStep() {
            if (currentStep > 1) {
                currentStep--;
                updateDisplay();
                window.scrollTo(0, 0);
            }
        }

        function updateDisplay() {
            document.querySelectorAll('.form-section').forEach(section => {
                section.classList.remove('active');
            });

            const activeSection = document.querySelector(`[data-section="${currentStep}"]`);
            if (activeSection) {
                activeSection.classList.add('active');
            }

            document.querySelectorAll('.step').forEach((step, index) => {
                const stepNum = index + 1;
                step.classList.remove('active', 'completed');
                
                if (stepNum === currentStep) {
                    step.classList.add('active');
                } else if (stepNum < currentStep) {
                    step.classList.add('completed');
                }
            });

            // Show/hide settings panel based on current step
            const settingsPanel = document.getElementById('settingsPanel');
            if (settingsPanel) {
                if (currentStep === 1) {
                    settingsPanel.style.display = 'block';
                } else {
                    settingsPanel.style.display = 'none';
                }
            }

            if (currentStep === 3) renderSmokeAlarms();
            if (currentStep === 4) renderAppliances();
            if (currentStep === 5 && rooms.length > 0) renderCurrentRoom();
        }

        // Build room list
        function buildRoomList() {
            rooms = [];

            if (document.getElementById('hasEntry').value === 'yes') {
                rooms.push({ type: 'entry', name: 'Entry' });
            }
            if (document.getElementById('hasKitchen').value === 'yes') {
                rooms.push({ type: 'kitchen', name: 'Kitchen' });
            }
            if (document.getElementById('hasDiningRoom').value === 'yes') {
                rooms.push({ type: 'diningroom', name: 'Dining Room' });
            }
            if (document.getElementById('hasLivingRoom').value === 'yes') {
                rooms.push({ type: 'livingroom', name: 'Living Room' });
            }

            const numBedrooms = parseInt(document.getElementById('numBedrooms').value) || 0;
            for (let i = 1; i <= numBedrooms; i++) {
                rooms.push({ type: 'bedroom', number: i, name: `Bedroom ${i}` });
            }

            const numBathrooms = parseInt(document.getElementById('numBathrooms').value) || 0;
            for (let i = 1; i <= numBathrooms; i++) {
                rooms.push({ type: 'bathroom', number: i, name: `Bathroom ${i}` });
            }

            if (document.getElementById('hasLaundryRoom').value === 'yes') {
                rooms.push({ type: 'laundryroom', name: 'Laundry Room' });
            }

            const numHallways = parseInt(document.getElementById('numHallways').value) || 0;
            for (let i = 1; i <= numHallways; i++) {
                rooms.push({ type: 'hallway', number: i, name: `Hallway/Stairway ${i}` });
            }

            if (document.getElementById('hasOutsideDeck').value === 'yes') {
                rooms.push({ type: 'outsidedeck', name: 'Outside Deck/Patio' });
            }

            currentRoomIndex = 0;
        }

        // Build appliance list
        function buildApplianceList() {
            const numAppliances = parseInt(document.getElementById('numAppliances').value) || 0;
            appliances = [];
            for (let i = 0; i < numAppliances; i++) {
                appliances.push({
                    number: i + 1,
                    location: '',
                    type: '',
                    brand: '',
                    model: '',
                    serial: '',
                    condition: '',
                    comment: ''
                });
            }
        }

        // Render smoke alarms
        function renderSmokeAlarms() {
            const numAlarms = parseInt(document.getElementById('numSmokeAlarms').value) || 0;
            const container = document.getElementById('smokeAlarmsContainer');
            const photoButtons = document.getElementById('safetyPhotoButtons');
            
            container.innerHTML = '';
            photoButtons.innerHTML = '';
            
            smokeAlarms = [];
            
            for (let i = 0; i < numAlarms; i++) {
                smokeAlarms.push({ 
                    number: i + 1, 
                    location: '', 
                    type: '', 
                    power: '',
                    alert: '',
                    interconnected: false,
                    condition: '', 
                    comment: '' 
                });
                
                const alarmDiv = document.createElement('div');
                alarmDiv.className = 'inspection-item';
                alarmDiv.innerHTML = `
                    <div class="inspection-item-title">Smoke Alarm #${i + 1}</div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Room Location <span class="required">*</span></label>
                            <select id="alarm${i}_location" onchange="updateAlarmData(${i}, 'location', this.value)" required>
                                <option value="">Select Room</option>
                                ${rooms.map(r => `<option value="${r.name}">${r.name}</option>`).join('')}
                                <option value="Hallway/Stairway">Hallway/Stairway</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Alarm Type <span class="required">*</span></label>
                            <select id="alarm${i}_type" onchange="updateAlarmData(${i}, 'type', this.value)" required>
                                <option value="">Select Type</option>
                                <option value="Smoke">Smoke</option>
                                <option value="CO2">CO2</option>
                                <option value="Smoke/CO2 Combo">Smoke/CO2 Combo</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Power Type <span class="required">*</span></label>
                            <select id="alarm${i}_power" onchange="updateAlarmData(${i}, 'power', this.value)" required>
                                <option value="">Select Power</option>
                                <option value="Wired">Wired</option>
                                <option value="Replaceable Battery">Replaceable Battery</option>
                                <option value="10 Year Battery">10 Year Battery</option>
                                <option value="Wired w/ Replaceable Battery Backup">Wired w/ Replaceable Battery Backup</option>
                                <option value="Wired with 10 Year Battery Backup">Wired with 10 Year Battery Backup</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Alert Type <span class="required">*</span></label>
                            <select id="alarm${i}_alert" onchange="updateAlarmData(${i}, 'alert', this.value)" required>
                                <option value="">Select Alert</option>
                                <option value="Light">Light</option>
                                <option value="Sound">Sound</option>
                                <option value="Voice">Voice</option>
                                <option value="Voice/Light Path Guided Evacuation">Voice/Light Path Guided Evacuation</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="checkbox-group" style="margin-top: 10px;">
                        <input type="checkbox" id="alarm${i}_interconnected" onchange="updateAlarmData(${i}, 'interconnected', this.checked)">
                        <label for="alarm${i}_interconnected">Interconnected with other alarms</label>
                    </div>
                    
                    <div class="form-group" style="margin-top: 15px;">
                        <label>Condition <span class="required">*</span></label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="alarm${i}_condition" value="Good" id="alarm${i}_good" onchange="updateAlarmData(${i}, 'condition', 'Good'); hideAlarmComment(${i})">
                                <label for="alarm${i}_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="alarm${i}_condition" value="Fair" id="alarm${i}_fair" onchange="updateAlarmData(${i}, 'condition', 'Fair'); showAlarmComment(${i})">
                                <label for="alarm${i}_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="alarm${i}_condition" value="Poor" id="alarm${i}_poor" onchange="updateAlarmData(${i}, 'condition', 'Poor'); showAlarmComment(${i})">
                                <label for="alarm${i}_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="alarm${i}_condition" value="N/A" id="alarm${i}_na" onchange="updateAlarmData(${i}, 'condition', 'N/A'); hideAlarmComment(${i})">
                                <label for="alarm${i}_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="alarm${i}_comment" placeholder="Comments..." onchange="updateAlarmData(${i}, 'comment', this.value); renderSafetyPhotoButtons()"></textarea>
                `;
                container.appendChild(alarmDiv);
            }
        }

        function updateAlarmData(index, field, value) {
            if (smokeAlarms[index]) {
                smokeAlarms[index][field] = value;
                if (field === 'comment' && value) {
                    renderSafetyPhotoButtons();
                }
            }
        }

        function showAlarmComment(index) {
            const commentField = document.getElementById(`alarm${index}_comment`);
            if (commentField) {
                commentField.classList.remove('hidden');
            }
        }

        function hideAlarmComment(index) {
            const commentField = document.getElementById(`alarm${index}_comment`);
            if (commentField) {
                commentField.classList.add('hidden');
                commentField.value = '';
                if (smokeAlarms[index]) {
                    smokeAlarms[index].comment = '';
                }
                renderSafetyPhotoButtons();
            }
        }

        function renderSafetyPhotoButtons() {
            const photoButtons = document.getElementById('safetyPhotoButtons');
            photoButtons.innerHTML = '';
            
            smokeAlarms.forEach((alarm, index) => {
                if (alarm.comment) {
                    const btn = document.createElement('button');
                    btn.className = 'photo-upload-btn';
                    btn.textContent = `📷 Smoke Alarm #${alarm.number} - ${alarm.comment.substring(0, 30)}${alarm.comment.length > 30 ? '...' : ''}`;
                    btn.onclick = () => triggerPhotoUpload('safety', `Smoke Alarm #${alarm.number}`, alarm.comment);
                    photoButtons.appendChild(btn);
                }
            });
        }

        // Render appliances
        function renderAppliances() {
            const container = document.getElementById('appliancesContainer');
            const photoButtons = document.getElementById('appliancePhotoButtons');
            
            container.innerHTML = '';
            photoButtons.innerHTML = '';
            
            appliances.forEach((appliance, index) => {
                const appDiv = document.createElement('div');
                appDiv.className = 'inspection-item';
                appDiv.innerHTML = `
                    <div class="inspection-item-title">Appliance #${appliance.number}</div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Location</label>
                            <select id="app${index}_location" onchange="updateApplianceData(${index}, 'location', this.value)">
                                <option value="">Select Location</option>
                                ${rooms.map(r => `<option value="${r.name}">${r.name}</option>`).join('')}
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Type</label>
                            <select id="app${index}_type" onchange="updateApplianceData(${index}, 'type', this.value); toggleWaterHeaterFields(${index}); toggleACTypeFields(${index})">
                                <option value="">Select Type</option>
                                <option value="Refrigerator">Refrigerator</option>
                                <option value="Stove/Range">Stove/Range</option>
                                <option value="Range Hood">Range Hood</option>
                                <option value="Dishwasher">Dishwasher</option>
                                <option value="Microwave">Microwave</option>
                                <option value="Washer">Washer</option>
                                <option value="Dryer">Dryer</option>
                                <option value="Air Conditioner">Air Conditioner</option>
                                <option value="Mini Split Air Handler">Mini Split Air Handler</option>
                                <option value="Mini Split Heat Pump">Mini Split Heat Pump</option>
                                <option value="Water Heater">Water Heater</option>
                                <option value="Garbage Disposal">Garbage Disposal</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Brand</label>
                            <input type="text" id="app${index}_brand" onchange="updateApplianceData(${index}, 'brand', this.value)" placeholder="Brand name">
                        </div>
                        <div class="form-group">
                            <label>Model Number</label>
                            <input type="text" id="app${index}_model" onchange="updateApplianceData(${index}, 'model', this.value)" placeholder="Model #" style="text-transform: uppercase;">
                        </div>
                        <div class="form-group">
                            <label>Serial Number</label>
                            <input type="text" id="app${index}_serial" onchange="updateApplianceData(${index}, 'serial', this.value)" placeholder="Serial #" style="text-transform: uppercase;">
                        </div>
                        <div class="form-group">
                            <label>Condition</label>
                            <div class="radio-group">
                                <div class="radio-option">
                                    <input type="radio" name="app${index}_condition" value="Good" id="app${index}_good" onchange="updateApplianceData(${index}, 'condition', 'Good')">
                                    <label for="app${index}_good">Good</label>
                                </div>
                                <div class="radio-option">
                                    <input type="radio" name="app${index}_condition" value="Fair" id="app${index}_fair" onchange="updateApplianceData(${index}, 'condition', 'Fair'); showApplianceComment(${index})">
                                    <label for="app${index}_fair">Fair</label>
                                </div>
                                <div class="radio-option">
                                    <input type="radio" name="app${index}_condition" value="Poor" id="app${index}_poor" onchange="updateApplianceData(${index}, 'condition', 'Poor'); showApplianceComment(${index})">
                                    <label for="app${index}_poor">Poor</label>
                                </div>
                                <div class="radio-option">
                                    <input type="radio" name="app${index}_condition" value="N/A" id="app${index}_na" onchange="updateApplianceData(${index}, 'condition', 'N/A')">
                                    <label for="app${index}_na">N/A</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Water Heater Specific Fields -->
                    <div id="app${index}_waterheater_fields" class="hidden" style="background: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 15px;">
                        <h4 style="color: var(--dark-color); margin-bottom: 15px;">Water Heater Details</h4>
                        
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Temperature Setting</label>
                                <input type="text" id="app${index}_temp_set" onchange="updateApplianceData(${index}, 'temp_set', this.value)" placeholder="e.g., 120°F">
                            </div>
                            
                            <div class="form-group">
                                <label>Plumbing Condition</label>
                                <div class="radio-group">
                                    <div class="radio-option">
                                        <input type="radio" name="app${index}_plumbing" value="Good" id="app${index}_plumbing_good" onchange="updateApplianceData(${index}, 'plumbing_condition', 'Good')">
                                        <label for="app${index}_plumbing_good">Good</label>
                                    </div>
                                    <div class="radio-option">
                                        <input type="radio" name="app${index}_plumbing" value="Fair" id="app${index}_plumbing_fair" onchange="updateApplianceData(${index}, 'plumbing_condition', 'Fair')">
                                        <label for="app${index}_plumbing_fair">Fair</label>
                                    </div>
                                    <div class="radio-option">
                                        <input type="radio" name="app${index}_plumbing" value="Poor" id="app${index}_plumbing_poor" onchange="updateApplianceData(${index}, 'plumbing_condition', 'Poor')">
                                        <label for="app${index}_plumbing_poor">Poor</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 15px;">
                            <label class="checkbox-label">
                                <input type="checkbox" id="app${index}_leaks" onchange="updateApplianceData(${index}, 'leaks', this.checked)">
                                Leaks Present
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" id="app${index}_tpm_valve" onchange="updateApplianceData(${index}, 'tpm_valve', this.checked)">
                                TPM Valve
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" id="app${index}_gas_exhaust" onchange="updateApplianceData(${index}, 'gas_exhaust', this.checked)">
                                Proper Gas Exhaust
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" id="app${index}_discharge_pipe" onchange="updateApplianceData(${index}, 'discharge_pipe', this.checked)">
                                Discharge Pipe
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" id="app${index}_drain_pan" onchange="updateApplianceData(${index}, 'drain_pan', this.checked)">
                                Drain Pan
                            </label>
                        </div>
                    </div>
                    
                    <!-- Air Conditioner Type Fields -->
                    <div id="app${index}_ac_type_fields" class="hidden" style="background: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 15px;">
                        <h4 style="color: var(--dark-color); margin-bottom: 15px;">Air Conditioner Type</h4>
                        
                        <div class="form-group">
                            <label>AC Type</label>
                            <select id="app${index}_ac_type" onchange="updateApplianceData(${index}, 'ac_type', this.value)">
                                <option value="">Select AC Type</option>
                                <option value="Through Wall">Through Wall</option>
                                <option value="Mini Split Air Handler">Mini Split Air Handler</option>
                                <option value="VTAC (Central Air)">VTAC (Central Air)</option>
                            </select>
                        </div>
                    </div>
                    
                    <textarea class="comment-field hidden" id="app${index}_comment" placeholder="Comments..." onchange="updateApplianceData(${index}, 'comment', this.value); renderAppliancePhotoButtons()"></textarea>
                `;
                container.appendChild(appDiv);
                
                // Restore Water Heater fields if type is already set
                if (appliance.type === 'Water Heater') {
                    toggleWaterHeaterFields(index);
                }
                
                // Restore AC Type fields if type is already set
                if (appliance.type === 'Air Conditioner') {
                    toggleACTypeFields(index);
                }
            });
        }

        function toggleWaterHeaterFields(index) {
            const typeSelect = document.getElementById(`app${index}_type`);
            const waterHeaterFields = document.getElementById(`app${index}_waterheater_fields`);
            
            if (typeSelect && waterHeaterFields) {
                if (typeSelect.value === 'Water Heater') {
                    waterHeaterFields.classList.remove('hidden');
                } else {
                    waterHeaterFields.classList.add('hidden');
                }
            }
        }

        function toggleACTypeFields(index) {
            const typeSelect = document.getElementById(`app${index}_type`);
            const acTypeFields = document.getElementById(`app${index}_ac_type_fields`);
            
            if (typeSelect && acTypeFields) {
                if (typeSelect.value === 'Air Conditioner') {
                    acTypeFields.classList.remove('hidden');
                } else {
                    acTypeFields.classList.add('hidden');
                }
            }
        }

        function updateApplianceData(index, field, value) {
            if (appliances[index]) {
                appliances[index][field] = value;
                if (field === 'comment' && value) {
                    renderAppliancePhotoButtons();
                }
            }
        }

        function showApplianceComment(index) {
            const commentField = document.getElementById(`app${index}_comment`);
            if (commentField) {
                commentField.classList.remove('hidden');
            }
        }

        function renderAppliancePhotoButtons() {
            const photoButtons = document.getElementById('appliancePhotoButtons');
            photoButtons.innerHTML = '';
            
            appliances.forEach((app, index) => {
                if (app.comment) {
                    const btn = document.createElement('button');
                    btn.className = 'photo-upload-btn';
                    btn.textContent = `📷 ${app.type || `Appliance #${app.number}`} - ${app.comment.substring(0, 30)}${app.comment.length > 30 ? '...' : ''}`;
                    btn.onclick = () => triggerPhotoUpload('appliance', `${app.type || `Appliance #${app.number}`}`, app.comment);
                    photoButtons.appendChild(btn);
                }
            });
        }

        // Room navigation
        function nextRoom() {
            saveCurrentRoomData();
            if (currentRoomIndex < rooms.length - 1) {
                currentRoomIndex++;
                renderCurrentRoom();
                window.scrollTo(0, 0);
            } else {
                nextStep();
            }
        }

        function previousRoom() {
            saveCurrentRoomData();
            if (currentRoomIndex > 0) {
                currentRoomIndex--;
                renderCurrentRoom();
                window.scrollTo(0, 0);
            } else {
                previousStep();
            }
        }

        function saveCurrentRoomData() {
            const room = rooms[currentRoomIndex];
            if (!room) return;

            if (!room.data) room.data = {};

            const container = document.getElementById('roomInspectionContainer');
            container.querySelectorAll('input, select, textarea').forEach(input => {
                if (input.id && input.type !== 'file') {
                    if (input.type === 'checkbox') {
                        room.data[input.id] = input.checked;
                    } else if (input.type === 'radio') {
                        if (input.checked) room.data[input.name] = input.value;
                    } else {
                        room.data[input.id] = input.value;
                    }
                }
            });
        }

        function renderCurrentRoom() {
            const room = rooms[currentRoomIndex];
            if (!room) return;

            document.getElementById('roomIndicator').textContent = `Room ${currentRoomIndex + 1} of ${rooms.length}: ${room.name}`;

            const container = document.getElementById('roomInspectionContainer');
            container.innerHTML = `
                <div class="inspection-item">
                    <div class="inspection-item-title">Housekeeping</div>
                    <div class="form-group">
                        <label>Overall Cleanliness</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_housekeeping" value="Clean" id="${room.type}_clean" onchange="handleHousekeepingChange('${room.type}', 'Clean')">
                                <label for="${room.type}_clean">Clean</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_housekeeping" value="Needs Cleaning" id="${room.type}_needscleaning" onchange="handleHousekeepingChange('${room.type}', 'Needs Cleaning')">
                                <label for="${room.type}_needscleaning">Needs Cleaning</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_housekeeping" value="Unacceptable" id="${room.type}_unacceptable" onchange="handleHousekeepingChange('${room.type}', 'Unacceptable')">
                                <label for="${room.type}_unacceptable">Unacceptable</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_housekeeping" value="N/A" id="${room.type}_na" onchange="handleHousekeepingChange('${room.type}', 'N/A')">
                                <label for="${room.type}_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_housekeeping_comment" placeholder="Housekeeping comments..." onchange="renderRoomPhotoButtons()"></textarea>
                </div>

                ${generateRoomTemplate(room)}
            `;

            if (room.data) {
                Object.keys(room.data).forEach(key => {
                    const input = document.getElementById(key);
                    if (input) {
                        if (input.type === 'checkbox') {
                            input.checked = room.data[key];
                        } else if (input.type === 'radio') {
                            if (room.data[key] === input.value) {
                                input.checked = true;
                            }
                        } else {
                            input.value = room.data[key];
                        }
                    }
                });
                
                // Toggle closet section if has_closet is checked
                const hasCloset = document.getElementById(`${room.type}_has_closet`);
                if (hasCloset && hasCloset.checked) {
                    toggleEntryCloset(room.type);
                }
            }

            renderRoomPhotoButtons();
        }

        function generateRoomTemplate(room) {
            // Base sections that appear in all rooms
            const doorSection = generateDoorSection(room);
            const thresholdSection = generateThresholdSection(room);
            const flooringSection = generateFlooringSection(room);
            const wallsSection = generateWallsSection(room);
            const bullnoseSection = generateBullnoseSection(room);
            const outletsSection = generateOutletsSection(room);
            const lightFixturesSection = generateLightFixturesSection(room);
            
            let template = '<div class="room-template">';
            
            // Room-specific templates
            switch(room.type) {
                case 'entry':
                    template += doorSection + thresholdSection + flooringSection;
                    template += generateClosetSection(room);
                    template += wallsSection + bullnoseSection + outletsSection + lightFixturesSection;
                    break;
                    
                case 'kitchen':
                    template += doorSection + thresholdSection + flooringSection;
                    template += generateGFISection(room);
                    template += generateSinkSection(room);
                    template += generateCabinetsSection(room);
                    template += generateShelvesSection(room);
                    template += generateDrawersSection(room);
                    template += generateMoldSection(room);
                    template += wallsSection + bullnoseSection + outletsSection + lightFixturesSection;
                    break;
                    
                case 'diningroom':
                    template += doorSection + thresholdSection + flooringSection;
                    template += generateWindowsSection(room);
                    template += generateHeaterSection(room);
                    template += wallsSection + bullnoseSection + outletsSection + lightFixturesSection;
                    break;
                    
                case 'livingroom':
                    template += doorSection + thresholdSection + flooringSection;
                    template += generateWindowsSection(room);
                    template += generateHeaterSection(room);
                    template += wallsSection + bullnoseSection + outletsSection + lightFixturesSection;
                    break;
                    
                case 'bedroom':
                    template += doorSection + thresholdSection + flooringSection;
                    template += generateClosetSection(room);
                    template += generateWindowsSection(room);
                    template += generateHeaterSection(room);
                    template += wallsSection + bullnoseSection + outletsSection + lightFixturesSection;
                    break;
                    
                case 'bathroom':
                    template += doorSection + thresholdSection + flooringSection;
                    template += generateGFISection(room);
                    template += generateSinkSection(room);
                    template += generateToiletSection(room);
                    template += generateTubShowerSection(room);
                    template += generateExhaustFanSection(room);
                    template += generateMedicineCabinetSection(room);
                    template += generateCabinetsSection(room);
                    template += generateShelvesSection(room);
                    template += generateDrawersSection(room);
                    template += generateMoldSection(room);
                    template += wallsSection + bullnoseSection + outletsSection + lightFixturesSection;
                    break;
                    
                case 'laundryroom':
                    template += doorSection + thresholdSection + flooringSection;
                    template += wallsSection + bullnoseSection + outletsSection + lightFixturesSection;
                    break;
                    
                case 'hallway':
                    template += flooringSection;
                    template += generateHeaterSection(room);
                    template += wallsSection + bullnoseSection + outletsSection + lightFixturesSection;
                    break;
                    
                case 'outsidedeck':
                    template += generateDeckTemplate(room);
                    break;
                    
                default:
                    template += doorSection + thresholdSection + flooringSection;
                    template += wallsSection + bullnoseSection + outletsSection + lightFixturesSection;
            }
            
            template += '</div>';
            return template;
        }

        function generateDoorSection(room) {
            return `
                <div class="inspection-item">
                    <div class="inspection-item-title">🚪 Door</div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Door Quantity</label>
                            <input type="number" id="${room.type}_door_quantity" min="0" value="1" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                        </div>
                        <div class="form-group">
                            <label>Door Type</label>
                            <select id="${room.type}_door_type" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                                <option value="">Select Type</option>
                                <option value="Wood">Wood</option>
                                <option value="Metal">Metal</option>
                                <option value="Fiberglass">Fiberglass</option>
                                <option value="Glass">Glass</option>
                                <option value="Sliding Glass Door">Sliding Glass Door</option>
                                <option value="Composite">Composite</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Door Dimensions</label>
                            <input type="text" id="${room.type}_door_dimensions" placeholder="e.g., 36x80" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="${room.type}_door_locks_function" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                            Door Locks Function Properly
                        </label>
                    </div>
                    
                    <div class="form-group">
                        <label>Door Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_door_condition" value="Excellent" id="${room.type}_door_excellent" onchange="handleConditionChange('${room.type}_door')">
                                <label for="${room.type}_door_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_door_condition" value="Good" id="${room.type}_door_good" onchange="handleConditionChange('${room.type}_door')">
                                <label for="${room.type}_door_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_door_condition" value="Fair" id="${room.type}_door_fair" onchange="handleConditionChange('${room.type}_door')">
                                <label for="${room.type}_door_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_door_condition" value="Poor" id="${room.type}_door_poor" onchange="handleConditionChange('${room.type}_door')">
                                <label for="${room.type}_door_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_door_condition" value="N/A" id="${room.type}_door_na" onchange="handleConditionChange('${room.type}_door')">
                                <label for="${room.type}_door_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_door_comment" placeholder="Door condition comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                </div>
            `;
        }

        function generateThresholdSection(room) {
            return `
                <div class="inspection-item">
                    <div class="inspection-item-title">Threshold</div>
                    
                    <div class="form-group">
                        <label>Threshold Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_threshold_condition" value="Excellent" id="${room.type}_threshold_excellent" onchange="handleConditionChange('${room.type}_threshold')">
                                <label for="${room.type}_threshold_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_threshold_condition" value="Good" id="${room.type}_threshold_good" onchange="handleConditionChange('${room.type}_threshold')">
                                <label for="${room.type}_threshold_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_threshold_condition" value="Fair" id="${room.type}_threshold_fair" onchange="handleConditionChange('${room.type}_threshold')">
                                <label for="${room.type}_threshold_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_threshold_condition" value="Poor" id="${room.type}_threshold_poor" onchange="handleConditionChange('${room.type}_threshold')">
                                <label for="${room.type}_threshold_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_threshold_condition" value="N/A" id="${room.type}_threshold_na" onchange="handleConditionChange('${room.type}_threshold')">
                                <label for="${room.type}_threshold_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_threshold_comment" placeholder="Threshold condition comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                </div>
            `;
        }

        function generateFlooringSection(room) {
            return `
                <div class="inspection-item">
                    <div class="inspection-item-title">Flooring</div>
                    
                    <div class="form-group">
                        <label>Flooring Type</label>
                        <select id="${room.type}_flooring_type" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                            <option value="">Select Type</option>
                            <option value="Carpet">Carpet</option>
                            <option value="Hardwood">Hardwood</option>
                            <option value="Laminate">Laminate</option>
                            <option value="Tile">Tile</option>
                            <option value="Vinyl">Vinyl</option>
                            <option value="Vinyl Plank">Vinyl Plank</option>
                            <option value="Concrete">Concrete</option>
                            <option value="Linoleum">Linoleum</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Flooring Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_flooring_condition" value="Excellent" id="${room.type}_flooring_excellent" onchange="handleConditionChange('${room.type}_flooring')">
                                <label for="${room.type}_flooring_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_flooring_condition" value="Good" id="${room.type}_flooring_good" onchange="handleConditionChange('${room.type}_flooring')">
                                <label for="${room.type}_flooring_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_flooring_condition" value="Fair" id="${room.type}_flooring_fair" onchange="handleConditionChange('${room.type}_flooring')">
                                <label for="${room.type}_flooring_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_flooring_condition" value="Poor" id="${room.type}_flooring_poor" onchange="handleConditionChange('${room.type}_flooring')">
                                <label for="${room.type}_flooring_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_flooring_condition" value="N/A" id="${room.type}_flooring_na" onchange="handleConditionChange('${room.type}_flooring')">
                                <label for="${room.type}_flooring_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_flooring_comment" placeholder="Flooring condition comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                </div>
            `;
        }

        function generateClosetSection(room) {
            return `
                <div class="inspection-item">
                    <div class="inspection-item-title">Closet</div>
                    
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="${room.type}_has_closet" onchange="toggleEntryCloset('${room.type}')">
                            Has Closet
                        </label>
                    </div>

                    <div id="${room.type}_closet_section" class="hidden" style="margin-top: 20px;">
                        <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                            <h4 style="color: var(--dark-color); margin-bottom: 15px;">Closet Door</h4>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Closet Door Quantity</label>
                                    <input type="number" id="${room.type}_closet_door_quantity" min="0" value="1" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                                </div>
                                <div class="form-group">
                                    <label>Closet Door Type</label>
                                    <select id="${room.type}_closet_door_type" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                                        <option value="">Select Type</option>
                                        <option value="Bifold">Bifold</option>
                                        <option value="Sliding">Sliding</option>
                                        <option value="Hinged">Hinged</option>
                                        <option value="Accordion">Accordion</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Closet Door Dimensions</label>
                                    <input type="text" id="${room.type}_closet_door_dimensions" placeholder="e.g., 48x80" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label>Closet Door Condition</label>
                                <div class="radio-group">
                                    <div class="radio-option">
                                        <input type="radio" name="${room.type}_closet_door_condition" value="Excellent" id="${room.type}_closet_door_excellent" onchange="handleConditionChange('${room.type}_closet_door')">
                                        <label for="${room.type}_closet_door_excellent">Excellent</label>
                                    </div>
                                    <div class="radio-option">
                                        <input type="radio" name="${room.type}_closet_door_condition" value="Good" id="${room.type}_closet_door_good" onchange="handleConditionChange('${room.type}_closet_door')">
                                        <label for="${room.type}_closet_door_good">Good</label>
                                    </div>
                                    <div class="radio-option">
                                        <input type="radio" name="${room.type}_closet_door_condition" value="Fair" id="${room.type}_closet_door_fair" onchange="handleConditionChange('${room.type}_closet_door')">
                                        <label for="${room.type}_closet_door_fair">Fair</label>
                                    </div>
                                    <div class="radio-option">
                                        <input type="radio" name="${room.type}_closet_door_condition" value="Poor" id="${room.type}_closet_door_poor" onchange="handleConditionChange('${room.type}_closet_door')">
                                        <label for="${room.type}_closet_door_poor">Poor</label>
                                    </div>
                                    <div class="radio-option">
                                        <input type="radio" name="${room.type}_closet_door_condition" value="N/A" id="${room.type}_closet_door_na" onchange="handleConditionChange('${room.type}_closet_door')">
                                        <label for="${room.type}_closet_door_na">N/A</label>
                                    </div>
                                </div>
                            </div>
                            <textarea class="comment-field hidden" id="${room.type}_closet_door_comment" placeholder="Closet door condition comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                        </div>

                        <div style="background: #f9fafb; padding: 15px; border-radius: 6px;">
                            <h4 style="color: var(--dark-color); margin-bottom: 15px;">Closet Opening (Wall/Drywall/Paint)</h4>
                            
                            <div class="form-group">
                                <label>Closet Opening Condition</label>
                                <div class="radio-group">
                                    <div class="radio-option">
                                        <input type="radio" name="${room.type}_closet_opening_condition" value="Excellent" id="${room.type}_closet_opening_excellent" onchange="handleConditionChange('${room.type}_closet_opening')">
                                        <label for="${room.type}_closet_opening_excellent">Excellent</label>
                                    </div>
                                    <div class="radio-option">
                                        <input type="radio" name="${room.type}_closet_opening_condition" value="Good" id="${room.type}_closet_opening_good" onchange="handleConditionChange('${room.type}_closet_opening')">
                                        <label for="${room.type}_closet_opening_good">Good</label>
                                    </div>
                                    <div class="radio-option">
                                        <input type="radio" name="${room.type}_closet_opening_condition" value="Fair" id="${room.type}_closet_opening_fair" onchange="handleConditionChange('${room.type}_closet_opening')">
                                        <label for="${room.type}_closet_opening_fair">Fair</label>
                                    </div>
                                    <div class="radio-option">
                                        <input type="radio" name="${room.type}_closet_opening_condition" value="Poor" id="${room.type}_closet_opening_poor" onchange="handleConditionChange('${room.type}_closet_opening')">
                                        <label for="${room.type}_closet_opening_poor">Poor</label>
                                    </div>
                                    <div class="radio-option">
                                        <input type="radio" name="${room.type}_closet_opening_condition" value="N/A" id="${room.type}_closet_opening_na" onchange="handleConditionChange('${room.type}_closet_opening')">
                                        <label for="${room.type}_closet_opening_na">N/A</label>
                                    </div>
                                </div>
                            </div>
                            <textarea class="comment-field hidden" id="${room.type}_closet_opening_comment" placeholder="Closet opening condition comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                        </div>
                    </div>
                </div>
            `;
        }

        function generateWallsSection(room) {
            return `
                <div class="inspection-item">
                    <div class="inspection-item-title">Walls / Ceiling</div>
                    
                    <div class="form-group">
                        <label>Walls/Ceiling Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_walls_condition" value="Excellent" id="${room.type}_walls_excellent" onchange="handleConditionChange('${room.type}_walls')">
                                <label for="${room.type}_walls_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_walls_condition" value="Good" id="${room.type}_walls_good" onchange="handleConditionChange('${room.type}_walls')">
                                <label for="${room.type}_walls_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_walls_condition" value="Fair" id="${room.type}_walls_fair" onchange="handleConditionChange('${room.type}_walls')">
                                <label for="${room.type}_walls_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_walls_condition" value="Poor" id="${room.type}_walls_poor" onchange="handleConditionChange('${room.type}_walls')">
                                <label for="${room.type}_walls_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_walls_condition" value="N/A" id="${room.type}_walls_na" onchange="handleConditionChange('${room.type}_walls')">
                                <label for="${room.type}_walls_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_walls_comment" placeholder="Walls/ceiling condition comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                </div>
            `;
        }

        function generateBullnoseSection(room) {
            return `
                <div class="inspection-item">
                    <div class="inspection-item-title">Bullnose / Corners</div>
                    
                    <div class="form-group">
                        <label>Bullnose/Corners Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_bullnose_condition" value="Excellent" id="${room.type}_bullnose_excellent" onchange="handleConditionChange('${room.type}_bullnose')">
                                <label for="${room.type}_bullnose_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_bullnose_condition" value="Good" id="${room.type}_bullnose_good" onchange="handleConditionChange('${room.type}_bullnose')">
                                <label for="${room.type}_bullnose_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_bullnose_condition" value="Fair" id="${room.type}_bullnose_fair" onchange="handleConditionChange('${room.type}_bullnose')">
                                <label for="${room.type}_bullnose_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_bullnose_condition" value="Poor" id="${room.type}_bullnose_poor" onchange="handleConditionChange('${room.type}_bullnose')">
                                <label for="${room.type}_bullnose_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_bullnose_condition" value="N/A" id="${room.type}_bullnose_na" onchange="handleConditionChange('${room.type}_bullnose')">
                                <label for="${room.type}_bullnose_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_bullnose_comment" placeholder="Bullnose/corners condition comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                </div>
            `;
        }

        function generateOutletsSection(room) {
            return `
                <div class="inspection-item">
                    <div class="inspection-item-title">⚡ Outlets</div>
                    
                    <div class="form-group">
                        <label>Outlet Quantity</label>
                        <input type="number" id="${room.type}_outlet_quantity" min="0" value="0" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                    </div>

                    <div class="form-group">
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                            <label class="checkbox-label">
                                <input type="checkbox" id="${room.type}_outlets_functioning" onchange="handleOutletChange('${room.type}')">
                                Functioning
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" id="${room.type}_outlets_tested" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                                Tested Working
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" id="${room.type}_outlets_loose" onchange="handleOutletChange('${room.type}')">
                                Loose
                            </label>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_outlets_comment" placeholder="Outlet issues..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                </div>
            `;
        }

        function generateGFISection(room) {
            return `
                <div class="inspection-item">
                    <div class="inspection-item-title">⚡ GFI Outlets</div>
                    
                    <div class="form-group">
                        <label>GFI Quantity</label>
                        <input type="number" id="${room.type}_gfi_quantity" min="0" value="0" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                    </div>

                    <div class="form-group">
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                            <label class="checkbox-label">
                                <input type="checkbox" id="${room.type}_gfi_functioning" onchange="handleGFIChange('${room.type}')">
                                Functioning
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" id="${room.type}_gfi_tested" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                                Tested Working
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" id="${room.type}_gfi_loose" onchange="handleGFIChange('${room.type}')">
                                Loose
                            </label>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_gfi_comment" placeholder="GFI issues..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                </div>
            `;
        }

        function generateMoldSection(room) {
            return `
                <div class="inspection-item">
                    <div class="inspection-item-title">🦠 Mold Check</div>
                    
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="${room.type}_mold_present" onchange="handleMoldChange('${room.type}')">
                            Mold Present
                        </label>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_mold_comment" placeholder="Describe mold location and extent..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                </div>
            `;
        }

        function generateCabinetsSection(room) {
            return `
                <div class="inspection-item">
                    <div class="inspection-item-title">🗄️ Cabinets</div>
                    
                    <div class="form-group">
                        <label>Cabinet Quantity</label>
                        <input type="number" id="${room.type}_cabinet_quantity" min="0" value="0" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                    </div>
                    
                    <div class="form-group">
                        <label>Cabinet Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_cabinets_condition" value="Excellent" id="${room.type}_cabinets_excellent" onchange="handleConditionChange('${room.type}_cabinets')">
                                <label for="${room.type}_cabinets_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_cabinets_condition" value="Good" id="${room.type}_cabinets_good" onchange="handleConditionChange('${room.type}_cabinets')">
                                <label for="${room.type}_cabinets_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_cabinets_condition" value="Fair" id="${room.type}_cabinets_fair" onchange="handleConditionChange('${room.type}_cabinets')">
                                <label for="${room.type}_cabinets_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_cabinets_condition" value="Poor" id="${room.type}_cabinets_poor" onchange="handleConditionChange('${room.type}_cabinets')">
                                <label for="${room.type}_cabinets_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_cabinets_condition" value="N/A" id="${room.type}_cabinets_na" onchange="handleConditionChange('${room.type}_cabinets')">
                                <label for="${room.type}_cabinets_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_cabinets_comment" placeholder="Cabinet condition comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                </div>
            `;
        }

        function generateShelvesSection(room) {
            return `
                <div class="inspection-item">
                    <div class="inspection-item-title">📚 Shelves</div>
                    
                    <div class="form-group">
                        <label>Shelf Quantity</label>
                        <input type="number" id="${room.type}_shelf_quantity" min="0" value="0" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                    </div>
                    
                    <div class="form-group">
                        <label>Shelf Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_shelves_condition" value="Excellent" id="${room.type}_shelves_excellent" onchange="handleConditionChange('${room.type}_shelves')">
                                <label for="${room.type}_shelves_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_shelves_condition" value="Good" id="${room.type}_shelves_good" onchange="handleConditionChange('${room.type}_shelves')">
                                <label for="${room.type}_shelves_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_shelves_condition" value="Fair" id="${room.type}_shelves_fair" onchange="handleConditionChange('${room.type}_shelves')">
                                <label for="${room.type}_shelves_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_shelves_condition" value="Poor" id="${room.type}_shelves_poor" onchange="handleConditionChange('${room.type}_shelves')">
                                <label for="${room.type}_shelves_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_shelves_condition" value="N/A" id="${room.type}_shelves_na" onchange="handleConditionChange('${room.type}_shelves')">
                                <label for="${room.type}_shelves_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_shelves_comment" placeholder="Shelf condition comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                </div>
            `;
        }

        function generateDrawersSection(room) {
            return `
                <div class="inspection-item">
                    <div class="inspection-item-title">🗃️ Drawers</div>
                    
                    <div class="form-group">
                        <label>Drawer Quantity</label>
                        <input type="number" id="${room.type}_drawer_quantity" min="0" value="0" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                    </div>
                    
                    <div class="form-group">
                        <label>Drawer Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_drawers_condition" value="Excellent" id="${room.type}_drawers_excellent" onchange="handleConditionChange('${room.type}_drawers')">
                                <label for="${room.type}_drawers_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_drawers_condition" value="Good" id="${room.type}_drawers_good" onchange="handleConditionChange('${room.type}_drawers')">
                                <label for="${room.type}_drawers_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_drawers_condition" value="Fair" id="${room.type}_drawers_fair" onchange="handleConditionChange('${room.type}_drawers')">
                                <label for="${room.type}_drawers_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_drawers_condition" value="Poor" id="${room.type}_drawers_poor" onchange="handleConditionChange('${room.type}_drawers')">
                                <label for="${room.type}_drawers_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_drawers_condition" value="N/A" id="${room.type}_drawers_na" onchange="handleConditionChange('${room.type}_drawers')">
                                <label for="${room.type}_drawers_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Drawer Track Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_drawer_tracks_condition" value="Good" id="${room.type}_drawer_tracks_good" onchange="handleConditionChange('${room.type}_drawer_tracks')">
                                <label for="${room.type}_drawer_tracks_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_drawer_tracks_condition" value="Needs Repair" id="${room.type}_drawer_tracks_repair" onchange="handleConditionChange('${room.type}_drawer_tracks')">
                                <label for="${room.type}_drawer_tracks_repair">Needs Repair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_drawer_tracks_condition" value="Needs Replacement" id="${room.type}_drawer_tracks_replace" onchange="handleConditionChange('${room.type}_drawer_tracks')">
                                <label for="${room.type}_drawer_tracks_replace">Needs Replacement</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_drawer_tracks_condition" value="N/A" id="${room.type}_drawer_tracks_na" onchange="handleConditionChange('${room.type}_drawer_tracks')">
                                <label for="${room.type}_drawer_tracks_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    
                    <textarea class="comment-field hidden" id="${room.type}_drawers_comment" placeholder="Drawer condition comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                    <textarea class="comment-field hidden" id="${room.type}_drawer_tracks_comment" placeholder="Drawer track comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                </div>
            `;
        }

        function generateWindowsSection(room) {
            return `
                <div class="inspection-item">
                    <div class="inspection-item-title">🪟 Windows</div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Window Measurements</label>
                            <input type="text" id="${room.type}_window_measurements" placeholder="e.g., 36x48" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                        </div>
                        <div class="form-group">
                            <label>Blind Measurements</label>
                            <input type="text" id="${room.type}_blind_measurements" placeholder="e.g., 34x46" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Window Covering Type</label>
                        <select id="${room.type}_window_covering_type" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                            <option value="">Select Type</option>
                            <option value="Blinds">Blinds</option>
                            <option value="Curtains">Curtains</option>
                            <option value="Shades">Shades</option>
                            <option value="Drapes">Drapes</option>
                            <option value="None">None</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                            <label class="checkbox-label">
                                <input type="checkbox" id="${room.type}_windows_open" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                                Windows Open
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" id="${room.type}_windows_lock" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                                Windows Lock
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Window Covering Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_window_coverings_condition" value="Excellent" id="${room.type}_window_coverings_excellent" onchange="handleConditionChange('${room.type}_window_coverings')">
                                <label for="${room.type}_window_coverings_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_window_coverings_condition" value="Good" id="${room.type}_window_coverings_good" onchange="handleConditionChange('${room.type}_window_coverings')">
                                <label for="${room.type}_window_coverings_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_window_coverings_condition" value="Fair" id="${room.type}_window_coverings_fair" onchange="handleConditionChange('${room.type}_window_coverings')">
                                <label for="${room.type}_window_coverings_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_window_coverings_condition" value="Poor" id="${room.type}_window_coverings_poor" onchange="handleConditionChange('${room.type}_window_coverings')">
                                <label for="${room.type}_window_coverings_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_window_coverings_condition" value="N/A" id="${room.type}_window_coverings_na" onchange="handleConditionChange('${room.type}_window_coverings')">
                                <label for="${room.type}_window_coverings_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_window_coverings_comment" placeholder="Window covering comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                    
                    <div class="form-group">
                        <label>Window Sill Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_window_sills_condition" value="Excellent" id="${room.type}_window_sills_excellent" onchange="handleConditionChange('${room.type}_window_sills')">
                                <label for="${room.type}_window_sills_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_window_sills_condition" value="Good" id="${room.type}_window_sills_good" onchange="handleConditionChange('${room.type}_window_sills')">
                                <label for="${room.type}_window_sills_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_window_sills_condition" value="Fair" id="${room.type}_window_sills_fair" onchange="handleConditionChange('${room.type}_window_sills')">
                                <label for="${room.type}_window_sills_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_window_sills_condition" value="Poor" id="${room.type}_window_sills_poor" onchange="handleConditionChange('${room.type}_window_sills')">
                                <label for="${room.type}_window_sills_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_window_sills_condition" value="N/A" id="${room.type}_window_sills_na" onchange="handleConditionChange('${room.type}_window_sills')">
                                <label for="${room.type}_window_sills_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_window_sills_comment" placeholder="Window sill comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                    
                    <div class="form-group">
                        <label>Window Screen Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_window_screens_condition" value="Excellent" id="${room.type}_window_screens_excellent" onchange="handleConditionChange('${room.type}_window_screens')">
                                <label for="${room.type}_window_screens_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_window_screens_condition" value="Good" id="${room.type}_window_screens_good" onchange="handleConditionChange('${room.type}_window_screens')">
                                <label for="${room.type}_window_screens_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_window_screens_condition" value="Fair" id="${room.type}_window_screens_fair" onchange="handleConditionChange('${room.type}_window_screens')">
                                <label for="${room.type}_window_screens_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_window_screens_condition" value="Poor" id="${room.type}_window_screens_poor" onchange="handleConditionChange('${room.type}_window_screens')">
                                <label for="${room.type}_window_screens_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_window_screens_condition" value="N/A" id="${room.type}_window_screens_na" onchange="handleConditionChange('${room.type}_window_screens')">
                                <label for="${room.type}_window_screens_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_window_screens_comment" placeholder="Window screen comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                </div>
            `;
        }

        function generateHeaterSection(room) {
            return `
                <div class="inspection-item">
                    <div class="inspection-item-title">🔥 Heater</div>
                    
                    <div class="form-group">
                        <label>Heater Type</label>
                        <select id="${room.type}_heater_type" onchange="handleHeaterTypeChange('${room.type}')">
                            <option value="">Select Type</option>
                            <option value="Baseboard">Baseboard</option>
                            <option value="Wall Unit">Wall Unit</option>
                            <option value="Floor Vent">Floor Vent</option>
                            <option value="Radiator">Radiator</option>
                            <option value="Mini Split Air Handler">Mini Split Air Handler</option>
                            <option value="None">None</option>
                        </select>
                    </div>
                    
                    <div id="${room.type}_baseboard_length" class="hidden" style="margin-top: 10px;">
                        <div class="form-group">
                            <label>Baseboard Length (feet)</label>
                            <input type="number" id="${room.type}_baseboard_length_feet" min="0" placeholder="Length in feet" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="${room.type}_has_thermostat" onchange="toggleThermostat('${room.type}')">
                            Has Thermostat
                        </label>
                    </div>
                    
                    <div id="${room.type}_thermostat_section" class="hidden" style="background: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 15px;">
                        <h4 style="color: var(--dark-color); margin-bottom: 15px;">Thermostat</h4>
                        
                        <div class="form-group">
                            <label>Thermostat Type</label>
                            <select id="${room.type}_thermostat_type" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                                <option value="">Select Type</option>
                                <option value="Digital">Digital</option>
                                <option value="Programmable">Programmable</option>
                                <option value="Smart">Smart</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Thermostat Condition</label>
                            <div class="radio-group">
                                <div class="radio-option">
                                    <input type="radio" name="${room.type}_thermostat_condition" value="Excellent" id="${room.type}_thermostat_excellent" onchange="handleConditionChange('${room.type}_thermostat')">
                                    <label for="${room.type}_thermostat_excellent">Excellent</label>
                                </div>
                                <div class="radio-option">
                                    <input type="radio" name="${room.type}_thermostat_condition" value="Good" id="${room.type}_thermostat_good" onchange="handleConditionChange('${room.type}_thermostat')">
                                    <label for="${room.type}_thermostat_good">Good</label>
                                </div>
                                <div class="radio-option">
                                    <input type="radio" name="${room.type}_thermostat_condition" value="Fair" id="${room.type}_thermostat_fair" onchange="handleConditionChange('${room.type}_thermostat')">
                                    <label for="${room.type}_thermostat_fair">Fair</label>
                                </div>
                                <div class="radio-option">
                                    <input type="radio" name="${room.type}_thermostat_condition" value="Poor" id="${room.type}_thermostat_poor" onchange="handleConditionChange('${room.type}_thermostat')">
                                    <label for="${room.type}_thermostat_poor">Poor</label>
                                </div>
                            </div>
                        </div>
                        <textarea class="comment-field hidden" id="${room.type}_thermostat_comment" placeholder="Thermostat comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                    </div>
                    
                    <div class="form-group" style="margin-top: 15px;">
                        <label>Heater Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_heater_condition" value="Excellent" id="${room.type}_heater_excellent" onchange="handleConditionChange('${room.type}_heater')">
                                <label for="${room.type}_heater_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_heater_condition" value="Good" id="${room.type}_heater_good" onchange="handleConditionChange('${room.type}_heater')">
                                <label for="${room.type}_heater_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_heater_condition" value="Fair" id="${room.type}_heater_fair" onchange="handleConditionChange('${room.type}_heater')">
                                <label for="${room.type}_heater_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_heater_condition" value="Poor" id="${room.type}_heater_poor" onchange="handleConditionChange('${room.type}_heater')">
                                <label for="${room.type}_heater_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_heater_condition" value="N/A" id="${room.type}_heater_na" onchange="handleConditionChange('${room.type}_heater')">
                                <label for="${room.type}_heater_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_heater_comment" placeholder="Heater condition comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                </div>
            `;
        }

        function generateDeckTemplate(room) {
            return `
                <div class="inspection-item">
                    <div class="inspection-item-title">Deck/Patio Surface</div>
                    <div class="form-group">
                        <label>Surface Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_surface_condition" value="Excellent" id="${room.type}_surface_excellent" onchange="handleConditionChange('${room.type}_surface')">
                                <label for="${room.type}_surface_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_surface_condition" value="Good" id="${room.type}_surface_good" onchange="handleConditionChange('${room.type}_surface')">
                                <label for="${room.type}_surface_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_surface_condition" value="Fair" id="${room.type}_surface_fair" onchange="handleConditionChange('${room.type}_surface')">
                                <label for="${room.type}_surface_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_surface_condition" value="Poor" id="${room.type}_surface_poor" onchange="handleConditionChange('${room.type}_surface')">
                                <label for="${room.type}_surface_poor">Poor</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_surface_comment" placeholder="Surface condition comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                </div>
                
                <div class="inspection-item">
                    <div class="inspection-item-title">Railings</div>
                    <div class="form-group">
                        <label>Railing Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_railing_condition" value="Excellent" id="${room.type}_railing_excellent" onchange="handleConditionChange('${room.type}_railing')">
                                <label for="${room.type}_railing_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_railing_condition" value="Good" id="${room.type}_railing_good" onchange="handleConditionChange('${room.type}_railing')">
                                <label for="${room.type}_railing_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_railing_condition" value="Fair" id="${room.type}_railing_fair" onchange="handleConditionChange('${room.type}_railing')">
                                <label for="${room.type}_railing_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_railing_condition" value="Poor" id="${room.type}_railing_poor" onchange="handleConditionChange('${room.type}_railing')">
                                <label for="${room.type}_railing_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_railing_condition" value="N/A" id="${room.type}_railing_na" onchange="handleConditionChange('${room.type}_railing')">
                                <label for="${room.type}_railing_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_railing_comment" placeholder="Railing condition comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                </div>
            `;
        }

        function generateTubShowerSection(room) {
            return `
                <div class="inspection-item">
                    <div class="inspection-item-title">🚿 Tub/Shower</div>
                    
                    <div class="form-group">
                        <label>Tub/Shower Type</label>
                        <select id="${room.type}_tubshower_type" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                            <option value="">Select Type</option>
                            <option value="Tub Only">Tub Only</option>
                            <option value="Shower Only">Shower Only</option>
                            <option value="Tub/Shower Combo">Tub/Shower Combo</option>
                            <option value="Walk-in Shower">Walk-in Shower</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Tub/Shower Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_tubshower_condition" value="Excellent" id="${room.type}_tubshower_excellent" onchange="handleConditionChange('${room.type}_tubshower')">
                                <label for="${room.type}_tubshower_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_tubshower_condition" value="Good" id="${room.type}_tubshower_good" onchange="handleConditionChange('${room.type}_tubshower')">
                                <label for="${room.type}_tubshower_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_tubshower_condition" value="Fair" id="${room.type}_tubshower_fair" onchange="handleConditionChange('${room.type}_tubshower')">
                                <label for="${room.type}_tubshower_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_tubshower_condition" value="Poor" id="${room.type}_tubshower_poor" onchange="handleConditionChange('${room.type}_tubshower')">
                                <label for="${room.type}_tubshower_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_tubshower_condition" value="N/A" id="${room.type}_tubshower_na" onchange="handleConditionChange('${room.type}_tubshower')">
                                <label for="${room.type}_tubshower_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_tubshower_comment" placeholder="Tub/shower condition comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                    
                    <div class="form-group" style="margin-top: 15px;">
                        <label>Shower Fixtures Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_shower_fixtures_condition" value="Excellent" id="${room.type}_shower_fixtures_excellent" onchange="handleConditionChange('${room.type}_shower_fixtures')">
                                <label for="${room.type}_shower_fixtures_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_shower_fixtures_condition" value="Good" id="${room.type}_shower_fixtures_good" onchange="handleConditionChange('${room.type}_shower_fixtures')">
                                <label for="${room.type}_shower_fixtures_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_shower_fixtures_condition" value="Fair" id="${room.type}_shower_fixtures_fair" onchange="handleConditionChange('${room.type}_shower_fixtures')">
                                <label for="${room.type}_shower_fixtures_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_shower_fixtures_condition" value="Poor" id="${room.type}_shower_fixtures_poor" onchange="handleConditionChange('${room.type}_shower_fixtures')">
                                <label for="${room.type}_shower_fixtures_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_shower_fixtures_condition" value="N/A" id="${room.type}_shower_fixtures_na" onchange="handleConditionChange('${room.type}_shower_fixtures')">
                                <label for="${room.type}_shower_fixtures_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_shower_fixtures_comment" placeholder="Shower fixtures comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                    
                    <div class="form-group" style="margin-top: 15px;">
                        <label>Shower Plumbing Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_shower_plumbing_condition" value="Excellent" id="${room.type}_shower_plumbing_excellent" onchange="handleConditionChange('${room.type}_shower_plumbing')">
                                <label for="${room.type}_shower_plumbing_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_shower_plumbing_condition" value="Good" id="${room.type}_shower_plumbing_good" onchange="handleConditionChange('${room.type}_shower_plumbing')">
                                <label for="${room.type}_shower_plumbing_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_shower_plumbing_condition" value="Fair" id="${room.type}_shower_plumbing_fair" onchange="handleConditionChange('${room.type}_shower_plumbing')">
                                <label for="${room.type}_shower_plumbing_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_shower_plumbing_condition" value="Poor" id="${room.type}_shower_plumbing_poor" onchange="handleConditionChange('${room.type}_shower_plumbing')">
                                <label for="${room.type}_shower_plumbing_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_shower_plumbing_condition" value="N/A" id="${room.type}_shower_plumbing_na" onchange="handleConditionChange('${room.type}_shower_plumbing')">
                                <label for="${room.type}_shower_plumbing_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_shower_plumbing_comment" placeholder="Shower plumbing comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                </div>
            `;
        }

        function generateToiletSection(room) {
            return `
                <div class="inspection-item">
                    <div class="inspection-item-title">🚽 Toilet</div>
                    
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="${room.type}_toilet_fixed_floor" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                            Properly Fixed to Floor
                        </label>
                    </div>
                    
                    <div class="form-group">
                        <label>Caulking Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_toilet_caulking_condition" value="Excellent" id="${room.type}_toilet_caulking_excellent" onchange="handleConditionChange('${room.type}_toilet_caulking')">
                                <label for="${room.type}_toilet_caulking_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_toilet_caulking_condition" value="Good" id="${room.type}_toilet_caulking_good" onchange="handleConditionChange('${room.type}_toilet_caulking')">
                                <label for="${room.type}_toilet_caulking_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_toilet_caulking_condition" value="Fair" id="${room.type}_toilet_caulking_fair" onchange="handleConditionChange('${room.type}_toilet_caulking')">
                                <label for="${room.type}_toilet_caulking_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_toilet_caulking_condition" value="Poor" id="${room.type}_toilet_caulking_poor" onchange="handleConditionChange('${room.type}_toilet_caulking')">
                                <label for="${room.type}_toilet_caulking_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_toilet_caulking_condition" value="N/A" id="${room.type}_toilet_caulking_na" onchange="handleConditionChange('${room.type}_toilet_caulking')">
                                <label for="${room.type}_toilet_caulking_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_toilet_caulking_comment" placeholder="Caulking condition comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                    
                    <div class="form-group" style="margin-top: 15px;">
                        <label>Toilet Plumbing Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_toilet_plumbing_condition" value="Excellent" id="${room.type}_toilet_plumbing_excellent" onchange="handleConditionChange('${room.type}_toilet_plumbing')">
                                <label for="${room.type}_toilet_plumbing_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_toilet_plumbing_condition" value="Good" id="${room.type}_toilet_plumbing_good" onchange="handleConditionChange('${room.type}_toilet_plumbing')">
                                <label for="${room.type}_toilet_plumbing_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_toilet_plumbing_condition" value="Fair" id="${room.type}_toilet_plumbing_fair" onchange="handleConditionChange('${room.type}_toilet_plumbing')">
                                <label for="${room.type}_toilet_plumbing_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_toilet_plumbing_condition" value="Poor" id="${room.type}_toilet_plumbing_poor" onchange="handleConditionChange('${room.type}_toilet_plumbing')">
                                <label for="${room.type}_toilet_plumbing_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_toilet_plumbing_condition" value="N/A" id="${room.type}_toilet_plumbing_na" onchange="handleConditionChange('${room.type}_toilet_plumbing')">
                                <label for="${room.type}_toilet_plumbing_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_toilet_plumbing_comment" placeholder="Toilet plumbing comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                </div>
            `;
        }

        function generateSinkSection(room) {
            return `
                <div class="inspection-item">
                    <div class="inspection-item-title">🚰 Sink</div>
                    
                    <div class="form-group">
                        <label>Sink Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_sink_condition" value="Excellent" id="${room.type}_sink_excellent" onchange="handleConditionChange('${room.type}_sink')">
                                <label for="${room.type}_sink_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_sink_condition" value="Good" id="${room.type}_sink_good" onchange="handleConditionChange('${room.type}_sink')">
                                <label for="${room.type}_sink_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_sink_condition" value="Fair" id="${room.type}_sink_fair" onchange="handleConditionChange('${room.type}_sink')">
                                <label for="${room.type}_sink_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_sink_condition" value="Poor" id="${room.type}_sink_poor" onchange="handleConditionChange('${room.type}_sink')">
                                <label for="${room.type}_sink_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_sink_condition" value="N/A" id="${room.type}_sink_na" onchange="handleConditionChange('${room.type}_sink')">
                                <label for="${room.type}_sink_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_sink_comment" placeholder="Sink condition comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                    
                    <div class="form-group" style="margin-top: 15px;">
                        <label class="checkbox-label">
                            <input type="checkbox" id="${room.type}_sink_shutoff_access" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                            Proper Access to Shutoffs
                        </label>
                    </div>
                    
                    <div class="form-group">
                        <label>Sink Plumbing Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_sink_plumbing_condition" value="Excellent" id="${room.type}_sink_plumbing_excellent" onchange="handleConditionChange('${room.type}_sink_plumbing')">
                                <label for="${room.type}_sink_plumbing_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_sink_plumbing_condition" value="Good" id="${room.type}_sink_plumbing_good" onchange="handleConditionChange('${room.type}_sink_plumbing')">
                                <label for="${room.type}_sink_plumbing_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_sink_plumbing_condition" value="Fair" id="${room.type}_sink_plumbing_fair" onchange="handleConditionChange('${room.type}_sink_plumbing')">
                                <label for="${room.type}_sink_plumbing_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_sink_plumbing_condition" value="Poor" id="${room.type}_sink_plumbing_poor" onchange="handleConditionChange('${room.type}_sink_plumbing')">
                                <label for="${room.type}_sink_plumbing_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_sink_plumbing_condition" value="N/A" id="${room.type}_sink_plumbing_na" onchange="handleConditionChange('${room.type}_sink_plumbing')">
                                <label for="${room.type}_sink_plumbing_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_sink_plumbing_comment" placeholder="Sink plumbing comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                </div>
            `;
        }

        function generateMedicineCabinetSection(room) {
            return `
                <div class="inspection-item">
                    <div class="inspection-item-title">🪞 Medicine Cabinet / Mirror</div>
                    
                    <div class="form-group">
                        <label>Medicine Cabinet/Mirror Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_medicine_cabinet_condition" value="Excellent" id="${room.type}_medicine_cabinet_excellent" onchange="handleConditionChange('${room.type}_medicine_cabinet')">
                                <label for="${room.type}_medicine_cabinet_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_medicine_cabinet_condition" value="Good" id="${room.type}_medicine_cabinet_good" onchange="handleConditionChange('${room.type}_medicine_cabinet')">
                                <label for="${room.type}_medicine_cabinet_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_medicine_cabinet_condition" value="Fair" id="${room.type}_medicine_cabinet_fair" onchange="handleConditionChange('${room.type}_medicine_cabinet')">
                                <label for="${room.type}_medicine_cabinet_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_medicine_cabinet_condition" value="Poor" id="${room.type}_medicine_cabinet_poor" onchange="handleConditionChange('${room.type}_medicine_cabinet')">
                                <label for="${room.type}_medicine_cabinet_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_medicine_cabinet_condition" value="N/A" id="${room.type}_medicine_cabinet_na" onchange="handleConditionChange('${room.type}_medicine_cabinet')">
                                <label for="${room.type}_medicine_cabinet_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_medicine_cabinet_comment" placeholder="Medicine cabinet/mirror comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                </div>
            `;
        }

        function generateExhaustFanSection(room) {
            return `
                <div class="inspection-item">
                    <div class="inspection-item-title">🌀 Exhaust Fan</div>
                    
                    <div class="form-group">
                        <label>Exhaust Fan Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_exhaust_fan_condition" value="Excellent" id="${room.type}_exhaust_fan_excellent" onchange="handleConditionChange('${room.type}_exhaust_fan')">
                                <label for="${room.type}_exhaust_fan_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_exhaust_fan_condition" value="Good" id="${room.type}_exhaust_fan_good" onchange="handleConditionChange('${room.type}_exhaust_fan')">
                                <label for="${room.type}_exhaust_fan_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_exhaust_fan_condition" value="Fair" id="${room.type}_exhaust_fan_fair" onchange="handleConditionChange('${room.type}_exhaust_fan')">
                                <label for="${room.type}_exhaust_fan_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_exhaust_fan_condition" value="Poor" id="${room.type}_exhaust_fan_poor" onchange="handleConditionChange('${room.type}_exhaust_fan')">
                                <label for="${room.type}_exhaust_fan_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_exhaust_fan_condition" value="N/A" id="${room.type}_exhaust_fan_na" onchange="handleConditionChange('${room.type}_exhaust_fan')">
                                <label for="${room.type}_exhaust_fan_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_exhaust_fan_comment" placeholder="Exhaust fan condition comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                </div>
            `;
        }

        function generateLightFixturesSection(room) {
            return `
                <div class="inspection-item">
                    <div class="inspection-item-title">💡 Light Fixtures</div>
                    
                    <div class="form-group">
                        <label>Light Fixture Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_light_fixture_condition" value="Excellent" id="${room.type}_light_fixture_excellent" onchange="handleConditionChange('${room.type}_light_fixture')">
                                <label for="${room.type}_light_fixture_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_light_fixture_condition" value="Good" id="${room.type}_light_fixture_good" onchange="handleConditionChange('${room.type}_light_fixture')">
                                <label for="${room.type}_light_fixture_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_light_fixture_condition" value="Fair" id="${room.type}_light_fixture_fair" onchange="handleConditionChange('${room.type}_light_fixture')">
                                <label for="${room.type}_light_fixture_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_light_fixture_condition" value="Poor" id="${room.type}_light_fixture_poor" onchange="handleConditionChange('${room.type}_light_fixture')">
                                <label for="${room.type}_light_fixture_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_light_fixture_condition" value="N/A" id="${room.type}_light_fixture_na" onchange="handleConditionChange('${room.type}_light_fixture')">
                                <label for="${room.type}_light_fixture_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_light_fixture_comment" placeholder="Light fixture comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                    
                    <div class="form-row" style="margin-top: 15px;">
                        <div class="form-group">
                            <label>Light Bulb Quantity</label>
                            <input type="number" id="${room.type}_light_bulb_quantity" min="0" value="0" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                        </div>
                        <div class="form-group">
                            <label>Light Switch Quantity</label>
                            <input type="number" id="${room.type}_light_switch_quantity" min="0" value="0" onchange="saveCurrentRoomData(); renderRoomPhotoButtons();">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Light Bulb Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_light_bulb_condition" value="Excellent" id="${room.type}_light_bulb_excellent" onchange="handleConditionChange('${room.type}_light_bulb')">
                                <label for="${room.type}_light_bulb_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_light_bulb_condition" value="Good" id="${room.type}_light_bulb_good" onchange="handleConditionChange('${room.type}_light_bulb')">
                                <label for="${room.type}_light_bulb_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_light_bulb_condition" value="Fair" id="${room.type}_light_bulb_fair" onchange="handleConditionChange('${room.type}_light_bulb')">
                                <label for="${room.type}_light_bulb_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_light_bulb_condition" value="Poor" id="${room.type}_light_bulb_poor" onchange="handleConditionChange('${room.type}_light_bulb')">
                                <label for="${room.type}_light_bulb_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_light_bulb_condition" value="N/A" id="${room.type}_light_bulb_na" onchange="handleConditionChange('${room.type}_light_bulb')">
                                <label for="${room.type}_light_bulb_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_light_bulb_comment" placeholder="Light bulb comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                    
                    <div class="form-group" style="margin-top: 15px;">
                        <label>Light Switch Condition</label>
                        <div class="radio-group">
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_light_switch_condition" value="Excellent" id="${room.type}_light_switch_excellent" onchange="handleConditionChange('${room.type}_light_switch')">
                                <label for="${room.type}_light_switch_excellent">Excellent</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_light_switch_condition" value="Good" id="${room.type}_light_switch_good" onchange="handleConditionChange('${room.type}_light_switch')">
                                <label for="${room.type}_light_switch_good">Good</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_light_switch_condition" value="Fair" id="${room.type}_light_switch_fair" onchange="handleConditionChange('${room.type}_light_switch')">
                                <label for="${room.type}_light_switch_fair">Fair</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_light_switch_condition" value="Poor" id="${room.type}_light_switch_poor" onchange="handleConditionChange('${room.type}_light_switch')">
                                <label for="${room.type}_light_switch_poor">Poor</label>
                            </div>
                            <div class="radio-option">
                                <input type="radio" name="${room.type}_light_switch_condition" value="N/A" id="${room.type}_light_switch_na" onchange="handleConditionChange('${room.type}_light_switch')">
                                <label for="${room.type}_light_switch_na">N/A</label>
                            </div>
                        </div>
                    </div>
                    <textarea class="comment-field hidden" id="${room.type}_light_switch_comment" placeholder="Light switch comments..." onchange="saveCurrentRoomData(); renderRoomPhotoButtons();"></textarea>
                </div>
            `;
        }

        function handleHeaterTypeChange(roomType) {
            const heaterType = document.getElementById(`${roomType}_heater_type`);
            const baseboardLengthSection = document.getElementById(`${roomType}_baseboard_length`);
            
            if (heaterType && baseboardLengthSection) {
                if (heaterType.value === 'Baseboard') {
                    baseboardLengthSection.classList.remove('hidden');
                } else {
                    baseboardLengthSection.classList.add('hidden');
                }
            }
            
            saveCurrentRoomData();
            renderRoomPhotoButtons();
        }

        function toggleThermostat(roomType) {
            const checkbox = document.getElementById(`${roomType}_has_thermostat`);
            const thermostatSection = document.getElementById(`${roomType}_thermostat_section`);
            
            if (checkbox && thermostatSection) {
                if (checkbox.checked) {
                    thermostatSection.classList.remove('hidden');
                } else {
                    thermostatSection.classList.add('hidden');
                }
            }
            
            saveCurrentRoomData();
            renderRoomPhotoButtons();
        }

        function handleHousekeepingChange(roomType, value) {
            const commentField = document.getElementById(`${roomType}_housekeeping_comment`);
            if (commentField) {
                if (value === 'Clean') {
                    commentField.classList.add('hidden');
                    commentField.value = '';
                } else {
                    commentField.classList.remove('hidden');
                }
            }
            renderRoomPhotoButtons();
        }

        function handleConditionChange(fieldPrefix) {
            const radios = document.getElementsByName(`${fieldPrefix}_condition`);
            const commentField = document.getElementById(`${fieldPrefix}_comment`);
            
            if (!commentField) return;
            
            let selectedValue = '';
            for (const radio of radios) {
                if (radio.checked) {
                    selectedValue = radio.value;
                    break;
                }
            }
            
            // Show comment field for Fair, Poor, or Needs Cleaning/Repair
            if (selectedValue === 'Fair' || selectedValue === 'Poor' || selectedValue === 'Needs Cleaning' || selectedValue === 'Needs Repair') {
                commentField.classList.remove('hidden');
            } else {
                commentField.classList.add('hidden');
                commentField.value = '';
            }
            
            saveCurrentRoomData();
            renderRoomPhotoButtons();
        }

        function toggleEntryCloset(roomType) {
            const checkbox = document.getElementById(`${roomType}_has_closet`);
            const closetSection = document.getElementById(`${roomType}_closet_section`);
            
            if (checkbox && closetSection) {
                if (checkbox.checked) {
                    closetSection.classList.remove('hidden');
                } else {
                    closetSection.classList.add('hidden');
                }
            }
            
            saveCurrentRoomData();
            renderRoomPhotoButtons();
        }

        function handleOutletChange(roomType) {
            const looseCheckbox = document.getElementById(`${roomType}_outlets_loose`);
            const functioningCheckbox = document.getElementById(`${roomType}_outlets_functioning`);
            const commentField = document.getElementById(`${roomType}_outlets_comment`);
            
            if (commentField) {
                // Show comment if loose is checked OR functioning is unchecked
                if ((looseCheckbox && looseCheckbox.checked) || (functioningCheckbox && !functioningCheckbox.checked)) {
                    commentField.classList.remove('hidden');
                } else {
                    commentField.classList.add('hidden');
                    commentField.value = '';
                }
            }
            
            saveCurrentRoomData();
            renderRoomPhotoButtons();
        }

        function handleGFIChange(roomType) {
            const looseCheckbox = document.getElementById(`${roomType}_gfi_loose`);
            const functioningCheckbox = document.getElementById(`${roomType}_gfi_functioning`);
            const commentField = document.getElementById(`${roomType}_gfi_comment`);
            
            if (commentField) {
                // Show comment if loose is checked OR functioning is unchecked
                if ((looseCheckbox && looseCheckbox.checked) || (functioningCheckbox && !functioningCheckbox.checked)) {
                    commentField.classList.remove('hidden');
                } else {
                    commentField.classList.add('hidden');
                    commentField.value = '';
                }
            }
            
            saveCurrentRoomData();
            renderRoomPhotoButtons();
        }

        function handleMoldChange(roomType) {
            const moldCheckbox = document.getElementById(`${roomType}_mold_present`);
            const commentField = document.getElementById(`${roomType}_mold_comment`);
            
            if (commentField && moldCheckbox) {
                if (moldCheckbox.checked) {
                    commentField.classList.remove('hidden');
                } else {
                    commentField.classList.add('hidden');
                    commentField.value = '';
                }
            }
            
            saveCurrentRoomData();
            renderRoomPhotoButtons();
        }

        function renderRoomPhotoButtons() {
            const room = rooms[currentRoomIndex];
            if (!room) return;

            const photoButtons = document.getElementById('roomPhotoButtons');
            photoButtons.innerHTML = '';

            // Define all possible comment fields
            const commentFields = [
                { id: `${room.type}_housekeeping_comment`, label: 'Housekeeping' },
                { id: `${room.type}_door_comment`, label: 'Door' },
                { id: `${room.type}_threshold_comment`, label: 'Threshold' },
                { id: `${room.type}_flooring_comment`, label: 'Flooring' },
                { id: `${room.type}_closet_door_comment`, label: 'Closet Door' },
                { id: `${room.type}_closet_opening_comment`, label: 'Closet Opening' },
                { id: `${room.type}_walls_comment`, label: 'Walls/Ceiling' },
                { id: `${room.type}_bullnose_comment`, label: 'Bullnose/Corners' },
                { id: `${room.type}_outlets_comment`, label: 'Outlets' },
                { id: `${room.type}_gfi_comment`, label: 'GFI' },
                { id: `${room.type}_mold_comment`, label: 'Mold' },
                { id: `${room.type}_sink_comment`, label: 'Sink' },
                { id: `${room.type}_sink_plumbing_comment`, label: 'Sink Plumbing' },
                { id: `${room.type}_toilet_caulking_comment`, label: 'Toilet Caulking' },
                { id: `${room.type}_toilet_plumbing_comment`, label: 'Toilet Plumbing' },
                { id: `${room.type}_tubshower_comment`, label: 'Tub/Shower' },
                { id: `${room.type}_shower_fixtures_comment`, label: 'Shower Fixtures' },
                { id: `${room.type}_shower_plumbing_comment`, label: 'Shower Plumbing' },
                { id: `${room.type}_exhaust_fan_comment`, label: 'Exhaust Fan' },
                { id: `${room.type}_medicine_cabinet_comment`, label: 'Medicine Cabinet/Mirror' },
                { id: `${room.type}_cabinets_comment`, label: 'Cabinets' },
                { id: `${room.type}_shelves_comment`, label: 'Shelves' },
                { id: `${room.type}_drawers_comment`, label: 'Drawers' },
                { id: `${room.type}_drawer_tracks_comment`, label: 'Drawer Tracks' },
                { id: `${room.type}_heater_comment`, label: 'Heater' },
                { id: `${room.type}_thermostat_comment`, label: 'Thermostat' },
                { id: `${room.type}_window_coverings_comment`, label: 'Window Coverings' },
                { id: `${room.type}_window_sills_comment`, label: 'Window Sills' },
                { id: `${room.type}_window_screens_comment`, label: 'Window Screens' },
                { id: `${room.type}_light_fixture_comment`, label: 'Light Fixture' },
                { id: `${room.type}_light_bulb_comment`, label: 'Light Bulbs' },
                { id: `${room.type}_light_switch_comment`, label: 'Light Switches' },
                { id: `${room.type}_surface_comment`, label: 'Deck Surface' },
                { id: `${room.type}_railing_comment`, label: 'Deck Railing' }
            ];

            // Generate photo buttons for each comment field that has content and is visible
            commentFields.forEach(field => {
                const commentElement = document.getElementById(field.id);
                if (commentElement && commentElement.value && !commentElement.classList.contains('hidden')) {
                    const btn = document.createElement('button');
                    btn.className = 'photo-upload-btn';
                    const commentPreview = commentElement.value.substring(0, 30);
                    btn.textContent = `📷 ${room.name} - ${field.label} - ${commentPreview}${commentElement.value.length > 30 ? '...' : ''}`;
                    btn.onclick = () => triggerPhotoUpload('room', `${room.name} - ${field.label}`, commentElement.value);
                    photoButtons.appendChild(btn);
                }
            });
        }

        // Report generation
        function generateReport() {
            saveCurrentRoomData();
            
            // Get current color values
            const primaryColor = document.getElementById('primaryColor').value;
            const secondaryColor = document.getElementById('secondaryColor').value;
            const darkColor = document.getElementById('darkColor').value;

            let report = `
                <style>
                    .report-table {
                        border-color: ${secondaryColor} !important;
                    }
                    .report-table th {
                        background: ${darkColor} !important;
                        color: white !important;
                    }
                    .report-table td {
                        border-color: ${secondaryColor} !important;
                        color: black !important;
                    }
                    .report-section-title {
                        color: ${primaryColor} !important;
                    }
                </style>
                <div class="report-section">
                    <p style="text-align: center; color: ${secondaryColor}; margin-bottom: 40px; padding-top: 20px;">
                        Property information is displayed in the header above
                    </p>
                </div>
            `;

            // Safety section
            if (smokeAlarms.length > 0) {
                report += '<div class="report-section"><h3 class="report-section-title">⚠️ Safety</h3>';
                report += '<table class="report-table"><tr><th>#</th><th>Location</th><th>Type</th><th>Power</th><th>Alert</th><th>Interconnected</th><th>Condition</th><th>Comments</th></tr>';
                smokeAlarms.forEach(alarm => {
                    if (alarm.location || alarm.type || alarm.condition) {
                        const interconnected = alarm.interconnected ? 'Yes' : 'No';
                        report += `<tr><td>${alarm.number}</td><td>${alarm.location}</td><td>${alarm.type}</td><td>${alarm.power || ''}</td><td>${alarm.alert || ''}</td><td>${interconnected}</td><td>${alarm.condition}</td><td>${alarm.comment || ''}</td></tr>`;
                    }
                });
                report += '</table>';
                
                if (allPhotos['safety'] && allPhotos['safety'].length > 0) {
                    report += '<h4 style="margin-top: 20px;">Safety Photos:</h4><div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">';
                    allPhotos['safety'].forEach(photo => {
                        report += `<div><img src="${photo.data}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px;"><p style="font-size: 12px; margin-top: 5px;"><strong>${photo.displayTitle}</strong><br>${photo.comment}</p></div>`;
                    });
                    report += '</div>';
                }
                report += '</div>';
            }

            // Appliances section
            if (appliances.length > 0) {
                report += '<div class="report-section"><h3 class="report-section-title">🔌 Appliances</h3>';
                report += '<table class="report-table"><tr><th>#</th><th>Location</th><th>Type</th><th>Brand</th><th>Model</th><th>Serial</th><th>Condition</th><th>Comments</th></tr>';
                appliances.forEach(app => {
                    if (app.type || app.brand || app.condition) {
                        report += `<tr><td>${app.number}</td><td>${app.location || ''}</td><td>${app.type}</td><td>${app.brand}</td><td>${app.model}</td><td>${app.serial}</td><td>${app.condition}</td><td>${app.comment || ''}</td></tr>`;
                    }
                });
                report += '</table>';
                
                if (allPhotos['appliance'] && allPhotos['appliance'].length > 0) {
                    report += '<h4 style="margin-top: 20px;">Appliance Photos:</h4><div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">';
                    allPhotos['appliance'].forEach(photo => {
                        report += `<div><img src="${photo.data}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px;"><p style="font-size: 12px; margin-top: 5px;"><strong>${photo.displayTitle}</strong><br>${photo.comment}</p></div>`;
                    });
                    report += '</div>';
                }
                report += '</div>';
            }

            // Rooms section
            if (rooms.length > 0) {
                report += '<div class="report-section"><h3 class="report-section-title">🏠 Room Inspections</h3>';
                rooms.forEach(room => {
                    if (room.data && Object.keys(room.data).length > 0) {
                        report += `<h4 style="margin-top: 20px; color: ${darkColor};">${room.name}</h4>`;
                        report += '<table class="report-table">';
                        for (const [key, value] of Object.entries(room.data)) {
                            if (value && value !== '' && value !== false) {
                                const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                                report += `<tr><td><strong>${label}:</strong></td><td>${value}</td></tr>`;
                            }
                        }
                        report += '</table>';
                    }
                });
                
                if (allPhotos['room'] && allPhotos['room'].length > 0) {
                    report += '<h4 style="margin-top: 20px;">Room Photos:</h4><div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">';
                    allPhotos['room'].forEach(photo => {
                        report += `<div><img src="${photo.data}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px;"><p style="font-size: 12px; margin-top: 5px;"><strong>${photo.displayTitle}</strong><br>${photo.comment}</p></div>`;
                    });
                    report += '</div>';
                }
                report += '</div>';
            }

            const brandingDisplay = document.getElementById('companyNameDisplay').textContent + document.getElementById('brandingText').textContent + ' - INSPECTION REPORT';
            report += `<div style="margin-top: 40px; text-align: center; color: #64748b; font-size: 12px;">${brandingDisplay}</div>`;

            document.getElementById('reportContent').innerHTML = report;
        }

        function printReport() {
            const propertyName = getPropertyName();
            const unitNumber = document.getElementById('unitNumber').value;
            const inspectionType = document.getElementById('inspectionType').value;
            const date = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, ' ');
            
            document.title = `${propertyName} ${unitNumber} ${inspectionType} ${date}`;
            
            window.print();
        }

        function emailReport() {
            const propertyName = getPropertyName();
            const unitNumber = document.getElementById('unitNumber').value;
            const inspectionType = document.getElementById('inspectionType').value;
            const date = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, ' ');
            
            const subject = `${propertyName} ${unitNumber} ${inspectionType} ${date}`;
            const body = `Please find attached the ${inspectionType} report for ${propertyName} Unit ${unitNumber}.

Use the Print Report button to save the report as a PDF, then attach it to this email.`;
            
            window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }
        
        // Start new inspection with saved property info
        function startNewInspection() {
            if (!confirm('Start a new inspection? This will clear all room and inspection data but keep your property information and logo.')) {
                return;
            }
            
            // Save property info and settings to reuse
            const savedPropertyInfo = {
                propertyNameSelect: document.getElementById('propertyNameSelect').value,
                propertyNameCustom: document.getElementById('propertyNameCustom').value,
                inspectorNameSelect: document.getElementById('inspectorNameSelect').value,
                inspectorNameCustom: document.getElementById('inspectorNameCustom').value,
                inspectorEmail: document.getElementById('inspectorEmail').value,
                inspectorEmailCustom: document.getElementById('inspectorEmailCustom').value,
                inspectionType: document.getElementById('inspectionType').value,
                companyName: companyName,
                colors: {
                    primary: document.getElementById('primaryColor').value,
                    secondary: document.getElementById('secondaryColor').value,
                    dark: document.getElementById('darkColor').value
                },
                logo: uploadedLogo
            };
            
            // Reset inspection data
            currentStep = 1;
            currentRoomIndex = 0;
            rooms = [];
            appliances = [];
            smokeAlarms = [];
            allPhotos = {};
            hasUnsavedChanges = false;
            
            // Clear unit number and address
            document.getElementById('unitNumber').value = '';
            document.getElementById('propertyAddressSelect').value = '';
            document.getElementById('propertyAddressCustom').value = '';
            document.getElementById('inspectionDate').valueAsDate = new Date();
            document.getElementById('noticeServedDate').value = '';
            
            // Restore saved info
            document.getElementById('propertyNameSelect').value = savedPropertyInfo.propertyNameSelect;
            document.getElementById('propertyNameCustom').value = savedPropertyInfo.propertyNameCustom;
            document.getElementById('inspectorNameSelect').value = savedPropertyInfo.inspectorNameSelect;
            document.getElementById('inspectorNameCustom').value = savedPropertyInfo.inspectorNameCustom;
            document.getElementById('inspectorEmail').value = savedPropertyInfo.inspectorEmail;
            document.getElementById('inspectorEmailCustom').value = savedPropertyInfo.inspectorEmailCustom;
            document.getElementById('inspectionType').value = savedPropertyInfo.inspectionType;
            companyName = savedPropertyInfo.companyName;
            
            if (savedPropertyInfo.companyName && document.getElementById('companyName')) {
                document.getElementById('companyName').value = savedPropertyInfo.companyName;
                updateCompanyName();
            }
            
            // Restore colors
            document.getElementById('primaryColor').value = savedPropertyInfo.colors.primary;
            document.getElementById('secondaryColor').value = savedPropertyInfo.colors.secondary;
            document.getElementById('darkColor').value = savedPropertyInfo.colors.dark;
            updateColors();
            
            // Restore logo
            if (savedPropertyInfo.logo) {
                uploadedLogo = savedPropertyInfo.logo;
                const headerLogo = document.getElementById('headerLogo');
                headerLogo.src = uploadedLogo;
                headerLogo.style.display = 'block';
            }
            
            // Trigger property change to populate dropdowns
            if (savedPropertyInfo.propertyNameSelect) {
                handlePropertyChange();
            }
            
            updateHeaderInfo();
            updateDisplay();
            window.scrollTo(0, 0);
            
            alert('New inspection started! Property information and settings have been preserved.');
        }
