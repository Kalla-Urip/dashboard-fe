import { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Card, Flex, Input, Pagination, Select, Table, Tag, Typography } from "antd";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTableHeight } from "../../hooks/useTableHeight";
import { useNavigate } from "react-router";
import { customerService } from "../../services/customer.service";

export default function CustomerDataIndex(){

  const navigate = useNavigate()
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const tableHeight = useTableHeight()

  const [dataParams, setDataParams] = useState({
    limit: 10,
    page: 1,
    query: debouncedKeyword,
  })

  useEffect(() => {
    setDataParams({
      ...dataParams,
      query: debouncedKeyword
    })
  }, [debouncedKeyword])

  const { data: customers , isLoading, isRefetching } = useQuery({
    queryKey: ['customers', dataParams],
    queryFn: () => customerService.fetchAll(dataParams),
    placeholderData: keepPreviousData,
  })

  const handleChangePage = (page, pageSize) => {
    setDataParams({
      ...dataParams,
      limit: pageSize,
      page
    })
  }

  const pagination = customers?.pagination || { total: 0, page: 1 };

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
      </Flex>
      <Table
        size="small"
        pagination={false}
        dataSource={customers?.data}
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
            dataIndex: 'name',
            width: 180,
          },
          {
            title: 'No. Telepon',
            dataIndex: 'phone',
            width: 180
          },
          {
            title: 'Alamat',
            dataIndex: 'address',
            width: 180
          },
          {
            title: 'Perusahaan',
            dataIndex: 'company',
            width: 180
          },
          {
            className: 'last-cell-p',
            title: 'Aksi',
            width: 110,
            fixed: 'right',
            render: record => (
              <Button onClick={() => navigate(`/customer-data/detail/${record.id}`)} type="primary" >
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