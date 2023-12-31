import { Heading, Button, Link } from '@chakra-ui/react'
import { Head } from '../components/layout/Head'
// import Image from 'next/image'
import { LinkComponent } from '../components/layout/LinkComponent'
import { useState, useEffect } from 'react'
import { useFeeData, useSigner, useAccount, useBalance, useNetwork } from 'wagmi'
import { ethers } from 'ethers'
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '../lib/consts'
import useSound from 'use-sound' // https://www.joshwcomeau.com/react/announcing-use-sound-react-hook/
const stevie = 'https://bafybeicxvrehw23nzkwjcxvsytimqj2wos7dhh4evrv5kscbbj6agilcsy.ipfs.w3s.link/another-star.mp3'

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false)
  const [userBal, setUserBal] = useState<string>('')
  const [txLink, setTxLink] = useState<string>('')

  const { data } = useFeeData()
  const { address, isConnecting, isDisconnected } = useAccount()

  const { data: signer } = useSigner()
  const {
    data: bal,
    isError,
    isLoading,
  } = useBalance({
    address: address,
  })
  const network = useNetwork()

  const [play, { stop, pause }] = useSound(stevie, {
    volume: 0.5,
  })

  const explorerUrl = network.chain?.blockExplorers?.default.url

  const nft = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer)

  useEffect(() => {
    const val = Number(bal?.formatted).toFixed(3)
    setUserBal(String(val) + ' ' + bal?.symbol)
  }, [bal?.formatted, bal?.symbol, address])

  const checkFees = () => {
    console.log('data?.formatted:', JSON.stringify(data?.formatted))
    return JSON.stringify(data?.formatted)
  }

  const mint = async () => {
    console.log('minting...')
    try {
      setLoading(true)
      const call = await nft.safeMint()
      const nftReceipt = await call.wait(1)
      console.log('tx:', nftReceipt)
      setTxLink(explorerUrl + '/tx/' + nftReceipt.transactionHash)
      setLoading(false)
      play()
    } catch (e) {
      setLoading(false)
      console.log('error:', e)
    }
  }

  return (
    <>
      <Head />

      <main>
        {/* <Heading as="h2">Supertontine v0.1.0</Heading>
        <br /> */}
        <p>Bienvenue chez Supertontine!</p>
        <br />
        {isDisconnected ? (
          <>
            <br />
            <p>Veuillez cliquer sur le bouton &quot;Login&quot; (en haut à droite).</p>
          </>
        ) : (
          <>
            <p>
              Vous êtes sur un testnet d&apos;Ethereum appelé <strong>Goerli</strong> et votre wallet indique un solde de
              <strong> {userBal}</strong>. Vous pouvez créer votre tontine onchain en quelques minutes.{' '}
            </p>
            <br />
            <p>
              La tontine est une pratique traditionnelle qu&apos;on retrouve notamment en Afrique et en Asie. Elle incite à l&apos;épargne et
              encourage les participants dans la réalisation de leurs projets. Supertontine propose d&apos;améliorer la gestion d&lsquo;une tontine en
              la rendant plus fluide, plus vérifiable et plus sûre.
            </p>
          </>
        )}
        <br />
        {!loading ? (
          !txLink ? (
            <>
              <Link>
                <Button colorScheme="green" variant="outline" onClick={mint}>
                  Je crée ma tontine onchain
                </Button>
              </Link>

              <Link href="/tontine-alpha">
                <Button ml={4} colorScheme="blue" variant="outline">
                  Voir une tontine
                </Button>
              </Link>
            </>
          ) : (
            <Button disabled colorScheme="green" variant="outline" onClick={mint}>
              Tontine créée !
            </Button>
          )
        ) : (
          <>
            <Button isLoading colorScheme="green" loadingText="Déploiement de la tontine..." variant="outline">
              Je crée ma tontine onchain
            </Button>
            <Link href="/tontine-alpha">
              <Button ml={4} colorScheme="blue" variant="outline">
                Voir une tontine
              </Button>
            </Link>
          </>
        )}
        <br />

        {txLink && (
          <>
            <br />
            <br />
            <p>Voir la transaction de création de la tontine :</p>
            <br />
            <LinkComponent target="blank" href={txLink}>
              {txLink}
            </LinkComponent>
          </>
        )}
        <br />
        <br />
        {txLink && (
          <>
            <Button colorScheme="red" variant="outline" onClick={() => stop()}>
              Arrêter la musique
            </Button>
            <br />
            <Link href="/tontine-alpha">
              <Button mt={5} colorScheme="blue" variant="outline">
                Voir une tontine
              </Button>
            </Link>
          </>
        )}
        {/* <Image height="800" width="800" alt="contract-image" src="/thistle-contract-feb-15-2023.png" /> */}
      </main>
    </>
  )
}
