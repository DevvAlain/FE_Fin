// Authentication service for FinWise
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  timezone?: string;
  language?: string;
  isActive: boolean;
  role?: 'user' | 'admin' | 'staff';
  lastLoginAt?: Date;
}

export interface AuthResponse {
  success: boolean;
  statusCode: number;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  needVerification?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface GoogleLoginData {
  email: string;
  name: string;
  picture?: string;
}

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Load tokens from localStorage on initialization
    this.accessToken = localStorage.getItem("accessToken");
    this.refreshToken = localStorage.getItem("refreshToken");
  }

  // Helper method for API calls
  private async apiCall(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<AuthResponse> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      // Handle token refresh if needed
      if (response.status === 401 && this.refreshToken) {
        const refreshResult = await this.refreshAccessToken();
        if (refreshResult.success) {
          // Retry the original request with new token
          headers["Authorization"] = `Bearer ${this.accessToken}`;
          const retryResponse = await fetch(url, {
            ...options,
            headers,
          });
          return await retryResponse.json();
        }
      }

      return data;
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  }

  // Register new user
  async register(
    userData: RegisterData,
    baseUrl?: string
  ): Promise<AuthResponse> {
    try {
      const response = await this.apiCall("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ ...userData, baseUrl }),
      });

      if (response.success && response.accessToken && response.refreshToken) {
        this.setTokens(response.accessToken, response.refreshToken);
      }

      return response;
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        statusCode: 500,
        message: "Lỗi kết nối đến server",
      };
    }
  }

  // Login user
  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      const response = await this.apiCall("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(loginData),
      });

      if (response.success && response.accessToken && response.refreshToken) {
        this.setTokens(response.accessToken, response.refreshToken);
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        statusCode: 500,
        message: "Lỗi kết nối đến server",
      };
    }
  }

  // Google login
  async googleLogin(googleData: GoogleLoginData): Promise<AuthResponse> {
    try {
      const response = await this.apiCall("/api/auth/google-login", {
        method: "POST",
        body: JSON.stringify(googleData),
      });

      if (response.success && response.accessToken && response.refreshToken) {
        this.setTokens(response.accessToken, response.refreshToken);
      }

      return response;
    } catch (error) {
      console.error("Google login error:", error);
      return {
        success: false,
        statusCode: 500,
        message: "Lỗi kết nối đến server",
      };
    }
  }

  // Refresh access token
  async refreshAccessToken(): Promise<AuthResponse> {
    if (!this.refreshToken) {
      return {
        success: false,
        statusCode: 401,
        message: "Không có refresh token",
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      const data = await response.json();

      if (data.success && data.accessToken && data.refreshToken) {
        this.setTokens(data.accessToken, data.refreshToken);
      } else {
        this.clearTokens();
      }

      return data;
    } catch (error) {
      console.error("Refresh token error:", error);
      this.clearTokens();
      return {
        success: false,
        statusCode: 500,
        message: "Lỗi kết nối đến server",
      };
    }
  }

  // Verify email with token
  async verifyEmail(token: string, returnUrl?: string): Promise<AuthResponse> {
    try {
      const url = returnUrl
        ? `/api/auth/verify-email/${token}?returnUrl=${encodeURIComponent(
            returnUrl
          )}`
        : `/api/auth/verify-email/${token}`;

      const response = await this.apiCall(url, {
        method: "GET",
      });

      return response;
    } catch (error) {
      console.error("Verify email error:", error);
      return {
        success: false,
        statusCode: 500,
        message: "Lỗi kết nối đến server",
      };
    }
  }

  // Resend verification email
  async resendVerificationEmail(
    email: string,
    baseUrl?: string
  ): Promise<AuthResponse> {
    try {
      const response = await this.apiCall("/api/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email, baseUrl }),
      });

      return response;
    } catch (error) {
      console.error("Resend verification error:", error);
      return {
        success: false,
        statusCode: 500,
        message: "Lỗi kết nối đến server",
      };
    }
  }

  // Forgot password
  async forgotPassword(email: string, baseUrl?: string): Promise<AuthResponse> {
    try {
      const response = await this.apiCall("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email, baseUrl }),
      });

      return response;
    } catch (error) {
      console.error("Forgot password error:", error);
      return {
        success: false,
        statusCode: 500,
        message: "Lỗi kết nối đến server",
      };
    }
  }

  // Reset password with token
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<AuthResponse> {
    try {
      const response = await this.apiCall(`/api/auth/reset-password/${token}`, {
        method: "POST",
        body: JSON.stringify({ newPassword }),
      });

      return response;
    } catch (error) {
      console.error("Reset password error:", error);
      return {
        success: false,
        statusCode: 500,
        message: "Lỗi kết nối đến server",
      };
    }
  }

  // Change password (requires authentication)
  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<AuthResponse> {
    try {
      const response = await this.apiCall("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      return response;
    } catch (error) {
      console.error("Change password error:", error);
      return {
        success: false,
        statusCode: 500,
        message: "Lỗi kết nối đến server",
      };
    }
  }

  // Get current user info
  async getCurrentUser(): Promise<User | null> {
    if (!this.accessToken) {
      return null;
    }

    try {
      // Decode JWT token to get user info
      const parts = this.accessToken.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid token format");
      }
      
      const payload = JSON.parse(
        decodeURIComponent(
          escape(
            window.atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
          )
        )
      );

      // Extract user info from token payload
      const role = payload?.role || payload?.userRole;
      const isAdmin = role === "admin" || role === "Admin" || payload?.isAdmin === true;

      return {
        id: payload.id || payload.sub || payload.userId,
        fullName: payload.name || payload.fullName || "Admin User",
        email: payload.email || "admin@example.com",
        role: isAdmin ? 'admin' : 'user',
        isActive: true,
      };
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }

  // Logout
  logout(): void {
    this.clearTokens();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Set tokens
  private setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  // Clear tokens
  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  // Get access token
  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Check if user is admin and redirect accordingly
  async checkAdminAndRedirect(): Promise<boolean> {
    try {
      if (!this.isAuthenticated()) {
        window.location.href = '/login';
        return false;
      }

      const user = await this.getCurrentUser();
      if (user && user.role === 'admin') {
        window.location.href = '/admin';
        return true;
      } else {
        window.location.href = '/';
        return false;
      }
    } catch (error) {
      console.error('Check admin error:', error);
      window.location.href = '/login';
      return false;
    }
  }
}

export default new AuthService();
