export const userSearchAbleFields: string[] = ["email"];

export const userFilterableFields: string[] = [
  "email",
  "role",
  "status",
  "searchTerm",
];

export const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  contactNumber: true,
  gender: true,
  photo: true,
  status: true,
  needPasswordChange: true,
  createdAt: true,
  updatedAt: true,
};
