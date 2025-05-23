import { useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Card, Flex, Input, Pagination, Select, Table, Typography } from "antd";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { tradeInService } from "../../services/tradeIn.service";
import { useTableHeight } from "../../hooks/useTableHeight";
import { useNavigate } from "react-router";

export default function DataTrustIndex(){

  const navigate = useNavigate()
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const [sales, setSales] = useState('')
  const tableHeight = useTableHeight()

  const [dataParams, setDataParams] = useState({
    limit: 10,
    page: 1,
    query: debouncedKeyword,
    sales
  })

  const { data: tradeInData , isLoading, isRefetching } = useQuery({
    queryKey: ['tradein', dataParams],
    queryFn: () => tradeInService.getDataTrust(dataParams),
    placeholderData: keepPreviousData,
  })

  const handleChangePage = (page, pageSize) => {
    setDataParams({
      ...dataParams,
      limit: pageSize,
      page
    })
  }

  const pagination = tradeInData?.pagination || { total: 0, page: 1 };

  return (
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
          placeholder="Nama Sales"
          style={{ width: 180 }}
          options={['Service', 'Customer'].map(e => ({ label: e, value: e }))}
          allowClear
          onChange={(e) => setSales(e)}
        />
      </Flex>
      <Table
        size="small"
        pagination={false}
        dataSource={tradeInData?.data}
        loading={isLoading || isRefetching}
        scroll={{ y: tableHeight }}
        columns={[
          {
            title: 'No',
            align: 'center',
            width: 80,
            fixed: 'left',
            render: (text, record, index) =>  index + 1,
          },
          {
            title: 'No Plat & Nama',
            width: 180,
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
            width: 160
          },
          {
            title: 'Nomor Rangka',
            dataIndex: 'chassisNumber',
            width: 180
          },
          {
            title: 'No Whatsapp',
            dataIndex: 'ownerPhone',
            align: 'center',
            width: 120
          },
          {
            title: 'Nama Trust',
            dataIndex: 'trustName',
            render: val => <Typography.Text style={{ fontWeight: 600 }} >{val}</Typography.Text>,
            align: 'center',
            width: 180
          },
          {
            className: 'last-cell-p',
            title: 'Aksi',
            width: 110,
            fixed: 'right',
            render: record => (
              <Button onClick={() => navigate(`/data-trust/detail/${record.id}`)} type="primary" >
                Detail
              </Button>
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
  )
}