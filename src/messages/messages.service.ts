import { Message } from "./message.model";

export const getPublicMessage = (): Message => {
  return {
    status: "All Systems Aperational.",
  };
};

export const getProtectedMessage = (): Message => {
  return {
    status: "This is a protected message.",
  };
};

export const getAdminMessage = (): Message => {
  return {
    status: "This is an admin message.",
  };
};
