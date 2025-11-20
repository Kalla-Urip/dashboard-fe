import { Button, Card, Divider, Drawer, Dropdown, Flex, Form, Input, message, Modal, Pagination, Popover, Select, Steps, Table, Tag, Typography, Upload } from "antd";
import { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react/dist/iconify.js";
import { serviceDataService } from "../../services/serviceData.service";
import { useTableHeight } from "../../hooks/useTableHeight";
import { stallService } from "../../services/stall.service";
import { userService } from "../../services/user.service";

export default function WorkshopMonitorIndex(){

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [messageApi, contextHolder] = message.useMessage()
  const [modalApi, modalHolder] = Modal.useModal()

  const [excelUpload, setExcelUpload] = useState([])
  const [vehicleStatus, setVehicleStatus] = useState({
    status: {},
    index: 0
  })
  const [openModal,setOpenModal] = useState(false)
  const [popover,setPopover] = useState(false)
  const [keyword, setKeyword] = useState("");
  const tableHeight = useTableHeight()
  const debouncedKeyword = useDebounce(keyword, 500);
  const [loadingId, setLoadingId] = useState()

  const [statusForm] = Form.useForm()

  const [drawerOpt, setDrawerOpt] = useState({
    open: false,
    id: null
  })

  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null,
  })

  const [dataParams, setDataParams] = useState({
    limit: 10,
    page: 1,
    query: debouncedKeyword,
    transferSales: null,
    mToyota: null,
  })

  const { data: stallData } = useQuery({
    queryKey: ['stall'],
    queryFn: () => stallService.fetchAllWithoutPaginate(),
    select: ({ data }) => data
  })

  const { data: mechanicData } = useQuery({
    queryKey: ['mechanic'],
    queryFn: () => userService.getMechanic(),
    select: ({ data }) => data
  })

  useEffect(() => {
    setDataParams((prev) => ({
      ...prev,
      query: debouncedKeyword
    }));
  }, [debouncedKeyword]);

  const { data: serviceData , isLoading, isRefetching } = useQuery({
    queryKey: ['service-data', dataParams, dateFilter],
    queryFn: () => serviceDataService.fetchAll({...dataParams, ...dateFilter}),
    placeholderData: keepPreviousData,
  })

  const uploadMutation = useMutation({
      mutationFn: () => serviceDataService.import(excelUpload[0]),
      onSuccess: () => {
        handleCloseModal()
        messageApi.success("Data berhasil diimport")
        queryClient.invalidateQueries('service-data')
      }
    })
  

  const pagination = serviceData?.pagination || { total: 0, page: 1 };

  const handleChangePage = (page, pageSize) => {
    setDataParams({
      ...dataParams,
      limit: pageSize,
      page
    })
  }

  const changeMutation = useMutation({
    mutationFn: (val) => serviceDataService.update(val),
    onSuccess: () => {
      messageApi.success("Data berhasil disimpan")
      queryClient.invalidateQueries('service-data')
      setLoadingId(null)
    } 
  })

  const changeStatusMutation = useMutation({
    mutationFn: (val) => serviceDataService.changeStatus(val),
    onSuccess: () => {
      messageApi.success("Data berhasil disimpan")
      queryClient.invalidateQueries('service-data')
      setLoadingId(null)
    },
    onError: ({ response }) => {
      const { data } = response
      messageApi.error(data.message || "Terjadi Kesalahan")
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (val) => serviceDataService.delete(val),
    onSuccess: () => {
      messageApi.success("Data berhasil dihapus")
      queryClient.invalidateQueries('service-data')
      setLoadingId(null)
    },
    onError: ({ response }) => {
      const { data } = response
      messageApi.error(data.message || "Terjadi Kesalahan")
    }
  })

  const handleChangeStall = (id, value) => {
    setLoadingId(id)
    changeMutation.mutate({ id, StallId: value ? value : null })
  }

  const handleChangeMechanic = (id, value) => {
    setLoadingId(id)
    changeMutation.mutate({ id, MechanicId: value ? value : null })
  }

  const changeStatus = (record) => {
    statusForm.setFieldsValue(record)
    setDrawerOpt({ open: true, id: record.id })
    const stats = {
      pending: record.statusses.find(e => e.status == 'Menunggu Konfirmasi').createdAt,
      confirmed: record.statusses.find(e => e.status == 'Dikonfirmasi')?.createdAt || null,
      onProggress: record.statusses.find(e => e.status == 'Mobil Diserahkan')?.createdAt || null,
      finish: record.statusses.find(e => e.status == 'Service Selesai')?.createdAt || null,
    }
    let statsIndex = 0
    switch (record.status) {
      case 'Menunggu Konfirmasi':
        statsIndex = 0
        break;
      case 'Dikonfirmasi':
        statsIndex = 1
        break;
      case 'Mobil Diserahkan':
        statsIndex = 2
        break;
      case 'Service Selesai':
        statsIndex = 3
        break;
    }
    setVehicleStatus({
      status: stats,
      index: statsIndex
    })
  }

  const handleChangeStatus = async (values) => {
    setLoadingId(drawerOpt.id)
    const res = await changeStatusMutation.mutateAsync({id: drawerOpt.id, ...values })
    console.log(res)
    handleCloseStatusDrawer()
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setExcelUpload([])
  }

  const handleResetFilterDate = () => {
    setDateFilter({ startDate: null, endDate: null })
    queryClient.invalidateQueries('service-data')
    setPopover(false)
  }

  const handleCloseStatusDrawer = () => {
    setDrawerOpt({ open: false, id: null })
    setVehicleStatus({
      index: 0,
      status: {}
    })
    statusForm.resetFields()
  }

  const handleDelete = record => {
    modalApi.confirm({
      title: "Pemberitahuan",
      content: `Yakin ingin menghapus data WAC dengan nomor plat ${record.plateNumber} ? `,
      centered: true,
      onOk: () => deleteMutation.mutate(record.id)
    })
  }

  return (
    <>
      {modalHolder}
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
            placeholder="Transfer Sales"
            options={['Ya', 'Tidak'].map(e => ({ label: e, value: e == 'Ya' }))}
            allowClear
            style={{ width: 150 }}
            onChange={val => setDataParams({ ...dataParams, transferSales: val })}
          />
          <Select
            placeholder="M-Toyota"
            options={['Sudah', 'Belum'].map(e => ({ label: e, value: e == 'Sudah' }))}
            allowClear
            style={{ width: 120 }}
            onChange={val => setDataParams({ ...dataParams, mToyota: val })}
          />
          <Button variant="solid" color="primary" onClick={() => setOpenModal(true)} >
            Import Data
          </Button>
        </Flex>
        <Table
          bordered
          size="small"
          pagination={false}
          dataSource={serviceData?.data}
          loading={isLoading || isRefetching}
          scroll={{ y: tableHeight }}
          columns={[
            {
              title: 'No',
              align: 'center',
              width: 50,
              fixed: 'left',
              render: (text, record, index) =>  index + 1,
            },
            {
              title: 'Tanggal Service',
              dataIndex: 'date',
              width: 120,
            },
            {
              title: 'No Plat & Nama',
              width: 170,
              fixed: 'left',
              render: record => (
                <>
                  <Typography.Text style={{ display: 'block', fontWeight: 600 }} >
                    {record.plateNumber}
                  </Typography.Text>
                  <Typography.Text style={{ display: 'block', fontWeight: 300 }} >
                    {record.owner}
                  </Typography.Text>
                </>
              )
            },
            {
              title: 'Tipe Tahun',
              dataIndex: 'typeYear',
              width: 210,
            },
            {
              title: 'Nomor Rangka',
              dataIndex: 'chassisNumber',
              align: 'center',
              width: 165,
            },
            {
              title: 'Transfer Sales',
              dataIndex: 'employeeType',
              align: 'center',
              width: 140,
            },
            {
              title: 'M Toyota',
              dataIndex: 'mToyota',
              align: 'center',
              width: 90,
              render: val => {
                return val ? <Tag color="green" >Sudah</Tag> : <Tag color="red" >Belum</Tag>
              }
            },
            {
              title: 'Status Kendaraan',
              dataIndex: 'status',
              width: 180,
              render: val => {
                const color = {
                  'Booking Service': 'blue',
                  'Konfirmasi Booking Service': 'blue',
                  'Penerimaan Service': 'cyan',
                  'Proses Service': 'cyan',
                  'Mobil Dicuci': 'green',
                  'Penyerahan Kendaraan': 'green',
                }
                return <Tag color={color[val]} >{val}</Tag>
              }
            },
            {
              title: 'Keterangan Pengerjaan',
              dataIndex: 'description',
              width: 180,
            },
            {
              title: 'Petugas',
              dataIndex: 'mechanic',
              align: 'center',
              width: 140,
              fixed: 'right',
              render: (val, record) => {
                return (
                  <Select
                    style={{ width: '100%' }}
                    options={mechanicData?.map(e => ({ label: e.name, value: e.id }))}
                    value={val}
                    onChange={(e) => handleChangeMechanic(record.id, e)}
                    loading={loadingId == record.id && changeMutation.isPending}
                    allowClear
                  />
                )
              }
            },
            {
              title: 'Stall',
              dataIndex: 'stall',
              align: 'center',
              width: 140,
              fixed: 'right',
              render: (val, record) => {
                return (
                  <Select
                    style={{ width: '100%' }}
                    options={stallData?.map(e => ({ label: e.name, value: e.id }))}
                    value={val}
                    onChange={(e) => handleChangeStall(record.id, e)}
                    loading={loadingId == record.id && changeMutation.isPending}
                    allowClear
                  />
                )
              }
            },
            {
              className: 'last-cell-p',
              title: 'Aksi',
              width: 185,
              fixed: 'right',
              render: (record) => (
                <Flex gap={10} >
                  <Button  onClick={() => navigate(`/workshop-monitor/detail/${record.id}`)} type="primary" >
                    Detail
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => changeStatus(record)}
                    icon={
                      <Icon
                        icon={'solar:clipboard-list-bold-duotone'}
                        width={18}
                      />
                    }
                  />
                  <Button
                    variant="outlined"
                    color="danger"
                    onClick={() => handleDelete(record)}
                    icon={
                      <Icon
                        icon={'solar:trash-bin-trash-bold-duotone'}
                        width={18}
                      />
                    }
                  />
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
      <Modal
        open={openModal}
        title="Import Data"
        centered
        okText="Upload"
        onOk={uploadMutation.mutate}
        okButtonProps={{ loading: uploadMutation.isPending }}
        cancelButtonProps={{ loading: uploadMutation.isPending }}
        onCancel={handleCloseModal}
      >
        <Upload.Dragger 
          fileList={excelUpload}
          style={{ paddingTop: '20px', paddingBottom: 20 }}  
          onRemove={() => setExcelUpload([])}
          beforeUpload={(file) => {
            if(file.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
              messageApi.error("Harap masukan file Excel")
              return
            }
            setExcelUpload([file])
          }}
        >
          <Icon
            icon="hugeicons:google-doc"
            style={{ marginBottom: -1, marginLeft: 0 }}
            width="32"
            height="32"
          />
          <Typography.Text style={{ display: 'block' }} >
            Tekan Atau seret file di sini untuk upload.
          </Typography.Text>
        </Upload.Dragger>
      </Modal>
      <Drawer
        open={drawerOpt.open}
        title="Status Kendaraan & Catatan tambahan"
        footer={
          <Flex gap={10} >
            <Button onClick={handleCloseStatusDrawer} block color="primary" variant="outlined" >
              Kembali
            </Button>
            <Button onClick={statusForm.submit} block color="primary" variant="solid" >
              Simpan
            </Button>
          </Flex>
        }
        onClose={handleCloseStatusDrawer}
      >
        <Form
          layout="vertical"
          form={statusForm}
          onFinish={handleChangeStatus}
        >
          <Form.Item name={'status'} label="Status Kendaraan" >
            <Select
              options={[
                // 'Booking Service',
                // 'Konfirmasi Booking Service',
                'Penerimaan Service',
                'Proses Service',
                'Mobil Dicuci',
                'Penyerahan Kendaraan'
              ].map(e => ({ label: e, value: e }))}
            />
          </Form.Item>
          <Form.Item name={'description'} label="Status Pengerjaan" >
            <Input.TextArea/>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}