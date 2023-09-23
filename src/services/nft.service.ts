import { client, customChain } from '../configs/chain.config'
import NFTUtils from '../utils/nft.util'
import nftAbi from '../abis/nft.abi'
import { privateKeyToAccount } from 'viem/accounts'
import { createWalletClient, http } from 'viem'

export default class NFTService {

    nftContractAddress = Bun.env.NFT_CONTRACT_ADDRESS || ''

    async name(): Promise<string> {
        return await client.readContract({
            address: NFTUtils.toAddress(this.nftContractAddress),
            abi: nftAbi.name,
            functionName: 'name',
            args: []
        })
    }

    async symbol(): Promise<string> {
        return await client.readContract({
            address: NFTUtils.toAddress(this.nftContractAddress),
            abi: nftAbi.symbol,
            functionName: 'symbol',
            args: []
        })
    }

    async ownerOf(tokenId: number): Promise<string> {
        return await client.readContract({
            address: NFTUtils.toAddress(this.nftContractAddress),
            abi: nftAbi.ownerOf,
            functionName: 'ownerOf',
            args: [BigInt(tokenId)]
        })
    }

    async tokenURI(tokenId: number): Promise<string> {
        return await client.readContract({
            address: NFTUtils.toAddress(this.nftContractAddress),
            abi: nftAbi.tokenURI,
            functionName: 'tokenURI',
            args: [BigInt(tokenId)]
        })
    }

    async mint(to: string, tokenUri: string): Promise<string> {
        const privateKey = Bun.env.NFT_OWNER_PRIVATE_KEY || ''
        const walletClient = createWalletClient({
            chain: customChain,
            transport: http()
        })

        const account = privateKeyToAccount(NFTUtils.toAddress(privateKey))
        const { request } = await client.simulateContract({
            account,
            address: NFTUtils.toAddress(this.nftContractAddress),
            abi: nftAbi.mint,
            functionName: 'safeMint',
            args: [NFTUtils.toAddress(to), tokenUri],
        })
        return await walletClient.writeContract(request)
    }
}