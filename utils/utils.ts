import { Logger } from 'pino';
import dotenv from 'dotenv';
import axios, { AxiosResponse } from 'axios';
import { logger } from '../buy';

dotenv.config();

export const retrieveEnvVariable = (variableName: string, logger: Logger) => {
  const variable = process.env[variableName] || '';
  if (!variable) {
    logger.error(`${variableName} is not set`);
    process.exit(1);
  }
  return variable;
};

interface Pair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    symbol: string;
  };
  priceNative: string;
  priceUsd?: string;
  txns: {
    m5: {
      buys: number;
      sells: number;
    };
    h1: {
      buys: number;
      sells: number;
    };
    h6: {
      buys: number;
      sells: number;
    };
    h24: {
      buys: number;
      sells: number;
    };
  };
  volume: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity?: {
    usd?: number;
    base: number;
    quote: number;
  };
  fdv?: number;
  pairCreatedAt?: number;
}

interface TokensResponse {
  schemaVersion: string;
  pairs: Pair[] | null;
}

export const retrieveTokenValueByAddress = async (tokenAddress: string) => {
  const url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;
  const tokenResponse: TokensResponse = (await axios.get(url)).data;
  if (tokenResponse.pairs) {
    const pair = tokenResponse.pairs.find((pair) => (pair.chainId = 'solana'));
    const priceNative = pair?.priceNative;
    if (priceNative) return parseFloat(priceNative);
  }
  return undefined;
};
