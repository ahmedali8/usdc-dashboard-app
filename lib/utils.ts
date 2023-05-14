import { type BigNumber, ethers } from "ethers";

export const LAST_BLOCK_ID = "645e37a69e63357045bc418f";
export const FIRST_MARCH_BLOCK_NUMBER = 16736849;
export const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
export const USDC_DECIMALS_DIGIT = 6;
export const USDC_DECIMALS = 10 ** USDC_DECIMALS_DIGIT;
export const DEFAULT_N_PER_PAGE = 20;
export const DEFAULT_PAGE_NUMBER = 0;
export const BATCH_SIZE = 100;
export const ANKR_RPC_URL = "https://rpc.ankr.com/eth";

export const convertToUsdcBal = (val: BigNumber) => {
  return val.div(USDC_DECIMALS).toNumber();
};

export async function initAnkrProvider() {
  return new ethers.providers.JsonRpcProvider(ANKR_RPC_URL, "mainnet");
}

export async function gerCurrentBlockNumber() {
  const provider = await initAnkrProvider();
  return await provider.getBlockNumber();
}
