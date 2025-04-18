'use client'

import { Box, Button, Flex, Text, Grid, GridItem, Input } from '@chakra-ui/react'
import { Select } from '@chakra-ui/select'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton } from '@chakra-ui/modal'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { useToast } from '@chakra-ui/toast'
import { useDisclosure } from '@chakra-ui/hooks'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useCallback } from 'react'
import Btn from '@/components/ui/button'

// API endpoint sabitleri
const API_ENDPOINTS = {
    GET_USERS: 'https://intfinex.azurewebsites.net/api/User/GetList',
    UPDATE_USER: 'https://intfinex.azurewebsites.net/api/User/Update',
    DELETE_USER: 'https://intfinex.azurewebsites.net/api/User/Delete',
    UPDATE_VERIFICATION: 'https://intfinex.azurewebsites.net/api/User/UpdateVerification'
} as const;

interface User {
  id: string; // UUID formatında kullanıcı ID'si
  uniqueId: string;
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  userLevel?: string;
  userLevelId?: string;
  registerDate?: string;
  emailVerification?: boolean;
  smsVerification?: boolean;
  isEmailApproved?: boolean;
  accountAgent?: string;
  status?: string;
  document?: string;
  service?: string;
  security?: string;
}

interface ApiResponse<T> {
    isSuccess: boolean;
    message?: string;
    data?: T;
}

interface ApiUser extends Omit<User, 'emailVerification' | 'smsVerification'> {
    emailVerification?: boolean | string;
    smsVerification?: boolean | string;
}

// Token yönetimi için yardımcı fonksiyonlar
const getAuthToken = () => {
    const isAdmin = localStorage.getItem('adminAuthenticated') === 'true';
  
    if (isAdmin) {
      console.log('[Admin] Giriş yapılmış, token gerekli değil.');
      return ''; // token boş döndür, çünkü backend istemiyor
    }
  
    try {
      const userDataStr = localStorage.getItem('userData');
      if (!userDataStr) {
        console.error('[User] userData bulunamadı.');
        throw new Error('Token bulunamadı');
      }
  
      const userData = JSON.parse(userDataStr);
      if (!userData.data || !userData.data[0]) {
        console.error('[User] Token verisi eksik:', userData);
        throw new Error('Token bulunamadı');
      }
  
      const token = userData.data[0];
      console.log('[User] Kullanıcı token:', token);
      return token;
    } catch (error) {
      console.error('[User] Token parse hatası:', error);
      throw new Error('Token formatı geçersiz');
    }
  };

  const createAuthHeaders = (token?: string) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
  
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  
    return headers;
  };

