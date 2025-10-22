import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse, isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import {
    ONESIGNAL_MODULE_OPTIONS,
    ONESIGNAL_API_BASE_URL
} from '../constants';
import { OneSignalModuleOptions } from '../interfaces';

@Injectable()
export class BaseOneSignalService {
    protected readonly headers: Record<string, string>;

    constructor(
        @Inject(ONESIGNAL_MODULE_OPTIONS)
        protected readonly options: OneSignalModuleOptions,
        protected readonly httpService: HttpService
    ) {
        // Set default timeout if not provided
        this.options.timeout = this.options.timeout ?? 10000;
        this.headers = {
            'Content-Type': 'application/json',
            Authorization: `Basic ${this.options.apiKey}`,
        };
    }

    protected async request<T>(
        method: 'get' | 'post' | 'put' | 'delete' | 'patch',
        endpoint: string,
        data?: any,
        params?: any
    ): Promise<T> {
        const url = `${ONESIGNAL_API_BASE_URL}${endpoint}`;
        const config = {
            headers: this.headers,
            params,
            timeout: this.options.timeout,
        };

        try {
            const response: AxiosResponse<T> = await firstValueFrom(
                method === 'get'
                    ? this.httpService.get(url, config)
                    : method === 'post'
                        ? this.httpService.post(url, data, config)
                        : method === 'put'
                            ? this.httpService.put(url, data, config)
                            : method === 'patch'
                                ? this.httpService.patch(url, data, config)
                                : this.httpService.delete(url, config)
            );
            return response.data;
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                const errorDetails = error.message || error.response?.data?.errors;
                throw new Error(`OneSignal API error: ${JSON.stringify(errorDetails)}`);
            }
            if (error instanceof Error) {
                throw new Error(`OneSignal request failed: ${error.message}`);
            }
            throw new Error(`OneSignal unknown error: ${JSON.stringify(error)}`);
        }
    }
}
