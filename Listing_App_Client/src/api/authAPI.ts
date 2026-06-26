import axios from 'axios';

interface AuthPayload {
  email: string;
  password: string;
  name?: string;
}

export const login = async (data: AuthPayload) => {
  const response = await axios.post('/auth/login', data);
  return response.data;
};

export const register = async (data: AuthPayload) => {
  const response = await axios.post('/auth/register', data);
  return response.data;
};
