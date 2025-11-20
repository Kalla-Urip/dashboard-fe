import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Col, Descriptions, Drawer, Flex, Form, Input, message, Pagination, Popover, Row, Select, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import { tradeInService } from "../../../services/tradeIn.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import { userService } from "../../../services/user.service";
import RenderIf from "../../../components/RenderIf";
import { useTableHeight } from "../../../hooks/useTableHeight";
import SourceTradeInChart from "../../../components/charts/SourceTradeInChart";
import SalesTradeInChart from "../../../components/charts/SalesTradeInChart";
import UATradeInChart from "../../../components/charts/UATradeInChart copy";
import { downloadBlob } from "../../../utils/download copy";

const renderBadge = status => {

  const colors = {
    "Belum Dikerjakan": 'orange',
    "Low": 'yellow',
    "Medium": 'cyan',
    "Hot": "green",
    "Deal": "green",
    "Tidak Deal": "red"
  }

  return <Tag color={colors[status]} >{status}</Tag>
}

export function SpvSalesUI(){

  const [form] = Form.useForm()

  const queryClient = useQueryClient()

  const [messageApi, contextHolder] = message.useMessage();
  const tableHeight = useTableHeight()
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const [source, setSource] = useState('')
  const [popover,setPopover] = useState(false)
  const [statisticPopover,setStatisticPopover] = useState(false)
  const [statisticFilter, setStatisticFilter] = useState({
    startDate: null,
    endDate: null,
    source: null
  })
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null,
  })
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
    queryKey: ['tradein', dataParams, dateFilter],
    queryFn: () => tradeInService.getProgressData({...dataParams, ...dateFilter}),
    placeholderData: keepPreviousData,
  })

  const { data: statistic  } = useQuery({
    queryKey: ['statistic', statisticFilter],
    queryFn: () => tradeInService.getStatistic(statisticFilter),
    placeholderData: keepPreviousData,
    select: ({ data }) => data
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

  const handleResetFilterDate = () => {
    setDateFilter({ startDate: null, endDate: null })
    queryClient.invalidateQueries('service-data')
    setPopover(false)
  }

  const exportMutation = useMutation({
    mutationFn: (val) => tradeInService.exportAllData(val),
    onSuccess: ({ blob, filename }) => {
      downloadBlob(blob, filename)
      messageApi.success("Data berhasil diexport")
    }
  })


  return (
    <>
      {contextHolder}
      <Card
        title={`Statistik : ${statistic?.salesStatus?.totalTrade} Trade In`}
        style={{ marginBottom: 20 }}
        extra={
          <Flex gap={20} >
            <Popover
              placement="bottomRight"
              open={statisticPopover}
              arrow={false}
              trigger={'click'}
              styles={{
                body: {
                  width: 240
                }
              }}
              content={
                <>
                  <Form.Item style={{ margin: 0, marginBottom: 10 }} label="Mulai" layout="vertical" >
                    <Input
                      type="date"
                      value={statisticFilter.startDate}
                      onChange={e => setStatisticFilter({ ...statisticFilter, startDate: e.target.value })}
                    />
                  </Form.Item>
                  <Form.Item style={{ margin: 0, marginBottom: 10 }} label="Sampai" layout="vertical" >
                    <Input
                      type="date"
                      value={statisticFilter.endDate}
                      onChange={e => setStatisticFilter({ ...statisticFilter, endDate: e.target.value })}
                    />
                  </Form.Item>
                  <Flex gap={10} style={{ marginTop: 20 }} >
                    <Button onClick={() => setStatisticFilter({ ...statisticFilter, startDate: null, endDate: null })} block variant="outlined" color="danger" >
                      Reset
                    </Button>
                  </Flex>
                </>
              }
            >
              <Button onClick={() => setStatisticPopover(!statisticPopover)} variant="outlined" color="primary" >
                Filter Tanggal
              </Button>
            </Popover>
            <Select
              placeholder="Sumber"
              style={{ width: 180 }}
              options={['Service', 'Customer'].map(e => ({ label: e, value: e }))}
              allowClear
              onChange={(e) => setStatisticFilter({ ...statisticFilter, source: e })}
            />
          </Flex>
        }
      >
        <Row>
          <Col span={8} style={{ height: 220 }} >
            <Typography.Title level={5} >Sumber Trade In</Typography.Title>
            <SourceTradeInChart
              data={statistic}
            />
          </Col>
          <Col span={8} style={{ height: 220 }} >
            <Typography.Title level={5} >Sales</Typography.Title>
            <SalesTradeInChart
              data={statistic}
            />
          </Col>
          <Col span={8} style={{ height: 220 }} >
            <Typography.Title level={5} >UA</Typography.Title>
            <UATradeInChart
              data={statistic}
            />
          </Col>
        </Row>
      </Card>
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
          <Popover
            placement="bottomRight"
            open={popover}
            arrow={false}
            trigger={'click'}
            styles={{
              body: {
                width: 240
              }
            }}
            content={
              <>
                  <Form.Item style={{ margin: 0, marginBottom: 10 }} label="Mulai" layout="vertical" >
                    <Input
                      type="date"
                      value={dateFilter.startDate}
                      onChange={e => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                    />
                  </Form.Item>
                  <Form.Item style={{ margin: 0, marginBottom: 10 }} label="Sampai" layout="vertical" >
                    <Input
                      type="date"
                      value={dateFilter.endDate}
                      onChange={e => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                    />
                  </Form.Item>
                  <Flex gap={10} style={{ marginTop: 20 }} >
                    <Button onClick={handleResetFilterDate} block variant="outlined" color="danger" >
                      Reset
                    </Button>
                  </Flex>
              </>
            }
          >
            <Button onClick={() => setPopover(!popover)} variant="outlined" color="primary" >
              Filter Tanggal
            </Button>
          </Popover>
          <Select
            placeholder="Sumber"
            style={{ width: 180 }}
            options={['Service', 'Customer'].map(e => ({ label: e, value: e }))}
            allowClear
            onChange={(e) => setSource(e)}
          />
          <Button onClick={() => exportMutation.mutate({...dataParams, ...dateFilter })} variant="solid" color="primary" >
            Export
          </Button>
        </Flex>
        <Table
          bordered
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
                  {/* <Tag color="orange" style={{ marginTop: 5 }}  >
                    Belum Dikerjakan
                  </Tag> */}
                  {renderBadge(record.salesStatus ?? "Belum Dikerjakan")}
                </>
              )
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
              // width: 110,
              width: 80,
              align: 'center',
              fixed: 'right',
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
                showSearch
                optionFilterProp="label"
                disabled={detailTradeIn?.data?.salesStatus}
              />
            </Form.Item>
          </Form>
        </RenderIf>
      </Drawer>
    </>
  )
}