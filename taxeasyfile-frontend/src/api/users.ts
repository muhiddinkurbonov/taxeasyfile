import { api } from "./utils";
import {User} from './types';

export const getCpas = async (): Promise<User[]> => {
  const response = await api.get("/users");
  return response.data;
};
