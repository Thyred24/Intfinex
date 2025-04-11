import React from 'react'
import { Box, Flex, Input as ChakraInput, InputGroup, Grid, Text, Textarea } from '@chakra-ui/react'
import { FaDiscord } from 'react-icons/fa';
import { Link } from '@chakra-ui/react'
import { FiMail } from 'react-icons/fi';
import Btn from '@/components/ui/button'


function ContactSection() {
  return (
    <Grid  
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
        gap={6}
        alignItems="center"
        maxW="1400px"
        mx="auto"
        px={{ base: 4, md: 6, lg: 8 }}
        display={{ base: 'none', md: 'grid' }}
    >
      <Flex direction="column" gap={10}>
        <Box fontSize={22}>
            <Flex alignItems="center" gap={2} >
                <FiMail color="#36b0e2" />         
                <Text> Email </Text>        
            </Flex>
            <Link href="mailto:intfinex@gmail.com" color="#36b0e2" fontSize={18}>intfinex@gmail.com</Link>
        </Box>
        <Box fontSize={22}>
            <Flex alignItems="center" gap={2} >
                <FaDiscord color="#36b0e2" />         
                <Text> Discord </Text>        
            </Flex>
            <Link href="https://discord.intfinex" color="#36b0e2" fontSize={18}>discord.intfinex</Link>
        </Box>
      </Flex>
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
    </Grid>
  )
}

export default ContactSection;
