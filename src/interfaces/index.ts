// =================================================================
// 1. Core & Reusable Base Interfaces
// =================================================================

/**
 * @interface Audience
 * @description Defines the common audience targeting parameters for notifications.
 * @see https://documentation.onesignal.com/reference/create-notification
 */
export interface Audience {
    /** Target users based on their external_id */
    include_aliases?: {
        external_id?: string[];
        onesignal_id?: string[];
    };
    /** Target specific subscription IDs. */
    include_subscription_ids?: string[];
    /** Target users in these segments. */
    included_segments?: string[];
    /** Exclude users in these segments. */
    excluded_segments?: string[];
    /** Use filters to target users based on data attributes. */
    filters?: Filter[];
}

/**
 * @interface Scheduling
 * @description Defines common scheduling and delivery options for notifications.
 */
export interface Scheduling {
    send_after?: string;
    /**
     * 'timezone' - Deliver at a specific time in the user's timezone.
     * 'last-active' - Deliver based on the user's last active time.
     */
    delayed_option?: 'timezone' | 'last-active';
    /** Time of day to deliver the notification (e.g., "9:00AM"). */
    delivery_time_of_day?: string;
    idempotency_key?: string;
}

/**
 * @interface UserPropertiesBase
 * @description Defines the base properties of a OneSignal user.
 */
export interface UserPropertiesBase {
    /** Key-value tags for segmenting users. */
    tags?: Record<string, string>;
    /** User's language code (e.g., "en"). */
    language?: string;
    /** User's timezone ID (e.g., "America/New_York"). */
    timezone_id?: string;
    /** User's latitude. */
    lat?: number;
    /** User's longitude. */
    long?: number;
    /** User's country code. */
    country?: string;
    /** Timestamp of the user's first session. */
    first_active?: number;
    /** Timestamp of the user's last session. */
    last_active?: number;
    /** The user's IP address. */
    ip?: string;
}

/**
 * @interface Filter
 * @description A filter to target a subset of users.
 * @see https://documentation.onesignal.com/docs/segmentation
 */
export interface Filter {
    /** The field to filter on (e.g., "tag", "last_session"). */
    field: string;
    /** The key for tag filters. */
    key?: string;
    /** The relation between the field and value (e.g., "=", ">", "exists"). */
    relation?: string;
    /** The value to compare against. */
    value: string;
}


// =================================================================
// 2. Module Configuration
// =================================================================

/**
 * @interface OneSignalModuleOptions
 * @description Configuration options for the OneSignal NestJS module.
 */
export interface OneSignalModuleOptions {
    /** Your OneSignal App ID. */
    appId: string;
    /** Your OneSignal REST API Key. */
    apiKey: string;
    /** Request timeout in milliseconds. */
    timeout?: number;
}


// =================================================================
// 3. User & Subscription Interfaces
// =================================================================

/**
 * @interface UserSubscription
 * @description Represents a user's subscription to a specific channel.
 */
export interface UserSubscription {
    type: 'Email' | 'SMS' | 'iOSPush' | 'AndroidPush' | 'HuaweiPush' | 'ChromePush' | 'FirefoxPush' | 'SafariPush';
    token: string;
    enabled?: boolean;
    notification_types?: number;
    session_time?: number;
    session_count?: number;
    app_version?: string;
    device_model?: string;
    device_os?: string;
    test_type?: number;
    sdk?: string;
    rooted?: boolean;
    web_auth?: string;
    web_p256?: string;
}

/**
 * @interface UserSubscriptionInfo
 * @description Detailed information about a user subscription, including OneSignal-specific IDs.
 * Extends the base UserSubscription with read-only fields from the API.
 */
export interface UserSubscriptionInfo extends UserSubscription {
    id: string;
    app_id: string;
}

/**
 * @interface CreateUserInput
 * @description Input for creating a new user in OneSignal.
 */
export interface CreateUserInput {
    identity: {
        external_id: string;
    };
    properties?: UserPropertiesBase;
    subscriptions?: UserSubscription[];
}

