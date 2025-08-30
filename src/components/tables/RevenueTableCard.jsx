import { Typography, Table } from "antd";

const cardRadius = 6;

export default function RevenueTableCard({ title, data, availableOptions }) {
  const columns = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
      width: 60,
      align: 'left', // Left aligned
      render: (text) => (
        <span style={{ fontFamily: 'Lato', fontSize: 14, fontWeight: 400, color: '#000' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Nama Sales',
      dataIndex: 'name',
      key: 'name',
      align: 'left', // Left aligned
      render: (text) => (
        <span style={{ fontFamily: 'Lato', fontSize: 14, fontWeight: 400, color: '#000' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      align: 'center', // Left aligned
      render: (value) => (
        <span style={{ fontFamily: 'Lato', fontSize: 14, fontWeight: 600, color: '#000' }}>
          Rp {value.toLocaleString('id-ID')}
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
          <select style={{ borderRadius: 8, padding: '2px 12px', fontSize: 16, border: '1px solid #DFE3E8' }}>
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
    
    </div>
  );
}
