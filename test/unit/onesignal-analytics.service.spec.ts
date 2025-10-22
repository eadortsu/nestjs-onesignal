import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { OneSignalAnalyticsService } from '../../src/services/onesignal-analytics.service';
import { ONESIGNAL_MODULE_OPTIONS } from '../../src/constants';
import { ViewOutcomesOptions } from '../../src/interfaces';

describe('OneSignalAnalyticsService', () => {
    let service: OneSignalAnalyticsService;
    let httpService: HttpService;

    const mockOptions = {
        appId: 'test-app-id',
        apiKey: 'test-api-key',
        timeout: 5000
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OneSignalAnalyticsService,
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

        service = module.get<OneSignalAnalyticsService>(OneSignalAnalyticsService);
        httpService = module.get<HttpService>(HttpService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('viewOutcomes', () => {
        it('should view outcomes successfully', async () => {
            const mockResponse = { outcomes: [], total_count: 0 };
            (httpService.get as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const options: ViewOutcomesOptions = {
                outcome_names: ['sent', 'clicked'],
                outcome_time_range: '1d',
            };

            const result = await service.viewOutcomes(options);
            expect(result).toEqual(mockResponse);
            expect(httpService.get).toHaveBeenCalledWith(
                'https://api.onesignal.com/outcomes',
                expect.objectContaining({
                    params: {
                        app_id: mockOptions.appId,
                        ...options,
                    },
                })
            );
        });
    });
});
