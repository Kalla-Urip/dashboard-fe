import { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Card, Flex, Input, message, Modal, Pagination, Select, Table, Typography, Upload } from "antd";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useTableHeight } from "../../hooks/useTableHeight";
import { useNavigate } from "react-router";
import { salesService } from "../../services/sales.service";
import { userService } from "../../services/user.service";

export default function DataSalesIndex(){

  const navigate = useNavigate()
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const tableHeight = useTableHeight()
  const [excelUpload, setExcelUpload] = useState([])
  const [messageApi, contextHolder] = message.useMessage()
  const [openModal,setOpenModal] = useState(false)

  const [dataParams, setDataParams] = useState({
    limit: 10,
    page: 1,
    query: debouncedKeyword,
    sales: null
  })

  const { data: salesData , isLoading, isRefetching } = useQuery({
    queryKey: ['sales', dataParams],
    queryFn: () => salesService.fetchAll(dataParams),
    placeholderData: keepPreviousData,
  })

  const { data: salesUser } = useQuery({
    queryKey: ['sales-user'],
    queryFn: () => userService.getSales(),
  })

  const uploadMutation = useMutation({
    mutationFn: () => salesService.import(excelUpload[0]),
    onSuccess: () => {
      handleCloseModal()
      messageApi.success("Data berhasil diimport")
    }
  })

  useEffect(() => {
    setDataParams({
      ...dataParams,
      query: debouncedKeyword,
      page: 1,
    })
  }, [debouncedKeyword])

  const handleChangePage = (page, pageSize) => {
    setDataParams({
      ...dataParams,
      limit: pageSize,
      page
    })
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setExcelUpload([])
  }
  const pagination = salesData?.pagination || { total: 0, page: 1 };

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
            options={salesUser?.data?.map(e => ({ label: e.name, value: e.id }))}
            allowClear
            onChange={(e) => setDataParams({ ...dataParams, sales: e, page: 1 })}
          />
          <Button variant="solid" color="primary" onClick={() => setOpenModal(true)} >
            Import Data
          </Button>
        </Flex>
        <Table
          size="small"
          pagination={false}
          dataSource={salesData?.data}
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
                    {record?.plateNumber ?? ''}
                  </Typography.Text>
                  <Typography.Text style={{ display: 'block', fontWeight: 300 }} >
                    {record.owner}
                  </Typography.Text>
                </>
              )
            },
            {
              title: 'Tipe & Tahun',
              render: val => `${val.type} - ${val.year ?? ''}`,
              width: 160
            },
            {
              title: 'Nomor Rangka',
              dataIndex: 'chassisNumber',
              width: 180
            },
            {
              title: 'No Whatsapp',
              dataIndex: 'phone',
              align: 'center',
              width: 120
            },
            {
              title: 'Nama Sales',
              dataIndex: 'sales',
              render: val => <Typography.Text style={{ fontWeight: 500 }} >{val}</Typography.Text>,
              align: 'center',
              width: 180
            },
            {
              title: 'SPK',
              dataIndex: 'spk',
              width: 180
            },
            {
              className: 'last-cell-p',
              title: 'Aksi',
              width: 110,
              fixed: 'right',
              render: record => (
                <Button onClick={() => navigate(`/data-sales/detail/${record.id}`)} type="primary" >
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