import { Injectable } from '@nestjs/common';
import { BaseOneSignalService } from './base-onesignal.service';
import {
    AppResponse,
} from '../interfaces';

@Injectable()
export class OneSignalAppsService extends BaseOneSignalService {
    // =====================
    // APPS
    // =====================

    async viewApp(): Promise<AppResponse> {
        const url = `/apps/${encodeURIComponent(this.options.appId)}`;
        return this.request<AppResponse>('get', url);
    }
}
