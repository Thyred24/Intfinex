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

interface User {
  email: string;
  userLevel?: string;
  isEmailApproved: boolean;
}

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

    console.log("[LOGIN] Login başladı...");
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('https://intfinex.azurewebsites.net/api/Login/Login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    
      console.log("[LOGIN] Response status:", response.status);
    
      const loginResult = await response.json();
      console.log("[LOGIN] Login result:", loginResult);
    
      if (loginResult.isSuccess && loginResult.data && loginResult.data[0]) {
        const token = loginResult.data[0];
        localStorage.setItem('userData', JSON.stringify(loginResult));
        localStorage.setItem('userEmail', formData.email);
    
        console.log("[LOGIN] Token kaydedildi, email kaydedildi:", { token, email: formData.email });
    
        // Şimdi GetList'e istek atıp email onayı kontrol edelim
        const userListResponse = await fetch('https://intfinex.azurewebsites.net/api/User/GetList', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
    
        const userListData = await userListResponse.json();
        console.log("[LOGIN] Kullanıcı listesi:", userListData);
    
        if (userListData.isSuccess && userListData.data) {
          const currentUser = userListData.data.find((u: User) => u.email === formData.email);
    
          if (currentUser) {
            console.log("[LOGIN] Kullanıcı bulundu:", currentUser);
    
            if (currentUser.isEmailApproved) {
              console.log("[LOGIN] Email doğrulanmış, dashboard'a yönlendiriliyor...");
              setIsSuccess(true);
              toast({
                title: 'Başarılı',
                description: 'Giriş başarılı, yönlendiriliyorsunuz...',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });

              // Kısa bir gecikme ile yönlendirme yapalım
              setTimeout(() => {
                if (currentUser.userLevel === 'Admin') {
                  window.location.href = '/admin';
                } else if (currentUser.userLevel === 'Premium') {
                  window.location.href = '/dashboard?premium=true';
                } else {
                  window.location.href = '/dashboard';
                }
              }, 1000);
            } else {
              console.log("[LOGIN] Email doğrulanmamış, email doğrulama ekranına yönlendiriliyor...");
              setErrorMessage('Please perform email integration');
              toast({
                title: 'Email Doğrulanmamış',
                description: 'Lütfen email adresinizi doğrulayın.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
              });
              localStorage.setItem('needsEmailVerification', 'true');
            }
          } else {
            console.log("[LOGIN] Kullanıcı GetList içinde bulunamadı.");
            toast({
              title: 'Kullanıcı bulunamadı',
              description: 'Lütfen tekrar giriş yapın.',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
        } else {
          console.log("[LOGIN] Kullanıcı listesi alınamadı:", userListData.errors);
          setErrorMessage('Kullanıcı bilgileri alınamadı');
        }
      } else {
        setErrorMessage(loginResult.message || 'User email/password is not correct!');
        toast({
          title: 'Giriş Başarısız',
          description: 'Email veya şifre yanlış.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("[LOGIN] Hata:", error);
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