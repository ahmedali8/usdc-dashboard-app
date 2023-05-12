import { type Contract, ethers } from "ethers";
import { ABI } from "./abi";
import { LastBlock } from "../mongoose/Models";
import { LAST_BLOCK_ID, USDC_ADDRESS } from "../utils";

if (!process.env.INFURA_PROJECT_ID) {
  throw new Error("Please add your INFURA_PROJECT_ID to .env.local");
}
const infuraProjectId: string = process.env.INFURA_PROJECT_ID;

async function initProvider() {
  const provider = new ethers.providers.InfuraProvider(
    "mainnet",
    infuraProjectId
  );
  return provider;
}

async function initContract(provider: ethers.providers.Provider) {
  // Create a contract instance for the USDC contract
  const usdcContract = new ethers.Contract(USDC_ADDRESS, ABI, provider);

  return usdcContract;
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
  try {
    const cycle = toBlock - fromBlock / 100; // e.g. (17244771-16736849)/100 = 5079.22 times loop

    toBlock = fromBlock + 100;

    // create batches of 100
    for (let i = 0; i < cycle; i++) {
      console.log(`batch no. ${i}`);
      const events = await getPastTransferEvents(
        contractInstance,
        fromBlock,
        toBlock
      );
      // console.log(events);

      fromBlock = toBlock;
      toBlock += 100;
    }
  } catch (error) {
    console.log(error);
  }
}

async function subscribeTransferEvent(contractInstance: Contract) {
  contractInstance.on("Transfer", function (from, to, amount, event) {
    console.log("New Transfer Event:", event);
  });
}

export async function handleEvents() {
  // init provider
  const provider = await initProvider();

  // init contract
  const contract = await initContract(provider);

  // get last block
  const lastBlock = await getLastBlockNumber();

  if (!lastBlock) return;

  // get current block from ethers
  const currentBlock = await provider.getBlockNumber();

  console.log(lastBlock, currentBlock);

  // subscribe to transfer event
  // await subscribeTransferEvent(contract);

  // loop: 100 ka batch logTransferEvents() from: lastBlock to: currentBlock
  await computePastTransferEvents(contract, lastBlock, currentBlock);
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

async function updateBalance() {}
