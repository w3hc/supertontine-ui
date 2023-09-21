import { Heading, Text, Button, Link } from '@chakra-ui/react'
import { RepeatIcon } from '@chakra-ui/icons'
import { Head } from '../../components/layout/Head'
import { useFeeData, useSigner, useAccount, useBalance, useNetwork } from 'wagmi'
import { useState, useEffect } from 'react'

export default function Home() {
  const [userBal, setUserBal] = useState<string>('')

  const { address, isConnecting, isDisconnected } = useAccount()

  const {
    data: bal,
    isError,
    isLoading,
  } = useBalance({
    address: address,
  })

  useEffect(() => {
    if (!isDisconnected) {
      const val = Number(bal?.formatted).toFixed(3)
      setUserBal(String(val) + ' ' + bal?.symbol)
    }
  }, [])

  const refresh = () => {
    console.log('hello')
  }

  return (
    <>
      <Head />

      <main>
        <Heading mt={5} as="h2">
          Tontine Alpha
        </Heading>
        <br />
        <Text>
          Adresse du contrat : <strong>0x0000000000000000000000000000000000000000</strong>
        </Text>
        {/* <Text>
          Adresse de la DAO : <strong>0x0000000000000000000000000000000000000000</strong>
        </Text>
        <Text>
          Adresse du contract de NFT : <strong>0x0000000000000000000000000000000000000000</strong>
        </Text>
        <Text>
          Adresse du Good Dollar (G$) : <strong>0x0000000000000000000000000000000000000000</strong>{' '}
        </Text> */}
        <br />
        <Heading mt={5} as="h2">
          Votre wallet{' '}
        </Heading>
        <br />
        <Text fontSize="lg">
          <strong>{address ? address : '0x8888888888888888888888888888888888888888'}</strong>
        </Text>
        <Text>
          Solde : <strong>{userBal === undefined ? userBal : '88888 G$'}</strong>{' '}
          <Link onClick={refresh}>
            <RepeatIcon w={4} h={4} color="blue.300" />
          </Link>
        </Text>
        <br />
        <Heading mt={5} as="h2">
          Bénéficiaire actuel
        </Heading>
        <br />
        <Text fontSize="lg">
          <strong>{address ? address : '0x8888888888888888888888888888888888888888'}</strong>{' '}
        </Text>
        <Text>
          Solde : <strong>{userBal === undefined ? userBal : '88888 G$'}</strong>{' '}
          <Link onClick={refresh}>
            <RepeatIcon w={4} h={4} color="blue.300" />
          </Link>
        </Text>
        <br />
        <br />
        <Button colorScheme="blue" variant="outline" onClick={refresh}>
          Démarrer ma cotisation
        </Button>
        <br />
        <Button mt={3} size={'xs'} colorScheme="red" variant="outline" onClick={refresh}>
          Passer au suivant
        </Button>{' '}
      </main>
    </>
  )
}
