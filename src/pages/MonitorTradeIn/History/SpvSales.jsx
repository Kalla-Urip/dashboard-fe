import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Badge, Button, Card, Descriptions, Drawer, Flex, Form, Input, Pagination, Select, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import { tradeInService } from "../../../services/tradeIn.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useTableHeight } from "../../../hooks/useTableHeight";
import { useNavigate } from "react-router";

export function SpvSalesUI(){

  const navigate = useNavigate()
  const tableHeight = useTableHeight()
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const [source, setSource] = useState('')
  const [dataParams, setDataParams] = useState({
    limit: 10,
    page: 1,
    query: debouncedKeyword,
    source
  })

  useEffect(() => {
    setDataParams((prev) => ({
      ...prev,
      query: debouncedKeyword,
      source
    }));
  }, [debouncedKeyword, source]);

  const { data: tradeInData , isLoading, isRefetching } = useQuery({
    queryKey: ['tradein', dataParams],
    queryFn: () => tradeInService.getFinishData(dataParams),
    placeholderData: keepPreviousData,
  })

  const pagination = tradeInData?.pagination || { total: 0, page: 1 };

  const handleChangePage = (page, pageSize) => {
    setDataParams({
      ...dataParams,
      limit: pageSize,
      page
    })
  }

  return (
    <>
      <Card>
        <Flex gap={20} style={{ marginBottom: 20 }} >
          <Input
            placeholder="cari..."
            style={{ width: 230, marginRight: 'auto' }}
            prefix={
              <Icon
                icon={'hugeicons:search-01'}
                width={20}
              />
            }
            onChange={e => setKeyword(e.target.value)}
            value={keyword}
          />
          <Select
            placeholder="Status"
            style={{ width: 180 }}
            options={['Berhasil', 'Gagal'].map(e => ({ label: e, value: e }))}
            allowClear
            onChange={(e) => setDataParams({ ...dataParams, status: e })}
          />
          <Select
            placeholder="Sumber"
            style={{ width: 180 }}
            options={['Service', 'Customer'].map(e => ({ label: e, value: e }))}
            allowClear
            onChange={(e) => setSource(e)}
          />
        </Flex>
        <Table
          bordered
          size="small"
          pagination={false}
          dataSource={tradeInData?.data}
          loading={isLoading || isRefetching}
          scroll={{ y: tableHeight }}
          columns={[
            {
              title: 'No',
              align: 'center',
              width: 40,
              fixed: 'left',
              render: (text, record, index) =>  index + 1,
            },
            {
              title: 'Sumber',
              dataIndex: 'source',
              width: 110,
              render: val => <Typography.Text style={{ color: val == 'Service' ? '#009E43' : '#FA9B25', fontWeight: 600 }} >{val}</Typography.Text>
            },
            {
              title: 'Plat & Nama',
              width: 150,
              render: record => (
                <>
                  <Typography.Text style={{ display: 'block', fontWeight: 600 }} >
                    {record.plateNumber}
                  </Typography.Text>
                  <Typography.Text style={{ display: 'block', fontWeight: 300 }} >
                    {record.ownerName}
                  </Typography.Text>
                </>
              )
            },
            {
              title: 'Tipe & Tahun',
              render: val => `${val.type} - ${val.year}`,
              width: 180
            },
            {
              title: 'Tanggal Diajukan',
              dataIndex: 'createdAt',
              width: 150
            },
            {
              title: 'Status Trust',
              width: 120,
              render: record => (
                <>
                  <Typography.Text style={{ display: 'block', fontWeight: 600 }} >
                    {record.salesName}
                  </Typography.Text>
                  <Tag color={record.salesStatus == 'Deal' ? "green" : 'red'} style={{ marginTop: 5 }}  >
                    {record.salesStatus}
                  </Tag>
                </>
              )
            },
            {
              className: 'last-cell-p',
              title: 'Aksi',
              width: 90,
              fixed: 'right',
              render: record => (
                <Flex gap={10} >
                  <Button onClick={() => navigate('/monitor-tradein/history/detail/'+record.id)} type="primary" >
                    Detail
                  </Button>
                </Flex>
              )
            },
          ]}
        />
        <Pagination
          style={{ marginInline: 24, marginTop: 16 }}
          total={pagination.total}
          showSizeChanger={{
            showSearch: false,
          }}
          pageSizeOptions={['10', '20', '50']}
          current={pagination.page}
          pageSize={dataParams.limit}
          align="end"
          onChange={handleChangePage}
        />
      </Card>
    </>
  )
  
}