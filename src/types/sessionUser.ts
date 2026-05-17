import { User, Role } from "./interfaces";
export interface SessionUser {
  id: User["id"];
  name: User["nama"];
  email: User["email"];
  role: Role;
  created_at: User["created_at"];
}
