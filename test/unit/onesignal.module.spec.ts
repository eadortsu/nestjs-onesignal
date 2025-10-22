import { Test } from '@nestjs/testing';
import { OneSignalModule } from '../../src/onesignal.module';
import { OneSignalService } from '../../src/onesignal.service';
import { HttpModule } from '@nestjs/axios';
import { OneSignalNotificationsService } from '../../src/services/onesignal-notifications.service';

describe('OneSignalModule', () => {
    it('should compile the module with options', async () => {
        const module = await Test.createTestingModule({
            imports: [
                OneSignalModule.forRoot({
                    appId: 'test-app-id',
                    apiKey: 'test-api-key',
                    timeout: 5000,
                }),
            ],
        }).compile();

        const service = module.get<OneSignalService>(OneSignalService);
        expect(service).toBeDefined();
    });

    describe('Validation', () => {
        it('should throw error when no options provided', () => {
            expect(() => OneSignalModule.forRoot(undefined as any))
                .toThrow('OneSignal options are required');
        });

        it('should throw error when missing appId', () => {
            expect(() => OneSignalModule.forRoot({ apiKey: 'key' } as any))
                .toThrow('OneSignal appId is required');
        });

        it('should throw error when missing apiKey', () => {
            expect(() => OneSignalModule.forRoot({ appId: 'app-id' } as any))
                .toThrow('OneSignal apiKey is required');
        });

        it('should throw error when both appId and apiKey missing', () => {
            expect(() => OneSignalModule.forRoot({} as any))
                .toThrow('OneSignal appId is required');
        });
    });

    it('should register HttpModule', async () => {
        const module = await Test.createTestingModule({
            imports: [
                OneSignalModule.forRoot({
                    appId: 'test-app-id',
                    apiKey: 'test-api-key',
                }),
            ],
        }).compile();

        const httpModule = module.get(HttpModule);
        expect(httpModule).toBeDefined();
    });

    it('should export OneSignalService', async () => {
        const module = await Test.createTestingModule({
            imports: [
                OneSignalModule.forRoot({
                    appId: 'test-app-id',
                    apiKey: 'test-api-key',
                }),
            ],
        }).compile();

        const service = module.get<OneSignalService>(OneSignalService);
        expect(service).toBeInstanceOf(OneSignalService);
    });

    it('should set default timeout when not provided', async () => {
        const module = await Test.createTestingModule({
            imports: [
                OneSignalModule.forRoot({
                    appId: 'test-app-id',
                    apiKey: 'test-api-key',
                }),
            ],
        }).compile();

        const notificationsService = module.get<OneSignalNotificationsService>(OneSignalNotificationsService);
        const timeout = (notificationsService as any).options.timeout;
        expect(timeout).toBe(10000); // Default value
    });

    it('should use custom timeout when provided', async () => {
        const customTimeout = 15000;
        const module = await Test.createTestingModule({
            imports: [
                OneSignalModule.forRoot({
                    appId: 'test-app-id',
                    apiKey: 'test-api-key',
                    timeout: customTimeout,
                }),
            ],
        }).compile();

        const notificationsService = module.get<OneSignalNotificationsService>(OneSignalNotificationsService);
        const timeout = (notificationsService as any).options.timeout;
        expect(timeout).toBe(customTimeout);
    });
});