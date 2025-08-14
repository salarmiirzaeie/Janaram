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
