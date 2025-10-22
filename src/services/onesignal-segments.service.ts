import { Injectable } from '@nestjs/common';
import { BaseOneSignalService } from './base-onesignal.service';
import {
    CreateSegmentInput,
    CreateSegmentResponse,
    ViewSegmentResponse,
    UpdateSegmentInput,
    UpdateSegmentResponse,
    ViewSegmentsResponse,
} from '../interfaces';

@Injectable()
export class OneSignalSegmentsService extends BaseOneSignalService {
    async createSegment(input: CreateSegmentInput): Promise<CreateSegmentResponse> {
        const url = `/apps/${encodeURIComponent(this.options.appId)}/segments`;
        return this.request<CreateSegmentResponse>('post', url, input);
    }

    async viewSegments(limit = 50, offset = 0): Promise<ViewSegmentsResponse> {
        const params = { limit, offset };
        const url = `/apps/${encodeURIComponent(this.options.appId)}/segments`;
        return this.request<ViewSegmentsResponse>('get', url, undefined, params);
    }

    async viewSegment(segmentId: string): Promise<ViewSegmentResponse> {
        const url = `/apps/${encodeURIComponent(this.options.appId)}/segments/${encodeURIComponent(segmentId)}`;
        return this.request<ViewSegmentResponse>('get', url);
    }

    async updateSegment(segmentId: string, input: UpdateSegmentInput): Promise<UpdateSegmentResponse> {
        const url = `/apps/${encodeURIComponent(this.options.appId)}/segments/${encodeURIComponent(segmentId)}`;
        return this.request<UpdateSegmentResponse>('patch', url, input);
    }

    async deleteSegment(segmentId: string): Promise<void> {
        const url = `/apps/${encodeURIComponent(this.options.appId)}/segments/${encodeURIComponent(segmentId)}`;
        return this.request<void>('delete', url);
    }
}
