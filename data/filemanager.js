// Simple File Manager - Demonstrates file organization concept
// Note: In a real server environment, this would write actual files to disk

const FileManager = {
    // Simulate creating a user directory and files under /user/email/
    createUserDirectory(user) {
        // In a real server environment, this would:
        // 1. Create a directory structure: /user/{user.email}/
        // 2. Create information.txt with user details
        // 3. Create uploaded_files.txt for tracking uploads
        
        console.log(`[SIMULATION] Creating directory: /user/${user.email}/`);
        console.log(`[SIMULATION] Creating file: /user/${user.email}/information.txt`);
        console.log(`[SIMULATION] Creating file: /user/${user.email}/uploaded_files.txt`);
        
        // For demonstration, we'll store this info in localStorage with a unified structure
        const userData = {
            email: user.email,
            name: user.name,
            userId: user.id,
            createdAt: user.createdAt,
            files: []
        };
        
        localStorage.setItem(`user_${user.email}`, JSON.stringify(userData));
        return true;
    },
    
    // Simulate recording user information
    createUserInfoFile(user) {
        const userInfo = `Account Information
=================

Name: ${user.name}
Email: ${user.email}
Account Created: ${user.createdAt || new Date().toISOString()}
User ID: ${user.id}

This file contains your account details for CloudVault.`;
        
        console.log(`[SIMULATION] Writing to file: /user/${user.email}/information.txt`);
        console.log(`[SIMULATION] Content:\n${userInfo}`);
        
        // Store in localStorage for demo purposes with the new structure
        localStorage.setItem(`user_${user.email}_info`, userInfo);
        return true;
    },
    
    // Simulate creating upload history file
    createUploadHistoryFile(user) {
        const uploadHistory = `Upload History
=============

This file records all your file uploads.

`;
        
        console.log(`[SIMULATION] Writing to file: /user/${user.email}/uploaded_files.txt`);
        console.log(`[SIMULATION] Content:\n${uploadHistory}`);
        
        // Store in localStorage for demo purposes with the new structure
        localStorage.setItem(`user_${user.email}_uploads`, uploadHistory);
        return true;
    },
    
    // Simulate recording a file upload
    recordFileUpload(user, file) {
        const uploadRecord = `${new Date().toISOString()} - ${file.name} (${file.size}, ${file.type})\n`;
        
        console.log(`[SIMULATION] Appending to file: /user/${user.email}/uploaded_files.txt`);
        console.log(`[SIMULATION] Adding record: ${uploadRecord.trim()}`);
        
        // Retrieve existing content and append
        const existingContent = localStorage.getItem(`user_${user.email}_uploads`) || 
                              "Upload History\n=============\n\nThis file records all your file uploads.\n\n";
        const newContent = existingContent + uploadRecord;
        localStorage.setItem(`user_${user.email}_uploads`, newContent);
        
        // Also update user data
        const userData = JSON.parse(localStorage.getItem(`user_${user.email}`) || '{}');
        if (!userData.files) userData.files = [];
        userData.files.push({
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toISOString()
        });
        localStorage.setItem(`user_${user.email}`, JSON.stringify(userData));
        
        return true;
    },
    
    // Simulate getting user files
    getUserFiles(email) {
        const userData = localStorage.getItem(`user_${email}`);
        return userData ? JSON.parse(userData) : null;
    },
    
    // Simulate getting user info content
    getUserInfoContent(email) {
        return localStorage.getItem(`user_${email}_info`) || null;
    },
    
    // Simulate getting upload history content
    getUploadHistoryContent(email) {
        return localStorage.getItem(`user_${email}_uploads`) || null;
    },
    
    // Get all users (for the file viewer)
    getAllUsers() {
        const users = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('user_') && !key.includes('_info') && !key.includes('_uploads')) {
                try {
                    const userData = JSON.parse(localStorage.getItem(key));
                    users.push(userData);
                } catch (e) {
                    console.error('Error parsing user data:', key, e);
                }
            }
        }
        return users;
    }
};