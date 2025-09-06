import { ApiMessageType } from "@/app/chat-bot";

export interface IGLoginRequest {
  token: string;
}
export interface IGLoginResponse {
  token: string;
}
export interface IPlansResponse {
  data: {
    plans: Plan[];
  };
  success: boolean;
}
export interface Plan {
  name: string;
  price: number;
  description: string;
  features: string[];
  isActive?: boolean;
  bgColor: string;
  buttonColor: string;
  id: string;
  oldPrice: number;
}
interface StartConversationResponse {
  success: boolean;
  data?: { response: string; conversationId: string };
  message?: string;
}

interface StartConversationRequest {
  message: string;
  conversationId?: string;
}

interface UpgradePlanResponse {
  success: boolean;
  message?: string;
}

export interface PlansResponse {
  success: boolean;
  data?: { plans: Plan[] };
  message?: string;
}

export interface ChatHistoryItem {
  conversationId: string;
  createdAt: Date;
  updatedAt: Date;
  messages: { role: "user" | "assistant"; content: string; timestamp: Date }[];
}

export interface ChatHistoryResponse {
  success: boolean;
  data: {
    messages: ApiMessageType[];
    pagination: {
      page: number;
      limit: number;
      totalMessages: number;
      totalPages: number;
    };
  };
  message?: string;
}
export interface IVerifyOtpRes {
  success: boolean;
  token: string;
  user: User;
  isNewUser: boolean;
  isOnboardingSelected: boolean; // Add isNewUser flag to response
}
export interface User {
  _id?: string; // Make _id optional to allow creation before insertion
  phoneNumber: string | null;
  email: string | null;
  googleId: string | null;
  name: string | null;
  picture: string | null;
  plan: "free" | "unlimited" | "unlimited_plus";
  conversationCount: {
    date: string; // ISO date string (e.g., "2025-07-27")
    count: number; // Number of conversations on that date
  };
  createdAt: Date;
  updatedAt: Date | null;
}
export interface Meditation {
  id: string;
  title: string;
  type: "calm" | "love" | "instrumental" | "sleep" | "sleep-music" | "nature" | "story";
  file: string;
  image: string; // اضافه کردن فیلد URL تصویر
  duration: number;
  description: string;
  exhaleDuration?: number;
  inhaleDuration?: number;
  holdDuration?: number;
}
