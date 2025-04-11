'use client'

import { Button as ChakraButton, ButtonProps, Icon, HStack } from "@chakra-ui/react"
import { LuArrowRight, LuArrowLeft } from "react-icons/lu"
import { useState } from "react"

interface CustomButtonProps extends ButtonProps {
  variant?: 'solid' | 'outline';
  buttonText?: string;
  arrowDirection?: 'left' | 'right'; // Yeni prop
  loading?: boolean;
  disabled?: boolean;
}

const CustomButton = ({ 
  buttonText,
  loading = false,
  disabled = false,
  variant = 'solid', 
  arrowDirection = 'right', // Varsayılan değer
  ...props 
}: CustomButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const styles = {
    solid: {
      bg: "#36b0e2",
      color: "#000A1C",
      _hover: {
        bg: "linear-gradient(to top, rgb(0, 32, 71) 1%, rgb(54, 176, 226) 10%, rgb(0, 32, 71) 100%)",
        transform: "translateX(5px)",
        color: "#ffffff"
      }
    },
    outline: {
      bg: "transparent",
      color: "#36b0e2",
      border: "2px solid rgb(54, 176, 226)",
      _hover: {
        bg: "#36b0e2",
        color: "#ffffff",
        transform: "translateX(5px)",
      }
    }
  }

  // Ok ikonunu ve animasyon yönünü belirle
  const arrowIcon = arrowDirection === 'right' ? LuArrowRight : LuArrowLeft;
  const hoverTransform = arrowDirection === 'right' 
    ? { opacity: isHovered ? 1 : 0, transform: isHovered ? "translateX(0)" : "translateX(-10px)" }
    : { opacity: isHovered ? 1 : 0, transform: isHovered ? "translateX(0)" : "translateX(10px)" };

  return (
    <ChakraButton
      {...styles[variant]}
      transition="all 0.3s ease"
      fontWeight="500"
      borderRadius="md"
      px={8}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      loading={loading}
      disabled={disabled || loading}
      {...props}
    >
      <HStack>
        {/* Left arrow için özel konumlandırma */}
        {arrowDirection === 'left' && (
          <Icon
            as={arrowIcon}
            transition="all 0.3s ease"
            {...hoverTransform}
          />
        )}

        <span style={{ 
          marginLeft: arrowDirection === 'right' ? '12px' : 0,
          marginRight: arrowDirection === 'left' ? '12px' : 0
        }}>
          {props.children || buttonText}
        </span>

        {/* Right arrow için özel konumlandırma */}
        {arrowDirection === 'right' && (
          <Icon
            as={arrowIcon}
            transition="all 0.3s ease"
            {...hoverTransform}
          />
        )}
      </HStack>
    </ChakraButton>
  )
}

export default CustomButton