function Admin() {
    const [users, setUsers] = useState<User[]>([]);
    const [adminName, setAdminName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [emailValidation, setEmailValidation] = useState(() => {
        const stored = localStorage.getItem('emailValidation');
        return stored !== null ? stored === 'true' : true; // varsayılan true
      });
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newPassword, setNewPassword] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const toast = useToast();

    const toggleEmailValidation = useCallback(() => {
        try {
            const newValidation = !emailValidation;
            
            // LocalStorage'a kaydet
            localStorage.setItem('emailValidation', newValidation.toString());
            
            // State'i güncelle
            setEmailValidation(newValidation);

            // needsEmailVerification'ı güncelle
            if (newValidation) {
                // Email validation aktif, needsEmailVerification true olmalı
                localStorage.setItem('needsEmailVerification', 'true');
            } else {
                // Email validation devre dışı, needsEmailVerification kaldır
                localStorage.removeItem('needsEmailVerification');
            }
            
            toast({
                title: 'Success',
                description: `Email validation ${newValidation ? 'activated' : 'deactivated'}`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Email validation toggle error:', error);
            toast({
                title: 'Error',
                description: 'Could not change email validation status',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    }, [emailValidation, toast]);

    // API çağrısı için yardımcı fonksiyon
    const makeApiCall = useCallback(async <T,>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
        console.log('[Admin] API çağrısı başlıyor:', url);
        try {
          const token = getAuthToken();
          const headers = createAuthHeaders(token);
      
          const response = await fetch(url, {
            ...options,
            headers: {
              ...headers,
              ...(options.headers || {})
            }
          });
      
          if (!response.ok) {
            throw new Error(`API yanıtı başarısız: ${response.status} ${response.statusText}`);
          }
      
          const result = await response.json();
          if (!result.isSuccess) {
            throw new Error(result.message || 'İşlem başarısız');
          }
      
          return result;
        } catch (error) {
          console.error('[Admin] API çağrısı hatası:', error);
          throw error;
        }
      }, []);

      const handleButtonClick = () => {
        if (!isEditing) {
          // İlk tıklamada sadece input alanını aç
          setIsEditing(true);
        } else {
          // İkinci tıklamada şifre güncellemesini yap
          updatePassword();
        }
      };

      const updatePassword = async () => {
        if (!newPassword || newPassword.length < 6) {
          toast({
            title: 'Geçersiz şifre',
            description: 'Şifre en az 6 karakter olmalı.',
            status: 'warning',
            duration: 3000,
            isClosable: true,
          });
          return;
        }
    
        setLoading(true);
    
        try {
          const response = await fetch('https://intfinex.azurewebsites.net/api/Admin/UpdatePassword', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: newPassword }),
          });
    
          const result = await response.json();
    
          if (result.isSuccess) {
            toast({
              title: 'Şifre güncellendi',
              description: 'Yeni şifreniz başarıyla kaydedildi.',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            setNewPassword('');
            setIsEditing(false); // input alanını kapat
          } else {
            throw new Error(result.errors?.[0] || 'Bilinmeyen bir hata oluştu');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
          toast({
            title: 'Hata oluştu',
            description: errorMessage,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      };

    // Kullanıcı listesini çekme
    const fetchUsers = useCallback(async () => {
        try {
            console.log('[Admin] API çağrısı yapılıyor...');
            // Cache yoksa API'den çek
            const result = await makeApiCall<ApiUser[]>(API_ENDPOINTS.GET_USERS);
            
            if (result.data) {
                const processedUsers = result.data.map((user: ApiUser) => ({
                    ...user,
                    emailVerification: typeof user.emailVerification === 'string' 
                        ? user.emailVerification === 'true' 
                        : !!user.emailVerification,
                    smsVerification: typeof user.smsVerification === 'string' 
                        ? user.smsVerification === 'true' 
                        : !!user.smsVerification
                }));

                setUsers(processedUsers);
                localStorage.setItem('userList', JSON.stringify(result.data));

                const adminUser = processedUsers.find((user: User) => user.userLevel === 'admin');
                if (adminUser) {
                    setAdminName(adminUser.name);
                }
            }
        } catch (error) {
            console.error('Kullanıcı listesi yükleme hatası:', error);
            toast({
                title: 'Error',
                description: 'Failed to load user list',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            router.push('/');
        }
    }, [makeApiCall, toast, router, setUsers, setAdminName]);

    useEffect(() => {
        const initializeAdmin = async () => {
          /*  const token = localStorage.getItem('token');
            const userLevel = localStorage.getItem('userLevel'); // Eğer rol bilgisi tutuluyorsa
    
            // Kullanıcı giriş yapmamışsa veya admin değilse yönlendir
            if (!token || userLevel !== 'admin') {
                router.replace('/'); // veya ana sayfa: '/'
                return;
            } */
    
            try {
                await fetchUsers();
            } finally {
                setLoading(false);
            }
        };
    
        initializeAdmin();
    }, [fetchUsers, setLoading, router]);

    const handleLogout = () => {
        localStorage.removeItem('userData');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userList');
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('tempUser');
        router.push('/');
    };

    // Edit User fonksiyonu
    const handleEditUser = useCallback(async (userId: string) => {
        const user = users.find(u => u.uniqueId === userId);
        if (user) {
            setSelectedUser(user);
            onOpen();
        }
    }, [users, setSelectedUser, onOpen]);

const handleUpdateUser = async () => {
        if (!selectedUser) {
            console.warn('[UpdateUser] Seçili kullanıcı yok.');
            return;
        }
      
        const updateData = {
          id: selectedUser.id,
          email: selectedUser.email,
          name: selectedUser.name,
          surname: selectedUser.name,
          password: selectedUser.password,
          uniqueId: selectedUser.uniqueId,
          phoneNumber: selectedUser.phoneNumber,
          userLevel: selectedUser.userLevel,
          userLevelId: selectedUser.userLevelId,
          accountAgent: selectedUser.accountAgent,
          document: selectedUser.document,
          service: selectedUser.service,
          security: selectedUser.security,
        };

        const token = getAuthToken();

        const url = `https://intfinex.azurewebsites.net/api/User/Update/${selectedUser.id}`;

        console.log('[UpdateUser] Güncelleme URL:', url);
        console.log('[UpdateUser] Gönderilen token:', token);
        console.log('[UpdateUser] Body:', updateData);
      
        try {
          const response = await fetch(
            url,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
              body: JSON.stringify(updateData)
            }
          );
      
          console.log('[UpdateUser] HTTP Durum Kodu:', response.status);
          const result = await response.json();
          console.log('[UpdateUser] API Yanıtı:', result);
      
          if (result.isSuccess) {
            toast({
              title: 'Başarılı',
              description: 'Kullanıcı bilgileri güncellendi',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            onClose();
            fetchUsers();
          } else {
            toast({
              title: 'Hata',
              description: 'Güncelleme başarısız',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
        } catch (error) {
          console.error('Update error:', error);
          toast({
            title: 'Hata',
            description: 'Sunucuya bağlanılamadı',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      };

    // Delete User fonksiyonu
    const handleDeleteUser = async (user: User) => {
        if (!user.id) {
            toast({
                title: 'Error',
                description: 'User ID not found',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!window.confirm(`Are you sure you want to delete user ${user.name}?`)) return;

        try {
            const response = await fetch(`https://intfinex.azurewebsites.net/api/User/Delete/${user.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const responseData = await response.json();
            console.log('Delete user response:', responseData);

            if (!responseData.isSuccess) {
                throw new Error('Failed to delete user');
            }

            toast({
                title: 'Success',
                description: `${user.name} has been successfully deleted.`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            // Refresh user list automatically
            await fetchUsers();
        } catch (error) {
            console.error('[Admin] User deletion error:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete user. Please try again.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    if (loading) {
        return <Text color="white">Yükleniyor...</Text>;
    }



    return (
        <Box p={10}>
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
                <Text fontSize="48px" fontWeight="bold" color="white">
                    Admin Panel
                </Text>
                <Flex gap={4} alignItems="center">
                    {isEditing && (
                        <Input
                            type="password"
                            placeholder="New Admin Password"
                            value={newPassword}
                            width="300px"
                            border="1px solid #36b0e2"
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    )}
                </Flex>

                <Button
                    onClick={handleButtonClick}
                    loading={loading}
                    bg="#36b0e2"
                    _hover={{ bg: "linear-gradient(to top, #002047 1%, rgb(54, 176, 226) 10%, #002047 100%)", color: "#ffffff", transition: "all 0.3s ease" }}
                    color="#000A1C"
                    transition="all 0.3s ease"
                >
                    {isEditing ? 'Update Admin Password' : 'Update Admin Password'}
                </Button>
                <Flex alignItems="center" gap={4}>
                    <Text fontSize="24px" color="white">
                        <span style={{
                            background: 'linear-gradient(to right, #ffffff, #36b0e2)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>{adminName}</span>
                    </Text>
                    <Btn 
                        buttonText="Logout"
                        onClick={handleLogout}
                    />
                </Flex>
            </Flex>

            <Flex gap={6} mb={8}>
                <Box
                    bg="rgba(0, 0, 0, 0.3)"
                    p={6}
                    borderRadius="xl"
                    flex="1"
                    _hover={{ bg: "rgba(0, 0, 0, 0.4)" }}
                    transition="all 0.3s"
                >
                    <Text fontSize="xl" color="white" mb={4}>SMS Verification</Text>
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text color="gray.300">Global Status</Text>
                        <Button
                            size="lg"
                            colorScheme="teal"
                            variant="outline"
                            cursor="disabled"
                        >
                            Turn Off All
                        </Button>
                    </Flex>
                </Box>
                <Box
                    bg="rgba(0, 0, 0, 0.3)"
                    p={6}
                    borderRadius="xl"
                    flex="1"
                    _hover={{ bg: "rgba(0, 0, 0, 0.4)" }}
                    transition="all 0.3s"
                >
                    <Text fontSize="xl" color="white" mb={4}>Email Verification</Text>
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text color="gray.300">Global Status</Text>
                        <Box>
          <Button
            size="lg"
            bg="#36b0e2"
            color="#000A1C"
            _hover={{
              bg: "linear-gradient(to top, #002047 1%, rgb(54, 176, 226) 10%, #002047 100%)",
              color: "#ffffff",
              transition: "all 0.3s ease"
            }}
            transition="all 0.3s ease"
            onClick={toggleEmailValidation}
          >
            {emailValidation ? 'Turn Off All' : 'Turn On All'}
          </Button>
          <Text color="gray.400" mt={2} fontSize="sm">
            Current Status: <Text as="span" color={emailValidation ? '#36b0e2' : 'gray.400'}>
              {emailValidation ? 'Active' : 'Inactive'}
            </Text>
          </Text>
        </Box>
                    </Flex>
                </Box>
            </Flex>

            <Box bg="rgba(0, 0, 0, 0.3)" p={6} borderRadius="xl" mb={6}>
                <Box mb={4}>
                    <Grid
                        templateColumns="repeat(11, 1fr)"
                        gap={4}
                        p={4}
                        borderBottom="2px solid rgba(54, 176, 226, 0.5)"
                        color="white"
                        fontWeight="bold"
                    >
                        <GridItem>ID</GridItem>
                        <GridItem>Name</GridItem>
                        <GridItem>Email</GridItem>
                        <GridItem>Account Agent</GridItem>
                        <GridItem>Statu</GridItem>
                        <GridItem>Document</GridItem>
                        <GridItem>Service</GridItem>
                        <GridItem>Security</GridItem>
                        <GridItem>Verification</GridItem>
                        <GridItem>Edit</GridItem>
                        <GridItem>Delete</GridItem>
                    </Grid>
                </Box>

                <Box mt={4}>
                    {users
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((user) => (
                        <Box
                            key={user.uniqueId}
                            bg="rgba(0, 0, 0, 0.3)"
                            p={4}
                            mb={2}
                            borderRadius="lg"
                            _hover={{ bg: "rgba(0, 0, 0, 0.4)" }}
                            transition="all 0.3s"
                        >
                            <Grid
                                templateColumns="repeat(11, 1fr)"
                                gap={4}
                                alignItems="center"
                            >
                                <GridItem color="white" >
                                    <Text>{user.uniqueId}</Text>
                                </GridItem>
                                <GridItem color="white">
                                    <Text>{user.name}</Text>
                                </GridItem>
                                <GridItem color="white" minWidth="250px">
                                    <Text>{user.email}</Text>
                                </GridItem>
                                <GridItem color="white" >
                                    <Text>{user.accountAgent || "Global Team"}</Text>
                                </GridItem>
                                <GridItem color="white">
                                    <Text>{user.userLevel || "Basic"}</Text>
                                </GridItem>
                                <GridItem color="white">
                                    <Text>{user.document || "N/A"}</Text>
                                </GridItem>
                                <GridItem color="white">
                                    <Text>{user.service || "N/A"}</Text>
                                </GridItem>
                                <GridItem color="white">
                                    <Text>{user.security || "Password"}</Text>
                                </GridItem>
                                <GridItem color="white">
                                    <Text p={2} w="100%" textAlign="center" borderRadius="lg" fontSize="xs" bg={user.isEmailApproved ? 'green' : 'red'}>
                                        Email Verification
                                    </Text>
                                </GridItem>
                                <GridItem>
                                    <Button
                                        size="sm"
                                        colorScheme="teal"
                                        variant="outline"
                                        _hover={{ bg: 'teal.900' }}
                                        onClick={() => handleEditUser(user.uniqueId)}
                                    >
                                        Edit
                                    </Button>
                                </GridItem>
                                <GridItem>
                                    <Button
                                        size="sm"
                                        colorScheme="red"
                                        variant="outline"
                                        _hover={{ bg: 'red.900' }}
                                        onClick={() => handleDeleteUser(user)}>
                                        Delete
                                    </Button>
                                </GridItem>
                            </Grid>
                        </Box>
                    ))}
                    {users.length > itemsPerPage && (
                        <Flex justify="center" mt={4} gap={2}>
                            <Button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                size="sm"
                                colorScheme="teal"
                                variant="outline"
                            >
                                Previous Page
                            </Button>
                            <Text color="white" alignSelf="center">
                                Page {currentPage} / {Math.ceil(users.length / itemsPerPage)}
                            </Text>
                            <Button
                                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(users.length / itemsPerPage), prev + 1))}
                                disabled={currentPage === Math.ceil(users.length / itemsPerPage)}
                                size="sm"
                                colorScheme="teal"
                                variant="outline"
                            >
                                Next Page
                            </Button>
                        </Flex>
                    )}
                </Box>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent
                    bg="rgba(0, 0, 0, 1)"
                    border="1px solid rgba(54, 176, 226, 0.5)"
                    borderRadius="xl"
                    p={20}
                >
                    <ModalHeader>Edit User</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                            <FormControl>
                                <FormLabel>ID</FormLabel>
                                <Input
                                    value={selectedUser?.uniqueId || ''}
                                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, uniqueId: e.target.value } : null)}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Name</FormLabel>
                                <Input
                                    value={selectedUser?.name || ''}
                                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    value={selectedUser?.email || ''}
                                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    value={selectedUser?.password || ''}
                                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, password: e.target.value } : null)}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Phone Number</FormLabel>
                                <Input
                                    value={selectedUser?.phoneNumber || ''}
                                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, phoneNumber: e.target.value } : null)}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>User Level</FormLabel>
                                <Select
                                    style={{ padding: '8px' }}
                                    bg="rgba(0, 0, 0, 0.3)"
                                    color="white"
                                    borderRadius="5px"
                                    border="2px solid rgba(54, 176, 226, 0.5)"
                                    iconColor="black"
                                    value={selectedUser?.userLevel || 'Basic'}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        const level = e.target.value;
                                        const levelId = level === 'Basic' ? '1' : level === 'Premium' ? '2' : '3';
                                        setSelectedUser(prev => prev ? { 
                                            ...prev, 
                                            userLevel: level,
                                            userLevelId: levelId 
                                        } : null);
                                    }}
                                >
                                    <option value="Basic" style={{ padding: '8px', backgroundColor: 'rgba(0, 0, 0, 1)', color: 'white', borderRadius: 'lg' }}>Basic</option>
                                    <option value="Premium" style={{ padding: '8px', backgroundColor: 'rgba(0, 0, 0, 1)', color: 'white', borderRadius: 'lg' }}>Premium</option>
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Account Agent</FormLabel>
                                <Input
                                    value={selectedUser?.accountAgent || ''}
                                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, accountAgent: e.target.value } : null)}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Document</FormLabel>
                                <Input
                                    value={selectedUser?.document || ''}
                                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, document: e.target.value } : null)}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Service</FormLabel>
                                <Input
                                    value={selectedUser?.service || ''}
                                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, service: e.target.value } : null)}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Security</FormLabel>
                                <Input
                                    value={selectedUser?.security || ''}
                                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, security: e.target.value } : null)}
                                />
                            </FormControl>
                        </Grid>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleUpdateUser}>
                            Save
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default Admin;
