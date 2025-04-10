'use client'

import {
  Flex,
  Image,
  Text,
  Grid,
  Box,
  Input,
  Stack
} from '@chakra-ui/react'
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
import Btn from '@/components/ui/button';

function DashboardTop() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  interface UserData {
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
  const [updateData, setUpdateData] = useState({
    email: '',
    phoneNumber: '',
    password: ''
  });

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
    <Box w="full" top={0} zIndex={10} bg="transparent" pt ={150}>
      <Box maxW="1400px" mx="auto" px={{ base: 4, md: 6, lg: 8 }} py={{ base: 2, md: 4 }}>
        {/* Desktop View */}
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
          gap={6}
          alignItems="center"
          display={{ base: 'none', md: 'grid' }}
        >
          <Text 
            fontSize={{ base: 'sm', md: 'md' }}
            alignItems="center"
            backgroundImage="linear-gradient(to left, #000, rgba(54, 176, 226, 0.8), #000)"
            backgroundRepeat="no-repeat"
            backgroundSize="100% 2px, 2px 100%"
            boxShadow="0px -10px 20px 0px inset rgba(54, 176, 226, 0.5)"
            p={{ base: "8px 16px", md: "10px 30px" }}
            borderRadius={10}
            transition="all 0.3s ease"
            zIndex={1}
            w="33%"
            cursor="pointer"
          >
            Dashboard
          </Text>
          <Text fontSize={{ base: 14, md: 16 }} 
            fontWeight={300} 
            opacity={0.7} 
            cursor="no-drop"
            mb={{ base: 4, md: 0 }}
            ml="-60%"
          >
            Financial Room (Verification Required)
          </Text>
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
                      setUpdateData({
                        email: userData?.email || '',
                        phoneNumber: userData?.phoneNumber || '',
                        password: ''
                      });
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

        {/* Mobile View */}
        <Flex
          display={{ base: 'flex', md: 'none' }}
          direction="column"
          gap={4}
          py={2}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Flex gap={3} alignItems="center">
              <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
              <Text fontSize={20} fontWeight={500}>Intifinex</Text>
            </Flex>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" gap={2}>
            {items.map((item) => (
              <Box
                key={item.name}
                fontSize="sm"
                alignItems="center"
                backgroundImage={item.name === "Dashboard" ? "linear-gradient(to left, #000, rgba(54, 176, 226, 0.8), #000)" : "none"}
                backgroundRepeat="no-repeat"
                backgroundSize={item.name === "Dashboard" ? "100% 2px, 2px 100%" : "auto"}
                boxShadow={item.name === "Dashboard" ? "0px -10px 20px 0px inset rgba(54, 176, 226, 0.5)" : "none"}
                p="8px 12px"
                borderRadius={8}
                transition="all 0.3s ease"
                zIndex={1}
                flex={1}
                textAlign="center"
                _hover={{
                  ...(item.name === "Settings" && { 
                    backgroundImage: "linear-gradient(to left, #000, rgba(54, 176, 226, 0.2), #000)",
                    boxShadow: "0px -10px 20px 0px inset rgba(54, 176, 226, 0.4)",
                    cursor: 'pointer'
                  }),
                  ...(item.name === "Logout" && {
                    backgroundImage: "linear-gradient(to left, #000, rgba(255, 87, 34, 0.2), #000)",
                    boxShadow: "0px -10px 20px 0px inset rgba(255, 0, 0, 0.4)",
                    cursor: 'pointer'
                  }),
                  ...(item.name === "Dashboard" && {
                    backgroundImage: "linear-gradient(to left, #000, rgba(255, 87, 34, 0.2), #000)",
                    cursor: 'pointer'
                  })
                }}
                onClick={() => {
                  if (item.name === "Logout") {
                    localStorage.removeItem("userData");
                    router.push("/");
                  } else if (item.name === "Settings") {
                    setUpdateData({
                      email: userData?.email || '',
                      phoneNumber: userData?.phoneNumber || '',
                      password: ''
                    });
                    onOpen();
                  }
                }}
              >
                {item.name}
              </Box>
            ))}
            {userData && (
              <Text fontSize={20} fontWeight={500}>
                Welcome Back{" "}
                <span style={{
                  background: 'linear-gradient(to right, #ffffff, #36b0e2)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {userData.name} {userData.surname}
                </span>
              </Text>
            )}
          </Flex>
        </Flex>
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
          borderRadius="15px"
          p={4}
          width="50%"
        >
          <ModalHeader color="white">Update Profile</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <Stack>
              <FormControl>
                <FormLabel color="white">Email</FormLabel>
                <Input
                  value={updateData.email}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="New Email"
                  bg="transparent"
                  color="white"
                  borderColor="#36b0e2"
                  _hover={{ borderColor: '#36b0e2' }}
                  _focus={{ borderColor: '#36b0e2', boxShadow: '0 0 0 1px #36b0e2' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color="white">Phone Number</FormLabel>
                <Input
                  value={updateData.phoneNumber}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="New Phone Number"
                  bg="transparent"
                  color="white"
                  borderColor="#36b0e2"
                  _hover={{ borderColor: '#36b0e2' }}
                  _focus={{ borderColor: '#36b0e2', boxShadow: '0 0 0 1px #36b0e2' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color="white">Password</FormLabel>
                <Input
                  type="password"
                  value={updateData.password}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="New Password"
                  bg="transparent"
                  color="white"
                  borderColor="#36b0e2"
                  _hover={{ borderColor: '#36b0e2' }}
                  _focus={{ borderColor: '#36b0e2', boxShadow: '0 0 0 1px #36b0e2' }}
                />
              </FormControl>

              <Btn 
                buttonText="Update Profile" 
                onClick={async () => {
                  try {
                    setIsUpdating(true);
                    const authData = localStorage.getItem('userData');
                    if (!authData) {
                      router.push('/');
                      return;
                    }

                    const parsedAuthData = JSON.parse(authData);
                    const response = await fetch('https://intfinex.azurewebsites.net/api/User/Update', {
                      method: 'PUT',
                      headers: {
                        'Authorization': `Bearer ${parsedAuthData.data[0]}`,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        email: updateData.email,
                        phoneNumber: updateData.phoneNumber,
                        password: updateData.password || undefined
                      })
                    });

                    const result = await response.json();

                    if (result.isSuccess) {
                      toast({
                        title: 'Profile Updated',
                        description: 'Your profile has been successfully updated.',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                      });
                      // Update local user data
                      if (userData) {
                        setUserData({
                          ...userData,
                          email: updateData.email,
                          phoneNumber: updateData.phoneNumber
                        });
                      }
                      onClose();
                    } else {
                      throw new Error(result.errors?.[0] || 'Update failed');
                    }
                  } catch (error) {
                    toast({
                      title: 'Error',
                      description: error instanceof Error ? error.message : 'Failed to update profile',
                      status: 'error',
                      duration: 5000,
                      isClosable: true,
                    });
                  } finally {
                    setIsUpdating(false);
                  }
                }}
                loading={isUpdating}
                mb={4}
              />
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default DashboardTop
