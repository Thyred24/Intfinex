'use client'

import {
  Flex,
  Text,
  Grid,
  Box,
  Input,
  Stack,
  Button
} from '@chakra-ui/react'
import {
  Alert,
  AlertIcon,
  AlertDescription
} from '@chakra-ui/alert'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/menu'
import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/modal'
import { useDisclosure } from '@chakra-ui/hooks'
import {
  FormControl,
  FormLabel
} from '@chakra-ui/form-control'
import { useToast } from '@chakra-ui/toast'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface DashboardTopProps {
  onViewChange: (view: string) => void;
  activeView: string;
}

function DashboardTop({ onViewChange, activeView }: DashboardTopProps) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  interface UserData {
    id: number;
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
  }

  interface ApiResponse {
    data: UserData[];
    isSuccess: boolean;
    errors: string[];
  }

  const [userData, setUserData] = useState<UserData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authData = localStorage.getItem('userData');
        if (!authData) {
          router.push('/login');
          return;
        }

        const parsedAuthData = JSON.parse(authData);
        if (!parsedAuthData.isSuccess || !parsedAuthData.data || parsedAuthData.data.length === 0) {
          router.push('/login');
          return;
        }

        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          router.push('/login');
          return;
        }

        const response = await fetch('https://intfinex.azurewebsites.net/api/User/GetList', {
          headers: {
            'Authorization': `Bearer ${parsedAuthData.data[0]}`,
            'Content-Type': 'application/json'
          }
        });

        const data: ApiResponse = await response.json();
        console.log('API response:', data);

        if (data.isSuccess && data.data) {
          const userInfo = data.data.find(user => user.email === userEmail);
          if (userInfo) {
            setUserData(userInfo);
          } else {
            console.error('User not found in API response');
            router.push('/');
          }
        } else {
          console.error('API request failed:', data.errors);
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/');
      }
    };

    fetchUserData();
  }, [router]);

  const items = [
    { name: "Settings" },
    { name: "Logout" }
  ]

  return (
    <Box w="full" top={0} zIndex={10} bg="transparent" pt={{ base: 100, md: 150 }}>
      <Box maxW="1400px" mx="auto" px={{ base: 4, md: 6, lg: 8 }} py={{ base: 2, md: 4 }}>
        {/* Mobile View */}
        <Flex
          direction="column"
          gap={4}
          display={{ base: 'flex', lg: 'none' }}
          alignItems="center"
          width="100%"
        >
          <Flex width="100%" gap={4} justifyContent="center">
            <Button 
              fontSize={{ base: 'sm', md: 'md' }}
              alignItems="center"
              backgroundImage={activeView === 'dashboard' ? "linear-gradient(to left, #000, rgba(54, 176, 226, 0.8), #000)" : "none"}
              backgroundRepeat="no-repeat"
              backgroundSize="100% 2px, 2px 100%"
              boxShadow={activeView === 'dashboard' ? "0px -10px 20px 0px inset rgba(54, 176, 226, 0.5)" : "none"}
              p="8px 16px"
              borderRadius={10}
              transition="all 0.3s ease"
              zIndex={1}
              flex="1"
              maxW="200px"
              cursor="pointer"
              onClick={() => onViewChange('dashboard')}
              color="white"
              bg="transparent"
              _hover={{ opacity: 0.8 }}
            >
              Dashboard
            </Button>
            <Button 
              fontSize={{ base: 'sm', md: 'md' }}
              alignItems="center"
              backgroundImage={activeView === 'financial' ? "linear-gradient(to left, #000, rgba(54, 176, 226, 0.8), #000)" : "none"}
              backgroundRepeat="no-repeat"
              backgroundSize="100% 2px, 2px 100%"
              boxShadow={activeView === 'financial' ? "0px -10px 20px 0px inset rgba(54, 176, 226, 0.5)" : "none"}
              p="8px 16px"
              borderRadius={10}
              transition="all 0.3s ease"
              zIndex={1}
              flex="1"
              maxW="200px"
              cursor="pointer"
              onClick={() => onViewChange('financial')}
              color="white"
              bg="transparent"
              _hover={{ opacity: 0.8 }}
            >
              Financial
            </Button>
          </Flex>
          <Text 
            fontSize="14px"
            fontWeight={300}
            opacity={0.7}
            cursor="no-drop"
            textAlign="center"
          >
            Financial Room (Verification Required)
          </Text>
          <Menu>
            <MenuButton
              as={Flex}
              fontSize="14px"
              cursor="pointer"
              alignItems="center"
              gap={2}
            >
            <span>Welcome Back {" "}</span>  <span style={{
                        background: 'linear-gradient(to right, #ffffff, #36b0e2)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }} >{userData?.name}</span>
              <ChevronDownIcon />
            </MenuButton>
            <MenuList bg="rgba(0, 0, 0, 0.85)" border="1px solid" borderColor="#36b0e2">
              {items.map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    if (item.name === "Settings") {
                      onOpen();
                    } else if (item.name === "Logout") {
                      localStorage.clear();
                      router.push('/');
                    }
                  }}
                  bg="transparent"
                  color="white"
                  _hover={{ bg: 'rgba(54, 176, 226, 0.2)' }}
                >
                  {item.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Flex>

        {/* Desktop View */}
        <Grid
          className="custom-grid"
          templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
          gap={{ base: 4, md: 6 }}
          alignItems="center"
          display={{ base: 'none', lg: 'grid' }}
        >
          <Button 
            fontSize={{ base: 'sm', md: 'md' }}
            alignItems="center"
            backgroundImage={activeView === 'dashboard' ? "linear-gradient(to left, #000, rgba(54, 176, 226, 0.8), #000)" : "none"}
            backgroundRepeat="no-repeat"
            backgroundSize="100% 2px, 2px 100%"
            boxShadow={activeView === 'dashboard' ? "0px -10px 20px 0px inset rgba(54, 176, 226, 0.5)" : "none"}
            p={{ base: "8px 16px", md: "10px 30px" }}
            borderRadius={10}
            transition="all 0.3s ease"
            zIndex={1}
            w="33%"
            cursor="pointer"
            onClick={() => onViewChange('dashboard')}
          >
            Dashboard
          </Button>
          <Button 
            fontSize={{ base: 14, md: 16 }} 
            fontWeight={300} 
            opacity={activeView === 'financial' ? 1 : 0.7} 
            cursor="pointer"
            mb={{ base: 4, md: 0 }}
            ml="-60%"
            backgroundImage={activeView === 'financial' ? "linear-gradient(to left, #000, rgba(54, 176, 226, 0.8), #000)" : "none"}
            backgroundRepeat="no-repeat"
            backgroundSize="100% 2px, 2px 100%"
            boxShadow={activeView === 'financial' ? "0px -10px 20px 0px inset rgba(54, 176, 226, 0.5)" : "none"}
            onClick={() => onViewChange('financial')}
          >
            Financial Room (Verification Required)
          </Button>
          <Flex justifyContent="flex-end" alignItems="center" gap={{ base: 2, md: 4 }}>
            {userData && (
              <Menu>
                <MenuButton
                  as={Flex}
                  alignItems="center"
                  gap={2}
                  cursor="pointer"
                  _hover={{ opacity: 0.8 }}
                >
                  <Flex alignItems="center">
                    <Text fontSize={20} fontWeight={500}>
                      Welcome Back{" "}
                      <span style={{
                        background: 'linear-gradient(to right, #ffffff, #36b0e2)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        {userData.name}
                      </span>
                    </Text>
                    <ChevronDownIcon color="#36b0e2" w={40} h={40} ml={2} />
                  </Flex>
                </MenuButton>
                <MenuList bg="#000A1C" border="1px solid #36b0e2">
                  <MenuItem
                    onClick={() => {
                      onOpen();
                    }}
                    _hover={{ bg: 'rgba(54, 176, 226, 0.2)' }}
                    color="white"
                    p="5px 30px"
                    cursor="pointer"
                  >
                    Settings
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      localStorage.removeItem("userData");
                      router.push("/");
                    }}
                    _hover={{ bg: 'rgba(255, 87, 34, 0.2)' }}
                    color="white"
                    p="5px 30px"
                    cursor="pointer"
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Grid>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px)"
        />
        <ModalContent
          bg="rgba(0, 0, 0, 0.85)"
          border="1px solid"
          borderColor="#36b0e2"
          borderRadius="10px"
          p={10}
          width={{ base: '90%', sm: '80%', md: '60%', lg: '50%' }}
          alignItems="center"
          mt={200}
        >
          <ModalHeader color="white" fontSize={{ base: '18px', md: '20px' }}>Change Password</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={{ base: 4, md: 6 }}>
            <Stack gap={4}>
              {passwordError && (
                <Alert status="error" bg="rgba(254, 178, 178, 0.1)" borderRadius="md">
                  <AlertIcon />
                  <AlertDescription color="red.300">{passwordError}</AlertDescription>
                </Alert>
              )}

              <FormControl>
                <FormLabel color="white" fontSize={{ base: '14px', md: '16px' }}>Current Password</FormLabel>
                <Input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                  placeholder="Enter current password"
                  size={{ base: 'sm', md: 'md' }}
                  bg="transparent"
                  color="white"
                  borderColor="#36b0e2"
                  _hover={{ borderColor: '#36b0e2' }}
                  _focus={{ borderColor: '#36b0e2', boxShadow: '0 0 0 1px #36b0e2' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color="white" fontSize={{ base: '14px', md: '16px' }}>New Password</FormLabel>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                  size={{ base: 'sm', md: 'md' }}
                  bg="transparent"
                  color="white"
                  borderColor="#36b0e2"
                  _hover={{ borderColor: '#36b0e2' }}
                  _focus={{ borderColor: '#36b0e2', boxShadow: '0 0 0 1px #36b0e2' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color="white" fontSize={{ base: '14px', md: '16px' }}>Confirm New Password</FormLabel>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                  size={{ base: 'sm', md: 'md' }}
                  bg="transparent"
                  color="white"
                  borderColor="#36b0e2"
                  _hover={{ borderColor: '#36b0e2' }}
                  _focus={{ borderColor: '#36b0e2', boxShadow: '0 0 0 1px #36b0e2' }}
                />
              </FormControl>

              <Button
  width="100%"
  bg="#36b0e2"
  color="white"
  _hover={{ bg: '#2c8eb3' }}
  size={{ base: 'sm', md: 'md' }}
  onClick={async () => {
    try {
      console.log("Başlangıç: Şifre güncelleme işlemi başlıyor");
      setIsUpdating(true);
      setPasswordError('');

      // Validation
      console.log("Validation yapılıyor...");
      if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        console.warn("Eksik alanlar var:", passwordData);
        setPasswordError('Please fill in all fields');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        console.warn("Yeni şifreler uyuşmuyor");
        setPasswordError('New passwords do not match');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        console.warn("Yeni şifre çok kısa");
        setPasswordError('New password must be at least 6 characters long');
        return;
      }

      console.log("Validation geçti");

      const authData = localStorage.getItem('userData');
      if (!authData) {
        console.error("LocalStorage'da userData bulunamadı");
        router.push('/');
        return;
      }

      const parsedAuthData = JSON.parse(authData);
      console.log("LocalStorage'dan alınan authData:", parsedAuthData);

      if (!userData?.id) {
        console.error("userData.id bulunamadı");
        setPasswordError('User ID not found');
        return;
      }

      const endpoint = `https://intfinex.azurewebsites.net/api/User/Update/${userData.id}`;
      const bodyData = {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      };

      console.log("API endpoint:", endpoint);
      console.log("Gönderilen veri:", bodyData);

      const response = await fetch(endpoint, {
        method: 'PUT', // 'POST' yerine 'PUT' kullanıyoruz
        headers: {
          'Authorization': `Bearer ${parsedAuthData.data[0]}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: userData.id, // id burada gönderilmeli
          password: passwordData.newPassword, // yalnızca şifreyi değiştiriyoruz
          email: "", // diğer zorunlu alanları boş bırakıyoruz
          name: "", 
          surname: "",
          uniqueId: 0, // veya varsayılan değerler
          phoneNumber: "",
          userLevelId: 0,
          accountAgent: "",
          document: "",
          service: ""
        })
      });

      console.log("API'den yanıt alındı. Status:", response.status);

      const contentType = response.headers.get("content-type");
      console.log("Response content-type:", contentType);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Hatası (response.ok değil):", errorText);
        setPasswordError('Password change failed');
        return;
      }

      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        console.log("API JSON yanıtı:", result);

        if (result.isSuccess) {
          toast({
            title: 'Success',
            description: 'Password changed successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          onClose();
          setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } else {
          console.warn("İşlem başarısız:", result);
          setPasswordError(result.message || result.errors?.[0] || 'Failed to change password');
        }
      } else {
        const text = await response.text();
        console.error("Beklenmeyen formatta yanıt alındı:", text);
        setPasswordError("Sunucu beklenmeyen bir cevap verdi");
      }
    } catch (error) {
      console.error('Şifre değiştirme sırasında hata oluştu:', error);
      setPasswordError('An error occurred. Please try again.');
      } finally {
      console.log("İşlem tamamlandı. Yüklenme durumu sıfırlanıyor");
      setIsUpdating(false);
    }
  }
}
loading={isUpdating}
            >
              Change Password
            </Button>
          </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default DashboardTop