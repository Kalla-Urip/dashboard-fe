import { Icon } from "@iconify/react";
import { Button, Card, Drawer, Flex, Input, Pagination, Table, Form, message, Select } from "antd";
import TableAction from "../../../components/TableAction";
import { useEffect, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { afterRequestHandler } from "../../../utils/afterRequestHandler";
import { testDriveVehicleService } from "../../../services/testDriveVehicle.service";
import { vehicleTypeService } from "../../../services/vehicleType.service";

export default function TestDriveVehicle(){

  const [form] = Form.useForm()

  const queryClient = useQueryClient()

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
      mutationFn: val => drawerOpt.id
      ? testDriveVehicleService.update({...val, id: drawerOpt.id})
      : testDriveVehicleService.store(val),
      ...afterRequestHandler(
        drawerOpt.id,
        messageApi,
         ()=> (() => {
          handleCloseDrawer()
          queryClient.invalidateQueries('vehicle')
        })()
      )
    })

  const deleteMutation = useMutation({
    mutationFn: val => testDriveVehicleService.delete(val),
    onSuccess: () => {
      queryClient.invalidateQueries('vehicle')
      messageApi.success('Data berhasil dihapus');
    }
  })

  const { data: vehicle , isLoading, isRefetching } = useQuery({
    queryKey: ['vehicle', dataParams],
    queryFn: () => testDriveVehicleService.fetchAll(dataParams),
    placeholderData: keepPreviousData,
  })

  const { data: vehicleType  } = useQuery({
    queryKey: ['vehicleType'],
    queryFn: () => vehicleTypeService.fetchWithoutPaginate(),
    placeholderData: keepPreviousData,
  })

  const { data: detailVehicleType } = useQuery({
    queryKey: ['detail-vehicle', drawerOpt.id],
    queryFn: () => testDriveVehicleService.getById(drawerOpt.id),
    enabled: !!drawerOpt.id
  })

  useEffect(() => {
    if(drawerOpt.id && detailVehicleType){
      form.setFieldsValue(detailVehicleType?.data)
    }
  }, [detailVehicleType, drawerOpt.id, form])

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
          <Button
            variant="solid"
            color="primary"
            onClick={() => setDrawerOpt({ open: true, id: null })}
            icon={
              <Icon
                icon={'hugeicons:add-01'}
                width={20}
              />
            }
          >
            Tambah Mobil
          </Button>
        </Flex>
        <Table
          size="small"
          pagination={false}
          dataSource={vehicle?.data}
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
              title: 'Jenis Kendaraan',
              dataIndex: 'vehicle',
            },
            {
              title: 'Tahun',
              dataIndex: 'year',
            },
            {
              className: 'last-cell-p',
              title: 'Aksi',
              align: 'right',
              width: 110,
              fixed: 'right',
              render: record => (
                <TableAction
                  onClickEdit={() => setDrawerOpt({ id: record.id, open: true })}
                  handleDelete={() => deleteMutation.mutate(record.id)}
                  deleteLoading={deleteMutation.isPending}
                />
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
        <Form
          form={form}
          layout="vertical"
          onFinish={submitMutation.mutate}
        >
          <Form.Item 
            label="Jenis Kendaraan" 
            name={'VehicleTypeId'} 
            rules={[{ required: true }]}
          >
            <Select
              options={vehicleType?.data.map(e => ({ label: e.name, value: e.id }))}
            />
          </Form.Item>
          <Form.Item 
            label="Tahun" 
            name={'year'} 
            rules={[{ required: true }]}
          >
            <Input/>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}