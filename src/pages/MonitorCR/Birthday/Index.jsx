import { Button, Card, Flex, Input, Pagination, Select, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import { useTableHeight } from "../../../hooks/useTableHeight";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { userService } from "../../../services/user.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import { customerRelationshipService } from "../../../services/customerRelationship.service";

export default function BirthDayIndex(){

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const tableHeight = useTableHeight()

  const [dataParams, setDataParams] = useState({
    limit: 10,
    page: 1,
    query: debouncedKeyword,
    sales: null
  })

  const { data: salesData } = useQuery({
    queryKey: ['sales-user'],
    queryFn: () => userService.getSales(),
  })

  const { data: birthDay , isLoading, isRefetching } = useQuery({
    queryKey: ['birthDay', dataParams],
    queryFn: () => customerRelationshipService.getBirthDayCustomer(dataParams),
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    setDataParams({
      ...dataParams,
      query: debouncedKeyword
    })
  }, [debouncedKeyword])

  const handleChangePage = (page, pageSize) => {
    setDataParams({
      ...dataParams,
      limit: pageSize,
      page
    })
  }

  const pagination = birthDay?.pagination || { total: 0, page: 1 };

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
            placeholder="Nama Sales"
            style={{ width: 180 }}
            options={salesData?.data?.map(e => ({ label: e.name, value: e.id }))}
            allowClear
            onChange={(e) => setDataParams({ ...dataParams, sales: e })}
          />
          <Select
            placeholder="Status"
            style={{ width: 180 }}
            options={salesData?.data?.map(e => ({ label: e.name, value: e.id }))}
            allowClear
            onChange={(e) => setDataParams({ ...dataParams, sales: e })}
          />
        </Flex>
        <Table
          size="small"
          pagination={false}
          dataSource={birthDay?.data}
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
              title: 'Nama',
              width: 180,
              render: record => (
                <>
                  <Typography.Text style={{ display: 'block', fontWeight: 600 }} >
                    {record.name}
                  </Typography.Text>
                </>
              )
            },
            {
              title: 'Nomor Telepon',
              dataIndex: 'phone',
              width: 180
            },
            {
              title: 'Tanggal Lahir',
              dataIndex: 'birthDate',
              width: 160
            },
            {
              title: 'Nama Sales',
              dataIndex: 'sales',
              width: 120
            },
            {
              title: 'Status',
              dataIndex: 'sales',
              render: val => <Tag color="green" >Selesai</Tag>,
              width: 120
            },
            {
              className: 'last-cell-p',
              title: 'Aksi',
              width: 140,
              fixed: 'right',
              render: () => (
                <Button onClick={() => {}} type="primary" >
                  Kirim Notifikasi
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
    </>
  )
}