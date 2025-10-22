import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';
import { BaseOneSignalService } from '../../src/services/base-onesignal.service';
import { ONESIGNAL_MODULE_OPTIONS } from '../../src/constants';

describe('BaseOneSignalService', () => {
    let service: BaseOneSignalService;
    let httpService: HttpService;

    const mockOptions = {
        appId: 'test-app-id',
        apiKey: 'test-api-key',
        timeout: 5000
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BaseOneSignalService,
                {
                    provide: ONESIGNAL_MODULE_OPTIONS,
                    useValue: mockOptions,
                },
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(),
                        post: jest.fn(),
                        put: jest.fn(),
                        patch: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<BaseOneSignalService>(BaseOneSignalService);
        httpService = module.get<HttpService>(HttpService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should set default timeout if not provided', async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BaseOneSignalService,
                {
                    provide: ONESIGNAL_MODULE_OPTIONS,
                    useValue: {
                        appId: 'test-app-id',
                        apiKey: 'test-api-key',
                    },
                },
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(),
                        post: jest.fn(),
                        put: jest.fn(),
                        patch: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        const serviceWithDefaultTimeout = module.get<BaseOneSignalService>(BaseOneSignalService);
        expect(serviceWithDefaultTimeout['options'].timeout).toBe(10000);
    });

    describe('request method', () => {
        const mockResponse: AxiosResponse = {
            data: { success: true },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {} as any,
        };

        it('should make a GET request successfully', async () => {
            (httpService.get as jest.Mock).mockReturnValue(of(mockResponse));

            const result = await service['request']('get', '/test');
            expect(result).toEqual({ success: true });
            expect(httpService.get).toHaveBeenCalledWith('https://api.onesignal.com/test', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${mockOptions.apiKey}`,
                },
                params: undefined,
                timeout: mockOptions.timeout,
            });
        });

        it('should make a POST request successfully', async () => {
            (httpService.post as jest.Mock).mockReturnValue(of(mockResponse));

            const data = { key: 'value' };
            const result = await service['request']('post', '/test', data);
            expect(result).toEqual({ success: true });
            expect(httpService.post).toHaveBeenCalledWith('https://api.onesignal.com/test', data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${mockOptions.apiKey}`,
                },
                params: undefined,
                timeout: mockOptions.timeout,
            });
        });

        it('should make a PUT request successfully', async () => {
            (httpService.put as jest.Mock).mockReturnValue(of(mockResponse));

            const data = { key: 'value' };
            const result = await service['request']('put', '/test', data);
            expect(result).toEqual({ success: true });
            expect(httpService.put).toHaveBeenCalledWith('https://api.onesignal.com/test', data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${mockOptions.apiKey}`,
                },
                params: undefined,
                timeout: mockOptions.timeout,
            });
        });

        it('should make a PATCH request successfully', async () => {
            (httpService.patch as jest.Mock).mockReturnValue(of(mockResponse));

            const data = { key: 'value' };
            const result = await service['request']('patch', '/test', data);
            expect(result).toEqual({ success: true });
            expect(httpService.patch).toHaveBeenCalledWith('https://api.onesignal.com/test', data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${mockOptions.apiKey}`,
                },
                params: undefined,
                timeout: mockOptions.timeout,
            });
        });

        it('should make a DELETE request successfully', async () => {
            (httpService.delete as jest.Mock).mockReturnValue(of(mockResponse));

            const result = await service['request']('delete', '/test');
            expect(result).toEqual({ success: true });
            expect(httpService.delete).toHaveBeenCalledWith('https://api.onesignal.com/test', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${mockOptions.apiKey}`,
                },
                params: undefined,
                timeout: mockOptions.timeout,
            });
        });

        it('should handle AxiosError', async () => {
            const axiosError = new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
                data: { errors: ['Invalid request'] },
                status: 400,
                statusText: 'Bad Request',
                headers: {},
                config: {} as any,
            });
            (httpService.get as jest.Mock).mockReturnValue(throwError(() => axiosError));

            await expect(service['request']('get', '/test')).rejects.toThrow('OneSignal API error: "Request failed"');
        });

        it('should handle generic Error', async () => {
            const genericError = new Error('Network error');
            (httpService.get as jest.Mock).mockReturnValue(throwError(() => genericError));

            await expect(service['request']('get', '/test')).rejects.toThrow('OneSignal request failed: Network error');
        });

        it('should handle unknown error', async () => {
            (httpService.get as jest.Mock).mockReturnValue(throwError(() => 'string error'));

            await expect(service['request']('get', '/test')).rejects.toThrow('OneSignal unknown error: "string error"');
        });
    });
});
