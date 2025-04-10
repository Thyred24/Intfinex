import React from 'react'
import { Grid, Text } from '@chakra-ui/react'

function AboutUs() {

  return (
    <Grid 
        templateColumns={{ base: '1fr', md: 'repeat(1, 1fr)' }}
        gap={6}
        alignItems="center"
        maxW="1400px"
        mx="auto"
        px={{ base: 4, md: 6, lg: 8 }}
        display={{ base: 'none', md: 'none' }}
        textAlign="center"
        mt={100}
        border="1px solid #36B0E2" 
        borderRadius="10px" 
        p="20px" 
        transition="all 0.3s ease"
        bg="rgba(0, 0, 0, 0.5)" 
    >
        
        <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight={500}>
            Who We Are
        </Text>
        
        <Text fontSize={{ base: 'md', md: 'lg' }} textAlign="left" fontWeight={400} color="gray.300">
            We are a technology-driven company committed to providing reliable, fast, and user-friendly solutions for both individual and institutional investors in the financial markets.
            With a client-focused approach, a robust technological infrastructure, and a team of experienced professionals, we aim to make investment processes more transparent, accessible, and efficient.
            Guided by our principles of continuous improvement and adherence to quality standards, we are dedicated to delivering innovative and sustainable financial solutions.
        </Text>
    
    </Grid>
  )
}

export default AboutUs
