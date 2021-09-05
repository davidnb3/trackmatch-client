import React from 'react'
import { Box, Center, Container } from "@chakra-ui/react"
import { Link } from "@chakra-ui/react"

const AUTH_URL = 'https://accounts.spotify.com/authorize?client_id=cda05a1cfab241769542ed054c843d20&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state';

export default function Login() {
    return (
        <Container
            minH='100vh'
            centerContent
            display='flex'
            justifyContent='center'>
            <Link
                href={AUTH_URL}
                bg='green'
                color='white'
                p={2}
                borderRadius='8px'>
                    Login with Spotify
            </Link>
        </Container>
    )
}
