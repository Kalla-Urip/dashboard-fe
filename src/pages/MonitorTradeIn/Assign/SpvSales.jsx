import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Descriptions, Drawer, Flex, Form, Input, message, Pagination, Select, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import { tradeInService } from "../../../services/tradeIn.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import { userService } from "../../../services/user.service";

export function SpvSalesUI(){

  const [form] = Form.useForm()

  const queryClient = useQueryClient()

  const [messageApi, contextHolder] = message.useMessage();
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const [source, setSource] = useState('')
  const [drawerOpt, setDrawerOpt] = useState({
    data: null,
    open: false
  })
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
    queryFn: () => tradeInService.getAssignData(dataParams),
    placeholderData: keepPreviousData,
  })

  const { data: salesData } = useQuery({
    queryKey: ['sales-user'],
    queryFn: () => userService.getSales(),
  })

  const assignMutation = useMutation({
    mutationFn: val => tradeInService.assignSales({ id: drawerOpt?.data?.id, ...val }),
    onSuccess: () => {
      queryClient.invalidateQueries('tradein')
      handleCloseDrawer()
      messageApi.success("Assign data berhasil")
    },
    onError: () => {
      messageApi.error("Terjadi Kesalahan")
    },
  })

  const pagination = tradeInData?.pagination || { total: 0, page: 1 };

  const handleChangePage = (page, pageSize) => {
    setDataParams({
      ...dataParams,
      limit: pageSize,
      page
    })
  }

  const handleCloseDrawer = () => {
    form.resetFields()
    setDrawerOpt({ open: false, data: null })
  }

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
            placeholder="Sumber"
            style={{ width: 180 }}
            options={['Service', 'Customer'].map(e => ({ label: e, value: e }))}
            allowClear
            onChange={(e) => setSource(e)}
          />
        </Flex>
        <Table
          size="small"
          pagination={false}
          dataSource={tradeInData?.data}
          loading={isLoading || isRefetching}
          columns={[
            {
              title: 'No',
              align: 'center',
              width: 80,
              fixed: 'left',
              render: (text, record, index) =>  index + 1,
            },
            {
              title: 'Sumber',
              dataIndex: 'source',
              width: 120,
              render: val => <Typography.Text style={{ color: val == 'Service' ? '#009E43' : '#FA9B25' }} >{val}</Typography.Text>
            },
            {
              title: 'Plat & Nama',
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
              render: val => `${val.type} - ${val.year}`
            },
            {
              title: 'No Whatsapp',
              dataIndex: 'ownerPhone',
            },
            {
              title: 'Tanggal Diajukan',
              dataIndex: 'createdAt',
            },
            {
              className: 'last-cell-p',
              title: 'Aksi',
              width: 110,
              fixed: 'right',
              render: record => (
                <Button onClick={() => setDrawerOpt({ data: record, open: true })} type="primary" >
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
      <Drawer
        open={drawerOpt.open}
        title="Assign"
        onClose={handleCloseDrawer}
        footer={
          <Button onClick={form.submit} block type="primary" >
            Assign
          </Button>
        }
      >
        <Descriptions
          bordered
          layout="vertical"
          size="small"
          column={1}
          style={{ marginBottom: 20 }}
          items={[
            {
              label: 'Sumber',
              children: <Typography.Text style={{ color: drawerOpt?.data?.source == 'Service' ? '#009E43' : '#FA9B25' }} >{drawerOpt?.data?.source}</Typography.Text>
            },
            {
              label: 'No Plat',
              children: drawerOpt.data?.plateNumber
            },
            {
              label: 'Nama',
              children: drawerOpt.data?.ownerName
            },
            {
              label: 'Tanggal Diajukan',
              children: drawerOpt.data?.createdAt
            },
          ]}
        />
        <Form 
          form={form}
          layout="vertical" 
          onFinish={assignMutation.mutate}
        >
          <Form.Item name={'salesId'} rules={[{ required: true }]} label="Sales" >
            <Select
              options={salesData?.data?.map(e => ({ label: e.name, value: e.id }))}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}