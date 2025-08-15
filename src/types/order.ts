export interface OrderData {
  data: SQLData;
  order_items?: OrderItem[];
}

export interface SQLData {
  order_id: string;
  platform: string;
  storeID: string;
  storeName: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  shipping_original_amount: string;
  shipping_fee_original: number;
  settlement: SettlementItem[];
  totalAmount: string;
  currency: string;
  status: number;
  totalReleasedAmount?: number | null;
  refundAmount: number;
  orderCreatedDate: string;
  orderUpdatedDate: string;
  payment_method: string;
  reason_text: string;
  statement?: string;
}

export interface OrderItem {
  name: string;
  sku: string;
  shop_sku: string;
  sku_id: string;
  item_price: string;
  paid_price: string;
  currency: string;
  tax_amount: string;
  status: string;
  variation: string;
  quantity: number;
  product_detail_url?: string;
  product_main_image: string;

  shipping_type: string;
  seller_discount: string;
  platform_discount: string;
  return_status?: string;

  image?: string;
  display_status?: string;
  shipping_provider_name?: string;
  purchase_order_id?: string;
  purchase_order_number?: string;
}

export interface SettlementItem {
  description: string;
  amount: number;
  stock_item_id: string;
  discount: number;
  quantity: number;
  cancel_quantity: number;
  return_quantity: number;
  transaction_date?: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
