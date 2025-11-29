// Dashboard module
const Dashboard = {
    currentUserId: null,
    currentUserEmail: null,
    selectedFileId: null,
    isUploading: false, // Flag to prevent duplicate uploads
    
    // Initialize dashboard
    init() {
        // Check if user is authenticated
        if (!Auth.isAuthenticated()) {
            this.redirectToAuth();
            return;
        }
        
        // Set current user
        const currentUser = Auth.getCurrentUser();
        this.currentUserId = currentUser.id;
        this.currentUserEmail = currentUser.email;
        
        // Update UI with user info
        this.updateUserInfo(currentUser);
        
        // Load user files
        this.loadUserFiles();
        
        // Initialize event listeners
        this.initEventListeners();
    },
    
    // Update user information in the UI
    updateUserInfo(user) {
        const userEmailElement = document.getElementById('user-email');
        if (userEmailElement) {
            userEmailElement.textContent = user.email;
        }
    },
    
    // Load user files
    async loadUserFiles() {
        try {
            const response = await API.getUserFiles(this.currentUserEmail);
            if (response.success) {
                this.displayFiles(response.files);
                this.updateStorageStats(response.files);
            }
        } catch (error) {
            console.error('Error loading files:', error);
        }
    },
    
    // Display files in the grid
    displayFiles(files) {
        const fileListElement = document.getElementById('file-list');
        if (!fileListElement) return;
        
        // Clear existing content
        fileListElement.innerHTML = '';
        
        if (files.length === 0) {
            // Show empty state
            fileListElement.innerHTML = `
                <div class="empty-state">
                    <p>No files uploaded yet</p>
                </div>
            `;
            return;
        }
        
        // Add files to the grid
        files.forEach(file => {
            const fileCard = this.createFileCard(file);
            fileListElement.appendChild(fileCard);
        });
    },
    
    // Create a file card element
    createFileCard(file) {
        const fileCard = document.createElement('div');
        fileCard.className = 'file-card';
        
        // Determine file icon or preview
        let fileDisplay = `<div class="file-icon">${this.getFileIcon(file.type)}</div>`;
        
        fileCard.innerHTML = `
            ${fileDisplay}
            <div class="file-name">${file.name}</div>
            <div class="file-meta">
                <span>${file.size}</span>
                <span>${this.formatDate(file.uploadDate)}</span>
            </div>
            <button class="action-button" data-file-id="${file.id}" data-file-name="${file.name}">⋮</button>
        `;
        
        // Add event listener to action button
        const actionButton = fileCard.querySelector('.action-button');
        actionButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showActionMenu(file.id, file.name, e);
        });
        
        return fileCard;
    },
    
    // Get appropriate icon for file type
    getFileIcon(fileType) {
        const iconMap = {
            'PDF': '📄',
            'DOCX': '📝',
            'PPTX': '📊',
            'JPG': '🖼️',
            'JPEG': '🖼️',
            'PNG': '🖼️',
            'GIF': '🎬',
            'ZIP': '📦',
            'TXT': '📄'
        };
        
        return iconMap[fileType] || '📁';
    },
    
    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    },
    
    // Update storage statistics
    updateStorageStats(files) {
        // Calculate total size
        let totalSize = 0;
        files.forEach(file => {
            // Extract number from size string (e.g., "2.4 MB" -> 2.4)
            const sizeParts = file.size.split(' ');
            const sizeValue = parseFloat(sizeParts[0]);
            const sizeUnit = sizeParts[1];
            
            // Convert to MB for calculation
            let sizeInMB = sizeValue;
            if (sizeUnit === 'KB') {
                sizeInMB = sizeValue / 1024;
            } else if (sizeUnit === 'GB') {
                sizeInMB = sizeValue * 1024;
            }
            
            totalSize += sizeInMB;
        });
        
        // Update UI
        const usedStorageElement = document.getElementById('used-storage');
        if (usedStorageElement) {
            usedStorageElement.textContent = `${totalSize.toFixed(1)} MB`;
        }
    },
    
    // Initialize event listeners
    initEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => Auth.logout());
        }
        
        // File input
        const browseFilesBtn = document.getElementById('browse-files-btn');
        const fileInput = document.getElementById('file-input');
        if (browseFilesBtn && fileInput) {
            browseFilesBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }
        
        // Drag and drop
        const uploadArea = document.getElementById('upload-area');
        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        }
        
        // Close modals
        const closeDetailsBtn = document.getElementById('close-details-btn');
        const fileDetailsModal = document.getElementById('file-details-modal');
        const closeBtn = fileDetailsModal ? fileDetailsModal.querySelector('.close-btn') : null;
        
        if (closeDetailsBtn) {
            closeDetailsBtn.addEventListener('click', () => this.hideFileDetails());
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideFileDetails());
        }
        
        // Close action menu when clicking outside
        document.addEventListener('click', (e) => {
            const actionMenu = document.getElementById('action-menu');
            if (actionMenu && !actionMenu.contains(e.target) && !e.target.classList.contains('action-button')) {
                actionMenu.classList.add('hidden');
            }
        });
        
        // Action menu items
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleActionItemClick(e));
        });
    },
    
    // Handle file selection
    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.uploadFiles(files);
            // Clear the file input to prevent issues with selecting the same file again
            e.target.value = '';
        }
    },
    
    // Handle drag over event
    handleDragOver(e) {
        e.preventDefault();
        const uploadArea = document.getElementById('upload-area');
        if (uploadArea) {
            uploadArea.classList.add('drag-over');
        }
    },
    
    // Handle drag leave event
    handleDragLeave(e) {
        e.preventDefault();
        const uploadArea = document.getElementById('upload-area');
        if (uploadArea) {
            uploadArea.classList.remove('drag-over');
        }
    },
    
    // Handle drop event
    handleDrop(e) {
        e.preventDefault();
        const uploadArea = document.getElementById('upload-area');
        if (uploadArea) {
            uploadArea.classList.remove('drag-over');
        }
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.uploadFiles(files);
        }
    },
    
    // Upload files
    async uploadFiles(files) {
        // Prevent duplicate uploads
        if (this.isUploading) {
            return;
        }
        
        this.isUploading = true;
        
        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                try {
                    // Show uploading state
                    this.showUploadingState();
                    
                    // Upload file
                    const response = await API.uploadFile(this.currentUserEmail, file);
                    
                    if (response.success) {
                        // Refresh file list
                        await this.loadUserFiles();
                        Auth.showSuccess(`"${file.name}" uploaded successfully!`);
                    }
                } catch (error) {
                    Auth.showError('upload-error', `Failed to upload "${file.name}"`);
                }
            }
        } finally {
            this.isUploading = false;
            // Hide uploading state after all files are processed
            setTimeout(() => {
                this.hideUploadingState();
            }, 1000);
        }
    },
    
    // Show uploading state
    showUploadingState() {
        const uploadArea = document.getElementById('upload-area');
        if (uploadArea) {
            uploadArea.classList.add('drag-over');
            const uploadContent = uploadArea.querySelector('.upload-content');
            if (uploadContent) {
                uploadContent.innerHTML = `
                    <div class="upload-icon">⏳</div>
                    <p>Uploading files...</p>
                `;
            }
        }
    },
    
    // Hide uploading state
    hideUploadingState() {
        const uploadArea = document.getElementById('upload-area');
        if (uploadArea) {
            uploadArea.classList.remove('drag-over');
            const uploadContent = uploadArea.querySelector('.upload-content');
            if (uploadContent) {
                uploadContent.innerHTML = `
                    <div class="upload-icon">📁</div>
                    <p>Drag & drop files here</p>
                    <p>or</p>
                    <button id="browse-files-btn" class="btn secondary-btn">Browse Files</button>
                    <input type="file" id="file-input" multiple class="hidden">
                `;
                
                // Re-initialize event listeners for the new elements
                const browseFilesBtn = document.getElementById('browse-files-btn');
                const fileInput = document.getElementById('file-input');
                if (browseFilesBtn && fileInput) {
                    browseFilesBtn.addEventListener('click', () => fileInput.click());
                    fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
                }
            }
        }
    },
    
    // Show action menu
    showActionMenu(fileId, fileName, event) {
        this.selectedFileId = fileId;
        this.selectedFileName = fileName;
        
        const actionMenu = document.getElementById('action-menu');
        if (actionMenu) {
            // Position menu near the button
            actionMenu.style.top = `${event.clientY}px`;
            actionMenu.style.left = `${event.clientX}px`;
            actionMenu.classList.remove('hidden');
        }
    },
    
    // Handle action menu item click
    async handleActionItemClick(e) {
        const action = e.target.dataset.action;
        const fileName = this.selectedFileName;
        
        // Hide action menu
        const actionMenu = document.getElementById('action-menu');
        if (actionMenu) {
            actionMenu.classList.add('hidden');
        }
        
        switch (action) {
            case 'download':
                await this.downloadFile(fileName);
                break;
            case 'details':
                this.showFileDetails(fileName);
                break;
            case 'delete':
                await this.deleteFile(fileName);
                break;
        }
    },
    
    // Download file
    async downloadFile(fileName) {
        try {
            const response = await API.downloadFile(this.currentUserEmail, fileName);
            if (response.success) {
                Auth.showSuccess(`Preparing download for "${fileName}"`);
                
                // Create blob and download
                const blob = new Blob([response.content], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                
                // Create temporary anchor element
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName; // Use original filename
                document.body.appendChild(a);
                a.click();
                
                // Clean up
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    Auth.showSuccess(`"${fileName}" downloaded successfully!`);
                }, 100);
            } else {
                Auth.showError('download-error', response.message || 'Failed to download file');
            }
        } catch (error) {
            Auth.showError('download-error', 'Failed to download file');
        }
    },
    
    // Show file details
    showFileDetails(fileName) {
        // In a real implementation, we would fetch detailed file information
        // For now, we'll just show basic info
        document.getElementById('detail-name').textContent = fileName;
        document.getElementById('detail-type').textContent = fileName.split('.').pop().toUpperCase();
        document.getElementById('detail-size').textContent = 'Unknown'; // Would be retrieved from file metadata
        document.getElementById('detail-date').textContent = new Date().toLocaleString();
        
        // Show modal
        const modal = document.getElementById('file-details-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    },
    
    // Hide file details
    hideFileDetails() {
        const modal = document.getElementById('file-details-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    },
    
    // Delete file
    async deleteFile(fileName) {
        try {
            const response = await API.deleteFile(this.currentUserEmail, fileName);
            if (response.success) {
                // Refresh file list
                await this.loadUserFiles();
                Auth.showSuccess('File deleted successfully!');
            } else {
                Auth.showError('delete-error', response.message || 'Failed to delete file');
            }
        } catch (error) {
            Auth.showError('delete-error', 'Failed to delete file');
        }
    },
    
    // Redirect to authentication
    redirectToAuth() {
        window.location.hash = '';
        location.reload();
    }
};