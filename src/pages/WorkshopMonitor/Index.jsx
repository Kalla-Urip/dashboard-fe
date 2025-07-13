import { Button, Card, Flex, Input, message, Modal, Pagination, Select, Table, Tag, Typography } from "antd";
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

  const [keyword, setKeyword] = useState("");
  const tableHeight = useTableHeight()
  const debouncedKeyword = useDebounce(keyword, 500);
  const [loadingId, setLoadingId] = useState()
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
    queryKey: ['service-data', dataParams],
    queryFn: () => serviceDataService.fetchAll(dataParams),
    placeholderData: keepPreviousData,
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
      messageApi.success("Stall berhasil disimpan")
      queryClient.invalidateQueries('service-data')
      setLoadingId(null)
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
        </Flex>
        <Table
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
              width: 140,
            },
            {
              title: 'Nomor Rangka',
              dataIndex: 'chassisNumber',
              align: 'center',
              width: 140,
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
              width: 140,
              render: val => {
                return val ? <Tag color="green" >Sudah</Tag> : <Tag color="red" >Belum</Tag>
              }
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
              width: 110,
              fixed: 'right',
              render: (record) => (
                <Button onClick={() => navigate(`/workshop-monitor/detail/${record.id}`)} type="primary" >
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
    </>
  )
}