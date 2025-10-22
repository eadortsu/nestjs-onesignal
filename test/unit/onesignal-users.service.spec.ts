import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { OneSignalUsersService } from '../../src/services/onesignal-users.service';
import { ONESIGNAL_MODULE_OPTIONS } from '../../src/constants';
import {
    CreateUserInput,
    UpdateUserInput,
    CustomEvent,
} from '../../src/interfaces';

describe('OneSignalUsersService', () => {
    let service: OneSignalUsersService;
    let httpService: HttpService;

    const mockOptions = {
        appId: 'test-app-id',
        apiKey: 'test-api-key',
        timeout: 5000
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OneSignalUsersService,
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

        service = module.get<OneSignalUsersService>(OneSignalUsersService);
        httpService = module.get<HttpService>(HttpService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createUser', () => {
        it('should create user successfully', async () => {
            const mockResponse = { identity: { onesignal_id: 'user-123' } };
            (httpService.post as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const input: CreateUserInput = {
                identity: { external_id: 'ext-123' },
                properties: { tags: { plan: 'premium' } },
            };

            const result = await service.createUser(input);
            expect(result).toEqual(mockResponse);
            expect(httpService.post).toHaveBeenCalledWith(
                'https://api.onesignal.com/apps/test-app-id/users',
                input,
                expect.any(Object)
            );
        });

        it('should throw error if external_id is missing', async () => {
            const input = { identity: {} } as CreateUserInput;

            await expect(service.createUser(input)).rejects.toThrow('external_id is required for CreateUserInput.identity');
        });
    });

    describe('viewUser', () => {
        it('should view user successfully', async () => {
            const mockResponse = { identity: { onesignal_id: 'user-123', external_id: 'ext-123' } };
            (httpService.get as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const result = await service.viewUser('external_id', 'ext-123');
            expect(result).toEqual(mockResponse);
            expect(httpService.get).toHaveBeenCalledWith(
                'https://api.onesignal.com/apps/test-app-id/users/by/external_id/ext-123',
                expect.any(Object)
            );
        });
    });

    describe('updateUser', () => {
        it('should update user successfully', async () => {
            const mockResponse = { success: true };
            (httpService.patch as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const input: UpdateUserInput = {
                properties: { tags: { plan: 'enterprise' } },
            };

            const result = await service.updateUser('external_id', 'ext-123', input);
            expect(result).toEqual(mockResponse);
            expect(httpService.patch).toHaveBeenCalledWith(
                'https://api.onesignal.com/apps/test-app-id/users/by/external_id/ext-123',
                input,
                expect.any(Object)
            );
        });

        it('should throw error if neither properties nor deltas are provided', async () => {
            const input = {} as UpdateUserInput;

            await expect(service.updateUser('external_id', 'ext-123', input)).rejects.toThrow('At least one of properties or deltas must be provided');
        });
    });

    describe('deleteUser', () => {
        it('should delete user successfully', async () => {
            const mockResponse = { success: true };
            (httpService.delete as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const result = await service.deleteUser('external_id', 'ext-123');
            expect(result).toEqual(mockResponse);
            expect(httpService.delete).toHaveBeenCalledWith(
                'https://api.onesignal.com/apps/test-app-id/users/by/external_id/ext-123',
                expect.any(Object)
            );
        });
    });

    describe('viewUserIdentity', () => {
        it('should view user identity successfully', async () => {
            const mockResponse = { identity: { onesignal_id: 'user-123', external_id: 'ext-123' } };
            (httpService.get as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const result = await service.viewUserIdentity('external_id', 'ext-123');
            expect(result).toEqual(mockResponse);
            expect(httpService.get).toHaveBeenCalledWith(
                'https://api.onesignal.com/apps/test-app-id/users/by/external_id/ext-123/identity',
                expect.any(Object)
            );
        });
    });

    describe('viewUserIdentityBySubscription', () => {
        it('should view user identity by subscription successfully', async () => {
            const mockResponse = { identity: { onesignal_id: 'user-123' } };
            (httpService.get as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const result = await service.viewUserIdentityBySubscription('sub-123');
            expect(result).toEqual(mockResponse);
            expect(httpService.get).toHaveBeenCalledWith(
                'https://api.onesignal.com/apps/test-app-id/subscriptions/sub-123/user/identity',
                expect.any(Object)
            );
        });
    });

    describe('createCustomEvents', () => {
        it('should create custom events successfully', async () => {
            const mockResponse = { success: true };
            (httpService.post as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const events: CustomEvent[] = [
                {
                    name: 'purchase',
                    external_id: 'ext-123',
                    timestamp: '1234567890',
                },
            ];

            const result = await service.createCustomEvents(events);
            expect(result).toEqual(mockResponse);
            expect(httpService.post).toHaveBeenCalledWith(
                'https://api.onesignal.com/apps/test-app-id/integrations/custom_events',
                { events },
                expect.any(Object)
            );
        });

        it('should throw error if events array is empty', async () => {
            await expect(service.createCustomEvents([])).rejects.toThrow('At least one event is required');
        });

        it('should throw error if event name is missing', async () => {
            const events = [{ external_id: 'ext-123' }] as CustomEvent[];

            await expect(service.createCustomEvents(events)).rejects.toThrow('Event name is required');
        });

        it('should throw error if neither external_id nor onesignal_id is provided', async () => {
            const events: CustomEvent[] = [{ name: 'test' }];

            await expect(service.createCustomEvents(events)).rejects.toThrow('Either external_id or onesignal_id must be provided for each event');
        });
    });
});
