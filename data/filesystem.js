// File System Simulator - Simulates folder and file storage
const FileSystem = {
    FS_KEY: 'cloudvault_filesystem',
    
    // Initialize file system
    init() {
        if (!localStorage.getItem(this.FS_KEY)) {
            const initialFS = {
                folders: {},
                files: {},
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(this.FS_KEY, JSON.stringify(initialFS));
        }
    },
    
    // Get file system
    getFileSystem() {
        const fsData = localStorage.getItem(this.FS_KEY);
        return fsData ? JSON.parse(fsData) : null;
    },
    
    // Save file system
    saveFileSystem(data) {
        data.lastUpdated = new Date().toISOString();
        localStorage.setItem(this.FS_KEY, JSON.stringify(data));
    },
    
    // Create folder
    createFolder(folderName) {
        const fs = this.getFileSystem();
        if (!fs) return false;
        
        if (!fs.folders[folderName]) {
            fs.folders[folderName] = {
                name: folderName,
                createdAt: new Date().toISOString(),
                files: {}
            };
            this.saveFileSystem(fs);
            return true;
        }
        return false;
    },
    
    // Create file in folder
    createFile(folderName, fileName, content) {
        const fs = this.getFileSystem();
        if (!fs) return null;
        
        // Create folder if it doesn't exist
        if (!fs.folders[folderName]) {
            this.createFolder(folderName);
        }
        
        const fileId = `${folderName}/${fileName}`;
        const file = {
            id: fileId,
            folder: folderName,
            name: fileName,
            content: content,
            createdAt: new Date().toISOString(),
            size: content.length
        };
        
        fs.files[fileId] = file;
        fs.folders[folderName].files[fileName] = file;
        this.saveFileSystem(fs);
        
        return file;
    },
    
    // Get file content
    getFileContent(folderName, fileName) {
        const fs = this.getFileSystem();
        if (!fs) return null;
        
        const fileId = `${folderName}/${fileName}`;
        return fs.files[fileId] ? fs.files[fileId].content : null;
    },
    
    // Get folder files
    getFolderFiles(folderName) {
        const fs = this.getFileSystem();
        if (!fs || !fs.folders[folderName]) return {};
        
        return fs.folders[folderName].files;
    },
    
    // Update file content
    updateFile(folderName, fileName, content) {
        const fs = this.getFileSystem();
        if (!fs) return null;
        
        const fileId = `${folderName}/${fileName}`;
        if (fs.files[fileId]) {
            fs.files[fileId].content = content;
            fs.files[fileId].updatedAt = new Date().toISOString();
            fs.files[fileId].size = content.length;
            fs.folders[folderName].files[fileName] = fs.files[fileId];
            this.saveFileSystem(fs);
            return fs.files[fileId];
        }
        return null;
    },
    
    // Append to file content
    appendToFile(folderName, fileName, content) {
        const existingContent = this.getFileContent(folderName, fileName) || '';
        const newContent = existingContent + '\n' + content;
        return this.updateFile(folderName, fileName, newContent);
    }
};

// Initialize file system when module loads
FileSystem.init();