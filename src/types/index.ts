export interface User {
  id: string;
  email: string;
  name: string;
}

export interface TableData {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  action?: string;
}

export interface FormData {
  username: string;
  email: string;
  password: string;
}

export interface FileUploadResponse {
  success: boolean;
  filename: string;
  size: number;
}

export interface IframeContent {
  id: string;
  title: string;
  content: string;
}

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export interface NotificationMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
