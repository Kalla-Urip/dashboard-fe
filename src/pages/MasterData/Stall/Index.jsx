import { Icon } from "@iconify/react";
import { Button, Card, Drawer, Flex, Input, Pagination, Table, Form, message } from "antd";
import TableAction from "../../../components/TableAction";
import { useEffect, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { afterRequestHandler } from "../../../utils/afterRequestHandler";
import { stallService } from "../../../services/stall.service";
import { breadcrumbStore } from "../../../store/breadcrumbStore";

export default function StallIndex(){

  const [form] = Form.useForm()

  const queryClient = useQueryClient()

  const { setTitle, setItems } = breadcrumbStore()

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
    setTitle("Stall")
    setItems([
      {
        title: 'Master Data'
      },
      {
        title: 'Stall'
      }
    ])
  }, [])

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
      ? stallService.update({...val, id: drawerOpt.id})
      : stallService.store(val),
      ...afterRequestHandler(
        drawerOpt.id,
        messageApi,
         ()=> (() => {
          handleCloseDrawer()
          queryClient.invalidateQueries('stall')
        })()
      )
    })

  const deleteMutation = useMutation({
    mutationFn: val => stallService.delete(val),
    onSuccess: () => {
      queryClient.invalidateQueries('stall')
      messageApi.success('Data berhasil dihapus');
    }
  })

  const { data: stall , isLoading, isRefetching } = useQuery({
    queryKey: ['stall', dataParams],
    queryFn: () => stallService.fetchAll(dataParams),
    placeholderData: keepPreviousData,
  })

  const { data: detailVehicleType } = useQuery({
    queryKey: ['detail-stall', drawerOpt.id],
    queryFn: () => stallService.getById(drawerOpt.id),
    enabled: !!drawerOpt.id
  })

  useEffect(() => {
    if(drawerOpt.id && detailVehicleType){
      form.setFieldsValue(detailVehicleType?.data)
    }
  }, [detailVehicleType, drawerOpt.id, form])

  const pagination = stall?.pagination || { total: 0, page: 1 };

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
            Tambah Stall
          </Button>
        </Flex>
        <Table
          size="small"
          pagination={false}
          dataSource={stall?.data}
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
              title: 'Stall',
              dataIndex: 'name',
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
            label="Stall" 
            name={'name'} 
            rules={[{ required: true }]}
          >
            <Input/>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}