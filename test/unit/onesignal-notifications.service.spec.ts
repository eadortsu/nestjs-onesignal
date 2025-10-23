import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';
import { OneSignalNotificationsService } from '../../src/services/onesignal-notifications.service';
import { ONESIGNAL_MODULE_OPTIONS } from '../../src/constants';
import {
    CreatePushNotificationInput,
    CreateEmailInput,
    CreateSMSInput,
    ViewNotificationsOptions,
    ViewNotificationOptions,
    StartLiveActivityInput,
    UpdateLiveActivityInput,
} from '../../src/interfaces';

describe('OneSignalNotificationsService', () => {
    let service: OneSignalNotificationsService;
    let httpService: HttpService;

    const mockOptions = {
        appId: 'test-app-id',
        apiKey: 'test-api-key',
        timeout: 5000
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OneSignalNotificationsService,
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

        service = module.get<OneSignalNotificationsService>(OneSignalNotificationsService);
        httpService = module.get<HttpService>(HttpService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('sendPushNotification', () => {
        it('should send push notification successfully', async () => {
            const mockResponse = { id: '123', recipients: 100 };
            (httpService.post as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const input: CreatePushNotificationInput = {
                contents: { en: 'Test message' },
                included_segments: ['All'],
            };

            const result = await service.sendPushNotification(input);
            expect(result).toEqual(mockResponse);
            expect(httpService.post).toHaveBeenCalledWith(
                'https://api.onesignal.com/notifications?c=push',
                { ...input, app_id: mockOptions.appId },
                expect.any(Object)
            );
        });

        it('should throw error if contents are missing', async () => {
            const input = { included_segments: ['All'] } as CreatePushNotificationInput;

            await expect(service.sendPushNotification(input)).rejects.toThrow('Contents are required for push notifications');
        });

        it('should send push notification with simplified onesignal_id and external_id', async () => {
            const mockResponse = { id: '123', recipients: 100 };
            (httpService.post as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const input: CreatePushNotificationInput = {
                contents: { en: 'Test message' },
                onesignal_id: 'user-123',
                external_id: ['ext-456', 'ext-789'],
            };

            const result = await service.sendPushNotification(input);
            expect(result).toEqual(mockResponse);
            expect(httpService.post).toHaveBeenCalledWith(
                'https://api.onesignal.com/notifications?c=push',
                {
                    contents: { en: 'Test message' },
                    app_id: mockOptions.appId,
                    include_aliases: {
                        onesignal_id: ['user-123'],
                        external_id: ['ext-456', 'ext-789'],
                    },
                    target_channel: 'push',
                },
                expect.any(Object)
            );
        });
    });

    describe('sendEmailNotification', () => {
        it('should send email notification successfully', async () => {
            const mockResponse = { id: '123', recipients: 100 };
            (httpService.post as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const input: CreateEmailInput = {
                email_subject: 'Test Subject',
                email_body: 'Test Body',
                email_to: ['test@example.com'],
            };

            const result = await service.sendEmailNotification(input);
            expect(result).toEqual(mockResponse);
            expect(httpService.post).toHaveBeenCalledWith(
                'https://api.onesignal.com/notifications?c=email',
                { ...input, app_id: mockOptions.appId },
                expect.any(Object)
            );
        });

        it('should throw error if email subject is missing', async () => {
            const input = { email_body: 'Test Body' } as CreateEmailInput;

            await expect(service.sendEmailNotification(input)).rejects.toThrow('Email subject is required');
        });

        it('should throw error if email body is missing', async () => {
            const input = { email_subject: 'Test Subject' } as CreateEmailInput;

            await expect(service.sendEmailNotification(input)).rejects.toThrow('Email body is required');
        });
    });

    describe('sendSMSNotification', () => {
        it('should send SMS notification successfully', async () => {
            const mockResponse = { id: '123', recipients: 100 };
            (httpService.post as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const input: CreateSMSInput = {
                contents: { en: 'Test SMS' },
                sms_from: '+1234567890',
                include_phone_numbers: ['+0987654321'],
            };

            const result = await service.sendSMSNotification(input);
            expect(result).toEqual(mockResponse);
            expect(httpService.post).toHaveBeenCalledWith(
                'https://api.onesignal.com/notifications?c=sms',
                { ...input, app_id: mockOptions.appId },
                expect.any(Object)
            );
        });

        it('should throw error if contents are missing', async () => {
            const input = { sms_from: '+1234567890' } as CreateSMSInput;

            await expect(service.sendSMSNotification(input)).rejects.toThrow('Contents are required for SMS notifications');
        });

        it('should throw error if sms_from is missing', async () => {
            const input = { contents: { en: 'Test' } } as CreateSMSInput;

            await expect(service.sendSMSNotification(input)).rejects.toThrow('SMS from number is required');
        });
    });

    describe('viewNotifications', () => {
        it('should view notifications successfully', async () => {
            const mockResponse = { notifications: [], total_count: 0 };
            (httpService.get as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const options: ViewNotificationsOptions = { limit: 10, offset: 0 };
            const result = await service.viewNotifications(options);
            expect(result).toEqual(mockResponse);
            expect(httpService.get).toHaveBeenCalledWith(
                'https://api.onesignal.com/notifications?c=messages&app_id=test-app-id&limit=10&offset=0',
                expect.any(Object)
            );
        });

        it('should view notifications without options', async () => {
            const mockResponse = { notifications: [], total_count: 0 };
            (httpService.get as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const result = await service.viewNotifications();
            expect(result).toEqual(mockResponse);
            expect(httpService.get).toHaveBeenCalledWith(
                'https://api.onesignal.com/notifications?c=messages&app_id=test-app-id',
                expect.any(Object)
            );
        });
    });

    describe('viewNotification', () => {
        it('should view notification successfully', async () => {
            const mockResponse = { id: '123', contents: { en: 'Test' } };
            (httpService.get as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const options: ViewNotificationOptions = { outcome_names: ['sent'] };
            const result = await service.viewNotification('123', options);
            expect(result).toEqual(mockResponse);
            expect(httpService.get).toHaveBeenCalledWith(
                'https://api.onesignal.com/notifications/123?app_id=test-app-id&outcome_names=sent',
                expect.any(Object)
            );
        });
    });

    describe('cancelNotification', () => {
        it('should cancel notification successfully', async () => {
            const mockResponse = { success: true };
            (httpService.delete as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const result = await service.cancelNotification('123');
            expect(result).toEqual(mockResponse);
            expect(httpService.delete).toHaveBeenCalledWith(
                'https://api.onesignal.com/notifications/123?app_id=test-app-id',
                expect.any(Object)
            );
        });
    });

    describe('startLiveActivity', () => {
        it('should start live activity successfully', async () => {
            const mockResponse = { activity_id: 'activity-123' };
            (httpService.post as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const input: StartLiveActivityInput = {
                event: 'start',
                activity_id: 'activity-123',
                event_attributes: {},
                event_updates: {},
                name: 'Test Activity',
                contents: { en: 'Test' },
                headings: { en: 'Test' },
            };
            const result = await service.startLiveActivity('activity-type', input);
            expect(result).toEqual(mockResponse);
            expect(httpService.post).toHaveBeenCalledWith(
                'https://api.onesignal.com/apps/test-app-id/activities/activity/activity-type',
                input,
                expect.any(Object)
            );
        });
    });

    describe('updateLiveActivity', () => {
        it('should update live activity successfully', async () => {
            const mockResponse = { success: true };
            (httpService.post as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const input: UpdateLiveActivityInput = { event: 'update', name: 'Test Activity', event_updates: {} };
            const result = await service.updateLiveActivity('activity-123', input);
            expect(result).toEqual(mockResponse);
            expect(httpService.post).toHaveBeenCalledWith(
                'https://api.onesignal.com/apps/test-app-id/live_activities/activity-123/notifications',
                input,
                expect.any(Object)
            );
        });
    });
});
