import { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Card, Flex, Input, Pagination, Select, Table, Tag, Typography } from "antd";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTableHeight } from "../../hooks/useTableHeight";
import { useNavigate } from "react-router";
import { vehicleService } from "../../services/vehicle.service";
import { userService } from "../../services/user.service";

export default function VehicleDataIndex(){

  const navigate = useNavigate()
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const tableHeight = useTableHeight()

  const [dataParams, setDataParams] = useState({
    limit: 10,
    page: 1,
    query: debouncedKeyword,
    sales: null
  })

  useEffect(() => {
    setDataParams({
      ...dataParams,
      query: debouncedKeyword
    })
  }, [debouncedKeyword])

  const { data: salesData } = useQuery({
    queryKey: ['sales-user'],
    queryFn: () => userService.getSales(),
  })

  const { data: vehicle , isLoading, isRefetching } = useQuery({
    queryKey: ['vehicle', dataParams],
    queryFn: () => vehicleService.fetchAll(dataParams),
    placeholderData: keepPreviousData,
  })

  const handleChangePage = (page, pageSize) => {
    setDataParams({
      ...dataParams,
      limit: pageSize,
      page
    })
  }

  const pagination = vehicle?.pagination || { total: 0, page: 1 };

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
          options={salesData?.data?.map(e => ({ label: e.name, value: e.id }))}
          allowClear
          onChange={(e) => setDataParams({ ...dataParams, sales: e })}
        />
      </Flex>
      <Table
        size="small"
        pagination={false}
        dataSource={vehicle?.data}
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
            title: 'Nomor Rangka',
            dataIndex: 'chassisNumber',
            width: 180
          },
          {
            title: 'type',
            dataIndex: 'type',
            render: val => <Tag>{val}</Tag>,
            width: 160
          },
          {
            title: 'Tahun',
            dataIndex: 'year',
            width: 90
          },
          {
            title: 'Nama Sales',
            dataIndex: 'salesName',
            render: val => <Typography.Text style={{ fontWeight: 600 }} >{val ?? '-'}</Typography.Text>,
            align: 'center',
            width: 180
          },
          {
            className: 'last-cell-p',
            title: 'Aksi',
            width: 110,
            fixed: 'right',
            render: record => (
              <Button onClick={() => navigate(`/vehicle-data/detail/${record.id}`)} type="primary" >
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