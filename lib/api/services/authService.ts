import axiosInstance from '../base-api';

/**
 * Auth Service - Handles authentication operations
 */
class AuthService {
  private baseUrl = '/auth';

  /**
   * Login user
   * @param username - Username
   * @param password - Password
   * @returns Promise with token
   */
  async login(username: string, password: string): Promise<{ token: string }> {
    const response = await axiosInstance.post<{ token: string }>(
      `${this.baseUrl}/login`,
      { username, password }
    );
    return response.data;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;

