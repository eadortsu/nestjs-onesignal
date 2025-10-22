import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { OneSignalSegmentsService } from '../../src/services/onesignal-segments.service';
import { ONESIGNAL_MODULE_OPTIONS } from '../../src/constants';
import {
    CreateSegmentInput,
    UpdateSegmentInput,
} from '../../src/interfaces';

describe('OneSignalSegmentsService', () => {
    let service: OneSignalSegmentsService;
    let httpService: HttpService;

    const mockOptions = {
        appId: 'test-app-id',
        apiKey: 'test-api-key',
        timeout: 5000
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OneSignalSegmentsService,
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

        service = module.get<OneSignalSegmentsService>(OneSignalSegmentsService);
        httpService = module.get<HttpService>(HttpService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createSegment', () => {
        it('should create segment successfully', async () => {
            const mockResponse = { id: 'segment-123', name: 'Test Segment' };
            (httpService.post as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const input: CreateSegmentInput = {
                name: 'Test Segment',
                filters: [{ field: 'tag', key: 'plan', relation: '=', value: 'premium' }],
            };

            const result = await service.createSegment(input);
            expect(result).toEqual(mockResponse);
            expect(httpService.post).toHaveBeenCalledWith(
                'https://api.onesignal.com/apps/test-app-id/segments',
                input,
                expect.any(Object)
            );
        });
    });

    describe('viewSegments', () => {
        it('should view segments successfully', async () => {
            const mockResponse = { segments: [], total_count: 0 };
            (httpService.get as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const result = await service.viewSegments(10, 0);
            expect(result).toEqual(mockResponse);
            expect(httpService.get).toHaveBeenCalledWith(
                'https://api.onesignal.com/apps/test-app-id/segments',
                expect.objectContaining({
                    params: { limit: 10, offset: 0 },
                })
            );
        });

        it('should view segments with default parameters', async () => {
            const mockResponse = { segments: [], total_count: 0 };
            (httpService.get as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const result = await service.viewSegments();
            expect(result).toEqual(mockResponse);
            expect(httpService.get).toHaveBeenCalledWith(
                'https://api.onesignal.com/apps/test-app-id/segments',
                expect.objectContaining({
                    params: { limit: 50, offset: 0 },
                })
            );
        });
    });

    describe('viewSegment', () => {
        it('should view segment successfully', async () => {
            const mockResponse = { id: 'segment-123', name: 'Test Segment' };
            (httpService.get as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const result = await service.viewSegment('segment-123');
            expect(result).toEqual(mockResponse);
            expect(httpService.get).toHaveBeenCalledWith(
                'https://api.onesignal.com/apps/test-app-id/segments/segment-123',
                expect.any(Object)
            );
        });
    });

    describe('updateSegment', () => {
        it('should update segment successfully', async () => {
            const mockResponse = { success: true };
            (httpService.patch as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const input: UpdateSegmentInput = {
                name: 'Updated Segment',
                filters: [{ field: 'tag', key: 'plan', relation: '=', value: 'enterprise' }],
            };

            const result = await service.updateSegment('segment-123', input);
            expect(result).toEqual(mockResponse);
            expect(httpService.patch).toHaveBeenCalledWith(
                'https://api.onesignal.com/apps/test-app-id/segments/segment-123',
                input,
                expect.any(Object)
            );
        });
    });

    describe('deleteSegment', () => {
        it('should delete segment successfully', async () => {
            (httpService.delete as jest.Mock).mockReturnValue(of({ data: undefined }));

            const result = await service.deleteSegment('segment-123');
            expect(result).toBeUndefined();
            expect(httpService.delete).toHaveBeenCalledWith(
                'https://api.onesignal.com/apps/test-app-id/segments/segment-123',
                expect.any(Object)
            );
        });
    });
});
