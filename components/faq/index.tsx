'use client'

import React from 'react'
import { Box, Text } from '@chakra-ui/react'
import { Accordion } from '@/components/ui/acordion'

function Faq() {
  const faqItems = [
    {
        title: "What is Intifinex?",
        content: "Intifinex is a platform that provides secure and fast cryptocurrency buying and selling services to its users."
      },
      {
        title: "How can I register?",
        content: "You can easily register by clicking the 'Register' button located at the top right corner of our website."
      },
      {
        title: "What are the transaction fees?",
        content: "Our transaction fees are offered at some of the most competitive rates in the market. For detailed information, you can visit our fees page."
      },
      {
        title: "How long do deposit and withdrawal transactions take?",
        content: "Deposits are processed instantly. Withdrawal transactions are completed within 24 hours after security checks."
      },
      {
        title: "What payment methods can I use?",
        content: "You can use bank transfer, credit card, and other popular payment methods."
      }
  ];

  return (
    <Box p={{ base: 4, md: 8, lg: 12 }} maxW="1400px" mx="auto" mt={100}>
        <Text 
          fontSize={{ base: '28px', md: '40px', lg: '48px' }} 
          fontWeight='bold' 
          textAlign='center' 
          color='white'
          mb={4}
        >
            Frequently Asked Questions
        </Text>
        <Accordion items={faqItems} />
    </Box>
  )
}

export default Faq
