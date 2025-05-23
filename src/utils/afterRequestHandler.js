export const afterRequestHandler = (
  isUpdate,
  messageApi,
  callback,
) => (
  {
    onSuccess: () => {
      messageApi.success(
        isUpdate 
        ? "Data berhasil diubah"
        : "Data berhasil ditambah"
      )
      callback()
    },
    onError: () => {
      messageApi.error("Terjadi Kesalahan")
    }
  }
)

