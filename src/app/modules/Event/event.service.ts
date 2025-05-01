import { ICreateEventInput } from "./event.constant";

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createEvent = async (data: ICreateEventInput) => {
    return await prisma.event.create({
        data: {
            ownerId: data.ownerId,
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
};

export const eventService = {
    createEvent,
};
