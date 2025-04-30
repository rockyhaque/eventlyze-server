type TOptions = {
  page?: number;
  limit?: number;
  sortOrder?: string;
  sortBy?: string;
};

type TOptionsResult = {
  page: number;
  limit: number;
  skip: number;
  sortOrder: string;
  sortBy: string;
};

const calculatePagination = (options: TOptions): TOptionsResult => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip: number = (Number(page) - 1) * limit;
  const sortBy: string = options.sortBy || "createdAt";
  const sortOrder: string = options.sortOrder || "desc";

  return { page, limit, skip, sortBy, sortOrder };
};

export const paginationHelper = {
  calculatePagination,
};
