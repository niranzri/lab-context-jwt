import { Box, Text } from '@mantine/core'

const ProfilePage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 100px)',
      }}
    >
      <Text size='xl' weight='bold' align='center'>
       Hello! <br></br>
       It's me, the user
      </Text>

    </Box>
  )
}

export default ProfilePage