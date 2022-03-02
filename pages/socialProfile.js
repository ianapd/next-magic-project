import { Box, Container, Heading, Button, Text, HStack, VStack, Image } from "@chakra-ui/react";
import { Magic } from "magic-sdk"
import Link from "next/link";
import { OAuthExtension } from '@magic-ext/oauth'
import { useEffect } from "react";
import { useState } from "react/cjs/react.development";

export default function SocialProfile() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [idToken, setIdToken] = useState('')
  const [generatedIdToken, setGeneratedIdToken] = useState('')
  
  // Magic Login Functions
  async function getResult() {
    const m = new Magic('pk_live_021EF6466E040AFD', {
      extensions: [new OAuthExtension()],
    })
    try {
      const result = await m.oauth.getRedirectResult()
      const name = result.oauth.userInfo.name
      const email = result.oauth.userInfo.email
      setName(name)
      setEmail(email)
      const idToken = await m.user.getIdToken()
      console.log(idToken)
      setIdToken(idToken)
      const newIdToken = await m.user.generateIdToken()
      console.log(newIdToken)
      setGeneratedIdToken(newIdToken)
      const { publicAddress } = await m.user.getMetadata()
      console.log(publicAddress)
      setAddress(publicAddress)
    } catch (err) {
      console.log(err)
    }
  }

  async function logout() {
    const m = new Magic('pk_live_021EF6466E040AFD', {
      extensions: [new OAuthExtension()],
    })    
    try {
      await m.user.logout()
      const isLoggedIn = await m.user.isLoggedIn()
      console.log(isLoggedIn)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getResult()
  }, [])

  return (
    <Box>
      <Container maxW="container.lg" mt={16}>
        <Heading size="lg" mb={4}>Welcome to your Profile</Heading>
        <Heading size="md" mb={4}>You are now logged in!</Heading>
        <Heading size="md" mb={4}>User Info</Heading>
        <Text mb={2}>Name: {name}</Text>
        <Text mb={2}>Email: {email}</Text>
        <Text mb={2}>ID Token: {idToken.slice(0, 16)}</Text>
        <Text mb={2}>Generated ID Token: {generatedIdToken.slice(0, 16)}</Text>
        <Text mb={8}>Public Address: {address}</Text>
        <Link href="/">
          <Button variant="outline" fontSize="lg" onClick={() => logout()}>Logout</Button>
        </Link>
      </Container>
    </Box>
  )
}