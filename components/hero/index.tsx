'use client'

import React, { useState } from 'react'
import { Box, Flex, Heading, Link, Text} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/toast'
import CustomInput from '../ui/loginInput'
import CustomButton from '../ui/button'
import { LuLock } from 'react-icons/lu'
import { FaEnvelope } from 'react-icons/fa'
import CustomCheckbox from '@/components/ui/chekbox'
import SocialMedia from '@/components/ui/social-media'
import { useRouter } from 'next/navigation'

function Hero() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast({
        title: 'Error',
        description: 'Please fill all fields',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  
    setIsLoading(true);
    
    try {
      const response = await fetch("https://intfinex.azurewebsites.net/api/Login/Login", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const result = await response.json();
      console.log("Gelen veri:", result);

      if (result.isSuccess) {
        // Store both the API response and user email
        localStorage.setItem("userData", JSON.stringify(result));
        localStorage.setItem("userEmail", formData.email);
        console.log("API response stored:", result);
        console.log("Email stored:", formData.email);
        router.push("/dashboard");
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Login failed',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally { 
      setIsLoading(false);
    }
  };


  return (
    <Flex>
      <Box
        minH="calc(150vh - 100px)"
        position="relative"
        overflow="hidden"
        bg="transparent"
        width="100%"
      >
        {/* İçerik Bölümü */}
        <Box zIndex={1} textAlign="center" px={6} mt="250px">
          <Box>
            <Heading
              as="h1"
              fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
              fontWeight="bold"
              color="white"
            >
              Welcome to  
              <span style={{ 
                background: 'linear-gradient(to right, #ffffff, #36b0e2)', 
                backgroundClip: 'text', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent'
              }}>
                &nbsp;Intfinex
              </span>
            </Heading>
          
            <Text
              as="p"
              fontSize={{ base: 'md', md: 'xl' }}
              color="gray.300"
              mt={5}
            >
              Intifinex – Empowering Your Financial Future with Smart Trading Solutions
            </Text>
          </Box>
          <Box mt="50px" alignItems="center" justifyContent="center" display="flex" flexDirection="column" gap="20px">
            <CustomInput 
              placeholder="Email" 
              icon={FaEnvelope}
              onChange={(value) => setFormData({...formData, email: value})}
            />
            <CustomInput 
              placeholder="Password" 
              icon={LuLock}
              type="password"
              onChange={(value) => setFormData({...formData, password: value})}
            />
            <CustomButton 
              onClick={handleLogin}
              loading={isLoading}
              buttonText="Login"
            />
            <Flex justifyContent="space-between" width="100%" maxW="400px" mx="auto">
              <CustomCheckbox />
              <Link 
                href="/forgot-password" 
                color="#36b0e2" 
                fontSize="sm" 
                fontWeight="semibold"
                _hover={{ textDecoration: 'underline' }}
              >
                Forgot password?
              </Link>
            </Flex>
          </Box>
        </Box>
      </Box>
      <Box position="fixed" top="35%" left="85%" transform="translateX(-50%)">
        <SocialMedia /> 
      </Box>
    </Flex>
  )
}

export default Hero