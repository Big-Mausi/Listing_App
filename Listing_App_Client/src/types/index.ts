export interface User {
  _id: string;
  name: string;
  email: string;
}



export interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  videos: string[];
  user: User;
  createdAt: string;
  updatedAt: string;
}
