import { type Contract, ethers, BigNumber } from "ethers";
import { ABI } from "./abi";
import { Holder, LastBlock } from "../mongoose/Models";
import { LAST_BLOCK_ID, USDC_ADDRESS, USDC_DECIMALS } from "../utils";

if (!process.env.INFURA_PROJECT_ID) {
  throw new Error("Please add your INFURA_PROJECT_ID to .env.local");
}
const infuraProjectId: string = process.env.INFURA_PROJECT_ID;
const userObj: Record<string, number> = {};

async function initProvider() {
  return new ethers.providers.InfuraProvider("mainnet", infuraProjectId);
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
  const batchSize = 100;

  const cycle = Math.ceil((toBlock - fromBlock) / batchSize); // e.g. (17244771-16736849)/100 = 5079 times loop

  // create batches
  for (let i = 0; i < cycle; i++) {
    const batchStart = fromBlock + i * 100;
    const batchEnd = Math.min(fromBlock + (i + 1) * 100, toBlock);

    console.log(`batch no. ${i}: fromBlock=${batchStart}, toBlock=${batchEnd}`);

    const events = await getPastTransferEvents(
      contractInstance,
      batchStart,
      batchEnd
    );

    for (const event of events) {
      await extractUserFromEvent(event, batchEnd);
    }
  }
}

async function extractUserFromEvent(event: ethers.Event, blockNumber: number) {
  const from: string = event?.args?.from?.toLowerCase();
  const to: string = event?.args?.to?.toLowerCase();
  const value: BigNumber = event?.args?.value;
  const amount: number = value.div(USDC_DECIMALS).toNumber();

  handleHolder(from, to, amount);

  // update last block number in mongodb
  await setLastBlockNumber(blockNumber);
}

async function handleHolder(from: string, to: string, amount: number) {
  // initialize
  if (!userObj[from]) userObj[from] = 0;
  if (!userObj[to]) userObj[to] = 0;

  // update userObj
  userObj[from] = userObj[from] - amount;
  userObj[to] = userObj[to] + amount;

  // update mongodb
  await updateHolder(from, userObj[from]);
  await updateHolder(to, userObj[to]);
}

async function subscribeTransferEvent(contractInstance: Contract) {
  contractInstance.on("Transfer", async function (from, to, amount) {
    // console.log("New Transfer Event");
    await handleHolder(from, to, amount);
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
  const holder = await Holder.findOne({ user });

  if (!holder) {
    const newHolder = new Holder({ user, balance });
    await newHolder.save();
  } else {
    await Holder.updateOne({ user }, { balance });
  }
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

  // subscribe to transfer event
  await subscribeTransferEvent(contract);

  // loop: 100 ka batch logTransferEvents() from: lastBlock to: currentBlock
  await computePastTransferEvents(contract, lastBlock, lastBlock + 100);
}
