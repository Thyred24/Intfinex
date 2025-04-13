'use client'

import React from 'react'
import { Box, Flex, Input as ChakraInput, InputGroup, Text, Textarea, SimpleGrid, useBreakpointValue } from '@chakra-ui/react'
import { FaDiscord } from 'react-icons/fa';
import { Link } from '@chakra-ui/react'
import { FiMail } from 'react-icons/fi';
import Btn from '@/components/ui/button'

function ContactSection() {
  const isMobile = useBreakpointValue({ base: true, md: false })
  
  return (
    <SimpleGrid
      columns={{ base: 1, md: 2 }}
      gap={6}
      alignItems="center"
      maxW="1400px"
      mx="auto"
      px={{ base: 4, sm: 6, md: 8 }}
      display="grid"
    >
      {!isMobile && (
        <Flex direction="column" gap={{ base: 6, md: 10 }}>
          <Box fontSize={{ base: 18, md: 22 }}>
            <Flex alignItems="center" gap={2}>
              <FiMail color="#36b0e2" size={isMobile ? 18 : 20} />         
              <Text>Email</Text>        
            </Flex>
            <Link href="mailto:intfinex@gmail.com" color="#36b0e2" fontSize={{ base: 16, md: 18 }}>
              intfinex@gmail.com
            </Link>
          </Box>
          <Box fontSize={{ base: 18, md: 22 }}>
            <Flex alignItems="center" gap={2}>
              <FaDiscord color="#36b0e2" size={isMobile ? 18 : 20} />         
              <Text>Discord</Text>        
            </Flex>
            <Link href="https://discord.intfinex" color="#36b0e2" fontSize={{ base: 16, md: 18 }}>
              discord.intfinex
            </Link>
          </Box>
        </Flex>
      )}
      
      <Box width="100%">
        <InputGroup 
          flex="1" 
          bg="transparent" 
          backdropFilter="blur(5px)"
        >
          <ChakraInput 
            height={{ base: "40px", sm: "45px", md: "50px" }}
            placeholder="Enter your name"
            pl={3}
            borderColor="#36b0e2"
            fontSize={{ base: 14, sm: 15, md: 16 }}
            size={{ base: "md", md: "lg" }}
            type="text"
            _focus={{ 
              boxShadow: '0 0 0 1px #36b0e2',
              borderColor: '#36b0e2'
            }}
            width="100%"
          />
        </InputGroup>
        
        <InputGroup 
          flex="1" 
          bg="transparent" 
          backdropFilter="blur(5px)"
          mt={4}
        >
          <ChakraInput 
            height={{ base: "40px", sm: "45px", md: "50px" }}
            placeholder="Enter your email"
            pl={3}
            borderColor="#36b0e2"
            fontSize={{ base: 14, sm: 15, md: 16 }}
            size={{ base: "md", md: "lg" }}
            type="email"
            _focus={{ 
              boxShadow: '0 0 0 1px #36b0e2',
              borderColor: '#36b0e2'
            }}
            width="100%"
          />
        </InputGroup>
        
        <InputGroup 
          flex="1" 
          bg="transparent" 
          backdropFilter="blur(5px)"
          mt={4}
        >
          <ChakraInput 
            height={{ base: "40px", sm: "45px", md: "50px" }}
            placeholder="Subject"
            pl={3}
            borderColor="#36b0e2"
            fontSize={{ base: 14, sm: 15, md: 16 }}
            size={{ base: "md", md: "lg" }}
            type="text"
            _focus={{ 
              boxShadow: '0 0 0 1px #36b0e2',
              borderColor: '#36b0e2'
            }}
            width="100%"
          />
        </InputGroup>
        
        <InputGroup 
          flex="1" 
          bg="transparent" 
          backdropFilter="blur(5px)"
          mt={4}
        >
          <Textarea 
            placeholder="Enter your message"
            pl={3}
            borderColor="#36b0e2"
            fontSize={{ base: 14, sm: 15, md: 16 }}
            height={{ base: "100px", sm: "120px", md: "150px" }}
            _focus={{ 
              boxShadow: '0 0 0 1px #36b0e2',
              borderColor: '#36b0e2'
            }}
            resize="vertical"
            width="100%"
          />
        </InputGroup>
        
        <Btn buttonText="Send" width="full" mt={4} />
      </Box>
      
      {isMobile && (
        <SimpleGrid columns={2} gap={4} mt={6}>
          <Box fontSize={16}>
            <Flex alignItems="center" gap={2}>
              <FiMail color="#36b0e2" size={18} />         
              <Text>Email</Text>        
            </Flex>
            <Link href="mailto:intfinex@gmail.com" color="#36b0e2" fontSize={14}>
              intfinex@gmail.com
            </Link>
          </Box>
          <Box fontSize={16}>
            <Flex alignItems="center" gap={2}>
              <FaDiscord color="#36b0e2" size={18} />         
              <Text>Discord</Text>        
            </Flex>
            <Link href="https://discord.intfinex" color="#36b0e2" fontSize={14}>
              discord.intfinex
            </Link>
          </Box>
        </SimpleGrid>
      )}
    </SimpleGrid>
  )
}

export default ContactSection