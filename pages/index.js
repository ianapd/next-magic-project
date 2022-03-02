import { Box, Container, Heading, Text, Button, Input, HStack, IconButton, Link } from "@chakra-ui/react"
import matter from "gray-matter"
import { Magic, RPCError, RPCErrorCode } from "magic-sdk"
import { OAuthExtension } from '@magic-ext/oauth'
import { useState, useEffect } from "react"
import { BsFacebook, BsGoogle } from "react-icons/bs"

export default function Home() {
  // Magic Login States
  const [email, setEmail] = useState('')
  const [smsNumber, setSMSNumber] = useState('')

  const BSCOptions = {
    rpcUrl: 'https://bsc-dataseed.binance.org/', // Smart Chain RPC URL
    chainId: 56, // Smart Chain chain id
  }

  // Magic Login Functions
  async function loginWithEmail() {
    const m = new Magic('pk_live_021EF6466E040AFD', {
      network: BSCOptions
    })
    console.log(email)
    try {
      await m.auth.loginWithMagicLink({ email: email, redirectURI: "http://localhost:3000/profile" })

    } catch (err) {
      if (err instanceof RPCError) {
        switch (err.code) {
          case RPCErrorCode.MagicLinkFailedVerification:
            console.log(err)
          case RPCErrorCode.MagicLinkExpired:
            console.log(err)
          case RPCErrorCode.MagicLinkRateLimited:
            console.log(err)
          case RPCErrorCode.MagicLinkInvalidRedirectURL:
            console.log(err)
          case RPCErrorCode.UserAlreadyLoggedIn:
            console.log(err)
            break
        }
      }
    }
  }

  async function loginWithSMSNumber() {
    const m = new Magic('pk_live_021EF6466E040AFD')
    console.log(smsNumber)
    try {
      await m.auth.loginWithSMS({ phoneNumber: smsNumber })
    } catch (err) {
      if (err instanceof RPCError) {
        switch (err.code) {
          case RPCErrorCode.MagicLinkFailedVerification:
            console.log(err)
          case RPCErrorCode.MagicLinkExpired:
            console.log(err)
          case RPCErrorCode.MagicLinkRateLimited:
            console.log(err)
          case RPCErrorCode.MagicLinkInvalidRedirectURL:
            console.log(err)
          case RPCErrorCode.UserAlreadyLoggedIn:
            console.log(err)
            break
        }
      }
    }
  }

  async function loginWithGoogle() {
    const m = new Magic('pk_live_021EF6466E040AFD', {
      extensions: [new OAuthExtension()],
    })
    try {
      await m.oauth.loginWithRedirect({
        provider: 'google',
        redirectURI: 'http://localhost:3000/socialProfile'
      })
    } catch (err) {
      console.log(err)
    }
  }

  async function loginWithFacebook() {
    const m = new Magic('pk_live_021EF6466E040AFD', {
      extensions: [new OAuthExtension()],
    })
    try {
      await m.oauth.loginWithRedirect({
        provider: 'facebook',
        redirectURI: 'http://localhost:3000/socialProfile'
      })
    } catch (err) {
      console.log(err)
    }
  }

  // Front-Matter
  const str = '---\nfoo: bar\n---\nThis is an excerpt.\n---\nThis is content';
  const file = matter(str, { excerpt: true })

  useEffect(() => {
    console.log(matter('---\ntitle: Front Matter\n---\nThis is the content.'))
    console.log(matter.stringify("Sample Front Matter", {title: 'Home'}))
    console.log(file)
  })

  return (
    <Box mt={16}>
      <Container maxW="container.lg">
        <Heading size="xl" mb={2}>Magic Login</Heading>
        <Text mb={2}>Login using the following methods:</Text>
        <Text mb={2}>Email</Text>
        <Input
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          mb={4} />
        <Button onClick={() => loginWithEmail()} mb={8}>Login</Button>  
        <Text mb={2}>Phone Number</Text>
        <Input
          type="tel"
          onChange={(e) => setSMSNumber(e.target.value)}
          mb={4} />
        <Button onClick={() => loginWithSMSNumber()} mb={8}>Login</Button>
        <Text mb={2}>Login using the following providers: </Text>
        <HStack spacing="32px" mb={8}>
          <IconButton
            icon={<BsGoogle />}
            onClick={() => loginWithGoogle()}/>  
          <IconButton
            icon={<BsFacebook />}
            onClick={() => loginWithFacebook()}/>
        </HStack>    
        <Text mb={8}>Note: See the console log in Inspect Element to view the front matter.</Text>
      </Container>
    </Box>
  )
}
