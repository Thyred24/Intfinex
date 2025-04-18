'use client'

import { Box, Flex, Grid, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@chakra-ui/toast'
import { fetchUserByEmail } from '@/src/fetchUserByEmail';

interface User {
  uniqueId: string;
  name: string;
  email: string;
  phoneNumber?: string;
  userLevel?: string;
  accountAgent?: string;
  status?: string;
  document?: string;
  service?: string;
  registerDate?: string;
  security?: string;
  documents?: string;
}

function Dashboard() {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (typeof window === 'undefined') return;

        const userDataRaw = localStorage.getItem('userData');
        const userEmail = localStorage.getItem("userEmail");
        console.log("[Dashboard] LocalStorage'dan okunan veriler:", {
          userDataRaw,
          userEmail
        });

        if (!userDataRaw || !userEmail) {
          console.log("[Dashboard] Oturum bilgileri bulunamadı");
          localStorage.removeItem('userData');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userList');
          localStorage.removeItem('adminAuthenticated');
          localStorage.removeItem('tempUser');
          toast({
            title: 'Oturum Hatası',
            description: 'Lütfen tekrar giriş yapın',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          window.location.href = '/';
          return;
        }

        let userData;
        try {
          userData = JSON.parse(userDataRaw);
          console.log("[Dashboard] Parse edilen userData:", userData);
          
          if (!userData.data || !userData.data[0]) {
            throw new Error("Token bulunamadı");
          }
        } catch (e) {
          console.log("[Dashboard] Token format hatası:", e);
          localStorage.removeItem('userData');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userList');
          localStorage.removeItem('adminAuthenticated');
          localStorage.removeItem('tempUser');
          toast({
            title: 'Token Hatası',
            description: 'Oturum bilgileriniz geçersiz. Lütfen tekrar giriş yapın.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          window.location.href = '/';
          return;
        }

        const token = userData.data[0];
        console.log("[Dashboard] Kullanılacak token:", token);

        const user = await fetchUserByEmail(userEmail, token);

        if (!user) {
          localStorage.removeItem('userData');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userList');
          localStorage.removeItem('adminAuthenticated');
          localStorage.removeItem('tempUser');
          toast({
            title: 'API Hatası',
            description: `Kullanıcı bilgileri alınamadı`,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          setError('Sunucu bağlantı hatası');
          return;
        }

        if (!user) {
          console.log("[Dashboard] API yanıtı başarısız ya da veri yok");
          toast({
            title: 'Veri Hatası',
            description: 'Kullanıcı bilgileri alınamadı',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          setError('Kullanıcı bilgileri alınamadı');
          return;
        }

        console.log("[Dashboard] Aranan email:", userEmail);
        const currentUser = user;

        console.log("[Dashboard] Bulunan kullanıcı:", currentUser);

        if (currentUser) {
          setUser(currentUser);

          // Kullanıcı listesini localStorage'a kaydet
          console.log('[Dashboard] Kullanıcı listesi localStorage\'a kaydediliyor');
          localStorage.setItem('userList', JSON.stringify([currentUser]));

          // Check if user is admin and redirect
          if (currentUser.userLevel === 'Admin') {
            console.log('[Dashboard] Admin kullanıcısı tespit edildi, yönlendirme yapılıyor');
            router.push('/admin');
            return;
          }

          toast({
            title: 'Başarılı',
            description: 'Hoş geldiniz!',
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
        } else {
          localStorage.removeItem('userData');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userList');
          localStorage.removeItem('adminAuthenticated');
          localStorage.removeItem('tempUser');
          console.log("[Dashboard] Kullanıcı bulunamadı");
          toast({
            title: 'Kullanıcı Bulunamadı',
            description: 'Hesap bilgilerinize ulaşılamadı',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          setError('Kullanıcı bulunamadı');
        }

      } catch (error) {
        console.error("Hata:", error);
        localStorage.removeItem('userData');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userList');
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('tempUser');
        toast({
          title: 'Beklenmeyen Hata',
          description: 'Bir sorun oluştu, lütfen tekrar deneyin',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setError('Beklenmeyen bir hata oluştu');
        window.location.href = '/';
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router, toast]);


  
  if (loading) return <Text mt={20} textAlign="center" color="white">Yükleniyor...</Text>;
  if (error) return <Text mt={20} textAlign="center" color="red.500">{error}</Text>;
  if (!user) return <Text mt={20} textAlign="center" color="white">Kullanıcı bilgileri bulunamadı.</Text>;

  const userInfoItems = [
    { name: "ID", data: user.uniqueId || "null" },
    { name: "Name", data: user.name },
    { name: "Email", data: user.email },
    { name: "Phone", data: user.phoneNumber || "Not Provided" },
    { name: "Security", data: user.security || "Password" },
    { name: "Agent", data: user.accountAgent || "Global Team" },
    { name: "Statu", data: user.userLevel || "Basic" },
    { name: "Document", data: user.document || "N/A" },
    { name: "Service", data: user.service || "N/A" },
    { name: "Registration", data: user.registerDate || "Unknown" },
  ];

  return (
    <Box
      w="full"
      py={{ base: 6, md: 12 }}
      px={{ base: 4, md: 6, lg: 8 }}
    >
      <Box
        maxW="1400px"
        mx="auto"
        mt={{ base: 4, md: 8, lg: 12 }}
      >
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
          <Flex direction="column" justifyContent="center" gap={{ base: 3, md: 5 }}>
            {userInfoItems.map((item) => (
              <Grid 
                key={item.name} 
                templateColumns={{ base: "1fr", sm: "1fr 1fr" }}
                gap={{ base: 1, sm: 4 }}
                alignItems="center"
              >
                <Text fontSize={{ base: 14, md: 16 }}>{item.name}</Text>
                <Text 
                  fontSize={{ base: 14, md: 16 }} 
                  fontWeight={300} 
                  opacity={0.7} 
                  cursor="no-drop"
                  textAlign={{ base: "left", sm: "right" }}
                >
                  {item.data}
                </Text>
              </Grid>
            ))}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