/**
 * @interface ViewUserResponse
 * @description The response structure when fetching a user.
 */
export interface ViewUserResponse {
    identity: {
        onesignal_id: string;
        external_id?: string;
    };
    properties?: UserPropertiesBase;
    subscriptions?: UserSubscriptionInfo[];
}

/**
 * @interface CreateUserResponse
 * @description The response after successfully creating a user.
 */
export interface CreateUserResponse {
    identity: {
        onesignal_id: string;
    };
    properties?: {
        tags?: {
            first_name?: string;
            last_name?: string;
        }
    };
}

/**
 * @interface Purchase
 * @description Represents a purchase event for a user.
 */
export interface Purchase {
    sku: string;
    iso?: string;
    amount?: string;
    count?: number;
}

/**
 * @interface UpdateUserInput
 * @description Input for updating an existing user's properties or deltas.
 */
export interface UpdateUserInput {
    properties?: Partial<UserPropertiesBase>;
    deltas?: {
        session_time?: number;
        session_count?: number;
        purchases?: Purchase[];
    };
}

/**
 * @interface UpdateUserResponse
 * @description The response after a successful user update.
 */
export interface UpdateUserResponse {
    properties?: UserPropertiesBase & {
        purchases?: Purchase[];
    };
}

/**
 * @interface DeleteUserResponse
 * @description The response after deleting a user.
 */
export interface DeleteUserResponse {
    identity: {
        onesignal_id: string;
    };
}

/**
 * @interface ViewUserIdentityResponse
 * @description The response when fetching a user's identity mapping.
 */
export interface ViewUserIdentityResponse {
    identity: {
        onesignal_id: string;
        external_id?: string;
        [customAlias: string]: string | undefined;
    };
}


// =================================================================
// 4. Notification Interfaces (Push, Email, SMS)
// =================================================================

/**
 * @description Simplified input for creating and sending a push notification.
 * @see https://documentation.onesignal.com/reference/create-notification
 */
