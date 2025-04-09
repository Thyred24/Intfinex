// components/ui/loginInput.tsx
import { Box, Flex, Input as ChakraInput, InputGroup } from '@chakra-ui/react'
import React from 'react'
import { IconType } from 'react-icons'

interface CustomInputProps {
  placeholder?: string;
  icon?: IconType | React.ReactNode;
  iconColor?: string;
  type?: string;
  onChange?: (value: string) => void;
}

function CustomInput({ 
  placeholder = "Username", 
  icon: Icon,
  iconColor = "gray.300",
  type = "text",
  onChange
}: CustomInputProps) {
  return (
    <Box width="100%">
      <InputGroup 
        flex="1" 
        bg="transparent" 
        backdropFilter="blur(5px)"
      >
        <Flex width="100%">
          {Icon && (
            <Box 
              position="absolute" 
              left={{ base: "2", sm: "3" }} 
              top="50%" 
              transform="translateY(-50%)" 
              zIndex={1} 
              fontSize={{ base: 16, sm: 18, md: 20 }}
            >
              {typeof Icon === 'function' ? <Icon color={iconColor} /> : Icon}
            </Box>
          )}
          <ChakraInput 
            height={{ base: "40px", sm: "45px", md: "50px" }}
            placeholder={placeholder}
            pl={Icon ? { base: 8, sm: 10 } : { base: 3, sm: 4 }}
            borderColor="#36b0e2"
            fontSize={{ base: 14, sm: 15, md: 16 }}
            size={{ base: "md", md: "lg" }}
            type={type}
            onChange={(e) => onChange && onChange(e.target.value)}
            _focus={{ 
              boxShadow: '0 0 0 1px #36b0e2',
              borderColor: '#36b0e2'
            }}
            width={400}
          />
        </Flex>
      </InputGroup>
    </Box>
  )
}

export default CustomInput