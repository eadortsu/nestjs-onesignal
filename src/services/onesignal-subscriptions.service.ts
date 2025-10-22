import { Injectable } from '@nestjs/common';
import { BaseOneSignalService } from './base-onesignal.service';
import {
    CreateSubscriptionInput,
    CreateSubscriptionResponse,
    ViewSubscriptionResponse,
    UpdateSubscriptionInput,
    UpdateSubscriptionResponse,
} from '../interfaces';

@Injectable()
export class OneSignalSubscriptionsService extends BaseOneSignalService {
    // =====================
    // SUBSCRIPTIONS
    // =====================

    async createSubscription(input: CreateSubscriptionInput): Promise<CreateSubscriptionResponse> {
        const payload = { ...input, app_id: this.options.appId };
        const url = `/players`;
        return this.request<CreateSubscriptionResponse>('post', url, payload);
    }

    async viewSubscription(subscriptionId: string): Promise<ViewSubscriptionResponse> {
        const url = `/players/${encodeURIComponent(subscriptionId)}`;
        return this.request<ViewSubscriptionResponse>('get', url);
    }

    async updateSubscription(subscriptionId: string, input: UpdateSubscriptionInput): Promise<UpdateSubscriptionResponse> {
        const payload = { ...input, app_id: this.options.appId };
        const url = `/players/${encodeURIComponent(subscriptionId)}`;
        return this.request<UpdateSubscriptionResponse>('put', url, payload);
    }

    async deleteSubscription(subscriptionId: string): Promise<void> {
        const url = `/players/${encodeURIComponent(subscriptionId)}`;
        return this.request<void>('delete', url);
    }
}
