const API_URL = 'http://localhost:5000/api';

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

export const api = {
    async login(email: string, password: string): Promise<LoginResponse> {
        try {
            const url = `${API_URL}/auth/login`;
            const body = JSON.stringify({ email, password });
            
            console.log('Login request details:', {
                url,
                method: 'POST',
                headers: defaultHeaders,
                body: { email, password } // Log the body without the password
            });

            const response = await fetch(url, {
                method: 'POST',
                headers: defaultHeaders,
                credentials: 'include',
                body
            });

            console.log('Login response status:', response.status);
            if (!response.ok) {
                const error = await response.json();
                console.error('Login error response:', error);
                throw new Error(error.error || 'Login failed');
            }

            const data = await response.json();
            console.log('Login successful:', data);
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async register(name: string, email: string, password: string, role: string): Promise<void> {
        try {
            const url = `${API_URL}/auth/register`;
            const body = JSON.stringify({ name, email, password, role });
            
            console.log('Registration request details:', {
                url,
                method: 'POST',
                headers: defaultHeaders,
                body: { name, email, role } // Log the body without the password
            });

            const response = await fetch(url, {
                method: 'POST',
                headers: defaultHeaders,
                credentials: 'include',
                body
            });

            console.log('Registration response status:', response.status);
            if (!response.ok) {
                const error = await response.json();
                console.error('Registration error response:', error);
                throw new Error(error.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    async logout(token: string): Promise<void> {
        try {
            const url = `${API_URL}/auth/logout`;
            
            console.log('Logout request details:', {
                url,
                method: 'POST',
                headers: {
                    ...defaultHeaders,
                    'Authorization': `Bearer ${token}`,
                }
            });

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    ...defaultHeaders,
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });

            console.log('Logout response status:', response.status);
            if (!response.ok) {
                const error = await response.json();
                console.error('Logout error response:', error);
                throw new Error(error.error || 'Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        try {
            const url = `${API_URL}/auth/change-password`;
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            console.log('Change password request details:', {
                url,
                method: 'POST',
                headers: {
                    ...defaultHeaders,
                    'Authorization': `Bearer ${token}`,
                }
            });

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    ...defaultHeaders,
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            console.log('Change password response status:', response.status);
            if (!response.ok) {
                const error = await response.json();
                console.error('Change password error response:', error);
                throw new Error(error.error || 'Password change failed');
            }
        } catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    },
}; 