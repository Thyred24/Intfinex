'use client'

import { Box, Flex, Grid, InputGroup, Input as ChakraInput } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'
import CustomButton from '@/components/ui/button'
import React, { useState } from 'react'
import { FormLabel } from '@chakra-ui/form-control'
import CustomUpload from '@/components/ui/upload'

function DashboardBottom() {
  const [isTicketBoxOpen, setIsTicketBoxOpen] = useState(false);

  const toggleTicketBox = () => {
    setIsTicketBoxOpen(!isTicketBoxOpen);
  };

  return (
    <Grid
      templateColumns="1fr"
      gap={{ base: 6, md: 8 }}
      alignItems="start"
      maxW="1400px"
      mx="auto"
      px={{ base: 2, sm: 4, md: 6, lg: 8 }}
      mt={{ base: 20, sm: 30, md: 40 }}
      pb={{ base: 4, sm: 6, md: 10 }}
    >
      <Flex 
        gap={{ base: 3, sm: 4, md: 6 }} 
        width="100%"
        direction={{ base: "column", sm: "row" }}
        justifyContent="center"
      >
        <CustomButton 
          buttonText="Update Your Account" 
          width={{ base: "100%", sm: "50%" }}
          height={{ base: "45px", md: "50px" }}
          mb={{ base: 3, sm: 0 }}
        />
        <CustomButton 
          buttonText="Send Ticket" 
          onClick={toggleTicketBox}
          variant={isTicketBoxOpen ? 'outline' : 'solid'}
          width={{ base: "100%", sm: "50%" }}
          height={{ base: "45px", md: "50px" }}
        />
      </Flex>

      <Box 
        width="100%" 
        px={{ base: 0, md: 4 }}
        display={isTicketBoxOpen ? 'block' : 'none'}
        opacity={isTicketBoxOpen ? 1 : 0}
        transform={isTicketBoxOpen ? 'translateY(0)' : 'translateY(-20px)'}
        transition="all 0.3s ease-in-out"
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
            mt={{ base: 4, md: 20 }}
          /> 
      </Box>

      <Flex 
        mx="auto" 
        mt={{ base: 10, sm: 15, md: 20 }} 
        gap={{ base: 2, sm: 3, md: 5 }}
        flexWrap="wrap"
        justifyContent="center"
      >
        <CustomButton 
          buttonText="Phone" 
          width={{ base: "45%", sm: "30%", md: "18%" }}
          height={{ base: "40px", sm: "45px", md: "50px" }}
        />
        <CustomButton 
          buttonText="Email" 
          width={{ base: "45%", sm: "30%", md: "18%" }}
          height={{ base: "40px", sm: "45px", md: "50px" }}
        />
        <CustomButton 
          buttonText="Live Chat" 
          width={{ base: "45%", sm: "30%", md: "18%" }}
          height={{ base: "40px", sm: "45px", md: "50px" }}
        />
        <CustomButton 
          buttonText="Whatsapp" 
          width={{ base: "45%", sm: "30%", md: "18%" }}
          height={{ base: "40px", sm: "45px", md: "50px" }}
        />
        <CustomButton 
          buttonText="Telegram" 
          width={{ base: "45%", sm: "30%", md: "18%" }}
          height={{ base: "40px", sm: "45px", md: "50px" }}
        />
      </Flex>
    </Grid>
  );
}

export default DashboardBottom