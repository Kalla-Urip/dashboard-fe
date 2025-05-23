import { Icon } from "@iconify/react";
import { Button, Flex, Popconfirm } from "antd";

export default function TableAction({ onClickEdit, handleDelete, deleteLoading, deleteDisabled = false }){

  return (
    <Flex gap={10} justify="end" >
      <Button  
        variant="solid"
        onClick={onClickEdit} 
        size=""
        style={{ backgroundColor: '#30B0C7', color: '#fff' }}
      >
        Edit
      </Button>
      <Popconfirm
        placement="right"
        title="Pemberitahuan"
        description="Yakin ingin menghapus data ini?"
        okText="Hapus"
        cancelText="Tidak"
        // icon={<AlertCircle color="red" strokeWidth={1.2} style={{ marginRight: 6 }} />}
        onConfirm={handleDelete}
        okButtonProps={{
          loading: deleteLoading,
          danger: true,
        }}
      >
        <Button 
          disabled={deleteDisabled}
          variant="solid" 
          color="danger"
          size=""
        >
          Hapus
        </Button>
      </Popconfirm>
    </Flex>
  )
}