import * as CryptoJS from "crypto-js";
class Block {
  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timeStamp: number;

  // new를 이용하여 object를 만들지 않아도 함수 사용이 가능하도록
  static caculateBlockHash = (
    index: number,
    previousHash: string,
    timeStamp: number,
    data: string
  ): string => CryptoJS.SHA256(index + previousHash + timeStamp + data).toString();

  static validateStructure = (aBlock: Block): boolean =>
    typeof aBlock.index === "number" &&
    typeof aBlock.hash === "string" &&
    typeof aBlock.previousHash === "string" &&
    typeof aBlock.timeStamp === "number" &&
    typeof aBlock.data === "string";

  constructor(index: number, hash: string, previousHash: string, data: string, timeStamp: number) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timeStamp = timeStamp;
  }
}

const genesisBlock: Block = new Block(0, "202020202020", "", "bit-coin", 123456);

let blockChain: Block[] = [genesisBlock];

const getBlockChain = (): Block[] => blockChain;

const getLatestBlock = (): Block => blockChain[blockChain.length - 1];

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
  const previousBlock: Block = getLatestBlock();
  const newIndex: number = previousBlock.index + 1;
  const newTimeStamp: number = getNewTimeStamp();
  const newHash: string = Block.caculateBlockHash(newIndex, previousBlock.hash, newTimeStamp, data);
  const newBlock: Block = new Block(newIndex, newHash, previousBlock.hash, data, newTimeStamp);
  addBlock(newBlock);
  return newBlock;
};

const getHashForBlock = (aBlock: Block): string =>
  Block.caculateBlockHash(aBlock.index, aBlock.previousHash, aBlock.timeStamp, aBlock.data);

const isBlockVaild = (candidateBlock: Block, previousBlock: Block): boolean => {
  if (!Block.validateStructure(candidateBlock)) {
    return false;
  } else if (previousBlock.index + 1 !== candidateBlock.index) {
    return false;
  } else if (previousBlock.hash !== candidateBlock.previousHash) {
    return false;
  } else if (getHashForBlock(candidateBlock) !== candidateBlock.hash) {
    return false;
  } else {
    return true;
  }
};

const addBlock = (candidateBlock: Block): void => {
  if (isBlockVaild(candidateBlock, getLatestBlock())) {
    blockChain.push(candidateBlock);
  }
};

createNewBlock("second");
createNewBlock("third");
createNewBlock("fourth");
createNewBlock("fifth");

console.log(blockChain);
export {};
