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
 * @interface CreatePushNotificationInput
 * @description Input for creating and sending a push notification.
 * @see https://documentation.onesignal.com/reference/create-notification
 */
export interface CreatePushNotificationInput extends Audience, Scheduling {
    target_channel?: 'push';
    contents: {
        en: string; // Default language content
        [lang: string]: string; // Additional languages
    };
    headings?: {
        en: string; // Default language content
        [lang: string]: string; // Additional languages
    };
    subtitle?:{
        en: string; // Default language content
        [lang: string]: string; // Additional languages
    };
    name?: string;
    template_id?: string;
    custom_data?: Record<string, any>;
    ios_attachments?: {
        id: string;
    };
    big_picture?: string;
    huawei_big_picture?: string;
    adm_big_picture?: string;
    chrome_web_image?: string;
    small_icon?: string;
    huawei_small_icon?: string;
    adm_small_icon?: string;
    large_icon?: string;
    huawei_large_icon?: string;
    adm_large_icon?: string;
    chrome_web_icon?: string;
    firefox_icon?: string;
    chrome_web_badge?: string;
    android_channel_id?: string;
    existing_android_channel_id?: string;
    huawei_category?: 'MARKETING' | 'IM' | 'VOIP' | 'SUBSCRIPTION' | 'TRAVEL' | 'HEALTH' | 'WORK' | 'ACCOUNT' | 'EXPRESS' | 'FINANCE' | 'DEVICE_REMINDER' | 'MAIL';
    huawei_msg_type?: string;
    huawei_bi_tag?: string;
    priority?: number;
    ios_interruption_level?: 'passive' | 'active' | 'time-sensitive' | 'critical';
    ios_sound?: string;
    ios_badgeType?: 'None' | 'SetTo' | 'Increase';
    ios_badgeCount?: number;
    android_accent_color?: string;
    huawei_accent_color?: string;
    url?: string;
    app_url?: string;
    web_url?: string;
    target_content_identifier?: string;
    buttons?: { id: string; text: string; icon?: string; }[];
    web_buttons?: { id: string; text: string; url: string; }[];
    thread_id?: string;
    ios_relevance_score?: number;
    android_group?: string;
    adm_group?: string;
    ttl?: number;
    collapse_id?: string;
    web_push_topic?: string;
    data?: Record<string, any>;
    content_available?: boolean;
    ios_category?: string;
    apns_push_type_override?: string;
    isIos?: boolean;
    isAndroid?: boolean;
    isHuawei?: boolean;
    isAnyWeb?: boolean;
    isChromeWeb?: boolean;
    isFirefox?: boolean;
    isSafari?: boolean;
    isWP_WNS?: boolean;
    isAdm?: boolean;
    throttle_rate_per_minute?: number;
    enable_frequency_cap?: boolean;
}

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

