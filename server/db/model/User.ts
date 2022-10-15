import { Schema, model, Model }  from "mongoose";
import { WeedPlayer } from "server/types/Player";

export interface DBUser {
  id: string;
  name: string;
  email: string;
  accessToken: string;
  token: string;
  isAdmin: boolean;
  avatarUrl?: string;
}

export const toWeedPlayer = (dbUser: DBUser) => {
  const weedPlayer: WeedPlayer = {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    isAdmin: dbUser.isAdmin,
    avatarUrl: dbUser.avatarUrl,
  };
  return weedPlayer;
};

const UserSchema = new Schema<DBUser>({
  id: String,
  name: String,
  email: String,
  accessToken: String,
  token: String,
  isAdmin: Boolean,
  avatarUrl: String,
});

let User: Model<DBUser>;

try {
  User = model<DBUser>('users', UserSchema);
} catch {
  User = model<DBUser>('users');
}

export default User;
