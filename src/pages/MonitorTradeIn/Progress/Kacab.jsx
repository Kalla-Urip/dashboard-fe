import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Badge, Button, Card, Descriptions, Drawer, Flex, Form, Input, message, Pagination, Select, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import { tradeInService } from "../../../services/tradeIn.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import { userService } from "../../../services/user.service";
import RenderIf from "../../../components/RenderIf";
import { useTableHeight } from "../../../hooks/useTableHeight";
import pallete from "../../../utils/pallete";

const renderBadge = status => {

  const colors = {
    "Belum Dikerjakan": 'orange',
    "Low": 'orange',
    "Medium": 'cyan',
    "Hot": "green",
    "Deal": "green",
    "Tidak Deal": "red",
    "Taksasi": 'cyan'
  }

  return <Tag color={colors[status]} >{status}</Tag>
}

export function KacabUI(){

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

  const { data: spvTrustData } = useQuery({
    queryKey: ['spv-trust-user'],
    queryFn: () => userService.getSpvTrust(),
  })

  const { data: spvSalesData } = useQuery({
    queryKey: ['spv-sales-user'],
    queryFn: () => userService.getSpvSales(),
  })

  const assignMutation = useMutation({
    mutationFn: val => tradeInService.assignSpv({ id: drawerOpt?.id, ...val }),
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
              width: 150,
              render: val => `${val.type} - ${val.year}`
            },
            {
              title: 'Tanggal Diajukan',
              dataIndex: 'createdAt',
              width: 150,
              align: 'center',
            },
            {
              title: 'Status Sales',
              children: [
                {
                  title: 'SPV',
                  width: 150,
                  align: 'center',
                  render: record => (
                    <>
                      <Typography.Text style={{ display: 'block' }} >
                        {record.spvSalesName}
                      </Typography.Text>
                    </>
                  )
                },
                {
                  title: 'Sales',
                  width: 150,
                  align: 'center',
                  render: record => (
                    <>
                      <RenderIf when={record?.salesName} >
                        <Typography.Text style={{ display: 'block' }} >
                          {record.salesName}
                        </Typography.Text>
                        {renderBadge(record.salesStatus ?? "Belum Dikerjakan")}
                      </RenderIf>
                      <RenderIf when={!record.salesName} >
                        <Tag color="orange" style={{ marginTop: 5 }}  >
                          Sales Belum ditunjuk
                        </Tag>
                      </RenderIf>
                    </>
                  )
                },
              ]
            },
            {
              title: 'Status Trust',
              children: [
                {
                  title: 'SPV',
                  width: 150,
                  align: 'center',
                  render: record => (
                    <>
                      <Typography.Text style={{ display: 'block' }} >
                        {record.spvTrustName}
                      </Typography.Text>
                    </>
                  )
                },
                {
                  title: 'UA',
                  width: 150,
                  align: 'center',
                  render: record => (
                    <>
                      <RenderIf when={record.trustName} >
                        <Typography.Text style={{ display: 'block' }} >
                          {record.trustName}
                        </Typography.Text>
                        {renderBadge(record?.trustStatus ?? "Belum Dikerjakan")}
                      </RenderIf>
                      <RenderIf when={!record.trustName} >
                        <Tag color="orange" style={{ marginTop: 5 }}  >
                          UA Belum ditunjuk
                        </Tag>
                      </RenderIf>
                    </>
                  )
                }
              ],
            },
            {
              className: 'last-cell-p',
              title: 'Aksi',
              // width: 150,
              width: 80,
              fixed: 'right',
              align: 'center',
              render: record => (
                <Flex gap={10} >
                  <Button onClick={() => setDrawerOpt({ id: record.id, open: true, action: 'Edit' })} variant="solid" style={{ backgroundColor: '#30B0C7', color: '#fff' }} >
                    Edit
                  </Button>
                  {/* <Button onClick={() => setDrawerOpt({  id: record.id, open: true, action: 'Detail' })} type="primary" >
                    Detail
                  </Button> */}
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
          <Button disabled={detailTradeIn?.data?.trustName && detailTradeIn?.data?.salesName} onClick={form.submit} block type="primary" >
            Assign
          </Button>
        }
      >
        {/* <Descriptions
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
              label: 'Status Sales',
              children: (
                <>
                  <Typography.Text style={{ display: 'block', fontWeight: 600 }} >
                    {detailTradeIn?.data?.spvSalesName}
                  </Typography.Text>
                  <RenderIf when={detailTradeIn?.data?.salesName} >
                    {renderBadge(detailTradeIn?.data?.salesStatus)}
                  </RenderIf>
                  <RenderIf when={!detailTradeIn?.data?.salesName} >
                    <Tag color="orange" style={{ marginTop: 5 }}  >
                      Sales belum ditunjuk
                    </Tag>
                  </RenderIf>
                </>
              )
            },
            ...(detailTradeIn?.data?.salesName
            ? [
                {
                  label: 'Sales',
                  children: detailTradeIn?.data?.salesName,
                },
              ]
            : []),
            {
              label: 'Status Trust',
              children: (
                <>
                  <Typography.Text style={{ display: 'block', fontWeight: 600 }} >
                    {detailTradeIn?.data?.spvTrustName}
                  </Typography.Text>
                  <RenderIf when={detailTradeIn?.data?.trustName} >
                    {renderBadge(detailTradeIn?.data?.trustStatus)}
                  </RenderIf>
                  <RenderIf when={!detailTradeIn?.data?.trustName} >
                    <Tag color="orange" style={{ marginTop: 5 }}  >
                      UA belum ditunjuk
                    </Tag>
                  </RenderIf>
                </>
              )
            },
            ...(detailTradeIn?.data?.trustName
            ? [
                {
                  label: 'Trust',
                  children: detailTradeIn?.data?.trustName,
                },
              ]
            : []),
          ]}
        /> */}
        <RenderIf when={drawerOpt.action != 'Detail'} >
          <RenderIf when={detailTradeIn?.data?.salesName || detailTradeIn?.data?.trustName} >
            <Alert
              type="warning"
              style={{ padding: '11px 14px', marginBottom: 15 }}
              description={
                <Typography.Text style={{ color: pallete.grey[700] }} >
                  SPV tidak bisa diubah karna sales telah ditugaskan
                </Typography.Text>
              }
              showIcon
              icon={
                <Icon
                  icon={'hugeicons:alert-circle'}
                />
              }
            />
          </RenderIf>
          <Form 
            form={form}
            layout="vertical" 
            onFinish={assignMutation.mutate}
          >
            <Form.Item name={'spvTrustId'} rules={[{ required: true }]} label="SPV Trust" >
              <Select
                options={spvTrustData?.data?.map(e => ({ label: e.name, value: e.id }))}
                disabled={detailTradeIn?.data?.trustName}
              />
            </Form.Item>
            <Form.Item 
              name={'spvSalesId'} 
              rules={[{ required: true }]} 
              label="SPV Sales"
            >
              <Select
                options={spvSalesData?.data?.map(e => ({ label: e.name, value: e.id }))}
                disabled={detailTradeIn?.data?.salesName}
              />
            </Form.Item>
          </Form>
        </RenderIf>
      </Drawer>
    </>
  )
}