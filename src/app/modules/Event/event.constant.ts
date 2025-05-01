

// Re-export Prisma enums for use in validation, controllers, etc.
export const TEVENT_STATUS = {
    UPCOMING: 'UPCOMING',
    ONGOING: 'ONGOING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
} as const;

export const TEVENT_TYPE = {
    ONLINE: 'ONLINE',
    OFFLINE: 'OFFLINE',
    HYBRID: 'HYBRID',
} as const;

// TypeScript union types from values
export type TEventStatus = keyof typeof TEVENT_STATUS;
export type TEventType = keyof typeof TEVENT_TYPE;

// Input type for creating an event
export interface ICreateEventInput {
    ownerId: string;
    title: string;
    description: string;
    isPublic?: boolean;
    isPaid?: boolean;
    price?: number;
    registrationStart: string | Date;
    registrationEnd: string | Date;
    eventStartTime: string | Date;
    eventEndTime: string | Date;
    seat?: number;
    status?: TEventStatus;
    eventType?: TEventType;
    paymentId?: string | null;
    reviewId?: string | null;
}
