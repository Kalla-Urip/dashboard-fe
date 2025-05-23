import { Button, Flex } from "antd";

export default function CardFooter({ onSubmit, onCancel }){
  return (
    <Flex justify="flex-end" gap={16} style={{ padding: '0 20px' }} >
      <Button onClick={onSubmit} type="primary" >
        Simpan
      </Button>
      <Button onClick={onCancel} variant="filled" color="danger" >
        Batal
      </Button>
    </Flex>
  )
}