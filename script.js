document.addEventListener('DOMContentLoaded', () => {
    // === STATE MANAGEMENT ===
    let scholarships = JSON.parse(localStorage.getItem('scholarships')) || [];
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let currentCollabGroup = localStorage.getItem('collabGroup') || null;
    let collabMembers = JSON.parse(localStorage.getItem('collabMembers')) || [];

    // Tambahkan status SUBMITTED
const APPLICATION_STATUSES = {
    NOT_OPEN: 'Belum Dibuka',    // Warna abu-abu (#6c757d)
    IN_PROGRESS: 'Dalam Proses', // Warna kuning (#ffc107)
    SUBMITTED: 'Telah Dikirim',  // Warna biru (#17a2b8)
    ACCEPTED: 'Diterima',        // Warna hijau (#28a745)
    REJECTED: 'Ditolak'          // Warna merah (#dc3545)
};

    // === DOM ELEMENTS ===
    const addScholarshipBtn = document.getElementById('add-scholarship-btn');
    const modal = document.getElementById('form-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const form = document.getElementById('scholarship-form');
    const scholarshipListContainer = document.getElementById('scholarship-list');
    const timelineContainer = document.querySelector('.gantt-wrapper'); // Wrapper untuk timeline baru
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const monthYearTitle = document.getElementById('month-year-title');
    const calendarDaysContainer = document.getElementById('calendar-days');
    const collabModal = document.getElementById('collab-modal');
    const shareModal = document.getElementById('share-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const collabBtn = document.getElementById('collab-btn');
    const shareCollabBtn = document.getElementById('share-collab-btn');
    const collabMode = document.getElementById('collab-mode');
    const collabCodeInput = document.getElementById('collab-code');
    const joinCollabCodeInput = document.getElementById('join-collab-code');
    const copyCodeBtn = document.getElementById('copy-code-btn');
    const joinCollabBtn = document.getElementById('join-collab-btn');
    const leaveCollabBtn = document.getElementById('leave-collab-btn');
    const membersList = document.getElementById('members-list');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');
    const shareCollabCodeInput = document.getElementById('share-collab-code');
    const copyShareCodeBtn = document.getElementById('copy-share-code-btn');
    const shareWhatsappBtn = document.getElementById('share-whatsapp');
    const shareEmailBtn = document.getElementById('share-email');
    const shareTelegramBtn = document.getElementById('share-telegram');
    const qrCodeContainer = document.getElementById('qr-code');
    const createCollabBtn = document.getElementById('create-collab-btn');
    const groupCodeSection = document.getElementById('group-code-section');
    const deleteModal = document.getElementById('delete-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

    // === HELPER FUNCTIONS ===
     const saveScholarships = () => {
        localStorage.setItem('scholarships', JSON.stringify(scholarships));
        if (currentCollabGroup) {
            localStorage.setItem('collabGroup', currentCollabGroup);
            localStorage.setItem('collabMembers', JSON.stringify(collabMembers));
        }
    };

    const calculateProgress = (scholarship) => {
        const totalTasks = scholarship.requirements.length;
        const completedTasks = scholarship.requirements.filter(r => r.completed).length;
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        
        return { 
            progress,
            completed: completedTasks,
            total: totalTasks
        };
    };

    const generateId = () => {
        return Math.random().toString(36).substring(2, 10);
    };

   const getApplicationStatus = (scholarship) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalisasi waktu hari ini
    
    const startDate = new Date(scholarship.start + 'T00:00:00');
    const endDate = new Date(scholarship.end + 'T00:00:00');
    
    // 1. Jika sudah ada status yang diset manual, kembalikan status tersebut
    if (scholarship.applicationStatus) {
        return scholarship.applicationStatus;
    }
    
    // 2. Jika tanggal hari ini sebelum tanggal buka -> "Belum Dibuka"
    if (today < startDate) {
        return APPLICATION_STATUSES.NOT_OPEN;
    }
    
    // 3. Jika tanggal hari ini sudah melewati tanggal tutup -> "Dalam Proses" (default)
    if (today > endDate) {
        return APPLICATION_STATUSES.IN_PROGRESS;
    }
    
    // 4. Jika tanggal hari ini antara tanggal buka dan tutup -> "Dalam Proses"
    return APPLICATION_STATUSES.IN_PROGRESS;
};

    const getStatusColor = (status) => {
    switch(status) {
        case APPLICATION_STATUSES.NOT_OPEN: return '#6c757d';    // Abu-abu
        case APPLICATION_STATUSES.IN_PROGRESS: return '#ffc107'; // Kuning
        case APPLICATION_STATUSES.SUBMITTED: return '#17a2b8';   // Biru
        case APPLICATION_STATUSES.ACCEPTED: return '#28a745';    // Hijau
        case APPLICATION_STATUSES.REJECTED: return '#dc3545';    // Merah
        default: return '#6c757d';                               // Default abu-abu
    }
};

    // === RENDERING FUNCTIONS ===
   const renderScholarshipList = () => {
    scholarshipListContainer.innerHTML = '';
    if (scholarships.length === 0) {
        scholarshipListContainer.innerHTML = '<p style="color: #6c757d; text-align: center; padding: 2rem;">Mulai tambahkan beasiswa pertama Anda!</p>';
        return;
    }

    scholarships.forEach((s, index) => {
        const progressData = calculateProgress(s);
        const startDate = new Date(s.start + 'T00:00:00');
        const endDate = new Date(s.end + 'T00:00:00');
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const status = getApplicationStatus(s);
        const statusColor = getStatusColor(status);

        const item = document.createElement('div');
        item.className = 'scholarship-list-item';
        item.setAttribute('data-id', s.id);
        item.style.animationDelay = `${index * 0.1}s`;
        
        // Header dengan toggle
 item.innerHTML = `
            <div class="item-header">
                <div class="header-content" style="display: flex; justify-content: space-between; width: 100%;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="toggle-icon material-icons-sharp">chevron_right</span>
                        <h3 style="margin: 0;">${s.name}</h3>
                    </div>
                    <div class="item-actions">
                        <span class="status-badge" style="background-color: ${statusColor}">${status}</span>
                        <button class="edit-btn" title="Edit" data-id="${s.id}">
                            <span class="material-icons-sharp">edit</span>
                        </button>
                        <button class="delete-btn" title="Hapus" data-id="${s.id}">
                            <span class="material-icons-sharp">delete_outline</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="item-body" style="display: none;">
                <div class="item-details">
                    ${s.links?.info ? `
                    <p><strong>Link Informasi:</strong> 
                        <a href="${s.links.info}" target="_blank" rel="noopener noreferrer">
                            ${s.links.info}
                        </a>
                    </p>` : ''}
                    ${s.links?.register ? `
                    <p><strong>Link Pendaftaran:</strong> 
                        <a href="${s.links.register}" target="_blank" rel="noopener noreferrer">
                            ${s.links.register}
                        </a>
                    </p>` : ''}
                    <p><strong>Periode:</strong> ${startDate.toLocaleDateString('id-ID', options)} - ${endDate.toLocaleDateString('id-ID', options)}</p>
                    <ul class="requirements-list">
                        ${s.requirements.map(req => `
                            <li class="${req.completed ? 'completed' : ''}" data-req-text="${req.text}">
                                <input type="checkbox" ${req.completed ? 'checked' : ''} style="display: none;">
                                <span class="material-icons-sharp">${req.completed ? 'check_box' : 'check_box_outline_blank'}</span>
                                <label>${req.text}</label>
                            </li>
                        `).join('')}
                    </ul>
                    <div class="progress-info">
                        <span>${progressData.completed}/${progressData.total} persyaratan</span>
                        <span>${Math.round(progressData.progress)}% selesai</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${progressData.progress}%"></div>
                    </div>
                    ${status === APPLICATION_STATUSES.IN_PROGRESS ? `
                    <div class="submission-actions">
                        <button class="btn-submit" data-id="${s.id}">Submit Aplikasi</button>
                    </div>
                    ` : status === APPLICATION_STATUSES.SUBMITTED ? `
                    <div class="submission-result">
                        <button class="btn-accepted" data-id="${s.id}">Diterima</button>
                        <button class="btn-rejected" data-id="${s.id}">Ditolak</button>
                    </div>
                    ` : ''}
                </div>
            </div>`;
        scholarshipListContainer.appendChild(item);
    });

    // Tambahkan event listener untuk toggle
    document.querySelectorAll('.item-header').forEach(header => {
        header.addEventListener('click', (e) => {
            // Jangan trigger toggle jika mengklik tombol edit/delete
            if (e.target.closest('.edit-btn') || e.target.closest('.delete-btn')) {
                return;
            }
            
            const body = header.nextElementSibling;
            const icon = header.querySelector('.toggle-icon');
            
            if (body.style.display === 'none') {
                body.style.display = 'block';
                icon.textContent = 'expand_more';
            } else {
                body.style.display = 'none';
                icon.textContent = 'chevron_right';
            }
        });
    });
};

   const renderTimeline = () => {
    timelineContainer.innerHTML = '';

    if (scholarships.length === 0) {
        timelineContainer.innerHTML = '<p style="color: #6c757d; text-align: center; padding: 2rem;">Timeline akan muncul di sini.</p>';
        return;
    }

    const timelineWrapper = document.createElement('div');
    timelineWrapper.className = 'timeline-container';
    
    // Tambahkan container untuk tahun
    const yearsDiv = document.createElement('div');
    yearsDiv.className = 'timeline-years';
    
    // Buat container untuk bulan
    const monthsDiv = document.createElement('div');
    monthsDiv.className = 'timeline-months';
    
    // Buat container untuk event (beasiswa)
    const eventsDiv = document.createElement('div');
    eventsDiv.className = 'timeline-events';
    
    timelineWrapper.append(yearsDiv, monthsDiv, eventsDiv);
    timelineContainer.appendChild(timelineWrapper);

    // Hitung rentang tanggal
    const allDates = scholarships.flatMap(s => [new Date(s.start + 'T00:00:00'), new Date(s.end + 'T00:00:00')]);
    const minDate = new Date(Math.min(...allDates.map(date => date.getTime())));
    const maxDate = new Date(Math.max(...allDates.map(date => date.getTime())));
    
    // Pastikan ada minimal rentang 1 bulan
    minDate.setDate(1);
    maxDate.setMonth(maxDate.getMonth() + 1, 0);

    const totalDurationInDays = (maxDate - minDate) / (1000 * 60 * 60 * 24);
    if (totalDurationInDays <= 0) return;

    // Render tahun
    let currentYear = minDate.getFullYear();
    const endYear = maxDate.getFullYear();
    
    while (currentYear <= endYear) {
        const yearDiv = document.createElement('div');
        yearDiv.className = 'timeline-year';
        yearDiv.textContent = currentYear;
        
        // Hitung lebar tahun (berdasarkan jumlah hari dalam tahun)
        const yearStart = new Date(currentYear, 0, 1);
        const yearEnd = new Date(currentYear, 11, 31);
        const yearDays = (Math.min(yearEnd, maxDate) - Math.max(yearStart, minDate)) / (1000 * 60 * 60 * 24) + 1;
        const yearWidth = (yearDays / totalDurationInDays) * 100;
        
        yearDiv.style.width = `${yearWidth}%`;
        yearsDiv.appendChild(yearDiv);
        
        currentYear++;
    }

    // Render bulan
    let currentDate = new Date(minDate);
    while (currentDate <= maxDate) {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'timeline-month';
        monthDiv.textContent = currentDate.toLocaleString('id-ID', { month: 'short' });
        
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const monthWidth = (daysInMonth / totalDurationInDays) * 100;
        monthDiv.style.width = `${monthWidth}%`;
        
        monthsDiv.appendChild(monthDiv);
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Render beasiswa (sama seperti sebelumnya)
    const colors = ['#4A90E2', '#50E3C2', '#F5A623', '#BD10E0', '#7ED321', '#F15B5B'];
    scholarships.forEach((scholarship, index) => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'timeline-event';
        eventDiv.textContent = scholarship.name;
        eventDiv.title = `${scholarship.name} (${scholarship.start} - ${scholarship.end})`;
        eventDiv.style.backgroundColor = colors[index % colors.length];

        const startDate = new Date(scholarship.start + 'T00:00:00');
        const endDate = new Date(scholarship.end + 'T00:00:00');

        const offsetInDays = (startDate - minDate) / (1000 * 60 * 60 * 24);
        const durationInDays = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;

        const leftPosition = (offsetInDays / totalDurationInDays) * 100;
        const width = (durationInDays / totalDurationInDays) * 100;

        eventDiv.style.left = `${leftPosition}%`;
        eventDiv.style.width = `${width}%`;
        
        const rowHeight = 45;
        const row = Math.floor(index / 3);
        eventDiv.style.top = `${row * rowHeight}px`;

        eventsDiv.appendChild(eventDiv);
    });

    const rowsNeeded = Math.ceil(scholarships.length / 3);
    eventsDiv.style.height = `${rowsNeeded * 45}px`;
};

    const renderCalendar = () => {
        const date = new Date(currentYear, currentMonth, 1);
        const firstDayIndex = date.getDay();
        const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
        const prevLastDay = new Date(currentYear, currentMonth, 0).getDate();
        monthYearTitle.innerText = `${date.toLocaleString('id-ID', { month: 'long' })} ${currentYear}`;
        calendarDaysContainer.innerHTML = '';
        let daysHTML = '';
        
        for (let x = firstDayIndex; x > 0; x--) { 
            daysHTML += `<div class="day-cell other-month">${prevLastDay - x + 1}</div>`;
        }
        
        for (let i = 1; i <= lastDay; i++) {
            const today = new Date();
            const isTodayClass = (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) ? 'today' : '';
            const currentDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            
            let eventsHTML = '<div class="events-container">';
            scholarships.forEach(s => {
                if (s.start === currentDateStr) {
                    eventsHTML += `<div class="event-dot start-date" title="Buka: ${s.name}"></div>`;
                }
                if (s.end === currentDateStr) {
                    eventsHTML += `<div class="event-dot end-date" title="Tutup: ${s.name}"></div>`;
                }
            });
            eventsHTML += '</div>';
            
            daysHTML += `<div class="day-cell ${isTodayClass}">${i}${eventsHTML}</div>`;
        }
        
        const totalCells = firstDayIndex + lastDay;
        const nextDays = (totalCells % 7 === 0) ? 0 : 7 - (totalCells % 7);
        for (let j = 1; j <= nextDays; j++) { 
            daysHTML += `<div class="day-cell other-month">${j}</div>`;
        }
        
        calendarDaysContainer.innerHTML = daysHTML;
    };

    const renderApp = () => {
        renderScholarshipList();
        renderTimeline();
        renderCalendar();
    };

    // === MODAL FUNCTIONS ===
    const closeModal = () => {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.remove('active');
        });
    };

     const openDeleteModal = (id) => {
        deleteModal.classList.add('active');
        confirmDeleteBtn.setAttribute('data-id', id);
    };
    
    // === SCHOLARSHIP FUNCTIONS ===
    // Tambahkan fungsi dari kode atas yang tidak ada di kode bawah
    const deleteScholarship = (id) => {
        scholarships = scholarships.filter(s => s.id !== id);
        saveScholarships();
        renderApp();
    };

    const submitApplication = (id) => {
    const scholarship = scholarships.find(s => s.id === id);
    if (scholarship) {
        scholarship.applicationStatus = APPLICATION_STATUSES.SUBMITTED;
        saveScholarships();
        renderApp();
    }
};

const updateApplicationResult = (id, status) => {
    const scholarship = scholarships.find(s => s.id === id);
    if (scholarship) {
        scholarship.applicationStatus = status;
        saveScholarships();
        renderApp();
    }
};

    // === COLLABORATION FUNCTIONS ===
    const openCollabModal = () => {
        collabModal.classList.add('active');
        joinCollabCodeInput.value = '';

        if (currentCollabGroup) {
            groupCodeSection.style.display = 'block';
            collabCodeInput.value = currentCollabGroup;
            document.getElementById('members-section').style.display = 'block';
            document.getElementById('create-collab-btn').style.display = 'none';
            leaveCollabBtn.style.display = 'block';
            shareCollabBtn.style.display = 'flex';
            collabMode.style.display = 'flex';
            loadCollabMembers();
        } else {
            groupCodeSection.style.display = 'none';
            document.getElementById('members-section').style.display = 'none';
            document.getElementById('create-collab-btn').style.display = 'block';
            leaveCollabBtn.style.display = 'none';
            shareCollabBtn.style.display = 'none';
            collabMode.style.display = 'none';
        }
    };

    const createCollabGroup = () => {
        const code = generateId();
        currentCollabGroup = code;
        localStorage.setItem('collabGroup', code);

        collabMembers = [{
            id: generateId(),
            name: 'Anda',
            isOwner: true
        }];
        localStorage.setItem('collabMembers', JSON.stringify(collabMembers));

        groupCodeSection.style.display = 'block';
        collabCodeInput.value = code;
        document.getElementById('members-section').style.display = 'block';
        document.getElementById('create-collab-btn').style.display = 'none';
        leaveCollabBtn.style.display = 'block';
        shareCollabBtn.style.display = 'flex';
        collabMode.style.display = 'flex';

        loadCollabMembers();
        alert('Grup kolaborasi baru berhasil dibuat! Kode: ' + code);
        saveScholarships();
    };

    const joinCollabGroup = () => {
        const groupId = joinCollabCodeInput.value.trim();
        if (!groupId) {
            alert('Masukkan kode kolaborasi terlebih dahulu');
            return;
        }
        if (groupId.length < 6 || groupId.length > 12) {
            alert('Kode grup harus antara 6-12 karakter');
            return;
        }
        currentCollabGroup = groupId;
        localStorage.setItem('collabGroup', groupId);

        const memberId = generateId();
        collabMembers.push({
            id: memberId,
            name: 'Anggota ' + (collabMembers.length + 1),
            isOwner: false
        });
        localStorage.setItem('collabMembers', JSON.stringify(collabMembers));

        groupCodeSection.style.display = 'block';
        collabCodeInput.value = groupId;
        document.getElementById('members-section').style.display = 'block';
        document.getElementById('create-collab-btn').style.display = 'none';
        leaveCollabBtn.style.display = 'block';
        shareCollabBtn.style.display = 'flex';
        collabMode.style.display = 'flex';

        loadCollabMembers();
        alert('Berhasil bergabung dengan grup kolaborasi');
        saveScholarships();
        closeModal();
    };

    const leaveCollabGroup = () => {
        if (confirm('Apakah Anda yakin ingin keluar dari grup kolaborasi ini?')) {
            collabMembers = collabMembers.filter(member => !member.isOwner);
            localStorage.setItem('collabMembers', JSON.stringify(collabMembers));
            currentCollabGroup = null;
            localStorage.removeItem('collabGroup');

            groupCodeSection.style.display = 'none';
            document.getElementById('members-section').style.display = 'none';
            document.getElementById('create-collab-btn').style.display = 'block';
            leaveCollabBtn.style.display = 'none';
            shareCollabBtn.style.display = 'none';
            collabMode.style.display = 'none';

            alert('Anda telah keluar dari grup kolaborasi');
            closeModal();
        }
    };

    const copyCollabCode = () => {
        collabCodeInput.select();
        document.execCommand('copy');
        
        const originalText = copyCodeBtn.innerHTML;
        copyCodeBtn.innerHTML = '<span class="material-icons-sharp">check</span> Tersalin!';
        setTimeout(() => {
            copyCodeBtn.innerHTML = originalText;
        }, 2000);
    };

    const loadCollabMembers = () => {
        const storedMembers = localStorage.getItem('collabMembers');
        if (storedMembers) {
            collabMembers = JSON.parse(storedMembers);
        } else {
            collabMembers = [{
                id: generateId(),
                name: 'Anda',
                isOwner: true
            }];
        }
        
        membersList.innerHTML = '';
        collabMembers.forEach(member => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="material-icons-sharp">${member.isOwner ? 'person' : 'people'}</span>
                ${member.name} ${member.isOwner ? '(Pemimpin Grup)' : ''}
            `;
            membersList.appendChild(li);
        });
    };

    const generateQRCode = (text) => {
        qrCodeContainer.innerHTML = '';
        new QRCode(qrCodeContainer, {
            text: text,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    };

    // === SHARE FUNCTIONS ===
    const shareViaWhatsapp = () => {
        const message = `Bergabunglah dengan grup kolaborasi Beazly saya! Kode: ${currentCollabGroup}`;
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const shareViaEmail = () => {
        const subject = 'Undangan Grup Kolaborasi Beazly';
        const body = `Hai,\n\nBergabunglah dengan grup kolaborasi Beazly saya menggunakan kode berikut:\n\nKode: ${currentCollabGroup}\n\nSalam,\n`;
        const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = url;
    };

    const shareViaTelegram = () => {
        const message = `Bergabunglah dengan grup kolaborasi Beazly saya! Kode: ${currentCollabGroup}`;
        const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    // === IMPORT/EXPORT FUNCTIONS ===
    const exportData = () => {
        const data = {
            scholarships: scholarships,
            exportedAt: new Date().toISOString(),
            collabGroup: currentCollabGroup || null,
            collabMembers: currentCollabGroup ? collabMembers : null
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scholartrack-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const importData = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (!data.scholarships || !Array.isArray(data.scholarships)) {
                    throw new Error('Format file tidak valid');
                }
                
                if (confirm(`Anda akan mengimpor ${data.scholarships.length} beasiswa. Lanjutkan?`)) {
                    scholarships = data.scholarships;
                    if (data.collabGroup) {
                        currentCollabGroup = data.collabGroup;
                        collabMembers = data.collabMembers || [{
                            id: generateId(),
                            name: 'Anda',
                            isOwner: true
                        }];
                        collabMode.style.display = 'flex';
                        shareCollabBtn.style.display = 'flex';
                        localStorage.setItem('collabMembers', JSON.stringify(collabMembers));
                    }
                    saveScholarships();
                    renderApp();
                    importFile.value = '';
                    alert('Data berhasil diimpor!');
                }
            } catch (error) {
                console.error("Error parsing import file: ", error);
                alert('Gagal memproses file: ' + error.message);
            }
        };
        reader.readAsText(file);
    };

    // === EVENT LISTENERS ===
    // Modal Controls
    addScholarshipBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.getElementById('modal-title').textContent = 'Tambah Beasiswa Baru';
        document.getElementById('scholarship-form').reset();
        document.getElementById('scholarship-id').value = '';
    });

    closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));

    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => e.target === modal && closeModal());
    });

    // Delete
    confirmDeleteBtn.addEventListener('click', () => {
        const id = confirmDeleteBtn.getAttribute('data-id');
        deleteScholarship(id);
        deleteModal.classList.remove('active');
    });
    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.classList.remove('active');
    });
    document.querySelector('#delete-modal .close-modal').addEventListener('click', () => {
        deleteModal.classList.remove('active');
    });

    // Form Submission
    form.addEventListener('submit', (e) => {
    e.preventDefault();

    const idInput = document.getElementById('scholarship-id');
    const id = idInput.value || generateId();
    const name = document.getElementById('name').value.trim();
    const start = document.getElementById('start-date').value;
    const end = document.getElementById('end-date').value;
    const infoLink = document.getElementById('info-link').value.trim();
    const registerLink = document.getElementById('register-link').value.trim();
    const requirementsText = document.getElementById('requirements').value;

    // Validate required fields
    if (!name || !start || !end) {
        alert('Nama dan tanggal beasiswa wajib diisi!');
        return;
    }

    if (new Date(start) > new Date(end)) {
        alert('Tanggal tutup tidak boleh sebelum tanggal buka!');
        return;
    }

    // Create new scholarship object
    // Di dalam form submit handler:
const newScholarship = {
    id,
    name,
    start,
    end,
    links: {
        info: infoLink,
        register: registerLink
    },
    requirements: requirementsText.split('\n')
        .filter(line => line.trim() !== '')
        .map(text => ({ text: text.trim(), completed: false })),
};

    // Check if editing existing scholarship
    const existingIndex = scholarships.findIndex(s => s.id === id);
    if (existingIndex >= 0) {
        newScholarship.applicationStatus = scholarships[existingIndex].applicationStatus;
        newScholarship.requirements = newScholarship.requirements.map(newReq => {
            const existingReq = scholarships[existingIndex].requirements.find(r => r.text === newReq.text);
            return existingReq ? { ...newReq, completed: existingReq.completed } : newReq;
        });
        scholarships[existingIndex] = newScholarship;
    } else {
        scholarships.push(newScholarship);
    }

    // Sort and save
    scholarships.sort((a, b) => new Date(a.start) - new Date(b.start));
    saveScholarships();
    renderApp();
    
    // Reset form and close modal
    form.reset();
    idInput.value = '';
    closeModal();
});


    // Scholarship List Interactions
     scholarshipListContainer.addEventListener('click', (e) => {
        const reqItem = e.target.closest('li[data-req-text]');
        const deleteButton = e.target.closest('.delete-btn');
        const editButton = e.target.closest('.edit-btn');
        const submitButton = e.target.closest('.btn-submit');
        const acceptedButton = e.target.closest('.btn-accepted');
        const rejectedButton = e.target.closest('.btn-rejected');
    
   if (editButton) {
    e.preventDefault();
    const id = editButton.getAttribute('data-id');
    const scholarship = scholarships.find(s => s.id === id);
    if (scholarship) {
        document.getElementById('modal-title').textContent = 'Edit Beasiswa';
        document.getElementById('scholarship-id').value = scholarship.id;
        document.getElementById('name').value = scholarship.name;
        document.getElementById('start-date').value = scholarship.start;
        document.getElementById('end-date').value = scholarship.end;
        document.getElementById('info-link').value = scholarship.links?.info || '';
        document.getElementById('register-link').value = scholarship.links?.register || '';
        document.getElementById('requirements').value = scholarship.requirements.map(r => r.text).join('\n');
        
        document.getElementById('application-status').value = scholarship.applicationStatus || 'IN_PROGRESS';
        modal.classList.add('active');
    }
    return;
}

        if (deleteButton) {
            e.preventDefault();
            const id = deleteButton.getAttribute('data-id');
            openDeleteModal(id);
            return;
        }
        
        if (submitButton) {
            e.preventDefault();
            const id = submitButton.getAttribute('data-id');
            submitApplication(id);
            return;
        }
        
        if (acceptedButton) {
            e.preventDefault();
            const id = acceptedButton.getAttribute('data-id');
            updateApplicationResult(id, APPLICATION_STATUSES.ACCEPTED);
            return;
        }
        
        if (rejectedButton) {
            e.preventDefault();
            const id = rejectedButton.getAttribute('data-id');
            updateApplicationResult(id, APPLICATION_STATUSES.REJECTED);
            return;
        }
        
    
    if (reqItem) {
        e.preventDefault();
        const listItem = reqItem.closest('.scholarship-list-item');
        const scholarshipId = listItem.getAttribute('data-id');
        const reqText = reqItem.getAttribute('data-req-text');
        const scholarship = scholarships.find(s => s.id === scholarshipId);
        
        if (scholarship) {
            const requirement = scholarship.requirements.find(r => r.text === reqText);
            if (requirement) { 
                requirement.completed = !requirement.completed; 
                saveScholarships(); 
                
                // Update UI langsung tanpa render ulang semua
                const checkboxIcon = reqItem.querySelector('.material-icons-sharp');
                checkboxIcon.textContent = requirement.completed ? 'check_box' : 'check_box_outline_blank';
                reqItem.classList.toggle('completed', requirement.completed);
                
                // Update progress bar
                const progressData = calculateProgress(scholarship);
                const progressBar = listItem.querySelector('.progress-bar');
                const progressInfo = listItem.querySelector('.progress-info');
                if (progressBar) progressBar.style.width = `${progressData.progress}%`;
                if (progressInfo) {
                    progressInfo.innerHTML = `
                        <span>${progressData.completed}/${progressData.total} persyaratan</span>
                        <span>${Math.round(progressData.progress)}% selesai</span>
                    `;
                }
            }
        }
        return;
    }
});
    
    // Calendar navigation
    prevMonthBtn.addEventListener('click', () => { 
        currentMonth--; 
        if (currentMonth < 0) { 
            currentMonth = 11; 
            currentYear--; 
        } 
        renderCalendar(); 
    });
    
    nextMonthBtn.addEventListener('click', () => { 
        currentMonth++; 
        if (currentMonth > 11) { 
            currentMonth = 0; 
            currentYear++; 
        } 
        renderCalendar(); 
    });

    // Collaboration
    collabBtn.addEventListener('click', openCollabModal);
    createCollabBtn.addEventListener('click', createCollabGroup);
    copyCodeBtn.addEventListener('click', copyCollabCode);
    joinCollabBtn.addEventListener('click', joinCollabGroup);
    leaveCollabBtn.addEventListener('click', leaveCollabGroup);

    // Share
    shareCollabBtn.addEventListener('click', () => {
        if (currentCollabGroup) {
            shareCollabCodeInput.value = currentCollabGroup;
            generateQRCode(currentCollabGroup);
            shareModal.classList.add('active');
        } else {
            alert('Anda belum membuat atau bergabung dengan grup kolaborasi');
        }
    });

    copyShareCodeBtn.addEventListener('click', () => {
        shareCollabCodeInput.select();
        document.execCommand('copy');
        
        const originalText = copyShareCodeBtn.innerHTML;
        copyShareCodeBtn.innerHTML = '<span class="material-icons-sharp">check</span> Tersalin!';
        setTimeout(() => {
            copyShareCodeBtn.innerHTML = originalText;
        }, 2000);
    });

    shareWhatsappBtn.addEventListener('click', shareViaWhatsapp);
    shareEmailBtn.addEventListener('click', shareViaEmail);
    shareTelegramBtn.addEventListener('click', shareViaTelegram);

    // Import/Export
    exportBtn.addEventListener('click', exportData);
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', importData);

    // Initialize
    renderApp();
});