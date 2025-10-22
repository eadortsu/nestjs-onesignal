import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse, AxiosError, AxiosRequestHeaders } from 'axios';
import { OneSignalService } from '../../src/onesignal.service';
import { OneSignalNotificationsService } from '../../src/services/onesignal-notifications.service';
import { OneSignalUsersService } from '../../src/services/onesignal-users.service';
import { OneSignalSegmentsService } from '../../src/services/onesignal-segments.service';
import { OneSignalSubscriptionsService } from '../../src/services/onesignal-subscriptions.service';
import { OneSignalAnalyticsService } from '../../src/services/onesignal-analytics.service';
import { OneSignalAppsService } from '../../src/services/onesignal-apps.service';
import { ONESIGNAL_MODULE_OPTIONS } from '../../src/constants';
import {
    CreatePushNotificationInput,
    CreateUserInput,
    CreateSegmentInput,
    CreateSubscriptionInput,
    ViewOutcomesOptions,
} from '../../src/interfaces';

describe('OneSignalService', () => {
    let service: OneSignalService;
    let notificationsService: OneSignalNotificationsService;
    let usersService: OneSignalUsersService;
    let segmentsService: OneSignalSegmentsService;
    let subscriptionsService: OneSignalSubscriptionsService;
    let analyticsService: OneSignalAnalyticsService;
    let appsService: OneSignalAppsService;

    const mockOptions = {
        appId: 'test-app-id',
        apiKey: 'test-api-key',
        timeout: 5000
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OneSignalService,
                {
                    provide: ONESIGNAL_MODULE_OPTIONS,
                    useValue: mockOptions,
                },
                {
                    provide: OneSignalNotificationsService,
                    useValue: {
                        sendPushNotification: jest.fn(),
                        sendEmailNotification: jest.fn(),
                        sendSMSNotification: jest.fn(),
                        viewNotifications: jest.fn(),
                        viewNotification: jest.fn(),
                        cancelNotification: jest.fn(),
                        startLiveActivity: jest.fn(),
                        updateLiveActivity: jest.fn(),
                    },
                },
                {
                    provide: OneSignalUsersService,
                    useValue: {
                        createUser: jest.fn(),
                        viewUser: jest.fn(),
                        updateUser: jest.fn(),
                        deleteUser: jest.fn(),
                        viewUserIdentity: jest.fn(),
                        viewUserIdentityBySubscription: jest.fn(),
                        createCustomEvents: jest.fn(),
                    },
                },
                {
                    provide: OneSignalSegmentsService,
                    useValue: {
                        createSegment: jest.fn(),
                        viewSegments: jest.fn(),
                        viewSegment: jest.fn(),
                        updateSegment: jest.fn(),
                        deleteSegment: jest.fn(),
                    },
                },
                {
                    provide: OneSignalSubscriptionsService,
                    useValue: {
                        createSubscription: jest.fn(),
                        viewSubscription: jest.fn(),
                        updateSubscription: jest.fn(),
                        deleteSubscription: jest.fn(),
                    },
                },
                {
                    provide: OneSignalAnalyticsService,
                    useValue: {
                        viewOutcomes: jest.fn(),
                    },
                },
                {
                    provide: OneSignalAppsService,
                    useValue: {
                        viewApp: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<OneSignalService>(OneSignalService);
        notificationsService = module.get<OneSignalNotificationsService>(OneSignalNotificationsService);
        usersService = module.get<OneSignalUsersService>(OneSignalUsersService);
        segmentsService = module.get<OneSignalSegmentsService>(OneSignalSegmentsService);
        subscriptionsService = module.get<OneSignalSubscriptionsService>(OneSignalSubscriptionsService);
        analyticsService = module.get<OneSignalAnalyticsService>(OneSignalAnalyticsService);
        appsService = module.get<OneSignalAppsService>(OneSignalAppsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(service).toBeInstanceOf(OneSignalService);
    });

    describe('Notifications', () => {
        const pushNotificationPayload: CreatePushNotificationInput = {
            contents: { en: 'Test Push Notification' },
            included_segments: ['All'],
        };

        it('should send push notification', async () => {
            const mockResponse = { id: '123', recipients: 100 };
            (notificationsService.sendPushNotification as jest.Mock).mockResolvedValue(mockResponse);

            const result = await service.sendPushNotification(pushNotificationPayload);
            expect(result).toEqual(mockResponse);
            expect(notificationsService.sendPushNotification).toHaveBeenCalledWith(pushNotificationPayload);
        });

        it('should view notifications', async () => {
            const mockResponse = { notifications: [], total_count: 0 };
            (notificationsService.viewNotifications as jest.Mock).mockResolvedValue(mockResponse);

            const result = await service.viewNotifications();
            expect(result).toEqual(mockResponse);
            expect(notificationsService.viewNotifications).toHaveBeenCalledWith(undefined);
        });

        it('should cancel notification', async () => {
            const mockResponse = { success: true };
            (notificationsService.cancelNotification as jest.Mock).mockResolvedValue(mockResponse);

            const result = await service.cancelNotification('123');
            expect(result).toEqual(mockResponse);
            expect(notificationsService.cancelNotification).toHaveBeenCalledWith('123');
        });
    });

    describe('Users', () => {
        const userPayload: CreateUserInput = {
            identity: { external_id: 'user-123' },
            properties: { tags: { plan: 'premium' } },
        };

        it('should create user', async () => {
            const mockResponse = { identity: { onesignal_id: 'user-123' } };
            (usersService.createUser as jest.Mock).mockResolvedValue(mockResponse);

            const result = await service.createUser(userPayload);
            expect(result).toEqual(mockResponse);
            expect(usersService.createUser).toHaveBeenCalledWith(userPayload);
        });

        it('should view user', async () => {
            const mockResponse = { identity: { onesignal_id: 'user-123' } };
            (usersService.viewUser as jest.Mock).mockResolvedValue(mockResponse);

            const result = await service.viewUser('external_id', 'user-123');
            expect(result).toEqual(mockResponse);
            expect(usersService.viewUser).toHaveBeenCalledWith('external_id', 'user-123');
        });

        it('should update user', async () => {
            const updatePayload = { properties: { tags: { plan: 'enterprise' } } };
            const mockResponse = { properties: { tags: { plan: 'enterprise' } } };
            (usersService.updateUser as jest.Mock).mockResolvedValue(mockResponse);

            const result = await service.updateUser('external_id', 'user-123', updatePayload);
            expect(result).toEqual(mockResponse);
            expect(usersService.updateUser).toHaveBeenCalledWith('external_id', 'user-123', updatePayload);
        });

        it('should delete user', async () => {
            const mockResponse = { identity: { onesignal_id: 'user-123' } };
            (usersService.deleteUser as jest.Mock).mockResolvedValue(mockResponse);

            const result = await service.deleteUser('external_id', 'user-123');
            expect(result).toEqual(mockResponse);
            expect(usersService.deleteUser).toHaveBeenCalledWith('external_id', 'user-123');
        });
    });

    describe('Segments', () => {
        const segmentPayload: CreateSegmentInput = {
            name: 'Test Segment',
            filters: [{ field: 'tag', key: 'plan', relation: '=', value: 'premium' }],
        };

        it('should create segment', async () => {
            const mockResponse = { id: 'segment-123', name: 'Test Segment' };
            (segmentsService.createSegment as jest.Mock).mockResolvedValue(mockResponse);

            const result = await service.createSegment(segmentPayload);
            expect(result).toEqual(mockResponse);
            expect(segmentsService.createSegment).toHaveBeenCalledWith(segmentPayload);
        });

        it('should view segments', async () => {
            const mockResponse = { segments: [], total_count: 0 };
            (segmentsService.viewSegments as jest.Mock).mockResolvedValue(mockResponse);

            const result = await service.viewSegments();
            expect(result).toEqual(mockResponse);
            expect(segmentsService.viewSegments).toHaveBeenCalledWith(50, 0);
        });

        it('should delete segment', async () => {
            (segmentsService.deleteSegment as jest.Mock).mockResolvedValue(undefined);

            await service.deleteSegment('segment-123');
            expect(segmentsService.deleteSegment).toHaveBeenCalledWith('segment-123');
        });
    });

    describe('Subscriptions', () => {
        const subscriptionPayload: CreateSubscriptionInput = {
            device_type: 1,
            identifier: 'test-token',
        };

        it('should create subscription', async () => {
            const mockResponse = { success: true, id: 'sub-123' };
            (subscriptionsService.createSubscription as jest.Mock).mockResolvedValue(mockResponse);

            const result = await service.createSubscription(subscriptionPayload);
            expect(result).toEqual(mockResponse);
            expect(subscriptionsService.createSubscription).toHaveBeenCalledWith(subscriptionPayload);
        });

        it('should view subscription', async () => {
            const mockResponse = { id: 'sub-123', device_type: 1 };
            (subscriptionsService.viewSubscription as jest.Mock).mockResolvedValue(mockResponse);

            const result = await service.viewSubscription('sub-123');
            expect(result).toEqual(mockResponse);
            expect(subscriptionsService.viewSubscription).toHaveBeenCalledWith('sub-123');
        });

        it('should delete subscription', async () => {
            (subscriptionsService.deleteSubscription as jest.Mock).mockResolvedValue(undefined);

            await service.deleteSubscription('sub-123');
            expect(subscriptionsService.deleteSubscription).toHaveBeenCalledWith('sub-123');
        });
    });

    describe('Analytics', () => {
        const outcomesOptions: ViewOutcomesOptions = {
            outcome_names: ['click'],
        };

        it('should view outcomes', async () => {
            const mockResponse = { outcomes: [] };
            (analyticsService.viewOutcomes as jest.Mock).mockResolvedValue(mockResponse);

            const result = await service.viewOutcomes(outcomesOptions);
            expect(result).toEqual(mockResponse);
            expect(analyticsService.viewOutcomes).toHaveBeenCalledWith(outcomesOptions);
        });
    });

    describe('Apps', () => {
        it('should view app', async () => {
            const mockResponse = { id: 'test-app-id', name: 'Test App' };
            (appsService.viewApp as jest.Mock).mockResolvedValue(mockResponse);

            const result = await service.viewApp();
            expect(result).toEqual(mockResponse);
            expect(appsService.viewApp).toHaveBeenCalled();
        });
    });
});