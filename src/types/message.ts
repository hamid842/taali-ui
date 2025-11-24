import type { User } from "./auth";

export type ConversationCategory =
  | "ABSENCE"
  | "ACADEMIC"
  | "BEHAVIOR"
  | "GENERAL";

export interface Student {
  id: number;
  name: string;
  grade: string;
  className?: string;
  school?: {
    id: number;
    name: string;
  };
}

export interface Message {
  id: number;
  content: string;
  sender: User;
  conversationId: number;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: number;
  subject: string;
  category: ConversationCategory;
  initiator: User;
  receiver: User;
  student?: Student;
  isClosed: boolean;
  lastMessageAt: string;
  createdAt: string;
  unreadCount: number;
  lastMessage?: {
    content: string;
    senderName: string;
    createdAt: string;
  };
  messageCount: number;
}

export interface CreateConversationRequest {
  subject: string;
  category: ConversationCategory;
  receiverId: number;
  studentId: number;
  content: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}
