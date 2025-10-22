import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { OneSignalSubscriptionsService } from '../../src/services/onesignal-subscriptions.service';
import { ONESIGNAL_MODULE_OPTIONS } from '../../src/constants';
import {
    CreateSubscriptionInput,
    UpdateSubscriptionInput,
} from '../../src/interfaces';

describe('OneSignalSubscriptionsService', () => {
    let service: OneSignalSubscriptionsService;
    let httpService: HttpService;

    const mockOptions = {
        appId: 'test-app-id',
        apiKey: 'test-api-key',
        timeout: 5000
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OneSignalSubscriptionsService,
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

        service = module.get<OneSignalSubscriptionsService>(OneSignalSubscriptionsService);
        httpService = module.get<HttpService>(HttpService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createSubscription', () => {
        it('should create subscription successfully', async () => {
            const mockResponse = { id: 'subscription-123', success: true };
            (httpService.post as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const input: CreateSubscriptionInput = {
                device_type: 0,
                identifier: 'test-token',
                test_type: 1,
            };

            const result = await service.createSubscription(input);
            expect(result).toEqual(mockResponse);
            expect(httpService.post).toHaveBeenCalledWith(
                'https://api.onesignal.com/players',
                { ...input, app_id: mockOptions.appId },
                expect.any(Object)
            );
        });
    });

    describe('viewSubscription', () => {
        it('should view subscription successfully', async () => {
            const mockResponse = { id: 'subscription-123', identifier: 'test-token' };
            (httpService.get as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const result = await service.viewSubscription('subscription-123');
            expect(result).toEqual(mockResponse);
            expect(httpService.get).toHaveBeenCalledWith(
                'https://api.onesignal.com/players/subscription-123',
                expect.any(Object)
            );
        });
    });

    describe('updateSubscription', () => {
        it('should update subscription successfully', async () => {
            const mockResponse = { success: true };
            (httpService.put as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const input: UpdateSubscriptionInput = {
                device_type: 0,
                identifier: 'updated-token',
            };

            const result = await service.updateSubscription('subscription-123', input);
            expect(result).toEqual(mockResponse);
            expect(httpService.put).toHaveBeenCalledWith(
                'https://api.onesignal.com/players/subscription-123',
                { ...input, app_id: mockOptions.appId },
                expect.any(Object)
            );
        });
    });

    describe('deleteSubscription', () => {
        it('should delete subscription successfully', async () => {
            (httpService.delete as jest.Mock).mockReturnValue(of({ data: undefined }));

            const result = await service.deleteSubscription('subscription-123');
            expect(result).toBeUndefined();
            expect(httpService.delete).toHaveBeenCalledWith(
                'https://api.onesignal.com/players/subscription-123',
                expect.any(Object)
            );
        });
    });
});
