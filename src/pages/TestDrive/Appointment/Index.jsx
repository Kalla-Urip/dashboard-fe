import { Icon } from "@iconify/react";
import { Button, Card, Drawer, Flex, Input, Pagination, Table, Form, message, Typography, Descriptions, Select } from "antd";
import { useEffect, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { testDriveService } from "../../../services/testDrive.service";
import { useTableHeight } from "../../../hooks/useTableHeight";

export default function AppoinmentIndex(){

  const [form] = Form.useForm()

  const queryClient = useQueryClient()
  const tableHeight = useTableHeight()

  const [messageApi, contextHolder] = message.useMessage();

  const [drawerOpt, setDrawerOpt] = useState({
    open: false,
    id: null
  })

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const [dataParams, setDataParams] = useState({
    limit: 10,
    page: 1,
    query: debouncedKeyword,
  })

  useEffect(() => {
    setDataParams((prev) => ({
      ...prev,
      query: debouncedKeyword
    }));
  }, [debouncedKeyword]);

  const handleCloseDrawer = () => {
    form.resetFields()
    setDrawerOpt({ open: false, id: null })
  }

  const submitMutation = useMutation({
    mutationFn: (val) => testDriveService.changeStatus(drawerOpt.id, val),
    onSuccess: () => {
      handleCloseDrawer()
      queryClient.invalidateQueries('vehicle')
      messageApi.success('Status disimpan');
    },
    onError: err => {
      console.log(err)
    }
  })

  // const deleteMutation = useMutation({
  //   mutationFn: val => testDriveService.delete(val),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries('vehicle')
  //     messageApi.success('Data berhasil dihapus');
  //   }
  // })

  const { data: vehicle , isLoading, isRefetching } = useQuery({
    queryKey: ['vehicle', dataParams],
    queryFn: () => testDriveService.findAllRequest(dataParams),
    placeholderData: keepPreviousData,
  })

  const { data: detailRequest } = useQuery({
    queryKey: ['detail-vehicle', drawerOpt.id],
    queryFn: () => testDriveService.requestDetail(drawerOpt.id),
    enabled: !!drawerOpt.id
  })

  useEffect(() => {
    if(drawerOpt.id && detailRequest){
      form.setFieldsValue(detailRequest?.data)
    }
  }, [detailRequest, drawerOpt.id, form])

  const pagination = vehicle?.pagination || { total: 0, page: 1 };

  const handleChangePage = (page, pageSize) => {
    setDataParams({
      ...dataParams,
      limit: pageSize,
      page
    })
  }

  return (
    <>
      {contextHolder}
      <Card>
        <Flex gap={20} style={{ marginBottom: 20 }} >
          <Input
            placeholder="cari..."
            style={{ width: 210, marginRight: 'auto' }}
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
              title: 'Jenis Kendaraan',
              dataIndex: 'vehicle',
              width: 180,
            },
            {
              title: 'Tahun',
              dataIndex: 'year',
              width: 90,
            },
            {
              title: 'Sales',
              dataIndex: 'sales',
              width: 150,
            },
            {
              title: 'Customer',
              dataIndex: 'customer',
              width: 150,
            },
            {
              title: 'Waktu',
              width: 210,
              render: val => (
                <Typography.Text>
                  {val.date}
                </Typography.Text>
              )
            },
            {
              className: 'last-cell-p',
              title: 'Aksi',
              align: 'right',
              width: 110,
              fixed: 'right',
              render: record => (
                <Button onClick={() => setDrawerOpt({ open: true, id: record.id })} variant="solid" color="primary" >
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
        title="Tambah Tipe Mobil"
        width={430}
        onClose={handleCloseDrawer}
        footer={
          <Flex gap={20} >
            <Button block onClick={() => form.submit()} type="primary" >
              Simpan
            </Button>
            <Button onClick={handleCloseDrawer} block variant="filled" color="danger" >
              Batal
            </Button>
          </Flex>
        }
      >
        <Descriptions
          style={{ marginBottom: 10 }}
          size="small"
          bordered
          column={2}
          layout="vertical"
          items={[
            {
              label: 'Nama Customer',
              children: detailRequest?.data?.customer
            },
            {
              label: 'Nomor',
              children: detailRequest?.data?.phone
            },
            {
              label: 'Mobil',
              children: detailRequest?.data?.vehicle
            },
            {
              label: 'Tahun',
              children: detailRequest?.data?.year
            },
            {
              label: 'Sales',
              children: detailRequest?.data?.sales
            },
            {
              label: 'Tanggal',
              children: detailRequest?.data?.date
            },
            {
              label: 'Waktu',
              children: detailRequest?.data?.time
            },
          ]}
        />
        <Form
          form={form}
          onFinish={submitMutation.mutate}
          layout="vertical"
        >
          <Form.Item
            label="Status"
            name={'status'}
            rules={[{ required: true }]}
          >
            <Select
              options={['Diterima', 'Ditolak'].map(e => ({ label: e, value: e }))}
              style={{ width: '100%'}}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}