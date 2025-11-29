// File-Based Storage System
// This system simulates how user data would be stored in actual files and folders

const FileBasedStorage = {
    // Simulate creating user directory structure
    createUserDirectory(email) {
        // In a real server environment, this would create:
        // /data/{email}/information.txt
        // /data/{email}/downloads/ (empty folder)
        
        // For simulation, we'll store directory info in localStorage
        const userDir = {
            email: email,
            path: `/data/${email}/`,
            createdAt: new Date().toISOString(),
            files: []
        };
        
        localStorage.setItem(`userdir_${email}`, JSON.stringify(userDir));
        return userDir;
    },
    
    // Simulate creating user information file
    createUserInfoFile(email, user) {
        const userInfo = `Account Information
=================

Name: ${user.name}
Email: ${user.email}
Account Created: ${user.createdAt || new Date().toISOString()}
User ID: ${user.id}

This file contains your account details for CloudVault.`;
        
        // Store in localStorage for demo purposes
        localStorage.setItem(`userinfo_${email}`, userInfo);
        
        // Update user directory record
        const userDir = JSON.parse(localStorage.getItem(`userdir_${email}`) || '{}');
        userDir.files = userDir.files || [];
        userDir.files.push({
            name: 'information.txt',
            path: `/data/${email}/information.txt`,
            type: 'text',
            size: userInfo.length,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem(`userdir_${email}`, JSON.stringify(userDir));
        
        return true;
    },
    
    // Simulate creating downloads directory
    createDownloadsDirectory(email) {
        // Update user directory record
        const userDir = JSON.parse(localStorage.getItem(`userdir_${email}`) || '{}');
        userDir.files = userDir.files || [];
        
        // Check if downloads directory entry exists
        const downloadsExists = userDir.files.some(file => file.name === 'downloads' && file.type === 'directory');
        if (!downloadsExists) {
            userDir.files.push({
                name: 'downloads',
                path: `/data/${email}/downloads/`,
                type: 'directory',
                createdAt: new Date().toISOString()
            });
            localStorage.setItem(`userdir_${email}`, JSON.stringify(userDir));
        }
        
        return true;
    },
    
    // Simulate saving uploaded file to downloads folder
    saveUploadedFile(email, fileName, fileType, fileSize, fileContent) {
        // Store file content
        localStorage.setItem(`userfile_${email}_${fileName}`, fileContent);
        
        // Update user directory record
        const userDir = JSON.parse(localStorage.getItem(`userdir_${email}`) || '{}');
        userDir.files = userDir.files || [];
        
        // Check if downloads directory entry exists
        let downloadsDir = userDir.files.find(file => file.name === 'downloads' && file.type === 'directory');
        if (!downloadsDir) {
            downloadsDir = {
                name: 'downloads',
                path: `/data/${email}/downloads/`,
                type: 'directory',
                files: [],
                createdAt: new Date().toISOString()
            };
            userDir.files.push(downloadsDir);
        }
        
        // Add file to downloads directory
        if (!downloadsDir.files) downloadsDir.files = [];
        downloadsDir.files.push({
            name: fileName,
            path: `/data/${email}/downloads/${fileName}`,
            type: fileType,
            size: fileSize,
            contentKey: `userfile_${email}_${fileName}`,
            createdAt: new Date().toISOString()
        });
        
        localStorage.setItem(`userdir_${email}`, JSON.stringify(userDir));
        
        return true;
    },
    
    // Simulate getting user directory info
    getUserDirectory(email) {
        const userDir = localStorage.getItem(`userdir_${email}`);
        return userDir ? JSON.parse(userDir) : null;
    },
    
    // Simulate getting user info content
    getUserInfoContent(email) {
        return localStorage.getItem(`userinfo_${email}`) || null;
    },
    
    // Simulate getting uploaded file content
    getUploadedFileContent(email, fileName) {
        return localStorage.getItem(`userfile_${email}_${fileName}`) || null;
    },
    
    // Simulate user authentication
    authenticateUser(email, password) {
        // In a real implementation, this would check actual stored credentials
        // For simulation, we'll check if user directory exists
        const userDir = this.getUserDirectory(email);
        if (userDir) {
            // Simulate password check
            const storedPassword = localStorage.getItem(`userpass_${email}`);
            if (storedPassword && storedPassword === password) {
                return {
                    id: userDir.email, // Using email as ID for simulation
                    name: "User", // Would be retrieved from actual user data
                    email: email
                };
            }
        }
        return null;
    },
    
    // Simulate user registration
    registerUser(name, email, password) {
        // Check if user already exists
        if (this.getUserDirectory(email)) {
            throw new Error("User with this email already exists");
        }
        
        // Store password (insecure for demo only)
        localStorage.setItem(`userpass_${email}`, password);
        
        // Create user directory structure
        const userDir = this.createUserDirectory(email);
        this.createUserInfoFile(email, { name, email, id: email, createdAt: new Date().toISOString() });
        this.createDownloadsDirectory(email);
        
        return {
            id: email,
            name: name,
            email: email
        };
    },
    
    // Get all users (for file viewer)
    getAllUsers() {
        const users = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('userdir_')) {
                try {
                    const userDir = JSON.parse(localStorage.getItem(key));
                    users.push({
                        email: userDir.email,
                        path: userDir.path,
                        createdAt: userDir.createdAt
                    });
                } catch (e) {
                    console.error('Error parsing user directory:', key, e);
                }
            }
        }
        return users;
    }
};