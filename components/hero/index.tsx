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
import RegisterInput from '@/components/ui/registerInput'

function Hero() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const toast = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

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
    setErrorMessage('');
    
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
        toast({
          title: 'Başarılı',
          description: 'Login successful, you are being redirected...',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setIsSuccess(true);
        localStorage.setItem('userData', JSON.stringify(result));
        localStorage.setItem('userEmail', formData.email);
      
        // Kısa bir gecikme ile yönlendirme yapalım ki kullanıcı başarılı mesajını görebilsin
        setTimeout(() => {
          // Check userLevel for redirection
          if (result.userLevel === 'Admin') {
            window.location.href = '/admin';
          } else if (result.userLevel === 'Premium') {
            window.location.href = '/dashboard?premium=true';
          } else {
            // Basic users
            window.location.href = '/dashboard';
          }
        }, 1000);
      } else {
        setErrorMessage(result.message || 'User email/password is not correct!');
        setIsSuccess(false);
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
    <Flex position="relative" width="100%">
      <Box
        minH={{ base: "100vh", md: "calc(150vh - 100px)" }}
        position="relative"
        overflow="hidden"
        bg="transparent"
        width="100%"
        px={{ base: 4, sm: 6, md: 8, lg: 10 }}
      >
        {/* İçerik Bölümü */}
        <Box 
          zIndex={1} 
          textAlign="center" 
          mt={{ base: "150px", sm: "180px", md: "250px" }}
          maxW="1200px"
          mx="auto"
        >
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
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            gap={{ base: 8, lg: 8 }}
            justify="center"
            align="center"
            mt={8}
            mx="auto"
            maxW={{ base: '100%', lg: '1200px' }}
            px={{ base: 4, sm: 6 }}
          >
            <Box
              flex={1}
              w={{ base: '100%', lg: '50%' }}
              maxW={{ base: '500px', lg: '500px' }}
              mx="auto"
            >
              <RegisterInput />
            </Box>
            <Box
              flex={1}
              w={{ base: '100%', lg: '50%' }}
              maxW={{ base: '400px', lg: '400px' }}
              mx="auto"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Box width="100%" maxW="400px">
                <Box mb={{ base: 2, md: 4 }} mt={{ base: 0, lg: 4 }}>
                  <CustomInput 
                    placeholder="Email" 
                    icon={FaEnvelope}
                    onChange={(value) => setFormData({...formData, email: value})}
                  />
                </Box>
                <Box mb={{ base: 2, md: 4 }}>
                  <CustomInput 
                    placeholder="Password" 
                    icon={LuLock}
                    type="password"
                    onChange={(value) => setFormData({...formData, password: value})}
                  />
                </Box>
                {isSuccess && (
                  <Box mb={{ base: 2, md: 4 }} textAlign="center">
                    <Text color="green.500" fontSize="sm">
                      Login successful, you are being redirected...
                    </Text>
                  </Box>
                )}
                {errorMessage && (
                  <Box mb={{ base: 2, md: 4 }} textAlign="center">
                    <Text color="red.500" fontSize="sm">
                      {errorMessage}
                    </Text>
                  </Box>
                )}
                <Flex 
                  justifyContent="space-between" 
                  width="100%"
                  flexDirection="column"
                  gap={{ base: 1, md: 2 }}
                  alignItems="center"
                >
                  <CustomCheckbox />
                  <Link 
                    href="/forgot-password" 
                    color="#36b0e2" 
                    fontSize={{ base: "10px", sm: "xs", md: "sm" }}
                    fontWeight="semibold"
                    mt={{ base: 1, md: 2 }}
                    _hover={{ textDecoration: 'underline' }}
                  >
                    Forgot password?
                  </Link>
                  <CustomButton 
                    onClick={handleLogin}
                    loading={isLoading}
                    buttonText="Login"
                    width="100%"
                    mt={{ base: 2, sm: 12 }}
                  />
                </Flex>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>
      <Box 
        position="fixed" 
        top={{ base: "auto", md: "35%" }} 
        bottom={{ base: "20px", md: "auto" }}
        left={{ base: "50%", md: "85%" }} 
        transform="translateX(-50%)"
        zIndex={2}
      >
        <SocialMedia /> 
      </Box>
    </Flex>
  );
}


export default Hero