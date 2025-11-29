// JSON Storage Manager - Simulates JSON file storage for user data
const JSONStorage = {
    // Simulate saving user data to a JSON file
    saveUserDataToJSON(user) {
        // In a real server environment, this would write to an actual JSON file
        // For simulation, we'll store the JSON string in localStorage
        
        // Create user data object
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password, // In a real app, this would be hashed
            createdAt: user.createdAt,
            files: user.files || []
        };
        
        // Convert to JSON string
        const userDataJSON = JSON.stringify(userData, null, 2);
        
        // Simulate writing to /user/{email}/data.json
        console.log(`[SIMULATION] Writing to file: /user/${user.email}/data.json`);
        console.log(`[SIMULATION] Content:\n${userDataJSON}`);
        
        // Store in localStorage for demo purposes
        localStorage.setItem(`user_${user.email}_data.json`, userDataJSON);
        
        return true;
    },
    
    // Simulate loading user data from a JSON file
    loadUserDataFromJSON(email) {
        // In a real server environment, this would read from an actual JSON file
        // For simulation, we'll retrieve from localStorage
        
        const userDataJSON = localStorage.getItem(`user_${email}_data.json`);
        
        if (userDataJSON) {
            try {
                console.log(`[SIMULATION] Reading from file: /user/${email}/data.json`);
                const userData = JSON.parse(userDataJSON);
                return userData;
            } catch (error) {
                console.error('Error parsing user data JSON:', error);
                return null;
            }
        }
        
        return null;
    },
    
    // Simulate saving all users data to a JSON file
    saveAllUsersToJSON(users) {
        // Create users data object
        const usersData = {
            users: users,
            lastUpdated: new Date().toISOString()
        };
        
        // Convert to JSON string
        const usersDataJSON = JSON.stringify(usersData, null, 2);
        
        // Simulate writing to /users.json
        console.log(`[SIMULATION] Writing to file: /users.json`);
        console.log(`[SIMULATION] Content:\n${usersDataJSON}`);
        
        // Store in localStorage for demo purposes
        localStorage.setItem('users.json', usersDataJSON);
        
        return true;
    },
    
    // Simulate loading all users data from a JSON file
    loadAllUsersFromJSON() {
        // In a real server environment, this would read from an actual JSON file
        // For simulation, we'll retrieve from localStorage
        
        const usersDataJSON = localStorage.getItem('users.json');
        
        if (usersDataJSON) {
            try {
                console.log(`[SIMULATION] Reading from file: /users.json`);
                const usersData = JSON.parse(usersDataJSON);
                return usersData.users || [];
            } catch (error) {
                console.error('Error parsing users data JSON:', error);
                return [];
            }
        }
        
        return [];
    },
    
    // Simulate updating user data in JSON file
    updateUserDataInJSON(user) {
        // Load existing data
        const existingData = this.loadUserDataFromJSON(user.email) || {};
        
        // Merge with new data
        const updatedData = { ...existingData, ...user };
        
        // Save updated data
        return this.saveUserDataToJSON(updatedData);
    },
    
    // Simulate adding a file to user's JSON data
    addFileToUserJSON(email, file) {
        // Load existing user data
        const userData = this.loadUserDataFromJSON(email) || {
            id: null,
            name: '',
            email: email,
            password: '',
            createdAt: new Date().toISOString(),
            files: []
        };
        
        // Add file to user's files array
        userData.files = userData.files || [];
        userData.files.push(file);
        
        // Save updated data
        return this.saveUserDataToJSON(userData);
    }
};