export type CreatePushNotificationInput = Scheduling & {
    /** The main message body with language-specific values. */
    contents: {
        en: string; // Default language content
        [lang: string]: string; // Additional languages
    };
    /** The message title with language-specific values. */
    headings?: {
        en: string; // Default language content
        [lang: string]: string; // Additional languages
    };
    /** iOS only. The subtitle with language-specific values. */
    subtitle?: {
        en: string; // Default language content
        [lang: string]: string; // Additional languages
    };
    /** An internal name you set to help organize and track messages. */
    name?: string;
    /** The template ID in UUID v4 format set for the message if applicable. */
    template_id?: string;
    /** Include user or context-specific data in a message. */
    custom_data?: Record<string, any>;
    /** iOS attachments. */
    ios_attachments?: {
        id: string;
    };
    /** URL of the image for Android notifications. */
    big_picture?: string;
    /** URL of the image for Huawei Android notifications. */
    huawei_big_picture?: string;
    /** URL of the image for Amazon Android notifications. */
    adm_big_picture?: string;
    /** URL of the image for Chrome web notifications. */
    chrome_web_image?: string;
    /** Local name of the small icon for Android notifications. */
    small_icon?: string;
    /** Local name of the small icon for Huawei Android notifications. */
    huawei_small_icon?: string;
    /** Local name of the small icon for Amazon Android notifications. */
    adm_small_icon?: string;
    /** Local name or URL of the large icon for Android notifications. */
    large_icon?: string;
    /** Local name or URL of the large icon for Huawei Android notifications. */
    huawei_large_icon?: string;
    /** Local name or URL of the large icon for Amazon Android notifications. */
    adm_large_icon?: string;
    /** URL of the icon for Chrome web notifications. */
    chrome_web_icon?: string;
    /** URL of the icon for Firefox web notifications. */
    firefox_icon?: string;
    /** URL of the icon for Android notification tray for Chrome web. */
    chrome_web_badge?: string;
    /** UUID of the Android notification channel category. */
    android_channel_id?: string;
    /** UUID of the existing Android notification channel category. */
    existing_android_channel_id?: string;
    /** UUID of the Huawei notification channel category. */
    huawei_channel_id?: string;
    /** UUID of the existing Huawei notification channel category. */
    huawei_existing_channel_id?: string;
    /** Category for Huawei notifications. */
    huawei_category?: 'MARKETING' | 'IM' | 'VOIP' | 'SUBSCRIPTION' | 'TRAVEL' | 'HEALTH' | 'WORK' | 'ACCOUNT' | 'EXPRESS' | 'FINANCE' | 'DEVICE_REMINDER' | 'MAIL';
    /** Type of notification for Huawei devices. */
    huawei_msg_type?: 'message' | 'data';
    /** Tag for associating messages in Huawei batch delivery. */
    huawei_bi_tag?: string;
    /** Priority of the notification. */
    priority?: 5 | 10;
    /** iOS interruption level. */
    ios_interruption_level?: 'passive' | 'active' | 'time-sensitive' | 'critical';
    /** Local name of the custom sound file for iOS. */
    ios_sound?: string;
    /** Badge type for iOS. */
    ios_badgeType?: 'None' | 'SetTo' | 'Increase';
    /** Badge count for iOS. */
    ios_badgeCount?: number;
    /** ARGB Hex color for Android small icon background. */
    android_accent_color?: string;
    /** ARGB Hex color for Huawei small icon background. */
    huawei_accent_color?: string;
    /** URL that opens in the browser when interacted with. */
    url?: string;
    /** URL for mobile platforms. */
    app_url?: string;
    /** URL for web platforms. */
    web_url?: string;
    /** Direct the notification to a specific user experience. */
    target_content_identifier?: string;
    /** Action buttons for Android and iOS. */
    buttons?: { id: string; text: string; icon?: string; }[];
    /** Action buttons for web push. */
    web_buttons?: { id: string; text: string; url: string; }[];
    /** ID to group notifications on Apple devices. */
    thread_id?: string;
    /** Relevance score for iOS notifications. */
    ios_relevance_score?: number;
    /** ID to group notifications on Android devices. */
    android_group?: string;
    /** ID to group notifications on Amazon Android devices. */
    adm_group?: string;
    /** Duration in seconds for which the notification remains valid. */
    ttl?: number;
    /** ID that replaces older notifications with newer ones. */
    collapse_id?: string;
    /** ID that prevents replacement for web push. */
    web_push_topic?: string;
    /** Custom data bundle within the notification. */
    data?: Record<string, any>;
    /** Allows sending data/background notifications. */
    content_available?: boolean;
    /** Category for iOS notifications. */
    ios_category?: string;
    /** Override for APNs push type. */
    apns_push_type_override?: string;
    /** Target iOS devices only. */
    isIos?: boolean;
    /** Target Android devices only. */
    isAndroid?: boolean;
    /** Target Huawei devices only. */
    isHuawei?: boolean;
    /** Target web push only. */
    isAnyWeb?: boolean;
    /** Target Chrome only. */
    isChromeWeb?: boolean;
    /** Target Firefox only. */
    isFirefox?: boolean;
    /** Target Safari only. */
    isSafari?: boolean;
    /** Target Windows apps only. */
    isWP_WNS?: boolean;
    /** Target Amazon devices only. */
    isAdm?: boolean;
    /** Throttle rate per minute. */
    throttle_rate_per_minute?: number;
    /** Enable frequency cap. */
    enable_frequency_cap?: boolean;
} & (
    | {
        /** Target users by their OneSignal ID (can be string or array) */
        onesignal_id?: string | string[];
        /** Target users by their external ID (can be string or array) */
        external_id?: string | string[];
        include_subscription_ids?: never;
        included_segments?: never;
        excluded_segments?: never;
        filters?: never;
    }
    | {
        include_subscription_ids?: string[];
        onesignal_id?: never;
        external_id?: never;
        included_segments?: never;
        excluded_segments?: never;
        filters?: never;
    }
    | {
        included_segments?: string[];
        excluded_segments?: string[];
        onesignal_id?: never;
        external_id?: never;
        include_subscription_ids?: never;
        filters?: never;
    }
    | {
        filters?: Filter[];
        onesignal_id?: never;
        external_id?: never;
        include_subscription_ids?: never;
        included_segments?: never;
        excluded_segments?: never;
    }
    | {
        onesignal_id?: never;
        external_id?: never;
        include_subscription_ids?: never;
        included_segments?: never;
        excluded_segments?: never;
        filters?: never;
    }
);

