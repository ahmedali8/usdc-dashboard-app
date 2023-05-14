import type { BigNumber, Contract } from "ethers";
import { ethers } from "ethers";

import { Holder, LastBlock } from "../mongo/Models";
import {
  BATCH_SIZE,
  FIRST_MARCH_BLOCK_NUMBER,
  LAST_BLOCK_ID,
  USDC_ADDRESS,
  convertToUsdcBal,
} from "../utils";
import { ABI } from "./abi";

if (!process.env.INFURA_PROJECT_ID) {
  throw new Error("Please add your INFURA_PROJECT_ID to .env.local");
}
const INFURA_PROJECT_ID: string = process.env.INFURA_PROJECT_ID;
const userObj: Record<string, number> = {};

async function initInfuraProvider() {
  return new ethers.providers.InfuraProvider("mainnet", INFURA_PROJECT_ID);
}

async function initContract(provider: ethers.providers.Provider) {
  return new ethers.Contract(USDC_ADDRESS, ABI, provider);
}

async function getPastTransferEvents(
  contractInstance: Contract,
  fromBlock: number,
  toBlock: number
) {
  const filter = contractInstance.filters.Transfer();
  const events = await contractInstance.queryFilter(filter, fromBlock, toBlock);
  return events;
}

async function computePastTransferEvents(
  contractInstance: Contract,
  fromBlock: number,
  toBlock: number
) {
  const batchSize = BATCH_SIZE;

  const cycle = Math.ceil((toBlock - fromBlock) / batchSize);

  // create batches
  for (let i = 0; i < cycle; i++) {
    const batchStart = fromBlock + i * batchSize;
    const batchEnd = Math.min(fromBlock + (i + 1) * batchSize, toBlock);

    console.log(`batch no. ${i}: fromBlock=${batchStart}, toBlock=${batchEnd}`);

    const events = await getPastTransferEvents(contractInstance, batchStart, batchEnd);

    await Promise.allSettled(
      events.map((event) => extractUserFromEvent(contractInstance, event, batchEnd))
    );
  }
}

async function extractUserFromEvent(
  contractInstance: Contract,
  event: ethers.Event,
  blockNumber: number
) {
  const from: string = event?.args?.from?.toLowerCase();
  const to: string = event?.args?.to?.toLowerCase();
  const value: BigNumber = event?.args?.value;
  const amount: number = convertToUsdcBal(value);

  handleHolder(contractInstance, from, to, amount);

  // update last block number in mongodb
  await setLastBlockNumber(blockNumber);
}

async function getPastBalanceOf(contractInstance: Contract, addr: string) {
  try {
    const bal: BigNumber = await contractInstance.balanceOf(addr, {
      blockTag: FIRST_MARCH_BLOCK_NUMBER,
    });
    return bal;
  } catch (error) {
    console.log("error: ", error);
  }
}

async function handleHolder(contractInstance: Contract, from: string, to: string, amount: number) {
  // initialize
  if (!userObj[from]) {
    const fromBal = await getPastBalanceOf(contractInstance, from);
    userObj[from] = fromBal === undefined ? 0 : convertToUsdcBal(fromBal);
  }
  if (!userObj[to]) {
    const toBal = await getPastBalanceOf(contractInstance, to);
    userObj[to] = toBal === undefined ? 0 : convertToUsdcBal(toBal);
  }

  // update userObj
  userObj[from] = userObj[from] - amount;
  userObj[to] = userObj[to] + amount;

  // update mongodb
  await updateHolder(from, userObj[from]);
  await updateHolder(to, userObj[to]);
}

async function subscribeTransferEvent(contractInstance: Contract) {
  contractInstance.on("Transfer", async function (from: string, to: string, amount: BigNumber) {
    await handleHolder(contractInstance, from, to, convertToUsdcBal(amount));
  });
}

async function getLastBlockNumber() {
  return (await LastBlock.findById(LAST_BLOCK_ID))?.blockNumber;
}

async function setLastBlockNumber(newBlockNumber: number) {
  return (
    await LastBlock.findByIdAndUpdate(LAST_BLOCK_ID, {
      blockNumber: newBlockNumber,
    })
  )?.blockNumber;
}

async function updateHolder(user: string, balance: number) {
  try {
    await Holder.findOneAndUpdate({ user: user }, { balance: balance }, { upsert: true });
  } catch (err) {
    const newHolder = new Holder({ user: user, balance: balance });
    await newHolder.save();
  }
}

export async function handleEvents() {
  // init provider
  const provider = await initInfuraProvider();

  // init contract
  const contract = await initContract(provider);

  // get last block
  const lastBlock = await getLastBlockNumber();

  if (!lastBlock) return;

  // get current block from ethers
  const currentBlock = await provider.getBlockNumber();

  // subscribe to transfer event
  await subscribeTransferEvent(contract);

  // loop: 100 ka batch logTransferEvents() from: lastBlock to: currentBlock
  await computePastTransferEvents(contract, lastBlock, currentBlock);
}
