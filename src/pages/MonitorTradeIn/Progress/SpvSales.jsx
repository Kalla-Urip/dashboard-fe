import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Descriptions, Drawer, Flex, Form, Input, message, Pagination, Select, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import { tradeInService } from "../../../services/tradeIn.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import { userService } from "../../../services/user.service";
import RenderIf from "../../../components/RenderIf";
import { useTableHeight } from "../../../hooks/useTableHeight";

export function SpvSalesUI(){

  const [form] = Form.useForm()

  const queryClient = useQueryClient()

  const [messageApi, contextHolder] = message.useMessage();
  const tableHeight = useTableHeight()
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const [source, setSource] = useState('')
  const [drawerOpt, setDrawerOpt] = useState({
    action: null,
    id: null,
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
    queryFn: () => tradeInService.getProgressData(dataParams),
    placeholderData: keepPreviousData,
  })

  const { data: detailTradeIn } = useQuery({
    queryKey: ['tradein', drawerOpt.id],
    queryFn: () => tradeInService.getProgressDataById(drawerOpt.id),
    enabled: !!drawerOpt.id
  })

  useEffect(() => {
    if(drawerOpt.open && drawerOpt.action == 'Edit'){
      form.setFieldsValue(detailTradeIn?.data)
    }
  }, [detailTradeIn?.data, drawerOpt, form])

  const { data: salesData } = useQuery({
    queryKey: ['sales-user'],
    queryFn: () => userService.getSales(),
  })

  const assignMutation = useMutation({
    mutationFn: val => tradeInService.assignSales({ id: drawerOpt?.id, ...val }),
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
          scroll={{ y: tableHeight }}
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
              render: val => `${val.type} - ${val.year}`
            },
            {
              title: 'Tanggal Diajukan',
              dataIndex: 'createdAt',
            },
            {
              title: 'Status Sales',
              render: record => (
                <>
                  <Typography.Text style={{ display: 'block', fontWeight: 600 }} >
                    {record.salesName}
                  </Typography.Text>
                  <Tag color="cyan" style={{ marginTop: 5 }}  >
                    Sedang Diproses
                  </Tag>
                </>
              )
            },
            {
              className: 'last-cell-p',
              title: 'Aksi',
              width: 110,
              fixed: 'right',
              render: record => (
                <Flex gap={10} >
                  <Button onClick={() => setDrawerOpt({ id: record.id, open: true, action: 'Edit' })} variant="solid" style={{ backgroundColor: '#30B0C7', color: '#fff' }} >
                    Edit
                  </Button>
                  <Button onClick={() => setDrawerOpt({  id: record.id, open: true, action: 'Detail' })} type="primary" >
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
      <Drawer
        open={drawerOpt.open}
        title={drawerOpt.action != 'Detail' ? "Edit" : "Detail Progress"}
        onClose={handleCloseDrawer}
        footer={
          drawerOpt.action != 'Detail'
          &&
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
              children: <Typography.Text style={{ color: detailTradeIn?.data?.source == 'Service' ? '#009E43' : '#FA9B25' }} >{detailTradeIn?.data?.source}</Typography.Text>
            },
            {
              label: 'No Plat',
              children: detailTradeIn?.data?.plateNumber
            },
            {
              label: 'Nama',
              children: detailTradeIn?.data?.ownerName
            },
            {
              label: 'Tanggal Diajukan',
              children: detailTradeIn?.data?.createdAt
            },
            {
              label: 'Sales',
              children: detailTradeIn?.data?.salesName
            },
          ]}
        />
        <RenderIf when={drawerOpt.action != 'Detail'} >
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
        </RenderIf>
      </Drawer>
    </>
  )
}