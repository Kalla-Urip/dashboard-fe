import { Button, Card, Dropdown, Flex, Form, Input, message, Modal, Pagination, Popover, Select, Table, Tag, Typography, Upload } from "antd";
import { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react/dist/iconify.js";
import { serviceDataService } from "../../services/serviceData.service";
import { useTableHeight } from "../../hooks/useTableHeight";

export default function WorkshopMonitorSAIndex(){

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [messageApi, contextHolder] = message.useMessage()
  const [modalApi, modalHolder] = Modal.useModal()

  const [excelUpload, setExcelUpload] = useState([])
  const [openModal,setOpenModal] = useState(false)
  const [popover,setPopover] = useState(false)
  const [keyword, setKeyword] = useState("");
  const tableHeight = useTableHeight()
  const debouncedKeyword = useDebounce(keyword, 500);
  const [loadingId, setLoadingId] = useState()

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

  useEffect(() => {
    setDataParams((prev) => ({
      ...prev,
      query: debouncedKeyword
    }));
  }, [debouncedKeyword]);

  const { data: serviceData , isLoading, isRefetching } = useQuery({
    queryKey: ['service-data', dataParams, dateFilter],
    queryFn: () => serviceDataService.getDataForSa({...dataParams, ...dateFilter}),
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
    mutationFn: (val) => serviceDataService.tradeIn(val),
    onSuccess: () => {
      messageApi.success("Data berhasil disimpan")
      queryClient.invalidateQueries('service-data')
      setLoadingId(null)
    } 
  })

  const handleTradeIn = (id) => {
    modalApi.confirm({
      centered: true,
      title: 'Konfirmasi',
      content: 'Apakah anda yakin perubahan ini ?',
      onOk: () => changeMutation.mutate(id)
    })
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setExcelUpload([])
  }

  // const handleFilterDate = () => {
  //   queryClient.invalidateQueries('service-data')
  //   setPopover(false)
  // }

  const handleResetFilterDate = () => {
    setDateFilter({ startDate: null, endDate: null })
    queryClient.invalidateQueries('service-data')
    setPopover(false)
  }

  return (
    <>
      {contextHolder}
      {modalHolder}
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
              title: 'M Toyota',
              dataIndex: 'mToyota',
              align: 'center',
              width: 90,
              render: val => {
                return val ? <Tag color="green" >Sudah</Tag> : <Tag color="red" >Belum</Tag>
              }
            },
            {
              className: 'last-cell-p',
              title: 'Aksi',
              width: 90,
              fixed: 'right',
              render: (record) => (
                <Button onClick={() => handleTradeIn(record.id)} type="primary" >
                  TradeIn
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
    </>
  )
}