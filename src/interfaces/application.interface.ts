import { ICofounderRequirement } from "./startup.interface";
import { IUser } from "./user.interface";

export type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "withdrawn";

export type NotificationType =
  | "new_application"
  | "application_accepted"
  | "application_rejected"
  | "new_message"
  | "system_announcement";

export interface IApplication {
  id: string;
  requirement?: ICofounderRequirement;
  candidate?: IUser;
  status: ApplicationStatus;
  compatibilityScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface IMessage {
  id: string;
  sender?: IUser;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface INotification {
  id: string;
  type: NotificationType;
  payload: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}
