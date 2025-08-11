import type { ApiResponse, OrderData } from "../types/order";
import type { Product } from "../types/product";

interface BindPayload {
  company_id: string;
  access_key: string;
  secret_key: string;
}

interface ProductPayload {
  dbName: string;
  stock_items: Product[];
}

export async function bindToBackend(payload: BindPayload) {
  console.log('Sending to backend:', payload);

  // Replace this with real API call:
  const response = await fetch('http://192.168.0.194:8081/v1/account/bind', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

   const data = await response.json();

   console.log("data", data)

   console.log("dbName", data.data.dbName)
   console.log("message", data.data.statusMsg)

  if (!response.ok) {
    if (data?.message && data.data.statusMsg == "another company") {
      return { success: false, bindStatus: data.data.statusMsg};
    }
    throw new Error(data?.message || 'Failed to bind to backend');
  }

  // if (data?.message && data.statusMsg.toLowerCase().includes('bind already')) {
  //     if (data?.dbName) {
  //       localStorage.setItem('dbName', data.dbName);
  //     }
  //     return { success: true, bindStatus: data.statusMsg };
  //   }

  localStorage.setItem('dbName', JSON.stringify(data.data.dbName));

  return { success: true, bindStatus: data.data.statusMsg };
}

export async function pushProduct(payload: ProductPayload) {
  console.log('Sending to backend:', payload.dbName);

  // Replace this with real API call:
  const response = await fetch('http://192.168.0.194:8081/v1/products/sql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to bind to backend');
  }

  const data = await response.json();

  return data;
}

export async function pullOrder(dbName: string): Promise<ApiResponse<OrderData[]>>  {
  console.log('Sending to backend:', dbName);

  // Replace this with real API call:
  const url = `http://192.168.0.194:8081/v1/orders/sql?dbName=${encodeURIComponent(dbName)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error('Failed to bind to backend');
  }

  const data: ApiResponse<OrderData[]> = await response.json();

  return data;
}