/**
 * @interface CreateEmailInput
 * @description Input for creating and sending an email.
 * @see https://documentation.onesignal.com/reference/create-email-notification
 */
export interface CreateEmailInput extends Audience, Scheduling {
    email_subject: string;
    email_body: string;
    target_channel?: 'email';
    email_to?: string[];
    email_preheader?: string;
    template_id?: string;
    name?: string;
    custom_data?: Record<string, any>;
    email_from_name?: string;
    email_from_address?: string;
    email_sender_domain?: string;
    email_reply_to_address?: string;
    include_unsubscribed?: boolean;
    disable_email_click_tracking?: boolean;
}

/**
 * @interface CreateSMSInput
 * @description Input for creating and sending an SMS.
 * @see https://documentation.onesignal.com/reference/create-sms-notification
 */
export interface CreateSMSInput extends Audience, Scheduling {
    contents: {
        en: string; // Default language content
        [lang: string]: string; // Additional languages
    };
    target_channel?: 'sms';
    include_phone_numbers?: string[];
    sms_from: string; // Your Twilio phone number
    sms_media_urls?: string[];
    name?: string;
    template_id?: string;
    custom_data?: Record<string, any>;
}

/**
 * @interface CreateNotificationResponse
 * @description Generic response after creating any notification (Push, Email, SMS).
 */
export interface CreateNotificationResponse {
    id: string;
    external_id: string | null;
    errors?: {
        invalid_phone_numbers?: string[];
        invalid_email_tokens?: string[];
        invalid_aliases?: {
            external_id: string[];
            onesignal_id: string[];
        };
        invalid_player_ids?: string[];
    };
}


// =================================================================
// 5. Live Activity Interfaces
// =================================================================

/**
 * @interface LiveActivityAudience
 * @description Audience for targeting a Live Activity. Note: it's a subset of the main Audience interface.
 */
export interface LiveActivityAudience {
    include_aliases?: { external_id?: string[] };
    include_subscription_ids?: string[];
}

/** @description Input to start a new Live Activity notification. */
export interface StartLiveActivityInput extends LiveActivityAudience {
    event: 'start';
    activity_id: string;
    event_attributes: Record<string, any>;
    event_updates: Record<string, any>;
    name: string;
    contents: Record<string, string>;
    headings: Record<string, string>;
    priority?: 5 | 10;
    idempotency_key?: string;
}

/** @description Response after starting a Live Activity. */
export interface StartLiveActivityResponse {
    notification_id: string;
}

/** @description Input to update or end an existing Live Activity. */
export interface UpdateLiveActivityInput {
    event: 'update' | 'end';
    name: string;
    event_updates: Record<string, any>;
    contents?: Record<string, string>;
    stale_date?: number;
    dismissal_date?: number;
    priority?: 5 | 10;
    ios_relevance_score?: number;
}

/** @description Response after updating a Live Activity. */
export interface UpdateLiveActivityResponse {
    id: string;
}

// =================================================================
// 6. Other Interfaces (Segments, Events, etc.)
// =================================================================

/**
 * @interface Button
 * @description Represents a push notification button.
 */
export interface Button {
    id: string;
    text: string;
    icon?: string;
}

/**
 * @interface WebButton
 * @description Represents a web push notification button with a URL.
 */
export interface WebButton {
    id: string;
    text: string;
    url: string;
}

/**
 * @interface NotificationResponse
 * @description Detailed response for a viewed notification.
 */
