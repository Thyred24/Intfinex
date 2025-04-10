'use client'

import React from "react";
import { 
  Accordion, 
  AccordionItem, 
  AccordionButton, 
  AccordionPanel, 
  AccordionIcon 
} from "@chakra-ui/accordion";
import { Box, Text, VStack } from "@chakra-ui/react";

interface AccordionProps {
  items: {
    title: string;
    content: string;
  }[];
}

const AccordionComponent: React.FC<AccordionProps> = ({ items }) => {
  return (
    <Accordion allowMultiple width="100%" maxW="1500px" mx="auto" mt="30px" transition="all 0.3s ease">
      {items.map((item, index) => (
        <AccordionItem 
          key={index}
          border="1px solid inset"
          boxShadow="inset 0 0 5px 0 #36B0E2"
          borderColor="#36B0E2"
          borderRadius="10px"
          transition="all 0.3s ease"
          mb={8}
        >
          <AccordionButton
          p={20}  
          transition="all 0.3s ease"
            _expanded={{ bg: 'linear-gradient(to top, #000A1C, #36B0E2)', color: 'white', transition: 'all 0.3s ease' }}
            _hover={{ bg: 'linear-gradient(to top, #000A1C, #36B0E2)', transition: 'all 0.3s ease', cursor: 'pointer' }}
            borderRadius="10px"
          >
            <Box flex="1" textAlign="left">
              <Text fontWeight="semibold">{item.title}</Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={8} bg="blackAlpha.50" borderRadius="10px" p={20} transition="all 0.3s ease">
            <VStack align="start">
              {item.content.split('\n').map((line, i) => (
                <Text key={i}>{line}</Text>
              ))}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export { AccordionComponent as Accordion }