import { Typography, Table, Empty } from "antd";

const cardRadius = 6;

export default function SAMetricTableCard({ 
  title, 
  data, 
  availableOptions, 
  selectedMonth, 
  onMonthChange 
}) {
  const handleSelectChange = (e) => {
    if (onMonthChange) {
      onMonthChange(parseInt(e.target.value));
    }
  };

  const columns = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
      width: 64,
      align: 'center',
      render: (value) => (
        <span style={{ fontFamily: 'Lato', fontSize: 14, fontWeight: 600, color: '#000' }}>
          {value}
        </span>
      ),
    },
    {
      title: 'Nama SA',
      dataIndex: 'namaSA',
      key: 'namaSA',
      align: 'left',
      render: (text) => (
        <span style={{ fontFamily: 'Lato', fontSize: 14, fontWeight: 400, color: '#000' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Jumlah',
      dataIndex: 'jumlah',
      key: 'jumlah',
      align: 'center',
      render: (value) => (
        <span style={{ fontFamily: 'Lato', fontSize: 14, fontWeight: 600, color: '#000' }}>
          {value}
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
          <select 
            style={{ borderRadius: 8, padding: '2px 12px', fontSize: 16, border: '1px solid #DFE3E8' }}
            value={selectedMonth || ""}
            onChange={handleSelectChange}
          >
            <option value="">Select Month</option>
            {availableOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Table */}
      <div style={{ flex: 1 }}>
        {data && data.length > 0 ? (
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
        ) : (
          <div style={{ padding: '40px 0' }}>
            <Empty 
              description={
                <div style={{ textAlign: 'center' }}>
                  <Typography.Text style={{
                    fontFamily: 'Lato',
                    fontSize: 16,
                    fontWeight: 400,
                    color: '#637381',
                    display: 'block'
                  }}>
                    Data tidak tersedia
                  </Typography.Text>
                  <Typography.Text style={{
                    fontFamily: 'Lato',
                    fontSize: 14,
                    fontWeight: 400,
                    color: '#919EAB',
                    marginTop: 8,
                    display: 'block'
                  }}>
                    Silakan pilih bulan lain
                  </Typography.Text>
                </div>
              }
            />
          </div>
        )}
      </div>
    
    </div>
  );
}
