import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { client } from './configs/chain.config'
import NFTUtils from './utils/nft.util'
import { formatEther } from 'viem'
import NFTService from "./services/nft.service";

const app = new Elysia()
  .use(swagger()) // Open Swagger http://localhost:3000/swagger
  .get("/", () => "Hello Elysia and Viem :D")

  // Get ETH balance
  .get('/balance', async () => {
    try {
      const walletAddress = Bun.env.NFT_OWNER_PUBLIC_KEY || ''
      const balance = await client.getBalance({ address: NFTUtils.toAddress(walletAddress) })
      return {
        success: true,
        walletAddress,
        balance: formatEther(balance)
      }
    } catch (error: any) {
      return { success: false, error: error?.shortMessage || error }
    }
  })

  // NFT apis
  .group('/nfts', (app: Elysia) =>
    app
      // Get NFT address, name,& symbol
      .get('/', async () => {
        try {
          const nftService = new NFTService()
          const name = await nftService.name()
          const symbol = await nftService.symbol()

          return { success: true, nft: nftService.nftContractAddress, name, symbol }
        } catch (error: any) {
          return { success: false, error: error?.shortMessage || error }
        }
      })
      // Mint NFT
      .post('/mint', async ({ body }) => {
        try {
          const { to, tokenUri } = body
          const nftService = new NFTService()
          const hash = await nftService.mint(to, tokenUri)
          return { success: true, hash }
        } catch (error: any) {
          return { success: false, error: error?.shortMessage || error }
        }
      }, {
        body: t.Object({
          to: t.String(),
          tokenUri: t.String()
        })
      })
      // Check owner of tokenId
      .get('/owner/:tokenId', async ({ params: { tokenId } }) => {
        try {
          const nftService = new NFTService()
          const owner = await nftService.ownerOf(parseInt(tokenId))
          return { success: true, owner }
        } catch (error: any) {
          return { success: false, error: error?.shortMessage || error }
        }
      })
      // Get TokenURI by tokenId
      .get('/uri/:tokenId', async ({ params: { tokenId } }) => {
        try {
          const nftService = new NFTService()
          const owner = await nftService.tokenURI(parseInt(tokenId))
          return { success: true, owner }
        } catch (error: any) {
          return { success: false, error: error?.shortMessage || error }
        }
      })

  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
