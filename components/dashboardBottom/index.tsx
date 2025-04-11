import { Box, Flex, Grid, InputGroup, Input as ChakraInput } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'
import CustomButton from '@/components/ui/button'
import React from 'react'
import { FormLabel } from '@chakra-ui/form-control'
import CustomUpload from '@/components/ui/upload'

function DashboardBottom() {
  return (
    <Grid
      templateColumns="1fr"
      gap={{ base: 4, md: 6 }}
      alignItems="center"
      maxW="1400px"
      mx="auto"
      px={{ base: 4, md: 6, lg: 8 }}
      mt={{ base: 40, md: 60 }}
      pb={{ base: 6, md: 10 }}
    >
      <Flex
        justifyContent="center"
        gap={{ base: 3, md: 5 }}
        direction={{ base: "column", sm: "row" }}
        alignItems={{ base: "stretch", sm: "flex-start" }}
      >
        <Flex direction="column" gap={6}>
          <CustomButton buttonText="Update Your Account" width="100%" />
          <CustomButton buttonText="Phone" width="100%" />
          <CustomButton buttonText="Email" width="100%" />
          <CustomButton buttonText="Live Chat" width="100%" />
          <CustomButton buttonText="Whatsapp" width="100%" />
          <CustomButton buttonText="Telegram" width="100%" />
        </Flex>
        <Box 
          width="100%" 
          mt={{ base: 6, sm: 0 }}
          px={{ base: 0, md: 4 }}
        >
          <InputGroup 
            flex="1" 
            bg="transparent" 
            backdropFilter="blur(5px)"
            mb={{ base: 3, md: 4 }}
          >
            <ChakraInput 
              height={{ base: "40px", sm: "45px", md: "50px" }}
              placeholder="Subject"
              pl={3}
              borderColor="#36b0e2"
              fontSize={{ base: "14px", md: "16px" }}
              _focus={{ 
                boxShadow: '0 0 0 1px #36b0e2',
                borderColor: '#36b0e2'
              }}
            />
          </InputGroup>
          <InputGroup 
            flex="1" 
            bg="transparent" 
            backdropFilter="blur(5px)"
            mb={{ base: 3, md: 4 }}
          >
            <Textarea 
              placeholder="Message"
              pl={3}
              pt={3}
              borderColor="#36b0e2"
              height={{ base: "100px", sm: "120px", md: "150px" }}
              fontSize={{ base: "14px", md: "16px" }}
              _focus={{ 
                boxShadow: '0 0 0 1px #36b0e2',
                borderColor: '#36b0e2'
              }}
              resize="vertical"
            />
          </InputGroup>
          <Box 
            mt={{ base: 3, md: 4 }} 
            height={{ base: "90px", md: "100px" }}
          >
            <FormLabel 
              fontSize={{ base: "13px", md: "14px" }}
              fontWeight={500} 
              color="#36b0e2"
              mb={{ base: 1, md: 2 }}
            >
              Upload Screenshot / Document
            </FormLabel>
            <Box 
              width="100%" 
              border="1px dashed #36b0e2" 
              p={{ base: 2, md: 3 }} 
              borderRadius="md"
            >
              <CustomUpload />
            </Box>
          </Box>
          <CustomButton 
            buttonText="Send Ticket" 
            width="full" 
            mt={{ base: 4, md: 6 }}
          /> 
        </Box>
      </Flex>
    </Grid>
  )
}

export default DashboardBottom