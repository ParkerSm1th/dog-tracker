import Clerk from '@clerk/clerk-js/headless';
import axios from 'axios';

class HTTPClient {
  apiInstance;

  constructor() {
    const apiHost = process.env.EXPO_PUBLIC_API_URL;
    const headers = {
      'Content-Type': 'application/json',
    };
    this.apiInstance = axios.create({
      baseURL: `${apiHost}`,
      responseType: 'json',
      headers,
      validateStatus: () => true,
    });
  }

  async get(path: string, params?: unknown, isAuthed = true) {
    const conf = {
      withCredentials: true,
      headers: isAuthed ? await this.headers() : {},
      params,
    };
    return this.apiInstance.get(path, conf);
  }

  async post(path: string, data?: unknown, isAuthed = true) {
    const conf = {
      headers: isAuthed ? await this.headers() : {},
      withCredentials: true,
    };
    return this.apiInstance.post(path, data, conf);
  }

  async put(path: string, data?: unknown, isAuthed = true) {
    const conf = {
      headers: isAuthed ? await this.headers() : {},
      withCredentials: true,
    };
    return this.apiInstance.put(path, data, conf);
  }

  async delete(path: string, data?: unknown, isAuthed = true) {
    const conf = {
      headers: isAuthed ? await this.headers() : {},
      withCredentials: true,
      data,
    };
    return this.apiInstance.delete(path, conf);
  }

  // eslint-disable-next-line class-methods-use-this
  private async headers(): Promise<Record<string, string>> {
    const clerk = new Clerk(process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!);
    const token = await clerk.session?.getToken();
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token != null) {
      headers = {
        ...headers,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Bearer ${token}`,
      };
    }
    return headers;
  }
}

export default new HTTPClient();
