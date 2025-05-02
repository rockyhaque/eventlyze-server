import { ICreateEventInput, IFilterQuery, TEVENT_STATUS, TEVENT_TYPE } from "./event.constant";

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




const parseBoolean = (value: string | undefined): boolean | undefined => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
};

const getAllEvents = {
    getFilteredEvents: async (query: IFilterQuery) => {
        const { isPublic, isPaid, status, eventType, category } = query;

        const filters: any = {};

        const publicBool = parseBoolean(isPublic);
        const paidBool = parseBoolean(isPaid);

        if (publicBool !== undefined) filters.isPublic = publicBool;
        if (paidBool !== undefined) filters.isPaid = paidBool;
        if (status && TEVENT_STATUS[status]) filters.status = status;
        if (eventType && TEVENT_TYPE[eventType]) filters.eventType = eventType;
        if (category) filters.category = category;

        const events = await prisma.event.findMany({
            where: filters,
            include: {
                owner: true,
                participants: true,
                invites: true,
                payment: true,
                review: true,
            },
        });

        return events;
    },
};

const getEventById = async (id: string) => {
    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            owner: true,
            participants: true,
            invites: true,
            payment: true,
            review: true,
        },
    });
    return event;
};

const updateSingleEvent = async (id: string, data: ICreateEventInput) => {
    const event = await prisma.event.update({
        where: { id },
        data,
    });
    return event;
};

const deleteSingleEvent = async (id: string) => {
    const event = await prisma.event.delete({
        where: { id },
    });
    return event;
};



export const eventService = {
    createEvent,
    getAllEvents,
    getEventById,
    updateSingleEvent,
    deleteSingleEvent,

};
