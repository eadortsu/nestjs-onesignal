import { Injectable } from '@nestjs/common';
import { BaseOneSignalService } from './base-onesignal.service';
import {
    ViewOutcomesOptions,
    ViewOutcomesResponse,
} from '../interfaces';

@Injectable()
export class OneSignalAnalyticsService extends BaseOneSignalService {
    // =====================
    // ANALYTICS
    // =====================

    async viewOutcomes(options: ViewOutcomesOptions): Promise<ViewOutcomesResponse> {
        const params = {
            app_id: this.options.appId,
            ...options
        };
        const url = `/outcomes`;
        return this.request<ViewOutcomesResponse>('get', url, undefined, params);
    }
}
