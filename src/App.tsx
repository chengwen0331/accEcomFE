import { useState } from 'react'
import './App.css'
import { Button, Modal, Input, Table, Tag } from '@douyinfe/semi-ui'
import '@douyinfe/semi-ui/dist/css/semi.min.css';
import { useBindECommerce, usePullOrder, usePushProduct } from './hooks/company';
import { Toaster, toast } from 'react-hot-toast';
import type { OrderData } from './types/order';
import type { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const { bind } = useBindECommerce();
  const { pushData } = usePushProduct();
  const { pullData } = usePullOrder();
  const [isSuccess, setIsSuccess] = useState(false);
  const [orders, setOrders] = useState<OrderData[]>([]);

  const handleBind = async () => {
    try {
       const result = await bind(accessKey, secretKey);
       setIsSuccess(result.success);

      if (result.success) {
        if (result.bindStatus === 'bind already') {
          toast.error("This company already bind with sql account", { duration: 2000 });
          setTimeout(() => setIsModalOpen(false), 200);
        } else {
          toast.success("Company successfully bound!");
          setTimeout(() => setIsModalOpen(false), 200);
        }
      }else{
        if (result.bindStatus === 'failed to decode access key') {
            toast.error("Please input valid access key and secret key", { duration: 2000 });
            setTimeout(() => setIsModalOpen(false), 200);
        }
      }

    } catch (err: any) {
      if (err?.message === 'bind to another company') {
            toast.error("This company already bind with other sql account", { duration: 2000 });
            setTimeout(() => setIsModalOpen(false), 200);
       }else{
        toast.error(err?.message || "Failed to bind company", { duration: 2000 });
        setTimeout(() => setIsModalOpen(false), 200);
       }
    }
  };

  const handlePush = async () => {
    try {
      await pushData();
      toast.success("Product successfully push to SQL Ecommerce", { duration: 2000 });
    } catch (err: any) {
      toast.error(err?.message || "Failed to push product data", { duration: 2000 });
    }
  };

  const handlePull = async () => {
    try {
      const result = await pullData();
      toast.success("Order successfully pulled from SQL Ecommerce", { duration: 2000 });
      console.log("order:", result)
      setOrders(result);
    } catch (err: any) {
      toast.error(err?.message || "Failed to pull order data", { duration: 2000 });
    }
  };

  const statusLabels: Record<number, string> = {
    0: "Unpaid",
    1: "To Ship",
    2: "Shipped",
    3: "Cancelled",
    4: "Returned",
    5: "Delivered",
    6: "Completed",
  };

const columns: ColumnProps<OrderData>[] = [
    {
      title: 'Order ID',
      key: 'order_id',
      width: 150,
      ellipsis: false,
      render: (_text, record) => record.data.order_id,
    },
    {
      title: 'Platform',
      key: 'platform',
      width: 120,
      ellipsis: false,
      render: (_text, record) => record.data.platform,
    },
    {
      title: 'Store',
      key: 'store_name',
      width: 200,
      ellipsis: false,
      render: (_text, record) => record.data.storeName,
    },
    {
      title: 'Customer',
      key: 'customer',
      width: 200,
      ellipsis: false,
      render: (_text, record) => record.data.customerName,
    },
    {
      title: 'Total',
      key: 'total',
      width: 150,
      ellipsis: false,
      render: (_text, record) => `${record.data.totalAmount} ${record.data.currency}`,
    },
    {
      title: 'Status',
      key: 'statuses',
      width: 200,
      ellipsis: false,
      render: (_text, record) =>
        <div style={{ display: 'flex', flexWrap: 'wrap', overflow: 'visible' }}>
          {Array.isArray(record.data.status)
            ? record.data.status.map((status: number, idx: number) => (
                <Tag key={idx} color="blue" style={{ marginRight: 4 }}>
                  {statusLabels[status] ?? `Unknown (${status})`}
                </Tag>
              ))
            : (
                <Tag color="blue">
                  {statusLabels[record.data.status] ?? `Unknown (${record.data.status})`}
                </Tag>
              )
          }
        </div>
    },
  ];

  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
      <div className="card">
        <div style={{ padding: 20 }}>
          {isSuccess ? (
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Button type="primary" onClick={handlePull}>Pull</Button>
              <Button type="primary" onClick={handlePush}>Push</Button>
            </div>
          ) : (
            <Button type="tertiary" onClick={() => setIsModalOpen(true)}>SQL E-Commerce</Button>
          )}
        </div>
      </div>

      <Modal
        title="Bind E-Commerce Account"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Access Key"
            showClear
            value={accessKey}
            onChange={value => setAccessKey(value)}
        />
        </div>
        <div style={{ marginBottom: 32 }}>
          <Input
            placeholder="Secret Key"
            showClear
            value={secretKey}
            onChange={value => setSecretKey(value)}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 16 }}>
          <Button type="primary" onClick={handleBind}>Bind</Button>
        </div>
      </Modal>

      {orders.length > 0 && (
      <Table
        columns={columns.map(col => ({ ...col, ellipsis: false }))}
        dataSource={orders}
        pagination={{ pageSize: 10 }}
        scroll={{ y: 400, x: 'max-content' }}
        bordered
        sticky
      />
    )}
      
    </>
  )
}

export default App
