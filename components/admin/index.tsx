import React from 'react'
import { Grid, Box, Text, Flex } from '@chakra-ui/react'

function Admin() {
  return (
    <Grid>
        <Box>
            <Text>
                Admin Panel
            </Text>
        </Box>
        <Flex>
            <Box>
                <Text>
                    Welcome to the admin panel Mr. <span></span>
                </Text>
            </Box>
        </Flex>
    </Grid>
  )
}

export default Admin
