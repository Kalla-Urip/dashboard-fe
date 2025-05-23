import { Icon } from "@iconify/react/dist/iconify.js";
import { Avatar, Button, Card, Flex, Input, message, Modal, Pagination, Select, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crossSellingService } from "../../services/crossSelling.service";
import { useTableHeight } from "../../hooks/useTableHeight";

export default function CrossSellingBodyRepair(){

  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage();
  const [modalApi, modalHolder] = Modal.useModal();
  const [keyword, setKeyword] = useState("");
  const tableHeight = useTableHeight()
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

  const { data: crossSellingData , isLoading, isRefetching } = useQuery({
    queryKey: ['cross-selling', dataParams],
    queryFn: () => crossSellingService.getBodyRepairData(dataParams),
    placeholderData: keepPreviousData,
  })

  const followUpMutation = useMutation({
    mutationFn: (id) => crossSellingService.followUp(id),
    onSuccess: () => {
      messageApi.success("Berhasil")
      queryClient.invalidateQueries('cross-selling')
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

  const handleFollowUp = (id) => {
    modalApi.confirm({
      centered: true,
      icon: null,
      title: (
        <Flex vertical align="center"  >
          <Avatar size={120} style={{ backgroundColor: '#FFF8EB' }} >
            <Icon
              icon={'hugeicons:alert-circle'}
              width={90}
              style={{ marginBottom: -5 }}
              color="#F4770C"
            />
          </Avatar>
          <Typography.Text style={{ fontSize: 16, marginTop: 12 }} >
            Konfirmasi Follow Up
          </Typography.Text>
          <Typography.Text style={{ fontSize: 16, fontWeight: 300, marginTop: 8 }} >
            Pastikan anda telah menghubungi Customer
          </Typography.Text>
        </Flex>
      ),
      okText: 'Ya, Selesai',
      // eslint-disable-next-line no-unused-vars
      footer: (_,{ OkBtn, CancelBtn }) => {
        return (
          <Flex justify="center" >
            <CancelBtn/>
            <OkBtn />
          </Flex>
        )
      },
      onOk: () => followUpMutation.mutate(id)
    })
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
              width: 120
            },
            {
              title: 'Nomor Rangka',
              dataIndex: 'chassisNumber',
              width: 180
            },
            {
              title: 'Kondisi Body',
              dataIndex: 'bodyCondition',
              width: 320,
              render : val => {
                return (
                  <Flex gap={8} wrap >
                    {
                      val && Object.entries(val).map(e => {
                        let color = ''
                        switch (e[1]) {
                          case 'Normal':
                            color = 'green'
                            break;
                          case 'Lecet':
                            color = 'orange'
                            break;
                          case 'Penyok':
                            color = 'red'
                            break;
                        }
                        return <Tag color={color} >{e[0].replaceAll('_', ' ').toUpperCase()}</Tag>
                      })
                    }
                  </Flex>
                )
              }
            },
            {
              className: 'last-cell-p',
              title: 'Aksi',
              width: 110,
              fixed: 'right',
              render: record => (
                <Button onClick={() => handleFollowUp(record.id)} disabled={record.followUpStatus} type="primary" >
                  Follow Up
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
    </>
  )
}