export interface NotificationResponse {
    app_id: string;
    id: string;
    name?: string;
    contents: Record<string, string>;
    headings?: Record<string, string>;
    big_picture?: string;
    chrome_web_icon?: string;
    chrome_web_image?: string;
    global_image?: string;
    data?: Record<string, any>;
    canceled?: boolean;
    queued_at?: number;
    send_after?: number;
    completed_at?: number;
    successful?: number;
    received?: number;
    converted?: number;
    errored?: number;
    failed?: number;
    filters?: any;
    included_segments?: any[];
    excluded_segments?: any[];
    template_id?: string;
    url?: string;
    web_url?: string;
    app_url?: string;
    ios_badgeCount?: number;
    ios_badgeType?: string;
    delayed_option?: string;
    delivery_time_of_day?: string;
    throttle_rate_per_minute?: number;
    platform_delivery_stats?: Record<string, any>;
    outcomes?: Record<string, any>;
}

/**
 * @interface CreateSegmentInput
 * @description Input for creating a new user segment.
 */
export interface CreateSegmentInput {
    name: string;
    filters: Filter[];
}

/** @description A custom event to track for a user. */
export interface CustomEvent {
    name: string;
    external_id?: string;
    onesignal_id?: string;
    /** ISO 8601 format. Defaults to the time of the request. */
    timestamp?: string;
    payload?: Record<string, any>;
}

/** @description Response after creating custom events. Usually an empty object on success. */
export interface CreateCustomEventsResponse {
    [key: string]: any;
}

/**
 * @interface ViewNotificationsOptions
 * @description Options for filtering the list of viewed notifications.
 * @see https://documentation.onesignal.com/reference/view-notifications
 */
export interface ViewNotificationsOptions {
    limit?: number;
    offset?: number;
    /** 0 for Dashboard, 1 for API, 3 for Automated. */
    kind?: 0 | 1 | 3;
    template_id?: string;
    time_offset?: string;
}

/**
 * @interface ViewNotificationOptions
 * @description Options for viewing a single notification, including outcome data.
 * @see https://documentation.onesignal.com/reference/view-notification
 */
export interface ViewNotificationOptions {
    outcome_names?: string[];
    outcome_time_range?: '1h' | '1d' | '1mo';
    /** e.g., "iOS", "Android" */
    outcome_platforms?: string;
    outcome_attribution?: 'direct' | 'influenced' | 'unattributed' | 'total';
}

/**
 * @interface NotificationStats
 * @description Base properties for a paginated list of notifications.
 */
export interface NotificationStats {
    total_count: number;
    offset: number;
    limit: number;
    time_offset?: string;
    next_time_offset?: string;
}

/**
 * @interface ViewNotificationsResponse
 * @description Paginated response when viewing multiple notifications.
 */
export interface ViewNotificationsResponse extends NotificationStats {
    notifications: NotificationResponse[];
}

/**
 * @interface CancelNotificationResponse
 * @description Response after canceling a scheduled notification.
 * @see https://documentation.onesignal.com/reference/cancel-notification
 */
export interface CancelNotificationResponse {
    success: boolean;
}

// =================================================================
// 7. Segment Interfaces
// =================================================================

/**
 * @interface SegmentResponse
 * @description Base response for segment operations.
 */
export interface SegmentResponse {
    id: string;
    name: string;
    created_at: number;
    updated_at: number;
    filters: Filter[];
    read_only: boolean;
}

/**
 * @interface CreateSegmentResponse
 * @description Response after creating a segment.
 */
export interface CreateSegmentResponse extends SegmentResponse {}

/**
 * @interface ViewSegmentResponse
 * @description Response when viewing a segment.
 */
export interface ViewSegmentResponse extends SegmentResponse {}

/**
 * @interface UpdateSegmentInput
 * @description Input for updating a segment.
 */
export interface UpdateSegmentInput {
    name?: string;
    filters?: Filter[];
}

/**
 * @interface UpdateSegmentResponse
 * @description Response after updating a segment.
 */
export interface UpdateSegmentResponse extends SegmentResponse {}

/**
 * @interface ViewSegmentsResponse
 * @description Paginated response for listing segments.
 */
export interface ViewSegmentsResponse {
    total_count: number;
    offset: number;
    limit: number;
    segments: SegmentResponse[];
}

