import { useQuery } from "@tanstack/react-query";
import { Button, Card, Descriptions, Pagination, Table } from "antd";
import { vehicleService } from "../../services/vehicle.service";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import pallete from "../../utils/pallete";
import { useTableHeight } from "../../hooks/useTableHeight";

export default function VehicleDataDetail(){

  const { id } = useParams()

  const tableHeight = useTableHeight()
  const navigate = useNavigate()

  const [dataParams, setDataParams] = useState({
    limit: 10,
    page: 1,
  })

  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ['detail', dataParams],
    queryFn: () => vehicleService.getById(dataParams, id),
    enabled: !!id,
    select: data => data.data
  })

  const pagination = data?.pagination || { total: 0, page: 1 };

  const handleChangePage = (page, pageSize) => {
    setDataParams({
      ...dataParams,
      limit: pageSize,
      page
    })
  }

  console.log(data)

  return (
    <>
      <Card>
        <Card
          style={{ border: 0 }}
          styles={{
            body: {
              backgroundColor: pallete.grey[100],
              padding: 8
            }
          }}
        >
          <Descriptions
            layout="vertical"
            colon={false}
            size="small"
            column={5}
            items={[
              {
                label: 'No Plat & Nama',
                children: `${data?.vehicle?.plateNumber} ${data?.vehicle?.name}`
              },
              {
                label: 'Nomor Rangka',
                children: data?.vehicle?.chassisNumber
              },
              {
                label: 'Tipe & Tahun',
                children: `${data?.vehicle?.type} ${data?.vehicle?.year}`
              },
              {
                label: 'Tanggal Lahir',
                children: data?.vehicle?.birthDate
              },
              {
                label: 'No Whatsapp',
                children: data?.vehicle?.phone
              },
            ]}
          />
        </Card>
        <Table
          size="small"
          pagination={false}
          dataSource={data?.service}
          loading={isLoading || isRefetching}
          scroll={{ y: tableHeight }}
          style={{ marginTop: 18 }}
          columns={[
            {
              title: 'No',
              align: 'center',
              width: 50,
              fixed: 'left',
              render: (text, record, index) =>  index + 1,
            },
            {
              title: 'Tanggal Serivce',
              width: 180,
              dataIndex: 'date'
            },
            {
              title: 'Jenis Service',
              dataIndex: 'type',
            },
            {
              title: 'Petugas Bengkel',
              dataIndex: 'mechanic',
            },
            {
              title: 'Stall',
              dataIndex: 'stall',
            },
            {
              className: 'last-cell-p',
              title: 'Aksi',
              width: 130,
              fixed: 'right',
              render: (record) => (
                <Button onClick={() => navigate(`/vehicle-data/service/${record.id}`)} type="primary" >
                  Detail Service
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