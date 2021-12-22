/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { TradingFloor, TradingFloorInterface } from "../TradingFloor";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_voteToken",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_newPrice",
        type: "uint256",
      },
    ],
    name: "PriceChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_firstRefer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_secondRefer",
        type: "address",
      },
    ],
    name: "UserIsRegistrated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_userAddress",
        type: "address",
      },
    ],
    name: "balanceOfACDM",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_userAddress",
        type: "address",
      },
    ],
    name: "balanceOfETH",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amountACDM",
        type: "uint256",
      },
    ],
    name: "buyACDMInSale",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBlockTimeStamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getRefer",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "firstRefer",
            type: "address",
          },
          {
            internalType: "address",
            name: "secondRefer",
            type: "address",
          },
        ],
        internalType: "struct TradingFloor.refer",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTradingFloorAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "numOfRound",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_firstRefer",
        type: "address",
      },
      {
        internalType: "address",
        name: "_secondRefer",
        type: "address",
      },
    ],
    name: "registration",
    outputs: [
      {
        internalType: "bool",
        name: "_success",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupplyACDM",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x6080604052600060015534801561001557600080fd5b5060405161083d38038061083d83398101604081905261003491610063565b600080546001600160a01b0319166001600160a01b03929092169190911790556509184e72a000600255610091565b600060208284031215610074578081fd5b81516001600160a01b038116811461008a578182fd5b9392505050565b61079d806100a06000396000f3fe6080604052600436106100915760003560e01c806372bbe2d31161005957806372bbe2d3146101d95780639270c82c146101ef57806398d5fdca14610204578063ca49a54314610219578063fb44b2491461022c57600080fd5b8063334551ff1461009657806346ca084a146100df5780634a5338f114610102578063561cd4621461018d57806362a7d3a3146101c3575b600080fd5b3480156100a257600080fd5b506100cc6100b136600461065f565b6001600160a01b031660009081526005602052604090205490565b6040519081526020015b60405180910390f35b6100f26100ed366004610679565b610247565b60405190151581526020016100d6565b34801561010e57600080fd5b5061016661011d36600461065f565b604080518082018252600080825260209182018190526001600160a01b039384168152600682528290208251808401909352805484168352600101549092169181019190915290565b6040805182516001600160a01b0390811682526020938401511692810192909252016100d6565b34801561019957600080fd5b506100cc6101a836600461065f565b6001600160a01b031660009081526004602052604090205490565b3480156101cf57600080fd5b506100cc60035481565b3480156101e557600080fd5b506100cc60015481565b6102026101fd3660046106cb565b610489565b005b34801561021057600080fd5b506002546100cc565b34801561022557600080fd5b50426100cc565b34801561023857600080fd5b506040513081526020016100d6565b336000818152600660205260408120549091906001600160a01b0316156102b55760405162461bcd60e51b815260206004820152601a60248201527f5573657220697320616c7265616479207265676973746572656400000000000060448201526064015b60405180910390fd5b6001600160a01b038085166000908152600660205260409020548591161515806102e657506001600160a01b038116155b6103285760405162461bcd60e51b8152602060048201526013602482015272155cd95c881b9bdd081c9959da5cdd195c9959606a1b60448201526064016102ac565b6001600160a01b0380851660009081526006602052604090205485911615158061035957506001600160a01b038116155b61039b5760405162461bcd60e51b8152602060048201526013602482015272155cd95c881b9bdd081c9959da5cdd195c9959606a1b60448201526064016102ac565b33600090815260046020908152604080832034905560059091528120556103d2604080518082019091526000808252602082015290565b6103db876105e6565b6001600160a01b031681526103ef866105e6565b6001600160a01b03908116602083810191825233600081815260068352604090819020865181546001600160a01b03199081169188169182178355955160019092018054909616919096169081179094558051918252918101939093528201527fb58d9a518283fd68405fc94680daa780e552e7f9a19cca68813e0ce00ba88ccb9060600160405180910390a15060019695505050505050565b600061049482610615565b3360009081526004602052604090205490915081106104e95760405162461bcd60e51b8152602060048201526011602482015270496e737566666963656e742066756e647360781b60448201526064016102ac565b3360009081526004602052604090205461050490829061073a565b3360009081526004602052604080822092909255308152908120805483929061052e9084906106e3565b909155505033600090815260056020526040812080548492906105529084906106e3565b90915550506000546040516323b872dd60e01b8152306004820152336024820152604481018490526001600160a01b03909116906323b872dd90606401602060405180830381600087803b1580156105a957600080fd5b505af11580156105bd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105e191906106ab565b505050565b60006001600160a01b038216156105fb575090565b6001600160a01b038216610610575030919050565b919050565b600080629896806002546298968061062d919061071b565b610637908561071b565b61064191906106fb565b9392505050565b80356001600160a01b038116811461061057600080fd5b600060208284031215610670578081fd5b61064182610648565b6000806040838503121561068b578081fd5b61069483610648565b91506106a260208401610648565b90509250929050565b6000602082840312156106bc578081fd5b81518015158114610641578182fd5b6000602082840312156106dc578081fd5b5035919050565b600082198211156106f6576106f6610751565b500190565b60008261071657634e487b7160e01b81526012600452602481fd5b500490565b600081600019048311821515161561073557610735610751565b500290565b60008282101561074c5761074c610751565b500390565b634e487b7160e01b600052601160045260246000fdfea2646970667358221220bf2ac353efc673d6e2b9d4fb88debf0a6f8ca583394cb08ce71ae77c9f34185964736f6c63430008040033";

type TradingFloorConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TradingFloorConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TradingFloor__factory extends ContractFactory {
  constructor(...args: TradingFloorConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    _voteToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TradingFloor> {
    return super.deploy(_voteToken, overrides || {}) as Promise<TradingFloor>;
  }
  getDeployTransaction(
    _voteToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_voteToken, overrides || {});
  }
  attach(address: string): TradingFloor {
    return super.attach(address) as TradingFloor;
  }
  connect(signer: Signer): TradingFloor__factory {
    return super.connect(signer) as TradingFloor__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TradingFloorInterface {
    return new utils.Interface(_abi) as TradingFloorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TradingFloor {
    return new Contract(address, _abi, signerOrProvider) as TradingFloor;
  }
}