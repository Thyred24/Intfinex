import { Checkbox } from "@chakra-ui/react"

const CustomCheckbox = () => {
  return (
    <Checkbox.Root color="gray.300" mt={{ base: 0, sm: 5 }}>
      <Checkbox.HiddenInput />
      <Checkbox.Control border="1px solid #36b0e2" color="blue" />
      <Checkbox.Label>Accept terms and conditions</Checkbox.Label>
    </Checkbox.Root>
  )
}

export default CustomCheckbox
