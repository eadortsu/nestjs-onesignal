# NestJS OneSignal Module

[![npm version](https://badge.fury.io/js/onesignal-nestjs.svg)](https://badge.fury.io/js/onesignal-nestjs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Test Coverage](https://img.shields.io/badge/coverage-94.11%25-brightgreen)](https://github.com/eadortsu/nestjs-onesignal)

A comprehensive, type-safe OneSignal integration module for NestJS applications. This module provides complete coverage of the OneSignal REST API with full TypeScript support, error handling, and easy configuration.

## ✨ Features

- **Complete OneSignal API Coverage** - All OneSignal REST API endpoints supported
- **Type-Safe Interfaces** - Full TypeScript definitions for all requests and responses
- **Easy Configuration** - Simple module registration with environment variables
- **Comprehensive Error Handling** - Proper error handling with detailed error messages
- **Test Coverage** - 94%+ test coverage with comprehensive unit tests
- **Modern NestJS Support** - Built for NestJS v10+ with latest dependencies
- **RxJS Integration** - Uses NestJS HttpModule with RxJS observables

### Supported OneSignal Features

- 📱 **Push Notifications** - Send push, email, and SMS notifications
- 👥 **User Management** - Create, update, view, and delete users
- 🎯 **Segments** - Manage user segments for targeted messaging
- 📊 **Analytics** - View outcomes and analytics data
- 📱 **Subscriptions** - Manage device subscriptions
- 📱 **Live Activities** - iOS Live Activities support
- 📊 **Apps** - View app information
- 📈 **Custom Events** - Track custom user events

## 🚀 Installation

```bash
npm install onesignal-nestjs @nestjs/axios axios
```

## 📋 Requirements

- Node.js >= 18.0.0
- NestJS >= 10.0.0
- TypeScript >= 5.0.0

## ⚙️ Configuration

### Environment Variables

Add the following environment variables to your `.env` file:

```env
ONESIGNAL_APP_ID=your_app_id_here
ONESIGNAL_API_KEY=your_rest_api_key_here
```

### Module Registration

Import and configure the module in your `app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { OneSignalModule } from 'onesignal-nestjs';

@Module({
  imports: [
    OneSignalModule.forRoot({
      appId: process.env.ONESIGNAL_APP_ID,
      apiKey: process.env.ONESIGNAL_API_KEY,
      timeout: 15000, // Optional: request timeout in milliseconds (default: 10000)
    }),
  ],
})
export class AppModule {}
```

### Configuration Options

```typescript
interface OneSignalModuleOptions {
  appId: string;        // Your OneSignal App ID (required)
  apiKey: string;       // Your OneSignal REST API Key (required)
  timeout?: number;     // Request timeout in milliseconds (optional, default: 10000)
}
```

## 📖 Usage

### Injecting the Service

```typescript
import { Injectable } from '@nestjs/common';
import { OneSignalService } from 'onesignal-nestjs';

@Injectable()
export class NotificationService {
  constructor(private readonly oneSignal: OneSignalService) {}
}
```

### Push Notifications

```typescript
// Send a push notification to all users
const result = await this.oneSignal.sendPushNotification({
  contents: { en: 'Hello World!' },
  included_segments: ['All'],
  headings: { en: 'Important Update' },
});

// Send with filters
const result = await this.oneSignal.sendPushNotification({
  contents: { en: 'Special offer!' },
  filters: [
    { field: 'tag', key: 'premium', relation: '=', value: 'true' }
  ],
});

// Send to specific users (simplified targeting)
const result = await this.oneSignal.sendPushNotification({
  contents: { en: 'Personal message' },
  external_id: ['user123', 'user456'], // Direct external ID targeting
  onesignal_id: 'onesignal_user_id',   // Direct OneSignal ID targeting
});

// Send to multiple users with mixed targeting
const result = await this.oneSignal.sendPushNotification({
  contents: { en: 'Group message' },
  external_id: 'user123',              // Single user as string
  onesignal_id: ['id1', 'id2', 'id3'], // Multiple users as array
  headings: { en: 'Group Notification' },
});
```

### Email Notifications

```typescript
// Send email to specific addresses
const result = await this.oneSignal.sendEmailNotification({
  email_subject: 'Welcome!',
  email_body: 'Thank you for joining us.',
  email_to: ['user@example.com'],
  include_unsubscribed: false,
});

// Send email using a template (email_body optional)
const result = await this.oneSignal.sendEmailNotification({
  email_subject: 'Welcome!',
  template_id: 'template-uuid-here',
  email_to: ['user@example.com'],
});

// Send email to users by external_id or OneSignal ID (simplified targeting)
const result = await this.oneSignal.sendEmailNotification({
  email_subject: 'Personal Update',
  email_body: 'Your account has been updated.',
  external_id: ['user123', 'user456'], // Target by external ID
  onesignal_id: 'onesignal_user_id',   // Target by OneSignal ID
});

// Send email with advanced options
const result = await this.oneSignal.sendEmailNotification({
  email_subject: 'Newsletter',
  email_body: '<h1>Monthly Update</h1><p>Check out our latest news...</p>',
  email_preheader: 'Your monthly newsletter is here',
  email_from_name: 'My Company',
  email_from_address: 'newsletter@mycompany.com',
  included_segments: ['Subscribed Users'],
  disable_email_click_tracking: false,
});
```

### SMS Notifications

```typescript
// Send SMS to specific phone numbers
const result = await this.oneSignal.sendSMSNotification({
  contents: { en: 'Your verification code is 123456' },
  sms_from: '+1234567890',
  include_phone_numbers: ['+0987654321'],
});

// Send SMS using a template (contents optional)
const result = await this.oneSignal.sendSMSNotification({
  template_id: 'template-uuid-here',
  sms_from: '+1234567890',
  include_phone_numbers: ['+0987654321'],
});

// Send SMS to users by external_id or OneSignal ID (simplified targeting)
const result = await this.oneSignal.sendSMSNotification({
  contents: { en: 'Personal SMS message' },
  sms_from: '+1234567890',
  external_id: ['user123', 'user456'], // Target by external ID
  onesignal_id: 'onesignal_user_id',   // Target by OneSignal ID
});

// Send SMS with advanced options
const result = await this.oneSignal.sendSMSNotification({
  contents: { en: 'Hello! Check out our new feature.' },
  sms_from: '+1234567890',
  included_segments: ['Active Users'],
  sms_media_urls: ['https://example.com/image.jpg'], // For MMS
  name: 'Promotional SMS',
  custom_data: { campaign: 'spring_promo' },
});
```

### User Management

```typescript
// Create a user
const user = await this.oneSignal.createUser({
  identity: { external_id: 'user123' },
  properties: {
    tags: { plan: 'premium', country: 'US' },
    language: 'en',
  },
  subscriptions: [{
    type: 'iOSPush',
    token: 'device_token_here',
  }],
});

// View user
const userData = await this.oneSignal.viewUser('external_id', 'user123');

// Update user
await this.oneSignal.updateUser('external_id', 'user123', {
  properties: {
    tags: { plan: 'enterprise' },
  },
});

// Delete user
await this.oneSignal.deleteUser('external_id', 'user123');
```

### Segments

```typescript
// Create a segment
const segment = await this.oneSignal.createSegment({
  name: 'Premium Users',
  filters: [
    { field: 'tag', key: 'plan', relation: '=', value: 'premium' }
  ],
});

// View all segments
const segments = await this.oneSignal.viewSegments();

// View specific segment
const segmentData = await this.oneSignal.viewSegment('segment_id');

// Update segment
await this.oneSignal.updateSegment('segment_id', {
  name: 'VIP Users',
  filters: [
    { field: 'tag', key: 'plan', relation: '=', value: 'enterprise' }
  ],
});

// Delete segment
await this.oneSignal.deleteSegment('segment_id');
```

### Subscriptions

```typescript
// Create subscription
const subscription = await this.oneSignal.createSubscription({
  device_type: 0, // iOS
  identifier: 'device_token',
  test_type: 1,
});

// View subscription
const subscriptionData = await this.oneSignal.viewSubscription('subscription_id');

// Update subscription
await this.oneSignal.updateSubscription('subscription_id', {
  device_type: 0,
  identifier: 'new_device_token',
});

// Delete subscription
await this.oneSignal.deleteSubscription('subscription_id');
```

### Analytics

```typescript
// View outcomes
const outcomes = await this.oneSignal.viewOutcomes({
  outcome_names: ['sent', 'clicked'],
  outcome_time_range: '1d',
});
```

### Live Activities (iOS)

```typescript
// Start live activity
const activity = await this.oneSignal.startLiveActivity('activity_type', {
  event: 'start',
  activity_id: 'unique_activity_id',
  event_attributes: { /* activity data */ },
  event_updates: { /* initial state */ },
  name: 'Live Activity Name',
  contents: { en: 'Activity content' },
  headings: { en: 'Activity title' },
});

// Update live activity
await this.oneSignal.updateLiveActivity('activity_id', {
  event: 'update',
  name: 'Live Activity Name',
  event_updates: { /* updated state */ },
});
```

### Custom Events

```typescript
// Track custom events
await this.oneSignal.createCustomEvents([
  {
    name: 'purchase',
    external_id: 'user123',
    timestamp: new Date().toISOString(),
    payload: {
      product_id: 'prod_123',
      amount: 99.99,
      currency: 'USD',
    },
  },
]);
```

## 🏗️ Architecture

### Service Structure

```
src/
├── onesignal.module.ts          # Main module
├── onesignal.service.ts         # Main service facade
├── constants.ts                 # Module constants
├── interfaces/                  # TypeScript interfaces
│   └── index.ts
└── services/                    # Individual service classes
    ├── base-onesignal.service.ts
    ├── onesignal-notifications.service.ts
    ├── onesignal-users.service.ts
    ├── onesignal-segments.service.ts
    ├── onesignal-subscriptions.service.ts
    ├── onesignal-analytics.service.ts
    └── onesignal-apps.service.ts
```

### Design Patterns

- **Facade Pattern** - `OneSignalService` provides a unified interface
- **Base Service** - `BaseOneSignalService` handles common HTTP logic
- **Dependency Injection** - Full NestJS DI support
- **Error Handling** - Comprehensive error handling with custom error messages

## 🧪 Testing

The module includes comprehensive unit tests with 94%+ coverage.

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch

# Run tests with debugging
npm run test:debug
```

### Test Structure

```
test/
└── unit/
    ├── base-onesignal.service.spec.ts
    ├── onesignal.service.spec.ts
    ├── onesignal.module.spec.ts
    └── [service].spec.ts (for each service)
```

## 📚 API Reference

### OneSignalService

The main service class that provides access to all OneSignal functionality.

#### Notifications

```typescript
sendPushNotification(notification: CreatePushNotificationInput): Promise<CreateNotificationResponse>
sendEmailNotification(email: CreateEmailInput): Promise<CreateNotificationResponse>
sendSMSNotification(sms: CreateSMSInput): Promise<CreateNotificationResponse>
viewNotifications(options?: ViewNotificationsOptions): Promise<ViewNotificationsResponse>
viewNotification(messageId: string, options?: ViewNotificationOptions): Promise<NotificationResponse>
cancelNotification(notificationId: string): Promise<CancelNotificationResponse>
startLiveActivity(activityType: string, input: StartLiveActivityInput): Promise<StartLiveActivityResponse>
updateLiveActivity(activityId: string, input: UpdateLiveActivityInput): Promise<UpdateLiveActivityResponse>
```

#### Users

```typescript
createUser(input: CreateUserInput): Promise<CreateUserResponse>
viewUser(aliasLabel: string, aliasId: string): Promise<ViewUserResponse>
updateUser(aliasLabel: string, aliasId: string, input: UpdateUserInput): Promise<UpdateUserResponse>
deleteUser(aliasLabel: string, aliasId: string): Promise<DeleteUserResponse>
viewUserIdentity(aliasLabel: string, aliasId: string): Promise<ViewUserIdentityResponse>
viewUserIdentityBySubscription(subscriptionId: string): Promise<ViewUserIdentityResponse>
createCustomEvents(events: CustomEvent[]): Promise<Record<string, any>>
```

#### Segments

```typescript
createSegment(input: CreateSegmentInput): Promise<CreateSegmentResponse>
viewSegments(limit?: number, offset?: number): Promise<ViewSegmentsResponse>
viewSegment(segmentId: string): Promise<ViewSegmentResponse>
updateSegment(segmentId: string, input: UpdateSegmentInput): Promise<UpdateSegmentResponse>
deleteSegment(segmentId: string): Promise<void>
```

#### Subscriptions

```typescript
createSubscription(input: CreateSubscriptionInput): Promise<CreateSubscriptionResponse>
viewSubscription(subscriptionId: string): Promise<ViewSubscriptionResponse>
updateSubscription(subscriptionId: string, input: UpdateSubscriptionInput): Promise<UpdateSubscriptionResponse>
deleteSubscription(subscriptionId: string): Promise<void>
```

#### Analytics

```typescript
viewOutcomes(options: ViewOutcomesOptions): Promise<ViewOutcomesResponse>
```

#### Apps

```typescript
viewApp(): Promise<AppResponse>
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/eadortsu/nestjs-onesignal.git
cd nestjs-onesignal

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build

# Lint code
npm run lint

# Format code
npm run format
```

### Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass
- Use conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OneSignal](https://onesignal.com) for their excellent push notification service
- [NestJS](https://nestjs.com) for the amazing framework
- The open-source community for inspiration and support

## 📞 Support

If you have any questions or need help:

- 📧 Email: eugeneadortsu@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/eadortsu/nestjs-onesignal/issues)
- 📖 Documentation: [OneSignal API Docs](https://documentation.onesignal.com/reference)

---

Made with ❤️ by [Eugene Adortsu](https://github.com/eadortsu)
