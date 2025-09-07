import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

class AuthService {
  private token: string | null = null;
  private readonly APEX_HOST = 'https://g32c06fca666406-jamesgoodeycpl.adb.uk-london-1.oraclecloudapps.com';
  private readonly APP_ALIAS = 'jamescpl';

  async getJwt(): Promise<string | null> {
    // For web platform, use cookie-based auth
    if (Platform.OS === 'web') {
      return this.getJwtFromCookie();
    }
    // For mobile, handle differently (stored token or redirect)
    if (this.token) {
      return this.token;
    }

    await this.redirectToAuth();
    return null;
  }

  private getJwtFromCookie(): string | null {
    if (typeof document === 'undefined') return null;

    const entry = document.cookie.split("; ").find(r => r.startsWith("apex_jwt="));
    if (entry) {
      const token = decodeURIComponent(entry.split("=")[1]);
      // Clear cookie after reading
      document.cookie = "apex_jwt=; Path=/; Max-Age=0; SameSite=Lax; Secure";
      this.token = token;
      return token;
    }
    return null;
  }

  private async redirectToAuth(): Promise<void> {
    const authUrl = `${this.APEX_HOST}/ords/r/${this.APP_ALIAS}/bridge`;

    if (Platform.OS === 'web') {
      window.location.href = authUrl;
    } else {
      // For mobile, use WebBrowser
      await WebBrowser.openBrowserAsync(authUrl);
    }
  }

  async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await this.getJwt();
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      // Token expired, redirect to auth
      this.token = null;
      await this.redirectToAuth();
      throw new Error('Authentication expired');
    }

    return response;
  }

  clearToken(): void {
    this.token = null;
  }
}

export const authService = new AuthService();
