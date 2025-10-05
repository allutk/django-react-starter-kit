export type UserTokensResponse = {
  access: string;
  refresh: string;
};

export type UserDetailsResponse = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
};
