export interface Transaction {
  id: number;
  transaction_id: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  status: "Success" | "Pending" | "Failed" | "Refunded";
  date: string;
  category: string;
}

export interface Preset {
  id?: number;
  name: string;
  config: FilterConfig;
  is_default: boolean;
}

export interface FilterRule {
  id: string; // for React keys
  field: string;
  operator: "eq" | "neq" | "contains" | "gt" | "lt" | "gte" | "lte";
  value: string | number;
}

export interface FilterConfig {
  logic: "AND" | "OR";
  rules: FilterRule[];
}

export interface ApiResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
