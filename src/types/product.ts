export interface Product {
  stock_item_id: number;
  sql_item_id: number;
  stock_code: string;
  name: string;
  reserved_quantity: number;
  sql_last_synced: string;
  description: string;
  is_active: boolean;
  has_stock_control: boolean;
  item_uom: ItemUOM[];
}

export interface ItemUOM {
  uom: string;
  rate: number;
  ref_cost: number;
  ref_price: number;
  is_base_uom: boolean;
}