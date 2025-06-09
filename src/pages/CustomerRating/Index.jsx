import { Button, Card, Descriptions, Drawer, Flex, Input, Pagination, Select, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react/dist/iconify.js";
import { customerRating } from "../../services/customerRating.service";
import useDebounce from "../../hooks/useDebounce";
import { useTableHeight } from "../../hooks/useTableHeight";

export default function CustomerRatingIndex(){

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const tableHeight = useTableHeight()

  const [dataParams, setDataParams] = useState({
    limit: 10,
    page: 1,
    query: debouncedKeyword,
  })

  const [selectedData, setSelectedData] = useState({
    open: false,
    data: null
  })

  const { data: rating , isLoading, isRefetching } = useQuery({
    queryKey: ['rating', dataParams],
    queryFn: () => customerRating.fetchALl(dataParams),
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    setDataParams({
      ...dataParams,
      query: debouncedKeyword
    })
  }, [debouncedKeyword])

  const handleChangePage = (page, pageSize) => {
    setDataParams({
      ...dataParams,
      limit: pageSize,
      page
    })
  }

  const pagination = rating?.pagination || { total: 0, page: 1 };

  return (
    <>
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
          dataSource={rating?.data}
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
                    {record.plateNumber}
                  </Typography.Text>
                  <Typography.Text style={{ display: 'block', fontWeight: 300 }} >
                    {record.name}
                  </Typography.Text>
                </>
              )
            },
            {
              title: 'Tipe & Tahun',
              render: val => `${val.type} - ${val.year}`,
              width: 180
            },
            {
              title: 'No Telepon',
              dataIndex: 'phone',
              width: 160
            },
            {
              title: 'Tanggal',
              dataIndex: 'createdAt',
              width: 120
            },
            {
              title: 'Rating',
              dataIndex: 'rating',
              render: val => <Tag >{val}</Tag>,
              width: 90
            },
            {
              className: 'last-cell-p',
              title: 'Aksi',
              width: 140,
              fixed: 'right',
              render: (data) => (
                <Button onClick={() => setSelectedData({ open: true, data })} type="primary" >
                  Lihat Masukan
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
        open={selectedData.open}
        title="Detail Masukan"
        onClose={() => setSelectedData({ open: false, data: null })}
        closable
      >
        <Descriptions
          size="small"
          bordered
          layout="vertical"
          items={[
            {
              label: 'Saran & Masukan',
              children: selectedData.data?.message
            }
          ]}
        />
      </Drawer>
    </>
  )
}