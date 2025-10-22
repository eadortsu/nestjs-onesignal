import { Injectable } from '@nestjs/common';
import { OneSignalNotificationsService } from './services/onesignal-notifications.service';
import { OneSignalUsersService } from './services/onesignal-users.service';
import { OneSignalSegmentsService } from './services/onesignal-segments.service';
import { OneSignalSubscriptionsService } from './services/onesignal-subscriptions.service';
import { OneSignalAnalyticsService } from './services/onesignal-analytics.service';
import { OneSignalAppsService } from './services/onesignal-apps.service';
import {
    CreatePushNotificationInput,
    NotificationResponse,
    CancelNotificationResponse,
    CreateEmailInput,
    CreateSMSInput,
    ViewNotificationsOptions,
    ViewNotificationOptions,
    CreateNotificationResponse,
    ViewNotificationsResponse,
    StartLiveActivityInput,
    StartLiveActivityResponse,
    UpdateLiveActivityInput,
    UpdateLiveActivityResponse,
    CustomEvent,
    CreateUserInput,
    CreateUserResponse,
    ViewUserResponse,
    UpdateUserInput,
    UpdateUserResponse,
    DeleteUserResponse,
    ViewUserIdentityResponse,
    CreateSegmentInput,
    CreateSegmentResponse,
    ViewSegmentResponse,
    UpdateSegmentInput,
    UpdateSegmentResponse,
    ViewSegmentsResponse,
    CreateSubscriptionInput,
    CreateSubscriptionResponse,
    ViewSubscriptionResponse,
    UpdateSubscriptionInput,
    UpdateSubscriptionResponse,
    ViewOutcomesOptions,
    ViewOutcomesResponse,
    AppResponse
} from './interfaces';

@Injectable()
export class OneSignalService {
    constructor(
        private readonly notificationsService: OneSignalNotificationsService,
        private readonly usersService: OneSignalUsersService,
        private readonly segmentsService: OneSignalSegmentsService,
        private readonly subscriptionsService: OneSignalSubscriptionsService,
        private readonly analyticsService: OneSignalAnalyticsService,
        private readonly appsService: OneSignalAppsService,
    ) {}

    // =====================
    // MESSAGES (NOTIFICATIONS)
    // =====================

    async sendPushNotification(
        notification: CreatePushNotificationInput
    ): Promise<CreateNotificationResponse> {
        return this.notificationsService.sendPushNotification(notification);
    }

    async sendEmailNotification(email: CreateEmailInput): Promise<CreateNotificationResponse> {
        return this.notificationsService.sendEmailNotification(email);
    }

    async sendSMSNotification(sms: CreateSMSInput): Promise<CreateNotificationResponse> {
        return this.notificationsService.sendSMSNotification(sms);
    }

    async viewNotifications(
        options?: ViewNotificationsOptions
    ): Promise<ViewNotificationsResponse> {
        return this.notificationsService.viewNotifications(options);
    }

    async viewNotification(
        messageId: string,
        options: ViewNotificationOptions = {}
    ): Promise<NotificationResponse> {
        return this.notificationsService.viewNotification(messageId, options);
    }

    async cancelNotification(
        notificationId: string
    ): Promise<CancelNotificationResponse> {
        return this.notificationsService.cancelNotification(notificationId);
    }

    // =====================
    // LIVE ACTIVITIES (iOS)
    // =====================

    async startLiveActivity(
        activityType: string,
        input: StartLiveActivityInput
    ): Promise<StartLiveActivityResponse> {
        return this.notificationsService.startLiveActivity(activityType, input);
    }

    async updateLiveActivity(
        activityId: string,
        input: UpdateLiveActivityInput
    ): Promise<UpdateLiveActivityResponse> {
        return this.notificationsService.updateLiveActivity(activityId, input);
    }

    // =====================
    // EVENTS
    // =====================

    async createCustomEvents(events: CustomEvent[]): Promise<Record<string, any>> {
        return this.usersService.createCustomEvents(events);
    }

    // =====================
    // USERS
    // =====================

    async createUser(input: CreateUserInput): Promise<CreateUserResponse> {
        return this.usersService.createUser(input);
    }

    async viewUser(
        aliasLabel: string,
        aliasId: string
    ): Promise<ViewUserResponse> {
        return this.usersService.viewUser(aliasLabel, aliasId);
    }

    async updateUser(
        aliasLabel: string,
        aliasId: string,
        input: UpdateUserInput
    ): Promise<UpdateUserResponse> {
        return this.usersService.updateUser(aliasLabel, aliasId, input);
    }

    async deleteUser(
        aliasLabel: string,
        aliasId: string
    ): Promise<DeleteUserResponse> {
        return this.usersService.deleteUser(aliasLabel, aliasId);
    }

    async viewUserIdentity(
        aliasLabel: string,
        aliasId: string
    ): Promise<ViewUserIdentityResponse> {
        return this.usersService.viewUserIdentity(aliasLabel, aliasId);
    }

    async viewUserIdentityBySubscription(
        subscriptionId: string
    ): Promise<ViewUserIdentityResponse> {
        return this.usersService.viewUserIdentityBySubscription(subscriptionId);
    }

    // =====================
    // SUBSCRIPTIONS
    // =====================

    async createSubscription(input: CreateSubscriptionInput): Promise<CreateSubscriptionResponse> {
        return this.subscriptionsService.createSubscription(input);
    }

    async viewSubscription(subscriptionId: string): Promise<ViewSubscriptionResponse> {
        return this.subscriptionsService.viewSubscription(subscriptionId);
    }

    async updateSubscription(subscriptionId: string, input: UpdateSubscriptionInput): Promise<UpdateSubscriptionResponse> {
        return this.subscriptionsService.updateSubscription(subscriptionId, input);
    }

    async deleteSubscription(subscriptionId: string): Promise<void> {
        return this.subscriptionsService.deleteSubscription(subscriptionId);
    }

    // =====================
    // SEGMENTS
    // =====================

    async createSegment(input: CreateSegmentInput): Promise<CreateSegmentResponse> {
        return this.segmentsService.createSegment(input);
    }

    async viewSegments(limit = 50, offset = 0): Promise<ViewSegmentsResponse> {
        return this.segmentsService.viewSegments(limit, offset);
    }

    async viewSegment(segmentId: string): Promise<ViewSegmentResponse> {
        return this.segmentsService.viewSegment(segmentId);
    }

    async updateSegment(segmentId: string, input: UpdateSegmentInput): Promise<UpdateSegmentResponse> {
        return this.segmentsService.updateSegment(segmentId, input);
    }

    async deleteSegment(segmentId: string): Promise<void> {
        return this.segmentsService.deleteSegment(segmentId);
    }

    // =====================
    // ANALYTICS
    // =====================

    async viewOutcomes(options: ViewOutcomesOptions): Promise<ViewOutcomesResponse> {
        return this.analyticsService.viewOutcomes(options);
    }

    // =====================
    // APPS
    // =====================

    async viewApp(): Promise<AppResponse> {
        return this.appsService.viewApp();
    }
}
