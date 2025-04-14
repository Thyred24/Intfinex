'use client'

import { Box, Button, Flex, Text, Grid, GridItem, Input } from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton } from '@chakra-ui/modal'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { useToast } from '@chakra-ui/toast'
import { useDisclosure } from '@chakra-ui/hooks'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useCallback } from 'react'
import { environment } from '@/app/config/environment'

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
  phoneNumber?: string;
  userLevel?: string;
  registerDate?: string;
  emailVerification?: boolean;
  smsVerification?: boolean;
  isEmailApproved?: boolean;
  accountAgent?: string;
  status?: string;
  document?: string;
  services?: string;
  security?: string;
  documents?: string;
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
    console.log('[Admin] localStorage içeriği:', {
        userData: localStorage.getItem('userData'),
        userEmail: localStorage.getItem('userEmail')
    });

    const userDataStr = localStorage.getItem('userData');
    if (!userDataStr) {
        console.error('[Admin] userData bulunamadı');
        throw new Error('Token bulunamadı');
    }

    try {
        const userData = JSON.parse(userDataStr);
        console.log('[Admin] Parse edilen userData:', userData);

        if (!userData.data || !userData.data[0]) {
            console.error('[Admin] Token verisi bulunamadı');
            throw new Error('Token bulunamadı');
        }

        const token = userData.data[0];
        console.log('[Admin] Kullanılacak token:', token);
        return token;
    } catch (error) {
        console.error('[Admin] Token parse hatası:', error);
        throw new Error('Token formatı geçersiz');
    }
};

const createAuthHeaders = (token: string) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
});

