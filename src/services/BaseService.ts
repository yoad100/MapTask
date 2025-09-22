  import axios, { AxiosInstance } from 'axios';

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7115/api';
  /**
   * BaseService is an abstract generic class that provides common
   * CRUD-like methods to interact with a REST API endpoint.
   * 
   * T = DTO type used when sending data to the API
   * R = Model type returned by the API
   */
  export abstract class BaseService<T, R> {
    protected api: AxiosInstance;

    constructor(protected endpoint: string) {
      this.api = axios.create({
        baseURL: API_BASE_URL,
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' },
      });
      // Log errors if API fails
      this.api.interceptors.response.use(
        (response) => response,
        (error) => {
          console.error(`API Error [${endpoint}]:`, error);
          return Promise.reject(error);
        }
      );
    }

    async getAll(): Promise<R[]> {
      const res = await this.api.get<R[]>(`/${this.endpoint}`);
      return res.data || [];
    }

    async delete(id: string): Promise<void> {
      await this.api.delete(`/${this.endpoint}/${id}`);
    }

    protected async saveBulk(data: T[]): Promise<R[]> {
      const res = await this.api.post<R[]>(`/${this.endpoint}/save`, data);
      return res.data || [];
    }
  }
