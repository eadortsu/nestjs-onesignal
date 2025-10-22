import { Injectable } from '@nestjs/common';
import { BaseOneSignalService } from './base-onesignal.service';
import {
    CreateUserInput,
    CreateUserResponse,
    ViewUserResponse,
    UpdateUserInput,
    UpdateUserResponse,
    DeleteUserResponse,
    ViewUserIdentityResponse,
    CustomEvent,
} from '../interfaces';

@Injectable()
export class OneSignalUsersService extends BaseOneSignalService {
    // =====================
    // USERS
    // =====================

    async createUser(input: CreateUserInput): Promise<CreateUserResponse> {
        if (!input.identity?.external_id) {
            throw new Error('external_id is required for CreateUserInput.identity');
        }

        const url = `/apps/${encodeURIComponent(this.options.appId)}/users`;
        return this.request<CreateUserResponse>('post', url, input);
    }

    async viewUser(
        aliasLabel: string,
        aliasId: string
    ): Promise<ViewUserResponse> {
        const url = `/apps/${encodeURIComponent(this.options.appId)}/users/by/${encodeURIComponent(aliasLabel)}/${encodeURIComponent(aliasId)}`;
        return this.request<ViewUserResponse>('get', url);
    }

    async updateUser(
        aliasLabel: string,
        aliasId: string,
        input: UpdateUserInput
    ): Promise<UpdateUserResponse> {
        if (!input.properties && !input.deltas) {
            throw new Error('At least one of properties or deltas must be provided');
        }

        const url = `/apps/${encodeURIComponent(this.options.appId)}/users/by/${encodeURIComponent(aliasLabel)}/${encodeURIComponent(aliasId)}`;
        return this.request<UpdateUserResponse>('patch', url, input);
    }

    async deleteUser(
        aliasLabel: string,
        aliasId: string
    ): Promise<DeleteUserResponse> {
        const url = `/apps/${encodeURIComponent(this.options.appId)}/users/by/${encodeURIComponent(aliasLabel)}/${encodeURIComponent(aliasId)}`;
        return this.request<DeleteUserResponse>('delete', url);
    }

    async viewUserIdentity(
        aliasLabel: string,
        aliasId: string
    ): Promise<ViewUserIdentityResponse> {
        const url = `/apps/${encodeURIComponent(this.options.appId)}/users/by/${encodeURIComponent(aliasLabel)}/${encodeURIComponent(aliasId)}/identity`;
        return this.request<ViewUserIdentityResponse>('get', url);
    }

    async viewUserIdentityBySubscription(
        subscriptionId: string
    ): Promise<ViewUserIdentityResponse> {
        const url = `/apps/${encodeURIComponent(this.options.appId)}/subscriptions/${encodeURIComponent(subscriptionId)}/user/identity`;
        return this.request<ViewUserIdentityResponse>('get', url);
    }

    // =====================
    // EVENTS
    // =====================

    async createCustomEvents(events: CustomEvent[]): Promise<Record<string, any>> {
        if (!events || events.length === 0) {
            throw new Error('At least one event is required');
        }
        for (const ev of events) {
            if (!ev.name) throw new Error('Event name is required');
            if (!ev.external_id && !ev.onesignal_id) {
                throw new Error('Either external_id or onesignal_id must be provided for each event');
            }
        }

        const url = `/apps/${encodeURIComponent(this.options.appId)}/integrations/custom_events`;
        const body = { events };

        return this.request('post', url, body);
    }
}
