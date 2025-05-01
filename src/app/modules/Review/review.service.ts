const createReview = async (eventId: string, payload: any) => {
  console.log("eventId", eventId);
  console.log("payload", payload);
};

const getReviews = async (eventId: string) => {
  console.log({ eventId });
};

const updateReview = async (reviewId: string, payload: any) => {
  console.log({ reviewId });
  console.log({ payload });
};

const deleteReview = async (reviewId: string) => {
  console.log({ reviewId });
};

export const ReviewService = {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
};