function Admin() {
    const [users, setUsers] = useState<User[]>([]);
    const [adminName, setAdminName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [emailValidation, setEmailValidation] = useState<boolean>(environment.emailValidation);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const toast = useToast();

    // API çağrısı için yardımcı fonksiyon
    const makeApiCall = useCallback(async <T,>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
        console.log('[Admin] API çağrısı başlıyor:', url);
        try {
            const token = getAuthToken();
            console.log('[Admin] Token alındı:', token);
            
            const headers = createAuthHeaders(token);
            console.log('[Admin] Oluşturulan headers:', headers);
            
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...createAuthHeaders(token),
                    ...(options.headers || {})
                }
            });

            console.log('[Admin] API yanıtı:', {
                status: response.status,
                statusText: response.statusText
            });

            if (!response.ok) {
                console.error('[Admin] API hata yanıtı:', response.status, response.statusText);
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

    // Kullanıcı listesini çekme
    const fetchUsers = useCallback(async () => {
        try {
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

                const adminUser = processedUsers.find((user: User) => user.userLevel === 'admin');
                if (adminUser) {
                    setAdminName(adminUser.name);
                }
            }
        } catch {
            toast({
                title: 'Hata',
                description: 'Kullanıcı listesi yüklenirken bir hata oluştu',
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
        localStorage.clear();
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
          uniqueId: selectedUser.uniqueId,
          phoneNumber: selectedUser.phoneNumber,
          userLevel: selectedUser.userLevel,
          accountAgent: selectedUser.accountAgent,
          document: selectedUser.document,
          services: selectedUser.services
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
                <Flex alignItems="center" gap={4}>
                    <Text fontSize="24px" color="white">
                        <span style={{
                            background: 'linear-gradient(to right, #ffffff, #36b0e2)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>{adminName}</span>
                    </Text>
                    <Button
                        onClick={handleLogout}
                        colorScheme="red"
                        size="lg"
                    >
                        Logout
                    </Button>
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
                                colorScheme="teal"
                                variant="outline"
                                _hover={{ bg: '#36b0e2' }}
                                onClick={async () => {
                                    try {
                                        const newValidation = !emailValidation;
                                        environment.emailValidation = newValidation;
                                        setEmailValidation(newValidation);
                                        
                                        toast({
                                            title: 'Başarılı',
                                            description: `Email doğrulaması ${newValidation ? 'aktif' : 'pasif'} edildi`,
                                            status: 'success',
                                            duration: 3000,
                                            isClosable: true,
                                        });
                                    } catch (error) {
                                        console.error('Email validation toggle error:', error);
                                        toast({
                                            title: 'Hata',
                                            description: 'Email doğrulama durumu değiştirilemedi',
                                            status: 'error',
                                            duration: 3000,
                                            isClosable: true,
                                        });
                                    }
                                }}
                            >
                                {emailValidation ? 'Turn Off All' : 'Turn On All'}
                            </Button>
                            <Text color="gray.400" mt={2} fontSize="sm">
                                Current Status: {emailValidation ? 'Active' : 'Inactive'}
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
                        <GridItem>Security</GridItem>
                        <GridItem>Account Agent</GridItem>
                        <GridItem>Statu</GridItem>
                        <GridItem>Document</GridItem>
                        <GridItem>Service</GridItem>
                        <GridItem>Verification</GridItem>
                        <GridItem>Edit</GridItem>
                        <GridItem>Delete</GridItem>
                    </Grid>
                </Box>

                <Box mt={4}>
                    {users.map((user) => (
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
                                <GridItem color="white">
                                    <Text>{user.uniqueId}</Text>
                                </GridItem>
                                <GridItem color="white">
                                    <Text>{user.name}</Text>
                                </GridItem>
                                <GridItem color="white">
                                    <Text>{user.email}</Text>
                                </GridItem>
                                <GridItem color="white">
                                    <Text>{user.security || "Password"}</Text>
                                </GridItem>
                                <GridItem color="white">
                                    <Text>{user.accountAgent || "Global Team"}</Text>
                                </GridItem>
                                <GridItem color="white">
                                    <Text>{user.userLevel || "Basic"}</Text>
                                </GridItem>
                                <GridItem color="white">
                                    <Text>{user.document || "N/A"}</Text>
                                </GridItem>
                                <GridItem color="white">
                                    <Text>{user.services || "N/A"}</Text>
                                </GridItem>
                                <GridItem color="white">
                                    <Text p={2} w= "100%" textAlign="center" borderRadius="lg" fontSize="xs" bg={user.isEmailApproved ? 'green' : 'red'}>
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
                </Box>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay
                    bg="blackAlpha.700"
                    backdropFilter="blur(10px)"
                />
                <ModalContent
                    bg="rgba(0, 0, 0, 0.8)"
                    border="1px solid rgba(54, 176, 226, 0.5)"
                    borderRadius="xl"
                    p={4}
                >
                    <ModalHeader>Kullanıcı Düzenle</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                            <FormControl>
                                <FormLabel>ID</FormLabel>
                                <Input
                                    value={selectedUser?.uniqueId || ''}
                                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, uniqueId: e.target.value } : null)}
                                    readOnly
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
                                <FormLabel>Phone Number</FormLabel>
                                <Input
                                    value={selectedUser?.phoneNumber || ''}
                                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, phoneNumber: e.target.value } : null)}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>User Level</FormLabel>
                                <Input
                                    value={selectedUser?.userLevel || ''}
                                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, userLevel: e.target.value } : null)}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Account Agent</FormLabel>
                                <Input
                                    value={selectedUser?.accountAgent || ''}
                                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, accountAgent: e.target.value } : null)}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Status</FormLabel>
                                <Input
                                    value={selectedUser?.status || ''}
                                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, status: e.target.value } : null)}
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
                                <FormLabel>Services</FormLabel>
                                <Input
                                    value={selectedUser?.services || ''}
                                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, services: e.target.value } : null)}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Security</FormLabel>
                                <Input
                                    value={selectedUser?.security || ''}
                                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, security: e.target.value } : null)}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Documents</FormLabel>
                                <Input
                                    value={selectedUser?.documents || ''}
                                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, documents: e.target.value } : null)}
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
