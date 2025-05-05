import { EventCategory, EventStatus, EventType } from "@prisma/client";
import { z } from "zod";

const EventStatusEnum = z.nativeEnum(EventStatus);
const EventTypeEnum = z.nativeEnum(EventType);
const EventCategoryEnum = z.nativeEnum(EventCategory);

export const EventSchema = z.object({
  body: z
    .object({
      title: z.string().min(1, { message: "Title is required." }),
      description: z.string().min(1, { message: "Description is required." }),
      isPublic: z.boolean(),
      isPaid: z.boolean(),
      price: z
        .number({ invalid_type_error: "Price must be a number." })
        .int({ message: "Price must be an integer." })
        .nonnegative({ message: "Price cannot be negative." }),
      category:  EventCategoryEnum.refine((val) => Object.values(EventCategory).includes(val), {
        message: "Invalid category. Must be one of: conference, meetup, webinar.",
      }),
      location: z.string().optional().nullable(),
      platform: z.string().optional().nullable(),
      meetingLink: z
        .string()
        .url({ message: "Meeting link must be a valid URL." })
        .optional()
        .nullable(),
      meetingLinkPassword: z.string().optional().nullable(),
      registrationStart: z.coerce.date({
        invalid_type_error: "Invalid registration start date.",
      }),
      registrationEnd: z.coerce.date({
        invalid_type_error: "Invalid registration end date.",
      }),
      eventStartTime: z.coerce.date({
        invalid_type_error: "Invalid event start time.",
      }),
      eventEndTime: z.coerce.date({
        invalid_type_error: "Invalid event end time.",
      }),
      seat: z
        .number({ invalid_type_error: "Seat must be a number." })
        .int({ message: "Seat count must be an integer." })
        .nonnegative({ message: "Seat count cannot be negative." }),

      eventBanner: z
        .string()
        .min(1, { message: "Event banner URL is required." }),
      status: EventStatusEnum.optional(),
      eventType: EventTypeEnum,
    })
    .strict(),
});

export const EventValidiontonSchema = {
  EventSchema,
};
