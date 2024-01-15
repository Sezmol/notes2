export interface IUser {
  email: string;
  username: string;
  password: string;
}

export interface INewUser {
  id: string;
  email: string;
  username: string;
}

export interface INewNote {
  title: string;
  content: string;
}
