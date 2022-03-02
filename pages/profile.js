import { Box, Button, Container, Heading, Text, Input, Spacer } from "@chakra-ui/react"
import { Magic, RPCError, RPCErrorCode } from "magic-sdk"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ethers } from 'ethers'

export default function Profile() {
  // Magic Login States
  const [newEmail, setNewEmail] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [idToken, setIdToken] = useState('')
  const [generatedIdToken, setGeneratedIdToken] = useState('')
  const [userAddress, setUserAddress] = useState('')
  const [userBalance, setUserBalance] = useState('')

  const BSCOptions = {
    rpcUrl: 'https://bsc-dataseed.binance.org/', // Smart Chain RPC URL
    chainId: 56, // Smart Chain chain id
  }

  // Magic Login Functions
  async function login() {
    const m = new Magic('pk_live_021EF6466E040AFD', {
      network: BSCOptions
    })
    const provider = new ethers.providers.Web3Provider(m.rpcProvider)

    try {
      await m.auth.loginWithCredential()
      console.log(m.user)
      const idToken = await m.user.getIdToken()
      console.log(idToken)
      setIdToken(idToken)
      const newIdToken = await m.user.generateIdToken()
      console.log(newIdToken)
      setGeneratedIdToken(newIdToken)
      const { email, publicAddress } = await m.user.getMetadata()
      console.log(email)
      console.log(publicAddress)
      setEmail(email)
      setAddress(publicAddress)
      const isLoggedIn = await m.user.isLoggedIn()
      console.log(isLoggedIn)
      const signer = provider.getSigner()
      const userAddress = await signer.getAddress()
      setUserAddress(userAddress)
      const userBalance = ethers.utils.formatEther(
        await provider.getBalance(userAddress)
      )
      setUserBalance(userBalance)
      console.log(message)
      setMessage(message)
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
  
  async function updateEmail() {
    const m = new Magic('pk_live_021EF6466E040AFD')
    try {
      await m.user.updateEmail({ email: newEmail, showUI: true })
    } catch (err) {
      if (err instanceof RPCError) {
        switch (err.code) {
          case RPCErrorCode.UpdateEmailFailed:
            console.log(err)
          case RPCErrorCode.UserRequestEditEmail:
            console.log(err)
            break
        }
      }
    }
  }

  async function logout() {
    const m = new Magic('pk_live_021EF6466E040AFD')
    try {
      await m.user.logout()
      const isLoggedIn = await m.user.isLoggedIn()
      console.log(isLoggedIn)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    login()
  }, [])

  return (
    <Box mt={16}>
      <Container maxW="container.lg">
        <Heading size="lg" mb={4}>Welcome to your Profile</Heading>
        <Heading size="md" mb={4}>You are now logged in!</Heading>
        <Heading size="md" mb={2}>User Info</Heading>
        <Text mb={2}>Email: {email}</Text>
        <Text mb={2}>ID Token: {idToken.slice(0, 16)}</Text>
        <Text mb={2}>Generated ID Token: {generatedIdToken.slice(0, 16)}</Text>
        <Text mb={4}>Public Address: {address}</Text>
        <Heading size="md" mb={2}>Blockchain Info</Heading>
        <Text mb={2}>User Address: {userAddress}</Text>
        <Text mb={2}>User Balance: {userBalance}</Text>
        <Text mb={2}>Update Email</Text>
        <Input
          type="text"
          onChange={(e) => setNewEmail(e.target.value)}
          mb={4} />
        <Button onClick={() => updateEmail()} mb={8}>Update Email</Button>    
        <Spacer />
        <Link href="/">
          <Button variant="outline" fontSize="lg" onClick={() => logout()}>Logout</Button>
        </Link>
      </Container>
    </Box>
  )
}