// =================================================================
// 8. Subscription Interfaces
// =================================================================

/**
 * @interface CreateSubscriptionInput
 * @description Input for creating a new subscription.
 */
export interface CreateSubscriptionInput {
    app_id?: string;
    device_type: number; // 0=iOS, 1=Android, etc.
    identifier: string; // token or email
    test_type?: number;
    language?: string;
    timezone?: number;
    game_version?: string;
    device_model?: string;
    device_os?: string;
    session_count?: number;
    tags?: Record<string, string>;
    amount_spent?: number;
    created_at?: number;
    playtime?: number;
    badge_count?: number;
    last_active?: number;
    notification_types?: number;
    sdk?: string;
}

/**
 * @interface CreateSubscriptionResponse
 * @description Response after creating a subscription.
 */
export interface CreateSubscriptionResponse {
    success: boolean;
    id: string;
}

/**
 * @interface ViewSubscriptionResponse
 * @description Response when viewing a subscription.
 */
export interface ViewSubscriptionResponse {
    id: string;
    app_id: string;
    device_type: number;
    identifier: string;
    test_type?: number;
    language?: string;
    timezone?: number;
    game_version?: string;
    device_model?: string;
    device_os?: string;
    session_count?: number;
    tags?: Record<string, string>;
    amount_spent?: number;
    created_at?: number;
    playtime?: number;
    badge_count?: number;
    last_active?: number;
    notification_types?: number;
    sdk?: string;
}

/**
 * @interface UpdateSubscriptionInput
 * @description Input for updating a subscription.
 */
export interface UpdateSubscriptionInput {
    app_id?: string;
    device_type?: number;
    identifier?: string;
    test_type?: number;
    language?: string;
    timezone?: number;
    game_version?: string;
    device_model?: string;
    device_os?: string;
    session_count?: number;
    tags?: Record<string, string>;
    amount_spent?: number;
    created_at?: number;
    playtime?: number;
    badge_count?: number;
    last_active?: number;
    notification_types?: number;
    sdk?: string;
}

/**
 * @interface UpdateSubscriptionResponse
 * @description Response after updating a subscription.
 */
export interface UpdateSubscriptionResponse {
    success: boolean;
}

// =================================================================
// 9. Analytics Interfaces
// =================================================================

/**
 * @interface ViewOutcomesOptions
 * @description Options for viewing outcomes.
 */
export interface ViewOutcomesOptions {
    outcome_names: string[];
    outcome_time_range?: '1h' | '1d' | '1mo';
    outcome_platforms?: string;
    outcome_attribution?: 'direct' | 'influenced' | 'unattributed';
}

/**
 * @interface OutcomeData
 * @description Data for an outcome.
 */
export interface OutcomeData {
    id: string;
    value: number;
    aggregation: string;
}

/**
 * @interface ViewOutcomesResponse
 * @description Response for viewing outcomes.
 */
export interface ViewOutcomesResponse {
    outcomes: OutcomeData[];
}

// =================================================================
// 10. App Interfaces
// =================================================================

/**
 * @interface AppResponse
 * @description Response for app information.
 */
export interface AppResponse {
    id: string;
    name: string;
    gcm_key?: string;
    chrome_key?: string;
    chrome_web_key?: string;
    chrome_web_origin?: string;
    chrome_web_gcm_sender_id?: string;
    chrome_web_default_notification_icon?: string;
    chrome_web_sub_domain?: string;
    apns_env?: string;
    apns_p12?: string;
    apns_p12_password?: string;
    apns_certificates?: string;
    safari_apns_certificate?: string;
    safari_site_origin?: string;
    safari_push_id?: string;
    safari_icon_16_16?: string;
    safari_icon_32_32?: string;
    safari_icon_64_64?: string;
    safari_icon_128_128?: string;
    safari_icon_256_256?: string;
    site_name?: string;
    basic_auth_key?: string;
    organization_id?: string;
    additional_data_is_root_payload?: boolean;
    apns_type?: number;
}

