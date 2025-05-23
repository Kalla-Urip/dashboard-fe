import { Icon } from "@iconify/react";
import { Button, Card, Flex, Input, Pagination, Table, Select, message } from "antd";
import TableAction from "../../../components/TableAction";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../../services/user.service";
import useDebounce from "../../../hooks/useDebounce";

const employeeTypes = [
  'SPV Sales',
  'Sales',
  'SPV Trust',
  'Trust',
  'Bengkel',
]

export default function UserRoleIndex(){

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const [messageApi, contextHolder] = message.useMessage();
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const [employeeType, setEmployeeType] = useState()
  const [dataParams, setDataParams] = useState({
    limit: 10,
    page: 1,
    query: debouncedKeyword,
    employeeType
  })

  useEffect(() => {
    setDataParams((prev) => ({
      ...prev,
      query: debouncedKeyword
    }));
  }, [debouncedKeyword]);

  useEffect(() => {
    setDataParams((prev) => ({
      ...prev,
      employeeType
    }));
  }, [employeeType]);

  const deleteMutation = useMutation({
    mutationFn: val => userService.delete(val),
    onSuccess: () => {
      queryClient.invalidateQueries('users')
      messageApi.success('Data berhasil dihapus');
    }
  })

  const { data: usersData , isLoading, isRefetching } = useQuery({
    queryKey: ['users', dataParams],
    queryFn: () => userService.fetchAll(dataParams),
    placeholderData: keepPreviousData,
  })

  const pagination = usersData?.pagination || { total: 0, page: 1 };

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
            placeholder="Tipe Pegawai"
            style={{ width: 180 }}
            options={employeeTypes.map(e => ({ label: e, value: e }))}
            allowClear
            onChange={val => setEmployeeType(val)}
          />
          <Button
            variant="solid"
            color="primary"
          onClick={() => navigate('/master-data/user-role/create')}
            icon={
              <Icon
                icon={'hugeicons:add-01'}
                width={20}
              />
            }
          >
            Tambah User
          </Button>
        </Flex>
        <Table
          size="small"
          pagination={false}
          dataSource={usersData?.data}
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
              title: 'NIK Pegawai',
              dataIndex: 'nik',
              width: 180
            },
            {
              title: 'Nama Lengkap',
              dataIndex: 'name',
            },
            {
              title: 'Telepon',
              dataIndex: 'phone',
            },
            {
              title: 'Tipe Pegawai',
              dataIndex: 'employeeType',
              width: 160,
              align: 'center'
            },
            {
              className: 'last-cell-p',
              title: 'Aksi',
              align: 'right',
              width: 110,
              fixed: 'right',
              render: record => (
                <TableAction
                  onClickEdit={() => navigate('/master-data/user-role/detail/'+record.id)}
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
    </>
  )
}