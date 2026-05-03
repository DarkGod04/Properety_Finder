// src/app/utils/message.tsx
import axiosInstance from "../lib/axios";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export interface Message {
  id: string;
  sender: {
    id: string;
    first_name: string;
    last_name: string;
    role: string;
    email: string;
    profile_picture?: string;
  };
  receiver: {
    id: string;
    first_name: string;
    last_name: string;
    role: string;
    email: string;
    profile_picture?: string;
  };
  property?: {
    id: string;
    title: string;
  };
  subject: string;
  body: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface SendMessageData {
  receiver_id: string;
  property_id?: string;
  subject: string;
  body: string;
}

// Get received messages
export const getReceivedMessages = async (): Promise<Message[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/property/messages/received/`,
      { withCredentials: true }
    );
    return response.data;
  } catch (e) {
    console.log("getReceivedMessages-e=", e);
    throw e;
  }
};

// Get sent messages
export const getSentMessages = async (): Promise<Message[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/property/messages/sent/`,
      { withCredentials: true }
    );
    return response.data;
  } catch (e) {
    console.log("getSentMessages-e=", e);
    throw e;
  }
};

// Get message detail
export const getMessageDetail = async (messageId: string): Promise<Message> => {
  try {
    const response = await axios.get(
      `${API_URL}/property/messages/${messageId}/`,
      { withCredentials: true }
    );
    return response.data;
  } catch (e) {
    console.log("getMessageDetail-e=", e);
    throw e;
  }
};

// Send a new message
export const sendMessage = async (data: SendMessageData): Promise<Message> => {
  try {
    const response = await axiosInstance.post(
      "/property/messages/send/",
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (e) {
    console.log("sendMessage-e=", e);
    throw e;
  }
};

// Get unread messages count
export const getUnreadCount = async (): Promise<{ unread_count: number }> => {
  try {
    const response = await axios.get(
      `${API_URL}/property/messages/unread-count/`,
      { withCredentials: true }
    );
    return response.data;
  } catch (e) {
    console.log("getUnreadCount-e=", e);
    throw e;
  }
};
