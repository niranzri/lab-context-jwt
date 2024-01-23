import { Box, Text, Image } from '@mantine/core'
import profile from '../images/profile.jpg'

const ProfilePage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 100px)',
      }}
    >
      <Text size='xl' weight='bold' align='center'>
       Hello! <br></br>
       It's me, the user
      </Text>
      <Image
        src={profile}  // Replace with the actual path to your image
        alt='Profile image'
        width={300}
        style={{ marginTop: '16px', marginLeft: '40px' }} // Adjust styling as needed
      />

    </Box>
  )
}

export default ProfilePage