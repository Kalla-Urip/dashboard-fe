import { Icon } from "@iconify/react/dist/iconify.js";
import { Avatar, Button, Card, Drawer, Flex, Form, Image, Input, message, Modal, Pagination, Popconfirm, Select, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crossSellingService } from "../../services/crossSelling.service";
import { useTableHeight } from "../../hooks/useTableHeight";

export default function CrossSellingTire(){

  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage();
  // const [modalApi, modalHolder] = Modal.useModal();
  const [keyword, setKeyword] = useState("");
  const tableHeight = useTableHeight()
  const debouncedKeyword = useDebounce(keyword, 500);
  const [dataParams, setDataParams] = useState({
    limit: 10,
    page: 1,
    query: debouncedKeyword,
  })

  const [drawerOpt, setDrawerOpt] = useState({
    open: false,
    id: null
  })

  const handleCloseDrawer = () => {
    form.resetFields()
    setDrawerOpt({ open: false, id: null })
  }

  useEffect(() => {
      setDataParams((prev) => ({
        ...prev,
        query: debouncedKeyword
      }));
    }, [debouncedKeyword]);

  const { data: crossSellingData , isLoading, isRefetching } = useQuery({
    queryKey: ['cross-selling', dataParams],
    queryFn: () => crossSellingService.getTireData(dataParams),
    placeholderData: keepPreviousData,
  })

  const submitMutation = useMutation({
    mutationFn: (body) => crossSellingService.followUp(drawerOpt.id, body),
    onSuccess: () => {
      messageApi.success("Berhasil")
      queryClient.invalidateQueries('cross-selling')
      handleCloseDrawer()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: val => crossSellingService.delete(val),
    onSuccess: () => {
      queryClient.invalidateQueries('cross-selling')
      messageApi.success('Data berhasil dihapus');
    }
  })

  const pagination = crossSellingData?.pagination || { total: 0, page: 1 };

  const handleChangePage = (page, pageSize) => {
    setDataParams({
      ...dataParams,
      limit: pageSize,
      page
    })
  }

  // const handleFollowUp = (body) => {
  //   modalApi.confirm({
  //     centered: true,
  //     icon: null,
  //     title: (
  //       <Flex vertical align="center"  >
  //         <Avatar size={120} style={{ backgroundColor: '#FFF8EB' }} >
  //           <Icon
  //             icon={'hugeicons:alert-circle'}
  //             width={90}
  //             style={{ marginBottom: -5 }}
  //             color="#F4770C"
  //           />
  //         </Avatar>
  //         <Typography.Text style={{ fontSize: 16, marginTop: 12 }} >
  //           Konfirmasi Follow Up
  //         </Typography.Text>
  //         <Typography.Text style={{ fontSize: 16, fontWeight: 300, marginTop: 8 }} >
  //           Pastikan anda telah menghubungi Customer
  //         </Typography.Text>
  //       </Flex>
  //     ),
  //     okText: 'Ya, Selesai',
  //     // eslint-disable-next-line no-unused-vars
  //     footer: (_,{ OkBtn, CancelBtn }) => {
  //       return (
  //         <Flex justify="center" >
  //           <CancelBtn/>
  //           <OkBtn />
  //         </Flex>
  //       )
  //     },
  //     onOk: () => followUpMutation.mutate(body)
  //   })
  // }

  return (
    <>
      {contextHolder}
      {/* {modalHolder} */}
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
        </Flex>
        <Table
          size="small"
          pagination={false}
          dataSource={crossSellingData?.data}
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
              title: 'Plat & Nama',
              width: 170,
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
              render: val => `${val.type} - ${val.year}`,
              width: 160
            },
            {
              title: 'Nomor Rangka',
              dataIndex: 'chassisNumber',
              width: 180
            },
            {
              title: 'Kondisi Ban',
              dataIndex: 'tireThicknessCondtion',
              width: 260,
              render : val => {
                return (
                  <Flex>
                    {
                      val && Object.entries(val).map(e => {
                        let color = ''
                        switch (e[1]) {
                          case 'Hijau':
                            color = 'green'
                            break;
                          case 'Kuning':
                            color = 'orange'
                            break;
                          case 'Merah':
                            color = 'red'
                            break;
                        }
                        return <Tag color={color} >{e[0].replace('_', ' ').toUpperCase()}</Tag>
                      })
                    }
                  </Flex>
                )
              }
            },
            {
              title: 'Catatan',
              dataIndex: 'note',
              width: 180
            },
            {
              className: 'last-cell-p',
              title: 'Aksi',
              width: 210,
              fixed: 'right',
              render: record => (
                <Flex gap={10} justify="end" >
                  <Button onClick={() => setDrawerOpt({ id: record.id, open: true })} disabled={record.followUpStatus} type="primary" >
                    Follow Up
                  </Button>
                  <Popconfirm
                    placement="right"
                    title="Pemberitahuan"
                    description="Yakin ingin menghapus data ini?"
                    okText="Hapus"
                    cancelText="Tidak"
                    onConfirm={() => deleteMutation.mutate(record.id)}
                    okButtonProps={{
                      loading: deleteMutation.isPending,
                      danger: true,
                    }}
                  >
                    <Button 
                      disabled={deleteMutation.isPending}
                      variant="solid" 
                      color="danger"
                      size=""
                    >
                      Hapus
                    </Button>
                  </Popconfirm>
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
        onClose={handleCloseDrawer}
        title="Tambah Tipe Mobil"
        footer={
          <Flex gap={20} >
            <Button block onClick={() => form.submit()} type="primary" >
              FollowUp
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
            label="Catatan" 
            name={'note'} 
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={5} />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}