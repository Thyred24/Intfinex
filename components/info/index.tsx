'use client'

import { Box, Text, Flex, SimpleGrid, useBreakpointValue } from '@chakra-ui/react'
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

    // Get responsive icon size
    const iconSize = useBreakpointValue({ base: 18, sm: 20 });

    return (
        <SimpleGrid
            columns={{ base: 1, sm: 2, md: 4 }}
            gap={{ base: 4, sm: 5, md: 6 }}
            alignItems="stretch"
            maxW="1400px"
            mx="auto"
            px={{ base: 4, sm: 6, md: 8 }}
            mt={{ base: 8, md: -100 }}
            mb={{ base: 8, md: 0 }}
        >
            {data.map((item, index) => (
                <Box 
                    key={index} 
                    border="1px solid" 
                    borderColor="#36B0E2"
                    borderRadius="10px" 
                    p={{ base: 4, sm: 5, md: 6 }}
                    display="flex" 
                    flexDirection="column" 
                    gap={{ base: 2, sm: 3, md: 4 }}
                    transition="all 0.3s ease"
                    minH="200px"
                    _hover={{
                        animation: `${rotateShadow} 2s linear infinite`,
                        transform: 'scale(1.03)',
                    }}
                >
                    <Flex gap={{ base: 3, sm: 4 }} alignItems="center">
                        <item.icon size={iconSize} color='#36B0E2' />
                        <Text fontSize={{ base: 18, sm: 20 }} fontWeight={500}>{item.title}</Text>
                    </Flex>
                    <Text 
                        mt={{ base: 3, sm: 4 }} 
                        fontSize={{ base: 14, sm: 15, md: 16 }} 
                        fontWeight={400} 
                        color="gray.400"
                    >
                        {item.description}
                    </Text>
                </Box>
            ))}
        </SimpleGrid>
    );
}

export default InfoSection;