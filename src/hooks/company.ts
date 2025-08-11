import { useState } from 'react';
import { bindToBackend, pullOrder, pushProduct } from '../services/company';
import type { Product } from '../types/product';
import type { OrderData } from '../types/order';

export function useBindECommerce() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isBind, setBindStatus] = useState("");

  const bind = async (accessKey: string, secretKey: string) => {
    if (!accessKey || !secretKey) throw new Error('Missing access or secret key');

    // Generate a random company ID
    const companyId = "600075264272120";

    // Pass to backend service
    const result = await bindToBackend({ company_id: companyId, access_key: accessKey, secret_key: secretKey });

    console.log("bindSTATUS", result.bindStatus);
    setIsSuccess(result.success);
    setBindStatus(result.bindStatus);
    return result;
  };

  return { bind, isSuccess, isBind};
}

function generateCompanyId(): string {
  // Generate a random 15-digit number and return as string
  const min = 1e14; // Smallest 15-digit number
  const max = 9e14; // Largest 15-digit number
  const randomNum = Math.floor(Math.random() * (max - min)) + min;
  return randomNum.toString();
}

export function usePullOrder() {
  const pullData = async (): Promise<OrderData[]> => {

    const dbName = JSON.parse(localStorage.getItem('dbName') || 'null');
    if (!dbName) throw new Error('No database name found in local storage');

    // Pass to backend service
    const result = await pullOrder(dbName);
    return result.data;
  };

  return { pullData};
}

export function usePushProduct() {
  const pushData = async () => {

    const dbName = JSON.parse(localStorage.getItem('dbName') || 'null');
    if (!dbName) throw new Error('No database name found in local storage');

    const products: Product[] = [
      {
        stock_item_id: 0,
        sql_item_id: 1007,
        stock_code: "ITEM-007",
        name: "Toner",
        reserved_quantity: 30,
        sql_last_synced: "2025-07-25T10:30:00Z",
        description: "Main product item",
        is_active: true,
        has_stock_control: true,
        item_uom: [
          {
            uom: "PCS",
            rate: 1,
            ref_cost: 5.99,
            ref_price: 12.99,
            is_base_uom: true
          },
          {
            uom: "BOX",
            rate: 24,
            ref_cost: 120.00,
            ref_price: 280.00,
            is_base_uom: false
          }
        ]
      },
      {
        stock_item_id: 42,
        sql_item_id: 1010,
        stock_code: "ITEM-010",
        name: "Lotion",
        reserved_quantity: 10,
        sql_last_synced: "2025-07-25T11:15:00Z",
        description: "Secondary product",
        is_active: true,
        has_stock_control: false,
        item_uom: [
          {
            uom: "UNIT",
            rate: 1,
            ref_cost: 3.50,
            ref_price: 7.99,
            is_base_uom: true
          },
          {
            uom: "PACK",
            rate: 12,
            ref_cost: 35.00,
            ref_price: 85.00,
            is_base_uom: false
          }
        ]
      }
    ];

    // Pass to backend service
    await pushProduct({ dbName, stock_items: products });
  };

  return { pushData };
}