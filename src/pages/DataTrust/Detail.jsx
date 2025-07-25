import { useQuery } from "@tanstack/react-query";
import { Button, Card, Descriptions, Flex, Typography } from "antd";
import { Link, useParams } from "react-router";
import { trustService } from "../../services/trust.service";
import { API_BASE_URL } from "../../config/api.config";

export default function DataTrustDetail(){

  const { id } = useParams()

  const { data } = useQuery({
    queryKey: ['detail'],
    queryFn: () => trustService.getById(id),
    enabled: !!id,
    select: data => data.data
  })

  return (
    <>
      <Card>
        <Typography.Title level={5} >
          Identitas
        </Typography.Title>
        <Descriptions
          bordered
          size="small"
          // styles={descStyle}
          column={2}
          items={[
            {
              label: 'Tanggal Pengajuan',
              children: data?.createdAt
            },
            {
              label: 'Nama',
              children: data?.name
            },
            {
              label: 'Tanggal Lahir',
              children: data?.birthDate
            },
            {
              label: 'No Whatsapp',
              children: data?.phone
            },
            {
              label: 'Alamat',
              children: data?.address,
              span: 2
            },
            {
              label: 'Tipe Kendaraan',
              children: data?.type,
            },
            {
              label: 'Tahun',
              children: data?.year
            },
            {
              label: 'Nomor Rangka',
              children: data?.chassisNumber
            },
            {
              label: 'Nomor Plat',
              children: data?.plateNumber
            },
          ]}
        />
      </Card>
      <Card style={{ marginTop: 15 }} >
        <Typography.Title level={5} >
          Tam Check
        </Typography.Title>
        <Descriptions
          bordered
          size="small"
          // styles={descStyle}
          column={2}
          items={[
            {
              label: 'Tam Check',
              children: 
              (
                <Flex align="center" justify="space-between" >
                  <Typography.Text>
                    {data?.tamFile?.split('/')[1]}
                  </Typography.Text>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="primary" 
                  >
                    <Link to={`${API_BASE_URL}/file${data?.tamFile?.replace('storage', '')}`} >
                      Unduh
                    </Link>
                  </Button>
                </Flex>
              ),
              span: 2
            },
            {
              label: 'Quality Level',
              children: data?.qualityLevel
            },
            {
              label: 'Harga Beli',
              children: data?.price?.toLocaleString()
            }
          ]}
        />
      </Card>
    </>
  )
}