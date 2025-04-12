'use client'

import {
  Box,
  Text,
  Flex
} from '@chakra-ui/react'
import React from 'react'
import TradingViewWidget from '@/components/ui/tradingView'
import TradingViewEventsWidget from '@/components/ui/events'

function FinancialRoom() {
  return (
    <Box w="full" py={{ base: 6, md: 12 }} px={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW="1400px" mx="auto" mt={{ base: 4, md: 8, lg: 12 }}>
          {/* API Endpoints Section */}
          <Box
            position="relative"
            backgroundColor="transparent"
            backdropFilter="blur(10px)"
            backgroundImage="linear-gradient(to left, #000, rgba(54, 176, 226, 0.8), #000)"
            backgroundRepeat="no-repeat"
            backgroundSize="100% 2px, 2px 100%"
            boxShadow="0px -5px 10px 0px inset rgba(54, 176, 226, 0.5)"
            borderRadius="10px"
            p={{ base: 4, md: 6, lg: 10 }}
          >
            <Text fontSize="20px" fontWeight="bold" mb={4} color="white">
              API Endpoints
            </Text>
            <Flex direction="column" gap={4}>
              <Box>
                <Text color="#36b0e2" fontSize="16px" mb={2}>
                  GET /api/financial/balance
                </Text>
                <Text color="white" opacity={0.8} fontSize="14px">
                  Retrieves current balance information and account status.
                  Returns detailed financial data including available balance,
                  pending transactions, and account limits.
                </Text>
              </Box>

              <Box>
                <Text color="#36b0e2" fontSize="16px" mb={2}>
                  POST /api/financial/transaction
                </Text>
                <Text color="white" opacity={0.8} fontSize="14px">
                  Creates a new financial transaction. Supports various transaction
                  types including deposits, withdrawals, and transfers. Requires
                  proper authentication and transaction details.
                </Text>
              </Box>

              <Box>
                <Text color="#36b0e2" fontSize="16px" mb={2}>
                  GET /api/financial/history
                </Text>
                <Text color="white" opacity={0.8} fontSize="14px">
                  Fetches detailed transaction history with filtering options.
                  Includes transaction status, timestamps, and related metadata.
                </Text>
              </Box>
            </Flex>
          </Box>
          <Box
            position="relative"
            backgroundColor="transparent"
            backdropFilter="blur(10px)"
            backgroundImage="linear-gradient(to left, #000, rgba(54, 176, 226, 0.8), #000)"
            backgroundRepeat="no-repeat"
            backgroundSize="100% 2px, 2px 100%"
            boxShadow="0px -5px 10px 0px inset rgba(54, 176, 226, 0.5)"
            borderRadius="10px"
            p={{ base: 4, md: 6, lg: 10 }}
            mt={10}
            height="650px"
            width="100%"
          >
            <TradingViewWidget /> 
          </Box>

          {/* Authentication & Rate Limits Section */}
          <Flex gap={8} mt={10}>
            <Box
              position="relative"
              backgroundColor="transparent"
              backdropFilter="blur(10px)"
              backgroundImage="linear-gradient(to left, #000, rgba(54, 176, 226, 0.8), #000)"
              backgroundRepeat="no-repeat"
              backgroundSize="100% 2px, 2px 100%"
              boxShadow="0px -5px 10px 0px inset rgba(54, 176, 226, 0.5)"
              borderRadius="10px"
              p={{ base: 4, md: 6, lg: 10 }}
              width="100%"
            >
              <TradingViewEventsWidget />
            </Box>

            <Box
              position="relative"
              backgroundColor="transparent"
              backdropFilter="blur(10px)"
              backgroundImage="linear-gradient(to left, #000, rgba(54, 176, 226, 0.8), #000)"
              backgroundRepeat="no-repeat"
              backgroundSize="100% 2px, 2px 100%"
              boxShadow="0px -5px 10px 0px inset rgba(54, 176, 226, 0.5)"
              borderRadius="10px"
              p={{ base: 4, md: 6, lg: 10 }}
            >
              <Text fontSize="20px" fontWeight="bold" mb={4} color="white">
                Rate Limits
              </Text>
              <Flex direction="column" gap={3}>
                <Text color="white" opacity={0.8} fontSize="14px">• 100 requests per minute for GET endpoints</Text>
                <Text color="white" opacity={0.8} fontSize="14px">• 20 requests per minute for POST endpoints</Text>
                <Text color="white" opacity={0.8} fontSize="14px">• 5 requests per minute for transaction endpoints</Text>
                <Text color="white" opacity={0.8} fontSize="14px">• Exceeded limits result in 429 Too Many Requests</Text>
              </Flex>
            </Box>
          </Flex>
      </Box>
    </Box>
  )
}

export default FinancialRoom
