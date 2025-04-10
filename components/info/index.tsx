'use client'

import { Grid, Box, Text, Flex } from '@chakra-ui/react'
import React from 'react'
import { FaUsers } from 'react-icons/fa6';
import { MdDesignServices } from 'react-icons/md';
import { BsGraphUpArrow } from 'react-icons/bs';
import { RiExchangeFundsFill } from 'react-icons/ri';
import { keyframes } from '@emotion/react';

function InfoSection() {

    const data = [
        { 
            title: "Our Clients",
            description: "We proudly serve a diverse range of clients, from individual investors to leading financial institutions, building long-term partnerships based on trust and performance.",
            icon: FaUsers 
        },
        { 
            title: "Our Services",
            description: "Our comprehensive financial services include market analysis, portfolio management, and personalized support to help our clients make informed investment decisions.",
            icon: MdDesignServices 
        },
        {
            title: "Markets",
            description: "We provide access to global financial markets including stocks, forex, commodities, and more — ensuring you never miss an opportunity.",
            icon: BsGraphUpArrow 
        },
        {
            title: "Instruments",
            description: "Trade with confidence using a wide array of financial instruments tailored to suit every investment strategy and risk profile.",
            icon: RiExchangeFundsFill 
        }
    ];

    const rotateShadow = keyframes`
    0% { box-shadow: 0 -3px 3px #36B0E2 inset; }
    25% { box-shadow: 3px 0 3px #36B0E2 inset; }
    50% { box-shadow: 0 3px 3px #36B0E2 inset; }
    75% { box-shadow: -3px 0 3px #36B0E2 inset; }
    100% { box-shadow: 0 -3px 3px #36B0E2 inset; }
  `;

  return (
    <Grid 
        templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
        gap={6}
        alignItems="center"
        maxW="1400px"
        mx="auto"
        px={{ base: 4, md: 6, lg: 8 }}
        display={{ base: 'none', md: 'grid' }}
        mt={-100}
    >
        {data.map((item, index) => (
            <Box 
                key={index} 
                border="1px solid #36B0E2" 
                borderRadius="10px" 
                p="20px" 
                display="flex" 
                flexDirection="column" 
                gap="10px"
                transition="all 0.3s ease"
                height="100%"
                _hover={{
                    animation: `${rotateShadow} 2s linear infinite`,
                    transform: 'scale(1.05)',
                }}
            >
                <Flex gap={5} alignItems="center">
                    <item.icon size={20} color='#36B0E2' />
                    <Text fontSize={20} fontWeight={500}>{item.title}</Text>
                </Flex>
                <Text mt={5} fontSize={16} fontWeight={400} color="gray.400">{item.description}</Text>
            </Box>
        ))}
    </Grid>
  )
}

export default InfoSection
