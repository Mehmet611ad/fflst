// API Module - Handles all user and file operations using file-based storage

const API = {
    // Simulate user login
    async login(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const user = FileBasedStorage.authenticateUser(email, password);
                    if (user) {
                        resolve({ success: true, user: user });
                    } else {
                        reject({ success: false, message: "Invalid email or password" });
                    }
                } catch (error) {
                    reject({ success: false, message: error.message });
                }
            }, 500); // Simulate network delay
        });
    },
    
    // Simulate user registration
    async register(name, email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const newUser = FileBasedStorage.registerUser(name, email, password);
                    const { password: pwd, ...userWithoutPassword } = newUser;
                    resolve({ success: true, user: userWithoutPassword });
                } catch (error) {
                    reject({ success: false, message: error.message });
                }
            }, 500); // Simulate network delay
        });
    },
    
    // Simulate file upload
    async uploadFile(userEmail, file) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    // Simulate file type detection
                    const fileType = file.name.split('.').pop().toUpperCase();
                    const fileSize = this.formatFileSize(file.size);
                    
                    // Generate file content (in a real app, this would be the actual file content)
                    let fileContent = '';
                    if (fileType === 'PDF') {
                        fileContent = `%PDF-1.4
% simulated PDF content for ${file.name}
% This is a simulated PDF file for demonstration purposes.`;
                    } else if (fileType === 'JPG' || fileType === 'JPEG') {
                        fileContent = ' simulated JPEG content ';
                    } else if (fileType === 'PNG') {
                        fileContent = ' simulated PNG content ';
                    } else if (fileType === 'DOCX') {
                        fileContent = `[Content_Types].xml
_simulated DOCX content for ${file.name}_`;
                    } else {
                        fileContent = `File: ${file.name}
Size: ${fileSize}
Type: ${fileType}
Upload Date: ${new Date().toISOString()}

This is a simulated file content for demonstration purposes.`;
                    }
                    
                    // Save file to user's downloads folder
                    FileBasedStorage.saveUploadedFile(userEmail, file.name, fileType, fileSize, fileContent);
                    
                    const newFile = {
                        id: Date.now(), // Simple ID generation
                        name: file.name,
                        type: fileType,
                        size: fileSize,
                        uploadDate: new Date().toISOString()
                    };
                    
                    resolve({ success: true, file: newFile });
                } catch (error) {
                    reject({ success: false, message: "Failed to upload file" });
                }
            }, 1000); // Simulate upload delay
        });
    },
    
    // Simulate file download
    async downloadFile(userEmail, fileName) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    // In a real app, this would retrieve the actual file content
                    const fileContent = FileBasedStorage.getUploadedFileContent(userEmail, fileName);
                    
                    if (fileContent) {
                        resolve({ success: true, message: "Download initiated", content: fileContent, fileName: fileName });
                    } else {
                        resolve({ success: false, message: "File not found" });
                    }
                } catch (error) {
                    resolve({ success: false, message: "Failed to download file" });
                }
            }, 300); // Simulate network delay
        });
    },
    
    // Simulate file deletion
    async deleteFile(userEmail, fileName) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    // In a real implementation, this would delete the actual file
                    // For simulation, we'll just remove the reference
                    const userDir = FileBasedStorage.getUserDirectory(userEmail);
                    if (userDir) {
                        // Remove file reference from downloads directory
                        const downloadsDir = userDir.files.find(file => file.name === 'downloads' && file.type === 'directory');
                        if (downloadsDir && downloadsDir.files) {
                            const fileIndex = downloadsDir.files.findIndex(file => file.name === fileName);
                            if (fileIndex !== -1) {
                                downloadsDir.files.splice(fileIndex, 1);
                                localStorage.setItem(`userdir_${userEmail}`, JSON.stringify(userDir));
                                resolve({ success: true, message: "File deleted successfully" });
                                return;
                            }
                        }
                    }
                    resolve({ success: false, message: "Failed to delete file" });
                } catch (error) {
                    resolve({ success: false, message: "Failed to delete file" });
                }
            }, 300); // Simulate network delay
        });
    },
    
    // Helper function to format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    // Get user's uploaded files
    async getUserFiles(userEmail) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    const userDir = FileBasedStorage.getUserDirectory(userEmail);
                    if (userDir) {
                        const downloadsDir = userDir.files.find(file => file.name === 'downloads' && file.type === 'directory');
                        if (downloadsDir && downloadsDir.files) {
                            const files = downloadsDir.files.map(file => ({
                                id: Date.now() + Math.random(), // Simple ID generation
                                name: file.name,
                                type: file.type,
                                size: file.size,
                                uploadDate: file.createdAt
                            }));
                            resolve({ success: true, files: files });
                            return;
                        }
                    }
                    resolve({ success: true, files: [] });
                } catch (error) {
                    resolve({ success: true, files: [] });
                }
            }, 300); // Simulate network delay
        });
    }
};