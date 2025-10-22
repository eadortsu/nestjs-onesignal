import { DynamicModule, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OneSignalService } from './onesignal.service';
import { BaseOneSignalService } from './services/base-onesignal.service';
import { OneSignalNotificationsService } from './services/onesignal-notifications.service';
import { OneSignalUsersService } from './services/onesignal-users.service';
import { OneSignalSegmentsService } from './services/onesignal-segments.service';
import { OneSignalSubscriptionsService } from './services/onesignal-subscriptions.service';
import { OneSignalAnalyticsService } from './services/onesignal-analytics.service';
import { OneSignalAppsService } from './services/onesignal-apps.service';
import { ONESIGNAL_MODULE_OPTIONS } from './constants';
import { OneSignalModuleOptions } from './interfaces';

@Module({})
export class OneSignalModule {
    static forRoot(options: OneSignalModuleOptions): DynamicModule {
        if (!options) {
            throw new Error('OneSignal options are required');
        }

        if (!options.appId) {
            throw new Error('OneSignal appId is required');
        }

        if (!options.apiKey) {
            throw new Error('OneSignal apiKey is required');
        }
        return {
            module: OneSignalModule,
            imports: [HttpModule.register({})],
            providers: [
                {
                    provide: ONESIGNAL_MODULE_OPTIONS,
                    useValue: options,
                },
                BaseOneSignalService,
                OneSignalNotificationsService,
                OneSignalUsersService,
                OneSignalSegmentsService,
                OneSignalSubscriptionsService,
                OneSignalAnalyticsService,
                OneSignalAppsService,
                OneSignalService,
            ],
            exports: [OneSignalService],
        };
    }
}