import { storage } from './storage';
import { User, UserRole } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = storage.getUsers();
        const user = users.find(u => u.email === email);
        
        if (user) {
          storage.saveSession(user);
          resolve(user);
        } else {
          // If no user exists, create a demo one for testing purposes if it matches a dummy password
          if (password === 'password123') {
            const newUser: User = {
              id: uuidv4(),
              fullName: 'Demo User',
              email: email,
              role: 'Founder',
              onboardingCompleted: true,
            };
            const updatedUsers = [...users, newUser];
            storage.saveUsers(updatedUsers);
            storage.saveSession(newUser);
            resolve(newUser);
          } else {
            reject(new Error('Invalid email or password'));
          }
        }
      }, 500);
    });
  },

  signup: async (fullName: string, email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = storage.getUsers();
        if (users.find(u => u.email === email)) {
          reject(new Error('User already exists'));
          return;
        }

        const newUser: User = {
          id: uuidv4(),
          fullName,
          email,
          role: 'Founder', // Default to Founder for signup
          onboardingCompleted: false,
        };

        storage.saveUsers([...users, newUser]);
        storage.saveSession(newUser);
        resolve(newUser);
      }, 500);
    });
  },

  logout: () => {
    storage.saveSession(null);
  },

  getCurrentUser: (): User | null => {
    return storage.getSession();
  },

  updateUser: (updatedUser: User) => {
    const users = storage.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      storage.saveUsers(users);
      storage.saveSession(updatedUser);
    }
  },

  forgotPassword: async (email: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Reset link sent to ${email}`);
        resolve();
      }, 500);
    });
  }
};
