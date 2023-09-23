function toAddress(address: string): `0x${string}` {
    return `0x${address.replace('0x', '')}`
}

export default {
    toAddress
}

