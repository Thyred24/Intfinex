'use client'

import { Box, Button, Flex, Text, Grid, GridItem, Input } from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton } from '@chakra-ui/modal'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Switch } from '@chakra-ui/switch'
import { useToast } from '@chakra-ui/toast'
import { useDisclosure } from '@chakra-ui/hooks'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useCallback } from 'react'

// API endpoint sabitleri
const API_ENDPOINTS = {
    GET_USERS: 'https://intfinex.azurewebsites.net/api/User/GetList',
    UPDATE_USER: 'https://intfinex.azurewebsites.net/api/User/Update',
    DELETE_USER: 'https://intfinex.azurewebsites.net/api/User/Delete',
    UPDATE_VERIFICATION: 'https://intfinex.azurewebsites.net/api/User/UpdateVerification'
} as const;

interface User {
  uniqueId: string;
  name: string;
  email: string;
  phoneNumber?: string;
  userLevel?: string;
  registerDate?: string;
  emailVerification?: boolean;
  smsVerification?: boolean;
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
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token bulunamadı');
    }
    return token;
};

const createAuthHeaders = (token: string) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
});

function Admin() {
    const [users, setUsers] = useState<User[]>([]);
    const [adminName, setAdminName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const toast = useToast();

    // API çağrısı için yardımcı fonksiyon
    const makeApiCall = useCallback(async <T,>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
        try {
            const token = getAuthToken();
            const response = await fetch(url, {
                ...options,
                headers: createAuthHeaders(token)
            });

            if (!response.ok) {
                throw new Error('API yanıtı başarısız');
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
            try {
                await fetchUsers();
            } finally {
                setLoading(false);
            }
        };

        initializeAdmin();
    }, [fetchUsers, setLoading]);

    const handleLogout = () => {
        localStorage.clear();
        router.push('/');
    };

    // Doğrulama durumu güncelleme
    const handleVerificationToggle = useCallback(async (userId: string, type: 'email' | 'sms', currentState: boolean) => {
        try {
            await makeApiCall(API_ENDPOINTS.UPDATE_VERIFICATION, {
                method: 'PUT',
                body: JSON.stringify({
                    userId,
                    type,
                    state: !currentState
                })
            });

            setUsers(users.map(user => {
                if (user.uniqueId === userId) {
                    return {
                        ...user,
                        [type === 'email' ? 'emailVerification' : 'smsVerification']: !currentState
                    };
                }
                return user;
            }));

            toast({
                title: 'Başarılı',
                description: 'Doğrulama durumu güncellendi',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        } catch {
            toast({
                title: 'Hata',
                description: 'Doğrulama durumu güncellenirken bir hata oluştu',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    }, [makeApiCall, users, setUsers, toast]);

    // Edit User fonksiyonu
    const handleEditUser = useCallback(async (userId: string) => {
        const user = users.find(u => u.uniqueId === userId);
        if (user) {
            setSelectedUser(user);
            onOpen();
        }
    }, [users, setSelectedUser, onOpen]);

    // Update User fonksiyonu
    const handleUpdateUser = useCallback(async () => {
        if (!selectedUser) return;

        try {
            await makeApiCall(API_ENDPOINTS.UPDATE_USER, {
                method: 'PUT',
                body: JSON.stringify(selectedUser)
            });

            setUsers(users.map(user => 
                user.uniqueId === selectedUser.uniqueId ? selectedUser : user
            ));

            toast({
                title: 'Başarılı',
                description: 'Kullanıcı güncellendi',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
            onClose();
        } catch {
            toast({
                title: 'Hata',
                description: 'Kullanıcı güncellenirken bir hata oluştu',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    }, [selectedUser, makeApiCall, users, setUsers, toast, onClose]);

    // Delete User fonksiyonu
    const handleDeleteUser = useCallback(async (userId: string) => {
        if (!window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;

        try {
            await makeApiCall(API_ENDPOINTS.DELETE_USER, {
                method: 'DELETE',
                body: JSON.stringify({ uniqueId: userId })
            });

            setUsers(users.filter(user => user.uniqueId !== userId));
            toast({
                title: 'Başarılı',
                description: 'Kullanıcı silindi',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        } catch {
            toast({
                title: 'Hata',
                description: 'Kullanıcı silinirken bir hata oluştu',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    }, [makeApiCall, users, setUsers, toast]);

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
                        Welcome, <span style={{
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
                    <Text fontSize="xl" color="white" mb={4}>Email Verification</Text>
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text color="gray.300">Global Status</Text>
                        <Button
                            size="lg"
                            colorScheme="teal"
                            variant="outline"
                            _hover={{ bg: 'teal.900' }}
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
                    <Text fontSize="xl" color="white" mb={4}>SMS Verification</Text>
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text color="gray.300">Global Status</Text>
                        <Button
                            size="lg"
                            colorScheme="teal"
                            variant="outline"
                            _hover={{ bg: 'teal.900' }}
                        >
                            Turn Off All
                        </Button>
                    </Flex>
                </Box>
            </Flex>

            <Box
                bg="rgba(0, 0, 0, 0.5)"
                backdropFilter="blur(10px)"
                borderRadius="xl"
                overflowX="auto"
                p={6}
                mb={6}
            >
                <Flex justifyContent="space-between" alignItems="center" mb={6}>
                    <Text fontSize="2xl" color="white">Users Management</Text>
                    <Flex gap={4}>
                        <Button
                            size="md"
                            colorScheme="teal"
                            variant="outline"
                            _hover={{ bg: 'teal.900' }}
                        >
                            Export Users
                        </Button>
                        <Button
                            size="md"
                            colorScheme="teal"
                            _hover={{ bg: 'teal.600' }}
                        >
                            Add New User
                        </Button>
                    </Flex>
                </Flex>
                <Grid templateColumns="repeat(9, 1fr)" gap={4} color="gray.300" fontWeight="bold" mb={4} bg="rgba(0, 0, 0, 0.2)" p={4} borderRadius="lg">
                    <GridItem>ID</GridItem>
                    <GridItem>Name</GridItem>
                    <GridItem>Email</GridItem>
                    <GridItem>Phone</GridItem>
                    <GridItem>Register Date</GridItem>
                    <GridItem>Status</GridItem>
                    <GridItem>Verification</GridItem>
                    <GridItem>Edit</GridItem>
                    <GridItem>Delete</GridItem>
                </Grid>
                <Flex direction="column" gap={4}>
                    {users.map((user) => (
                        <Box
                            key={user.uniqueId}
                            bg="rgba(0, 0, 0, 0.3)"
                            p={4}
                            borderRadius="lg"
                            _hover={{ bg: "rgba(0, 0, 0, 0.4)" }}
                            transition="all 0.3s"
                        >
                            <Grid templateColumns="repeat(9, 1fr)" gap={4} alignItems="center">
                                <GridItem color="white" fontSize="sm">{user.uniqueId}</GridItem>
                                <GridItem color="white">{user.name}</GridItem>
                                <GridItem color="white">{user.email}</GridItem>
                                <GridItem color="white">{user.phoneNumber || 'N/A'}</GridItem>
                                <GridItem color="white">{user.registerDate || 'N/A'}</GridItem>
                                <GridItem color="white">{user.userLevel || 'N/A'}</GridItem>
                                <GridItem>
                                    <Flex gap={2}>
                                        <Box
                                            bg={user.emailVerification === true ? "green.500" : "red.500"}
                                            color="white"
                                            px={2}
                                            py={1}
                                            borderRadius="md"
                                            fontSize="xs"
                                            display="flex"
                                            alignItems="center"
                                            title={user.emailVerification === true ? "Email Verified" : "Email Not Verified"}
                                        >
                                            Email
                                        </Box>
                                    </Flex>
                                </GridItem>
                                <GridItem color="white">
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
                                <GridItem color="white">
                                    <Button
                                        size="sm"
                                        colorScheme="red"
                                        variant="outline"
                                        _hover={{ bg: 'red.900' }}
                                        onClick={() => handleDeleteUser(user.uniqueId)}
                                    >
                                        Delete
                                    </Button>
                                </GridItem>
                            </Grid>
                        </Box>
                    ))}
                </Flex>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit User</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input type="text" value={selectedUser?.name || ''} onChange={(e) => selectedUser && setSelectedUser({...selectedUser, name: e.target.value})} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input type="email" value={selectedUser?.email || ''} onChange={(e) => selectedUser && setSelectedUser({...selectedUser, email: e.target.value})} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Phone Number</FormLabel>
                            <Input type="text" value={selectedUser?.phoneNumber || ''} onChange={(e) => selectedUser && setSelectedUser({...selectedUser, phoneNumber: e.target.value})} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Email Verification</FormLabel>
                            <Switch
                                isChecked={selectedUser?.emailVerification || false}
                                onChange={() => selectedUser && handleVerificationToggle(selectedUser.uniqueId, 'email', !!selectedUser.emailVerification)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>SMS Verification</FormLabel>
                            <Switch
                                isChecked={selectedUser?.smsVerification || false}
                                onChange={() => selectedUser && handleVerificationToggle(selectedUser.uniqueId, 'sms', !!selectedUser.smsVerification)}
                            />
                        </FormControl>
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
