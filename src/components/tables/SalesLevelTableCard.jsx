import { Typography, Table } from "antd";

const cardRadius = 6;

export default function SalesLevelTableCard({ title, data, availableOptions }) {
  const columns = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
      width: 60,
      align: 'left', // Changed to left aligned
      render: (text) => (
        <span style={{
          fontFamily: 'Lato',
          fontSize: 14,
          fontWeight: 600,
          color: '#000'
        }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Nama Sales',
      dataIndex: 'namaSales',
      key: 'namaSales',
      align: 'left', // Changed to left aligned
      render: (text) => (
        <span style={{
          fontFamily: 'Lato',
          fontSize: 14,
          fontWeight: 400, // Not bold for nama sales
          color: '#000'
        }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Deal',
      dataIndex: 'deal',
      key: 'deal',
      align: 'center',
      render: (text) => (
        <span style={{
          fontFamily: 'Lato',
          fontSize: 14,
          fontWeight: 600, // Bold for other columns
          color: '#000'
        }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Hot',
      dataIndex: 'hot',
      key: 'hot',
      align: 'center',
      render: (text) => (
        <span style={{
          fontFamily: 'Lato',
          fontSize: 14,
          fontWeight: 600,
          color: '#000'
        }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Medium',
      dataIndex: 'medium',
      key: 'medium',
      align: 'center',
      render: (text) => (
        <span style={{
          fontFamily: 'Lato',
          fontSize: 14,
          fontWeight: 600,
          color: '#000'
        }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Low',
      dataIndex: 'low',
      key: 'low',
      align: 'center',
      render: (text) => (
        <span style={{
          fontFamily: 'Lato',
          fontSize: 14,
          fontWeight: 600,
          color: '#000'
        }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Tidak Deal',
      dataIndex: 'tidakDeal',
      key: 'tidakDeal',
      align: 'center',
      render: (text) => (
        <span style={{
          fontFamily: 'Lato',
          fontSize: 14,
          fontWeight: 600,
          color: '#000'
        }}>
          {text}
        </span>
      ),
    },
  ];

  return (
    <div style={{ 
      background: '#fff', 
      borderRadius: cardRadius, 
      boxShadow: '0 2px 8px 0 rgba(99,115,129,0.08)', 
      padding: 18,
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%' 
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title level={5} style={{ margin: 0, fontFamily: 'Lato', fontWeight: 600, fontSize: 18 }}>
          {title}
        </Typography.Title>
        <div style={{ marginLeft: 'auto' }}>
          <select style={{ borderRadius: 8, padding: '4px 12px', fontSize: 16, border: '1px solid #DFE3E8' }}>
            {availableOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Table */}
      <div style={{ flex: 1 }}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 4,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: false,
            style: {
              marginTop: 16,
            },
          }}
          rowKey="no"
          size="small"
        />
      </div>
      
      <style jsx global>{`
        .ant-table-thead > tr > th {
          background-color: #00CA52 !important;
          color: #fff !important;
          font-family: 'Lato' !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          text-align: center !important;
          border: none !important;
        }
        .ant-table-thead > tr > th:nth-child(1),
        .ant-table-thead > tr > th:nth-child(2) {
          text-align: left !important;
        }
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid #F2F4F7 !important;
          padding: 12px 8px !important;
        }
        .ant-table-tbody > tr:hover > td {
          background-color: #F9FAFB !important;
        }
        .ant-pagination-item-active {
          background-color: #E8F5E8 !important;
          border-color: #00CA52 !important;
        }
        .ant-pagination-item-active a {
          color: #00CA52 !important;
        }
      `}</style>
    </div>
  );
}
