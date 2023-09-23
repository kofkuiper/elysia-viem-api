import { defineChain, createPublicClient, http } from 'viem'

const chainRpc = Bun.env.CHAIN_RPC_URL || ''
const chainId = Bun.env.CHAIN_ID || ''
const chainName = Bun.env.CHAIN_NAME || ''

export const customChain = defineChain({
    id: parseInt(chainId),
    name: chainName,
    network: chainName,
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: [chainRpc],
            webSocket: [''],
        },
        public: {
            http: [chainRpc],
            webSocket: [''],
        },
    },
})

export const client = createPublicClient({
    chain: customChain,
    transport: http()
})