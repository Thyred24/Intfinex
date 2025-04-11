import { Button, FileUpload } from "@chakra-ui/react"
import { HiUpload } from "react-icons/hi"

const CustomUpload = () => {
  return (
    <FileUpload.Root>
      <FileUpload.HiddenInput />
      <FileUpload.Trigger asChild>
        <Button variant="outline" size="sm" width="100%" height="50px" border="none" _hover={{ bg: 'rgba(54, 176, 226, 0.3)' }}>
          <HiUpload /> Upload file
        </Button>
      </FileUpload.Trigger>
      <FileUpload.List />
    </FileUpload.Root>
  )
}

export default CustomUpload