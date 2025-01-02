export interface Rule {
  id: string;
  uniqueId: string;
  title: string;
  description?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  message: string;
  rules: Rule[];
}
