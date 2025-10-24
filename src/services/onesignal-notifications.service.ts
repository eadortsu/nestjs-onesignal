import { Injectable } from '@nestjs/common';
import { BaseOneSignalService } from './base-onesignal.service';
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
} from '../interfaces';

@Injectable()
export class OneSignalNotificationsService extends BaseOneSignalService {
    async sendPushNotification(
        notification: CreatePushNotificationInput
    ): Promise<CreateNotificationResponse> {
        if (!notification.contents) {
            throw new Error('Contents are required for push notifications');
        }

        const payload: any = {
            ...notification,
            app_id: this.options.appId
        };

        // Handle simplified targeting
        if (notification.onesignal_id || notification.external_id) {
            payload.include_aliases = {};
            if (notification.onesignal_id) {
                payload.include_aliases.onesignal_id = Array.isArray(notification.onesignal_id)
                    ? notification.onesignal_id
                    : [notification.onesignal_id];
            }
            if (notification.external_id) {
                payload.include_aliases.external_id = Array.isArray(notification.external_id)
                    ? notification.external_id
                    : [notification.external_id];
            }
            payload.target_channel = 'push';
        }

        // Remove the simplified fields from payload
        delete payload.onesignal_id;
        delete payload.external_id;

        return this.request('post', '/notifications?c=push', payload);
    }

    async sendEmailNotification(email: CreateEmailInput): Promise<CreateNotificationResponse> {
        if (!email.email_subject) {
            throw new Error('Email subject is required');
        }
        if (!email.template_id && !email.email_body) {
            throw new Error('Email body is required if template_id is not provided');
        }

        const payload: any = {
            ...email,
            app_id: this.options.appId
        };

        // Handle simplified targeting
        if ((email as any).onesignal_id || (email as any).external_id) {
            payload.include_aliases = {};
            if ((email as any).onesignal_id) {
                payload.include_aliases.onesignal_id = Array.isArray((email as any).onesignal_id)
                    ? (email as any).onesignal_id
                    : [(email as any).onesignal_id];
            }
            if ((email as any).external_id) {
                payload.include_aliases.external_id = Array.isArray((email as any).external_id)
                    ? (email as any).external_id
                    : [(email as any).external_id];
            }
            payload.target_channel = 'email';
        }

        // Remove the simplified fields from payload
        delete payload.onesignal_id;
        delete payload.external_id;

        return this.request('post', '/notifications?c=email', payload);
    }

    async sendSMSNotification(sms: CreateSMSInput): Promise<CreateNotificationResponse> {
        if (!sms.template_id && (!sms.contents || !sms.contents.en)) {
            throw new Error('Contents with en language are required if template_id is not provided');
        }
        if (!sms.sms_from) {
            throw new Error('SMS from number is required');
        }

        const payload: any = {
            ...sms,
            app_id: this.options.appId
        };

        // Handle simplified targeting
        if ((sms as any).onesignal_id || (sms as any).external_id) {
            payload.include_aliases = {};
            if ((sms as any).onesignal_id) {
                payload.include_aliases.onesignal_id = Array.isArray((sms as any).onesignal_id)
                    ? (sms as any).onesignal_id
                    : [(sms as any).onesignal_id];
            }
            if ((sms as any).external_id) {
                payload.include_aliases.external_id = Array.isArray((sms as any).external_id)
                    ? (sms as any).external_id
                    : [(sms as any).external_id];
            }
            payload.target_channel = 'sms';
        }

        // Remove the simplified fields from payload
        delete payload.onesignal_id;
        delete payload.external_id;

        return this.request('post', '/notifications?c=sms', payload);
    }

    async viewNotifications(
        options?: ViewNotificationsOptions
    ): Promise<ViewNotificationsResponse> {
        const params: Record<string, any> = {
            app_id: this.options.appId,
            ...options,
        };

        if (options?.time_offset) {
            delete params.offset;
        }

        const query = Object.entries(params)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
            .join('&');

        const url = `/notifications?c=messages&${query}`;

        return this.request<ViewNotificationsResponse>('get', url);
    }

    async viewNotification(
        messageId: string,
        options: ViewNotificationOptions = {}
    ): Promise<NotificationResponse> {
        const params: Record<string, string> = {
            app_id: this.options.appId,
            ...options.outcome_names && { outcome_names: options.outcome_names.join(',') },
            ...options.outcome_time_range && { outcome_time_range: options.outcome_time_range },
            ...options.outcome_platforms && { outcome_platforms: options.outcome_platforms },
            ...options.outcome_attribution && { outcome_attribution: options.outcome_attribution },
        };

        const query = Object.entries(params)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
            .join('&');

        const url = `/notifications/${encodeURIComponent(messageId)}?${query}`;

        return this.request<NotificationResponse>('get', url);
    }

    async cancelNotification(
        notificationId: string
    ): Promise<CancelNotificationResponse> {
        const params = new URLSearchParams({ app_id: this.options.appId });
        return this.request<CancelNotificationResponse>('delete', `/notifications/${encodeURIComponent(notificationId)}?${params.toString()}`);
    }

    // =====================
    // LIVE ACTIVITIES (iOS)
    // =====================

    async startLiveActivity(
        activityType: string,
        input: StartLiveActivityInput
    ): Promise<StartLiveActivityResponse> {
        const url = `/apps/${encodeURIComponent(this.options.appId)}/activities/activity/${encodeURIComponent(activityType)}`;
        return this.request<StartLiveActivityResponse>('post', url, input);
    }

    async updateLiveActivity(
        activityId: string,
        input: UpdateLiveActivityInput
    ): Promise<UpdateLiveActivityResponse> {
        const url = `/apps/${encodeURIComponent(this.options.appId)}/live_activities/${encodeURIComponent(activityId)}/notifications`;
        return this.request<UpdateLiveActivityResponse>('post', url, input);
    }
}
