import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { OneSignalAppsService } from '../../src/services/onesignal-apps.service';
import { ONESIGNAL_MODULE_OPTIONS } from '../../src/constants';

describe('OneSignalAppsService', () => {
    let service: OneSignalAppsService;
    let httpService: HttpService;

    const mockOptions = {
        appId: 'test-app-id',
        apiKey: 'test-api-key',
        timeout: 5000
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OneSignalAppsService,
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

        service = module.get<OneSignalAppsService>(OneSignalAppsService);
        httpService = module.get<HttpService>(HttpService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('viewApp', () => {
        it('should view app successfully', async () => {
            const mockResponse = { id: 'test-app-id', name: 'Test App' };
            (httpService.get as jest.Mock).mockReturnValue(of({ data: mockResponse }));

            const result = await service.viewApp();
            expect(result).toEqual(mockResponse);
            expect(httpService.get).toHaveBeenCalledWith(
                'https://api.onesignal.com/apps/test-app-id',
                expect.any(Object)
            );
        });
    });
});
