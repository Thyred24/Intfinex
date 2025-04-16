'use client'

import React, { useState, useEffect } from 'react'
import { Box, Button, Flex, Heading, Link, Text} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/toast'
import CustomInput from '../ui/loginInput'
import CustomButton from '../ui/button'
import { LuLock } from 'react-icons/lu'
import { FaEnvelope } from 'react-icons/fa'
import CustomCheckbox from '@/components/ui/chekbox'
import SocialMedia from '@/components/ui/social-media'
import RegisterInput from '@/components/ui/registerInput'

interface User {
  id: string;
  email: string;
  userLevel?: string;
  isEmailApproved: boolean;
}

function Hero() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    verificationCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const toast = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // LocalStorage'da userData var mı kontrol et
    const userData = localStorage.getItem('userData');
    setIsLoggedIn(!!userData);
  }, []);

  // Email doğrulama kodu doğrulama fonksiyonu
  const validateEmailCode = async () => {
    if (!currentUserId || !formData.verificationCode) {
      toast({
        title: 'Hata',
        description: 'Doğrulama kodu gerekli',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      console.log('[VALIDATE_EMAIL] Doğrulama kodu kontrol ediliyor...', {
        userId: currentUserId,
        code: formData.verificationCode,
        timestamp: new Date().toISOString()
      });

      const response = await fetch('https://intfinex.azurewebsites.net/api/Verification/ValidateEmailCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          code: formData.verificationCode
        })
      });

      console.log('[VALIDATE_EMAIL] Response status:', response.status);
      const result = await response.json();
      console.log('[VALIDATE_EMAIL] Result:', result);

      if (response.ok && result.isSuccess && (!result.errors || result.errors.length === 0)) {
        toast({
          title: 'Başarılı',
          description: 'Email doğrulandı',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Kullanıcı bilgilerini localStorage'dan al
        const userDataStr = localStorage.getItem('userData');
        const userEmail = localStorage.getItem('userEmail');

        if (!userDataStr || !userEmail) {
          throw new Error('Kullanıcı bilgileri bulunamadı');
        }

        const userData = JSON.parse(userDataStr);
        console.log('[VALIDATE_EMAIL] User data:', userData);

        // Dashboard'a yönlendir
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        const errorMessage = result.errors?.[0] || 'Doğrulama başarısız oldu. Lütfen tekrar deneyin.';
        console.log('[VALIDATE_EMAIL] Validation failed:', {
          responseOk: response.ok,
          isSuccess: result.isSuccess,
          errors: result.errors,
          errorMessage
        });

        toast({
          title: 'Hata',
          description: errorMessage,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('[VALIDATE_EMAIL] Hata:', error);
      toast({
        title: 'Hata',
        description: error instanceof Error ? error.message : 'Doğrulama başarısız',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Email doğrulama kodu gönderme fonksiyonu
  const sendEmail = async (userId: string) => {
    try {
      console.log('[SEND_EMAIL] Doğrulama kodu gönderiliyor, userId:', userId);
      const response = await fetch('https://intfinex.azurewebsites.net/api/Verification/SendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      console.log('[SEND_EMAIL] Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[SEND_EMAIL] API Error:', errorText);
        throw new Error(`API yanıtı başarısız: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('[SEND_EMAIL] Raw response:', responseText);

      if (!responseText) {
        console.log('[SEND_EMAIL] Empty response, assuming success');
        toast({
          title: 'Başarılı',
          description: 'Doğrulama kodu gönderildi',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      try {
        const result = JSON.parse(responseText);
        console.log('[SEND_EMAIL] Parsed result:', result);

        if (result.isSuccess) {
          toast({
            title: 'Başarılı',
            description: 'Doğrulama kodu gönderildi',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        } else {
          throw new Error(result.message || 'Email gönderilemedi');
        }
      } catch (parseError) {
        console.error('[SEND_EMAIL] JSON parse error:', parseError);
        // Boş yanıt veya geçersiz JSON durumunda başarılı kabul ediyoruz
        if (response.ok) {
          toast({
            title: 'Başarılı',
            description: 'Doğrulama kodu gönderildi',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        } else {
          throw new Error('Geçersiz API yanıtı');
        }
      }
    } catch (error) {
      console.error('[SEND_EMAIL] Hata:', error);
      toast({
        title: 'Hata',
        description: error instanceof Error ? error.message : 'Doğrulama kodu gönderilemedi',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
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
          console.log("[LOGIN] Kullanıcı aranıyor, email:", formData.email);
          const currentUser = userListData.data.find((u: User) => u.email === formData.email);

          if (currentUser) {
            console.log("[LOGIN] Kullanıcı bulundu:", {
              id: currentUser.id,
              email: currentUser.email,
              userLevel: currentUser.userLevel,
              isEmailApproved: currentUser.isEmailApproved
            });
    
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
              console.log("[LOGIN] Email doğrulanmamış, yeni doğrulama kodu gönderiliyor...");
              setErrorMessage('Please perform email integration');
              // Yeni doğrulama kodu gönder
              if (currentUser.id) {
                setCurrentUserId(currentUser.id);
                setShowVerification(true);
                sendEmail(currentUser.id);
              } else {
                console.error('[LOGIN] User ID bulunamadı');
                toast({
                  title: 'Hata',
                  description: 'Kullanıcı ID bulunamadı',
                  status: 'error',
                  duration: 3000,
                  isClosable: true,
                });
              }
              toast({
                title: 'Email Doğrulanmamış',
                description: 'Yeni doğrulama kodu gönderildi. Lütfen email adresinizi kontrol edin.',
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
              opacity={isLoggedIn ? 0.3 : 1}
              pointerEvents={isLoggedIn ? 'none' : 'auto'}
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
              opacity={isLoggedIn ? 0.3 : 1}
              pointerEvents={isLoggedIn ? 'none' : 'auto'}
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
                {showVerification && (
                  <Box mb={{ base: 2, md: 4 }}>
                    <CustomInput 
                      placeholder="Verification Code" 
                      icon={FaEnvelope}
                      onChange={(value) => setFormData({...formData, verificationCode: value})}
                    />
                    <CustomButton 
                      onClick={validateEmailCode}
                      buttonText="Verify Code"
                      width="100%"
                      mt={2}
                    />
                    <Button
                                onClick={async () => {
                                  setIsLoading(true);
                                  await sendEmail(currentUserId);
                                  setIsLoading(false);
                                }}
                                variant="ghost"
                                color="blue.400"
                                fontSize={{ base: "xs", sm: "sm" }}
                                _hover={{ color: '#36b0e2' }}
                                loading={isLoading}
                                loadingText="Gönderiliyor..."
                              >
                                Resend code
                              </Button>
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
                          Email validation code is not valid or expired!
                        </Text>
                      </Box>
                    )}
                  </Box>
                )}
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