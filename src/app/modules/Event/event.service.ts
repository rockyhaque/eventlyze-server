import { ICreateEventInput } from "./event.constant";

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const createEvent = async (data: ICreateEventInput, user: any) => {
    // 1. Extract email from user
    const email = user?.email;

    // 2. Find the user by email
    const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
    });

    // if (!existingUser) {
    //     throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    // }

    // 3. Inject ownerId into the event data
    const event = await prisma.event.create({
        data: {
            ownerId: existingUser.id,
            title: data.title,
            description: data.description,
            isPublic: data.isPublic || false,
            isPaid: data.isPaid || false,
            price: data.price || 0,
            category: data.category,
            location: data.location,
            registrationStart: new Date(data.registrationStart),
            registrationEnd: new Date(data.registrationEnd),
            eventStartTime: new Date(data.eventStartTime),
            eventEndTime: new Date(data.eventEndTime),
            seat: data.seat || 0,
            status: data.status || 'UPCOMING',
            eventType: data.eventType || 'OFFLINE',
            paymentId: data.paymentId || null,
            reviewId: data.reviewId || null,
        },
    });

    return event;
};


export const eventService = {
    createEvent,
};
