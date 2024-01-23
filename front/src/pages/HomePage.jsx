import { Box, Text, Image } from '@mantine/core'
import unicorn from '../images/unicorn.jpg'

const HomePage = () => {
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
       This is a site about unicorns
      </Text>
      <Image
        src={unicorn}  // Replace with the actual path to your image
        alt='Unicorn Image'
        width={600}
        style={{ marginTop: '16px' }} // Adjust styling as needed
      />
    </Box>
  )
}

export default HomePage
