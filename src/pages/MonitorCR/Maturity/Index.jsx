import { Button, Card, Flex, Input, message, Pagination, Select, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import { useTableHeight } from "../../../hooks/useTableHeight";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../../services/user.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import { customerRelationshipService } from "../../../services/customerRelationship.service";

export default function MaturityIndex(){

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const tableHeight = useTableHeight()
  const queryClient = useQueryClient()
  const [messageApi,contextHolder] = message.useMessage()

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

  const { data: reminder , isLoading, isRefetching } = useQuery({
    queryKey: ['reminder', dataParams],
    queryFn: () => customerRelationshipService.getInstallmentDuedate(dataParams),
    placeholderData: keepPreviousData,
  })

  const followUpMutation = useMutation({
    mutationFn: id => customerRelationshipService.followUpInstallmentDuedate(id),
    onSuccess: () => {
      queryClient.invalidateQueries('reminder')
      messageApi.success("Follow Up dikirim")
    },
    onError: err => console.log(err)
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

  const pagination = reminder?.pagination || { total: 0, page: 1 };

  return (
    <>
      {contextHolder}
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
          dataSource={reminder?.data}
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
              title: 'Tanggal Pembelian',
              dataIndex: 'deliveryDate',
              width: 160
            },
            {
              title: 'Nama Sales',
              dataIndex: 'sales',
              width: 120
            },
            {
              title: 'Status',
              dataIndex: 'salesStatus',
              render: val => <Tag color={val ? "green" : 'red'} >{val ? 'Selesai' : 'Belum '} Dikerjakan</Tag>,
              width: 120
            },
            {
              className: 'last-cell-p',
              title: 'Aksi',
              width: 140,
              fixed: 'right',
              render: (record) => (
                <Button disabled={record.status} onClick={() => followUpMutation.mutate(record.id)} type="primary" >
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