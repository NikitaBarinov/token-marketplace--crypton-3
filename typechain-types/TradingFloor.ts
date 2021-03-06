/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export type OrderStruct = {
  owner: string;
  numRound: BigNumberish;
  balance: BigNumberish;
  totalAmountACDM: BigNumberish;
  totalPriceForACDM: BigNumberish;
  open: boolean;
};

export type OrderStructOutput = [
  string,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  boolean
] & {
  owner: string;
  numRound: BigNumber;
  balance: BigNumber;
  totalAmountACDM: BigNumber;
  totalPriceForACDM: BigNumber;
  open: boolean;
};

export type RoundStruct = {
  totalSupply: BigNumberish;
  finishTime: BigNumberish;
  tradingVolumeETH: BigNumberish;
  saleOrTrade: boolean;
};

export type RoundStructOutput = [BigNumber, BigNumber, BigNumber, boolean] & {
  totalSupply: BigNumber;
  finishTime: BigNumber;
  tradingVolumeETH: BigNumber;
  saleOrTrade: boolean;
};

export interface TradingFloorInterface extends utils.Interface {
  functions: {
    "addOrder(uint256,uint256)": FunctionFragment;
    "balanceOfACDM(address)": FunctionFragment;
    "buyACDMInSale(uint256)": FunctionFragment;
    "buyOrder(uint256,uint256)": FunctionFragment;
    "cancelOrder(uint256)": FunctionFragment;
    "finishRound()": FunctionFragment;
    "getIdOrder()": FunctionFragment;
    "getOrder(uint256,uint256)": FunctionFragment;
    "getPrice()": FunctionFragment;
    "getRefer(address)": FunctionFragment;
    "getRound(uint256)": FunctionFragment;
    "getTradingFloorAddress()": FunctionFragment;
    "numOfRound()": FunctionFragment;
    "owner()": FunctionFragment;
    "pause()": FunctionFragment;
    "paused()": FunctionFragment;
    "registration(address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "tradingFloorInit()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "unpause()": FunctionFragment;
    "withdraw(address,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addOrder",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOfACDM",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "buyACDMInSale",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "buyOrder",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "cancelOrder",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "finishRound",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getIdOrder",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getOrder",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "getPrice", values?: undefined): string;
  encodeFunctionData(functionFragment: "getRefer", values: [string]): string;
  encodeFunctionData(
    functionFragment: "getRound",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getTradingFloorAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "numOfRound",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "registration",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "tradingFloorInit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [string, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "addOrder", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "balanceOfACDM",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "buyACDMInSale",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "buyOrder", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "cancelOrder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "finishRound",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getIdOrder", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getOrder", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getPrice", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getRefer", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getRound", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getTradingFloorAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "numOfRound", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "registration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tradingFloorInit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "ACDMBought(address,uint256,uint256)": EventFragment;
    "FeeTransfered(address,uint256)": EventFragment;
    "OrderBought(address,address,uint256,uint256)": EventFragment;
    "OrderCancelled(uint256,uint256,address)": EventFragment;
    "OrderCreated(address,uint256,uint256,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "Paused(address)": EventFragment;
    "PriceChanged(uint256)": EventFragment;
    "RoundStarted(bool,uint256,uint256)": EventFragment;
    "Unpaused(address)": EventFragment;
    "UserIsRegistrated(address,address)": EventFragment;
    "Withdraw(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ACDMBought"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FeeTransfered"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OrderBought"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OrderCancelled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OrderCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Paused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PriceChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoundStarted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Unpaused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UserIsRegistrated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdraw"): EventFragment;
}

export type ACDMBoughtEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  { buyer: string; _amountACDM: BigNumber; _PriceInETH: BigNumber }
>;

export type ACDMBoughtEventFilter = TypedEventFilter<ACDMBoughtEvent>;

export type FeeTransferedEvent = TypedEvent<
  [string, BigNumber],
  { _to: string; _amount: BigNumber }
>;

export type FeeTransferedEventFilter = TypedEventFilter<FeeTransferedEvent>;

export type OrderBoughtEvent = TypedEvent<
  [string, string, BigNumber, BigNumber],
  {
    _owner: string;
    _buyer: string;
    _amountACDM: BigNumber;
    _priceForAmountACDM: BigNumber;
  }
>;

export type OrderBoughtEventFilter = TypedEventFilter<OrderBoughtEvent>;

export type OrderCancelledEvent = TypedEvent<
  [BigNumber, BigNumber, string],
  { _numOfRound: BigNumber; _id: BigNumber; _owner: string }
>;

export type OrderCancelledEventFilter = TypedEventFilter<OrderCancelledEvent>;

export type OrderCreatedEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber],
  {
    _owner: string;
    _amountACDM: BigNumber;
    _totalPriceForACDM: BigNumber;
    idOrder: BigNumber;
  }
>;

export type OrderCreatedEventFilter = TypedEventFilter<OrderCreatedEvent>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export type PausedEvent = TypedEvent<[string], { account: string }>;

export type PausedEventFilter = TypedEventFilter<PausedEvent>;

export type PriceChangedEvent = TypedEvent<
  [BigNumber],
  { _newPrice: BigNumber }
>;

export type PriceChangedEventFilter = TypedEventFilter<PriceChangedEvent>;

export type RoundStartedEvent = TypedEvent<
  [boolean, BigNumber, BigNumber],
  { _saleOrTrade: boolean; _totalSupply: BigNumber; _price: BigNumber }
>;

export type RoundStartedEventFilter = TypedEventFilter<RoundStartedEvent>;

export type UnpausedEvent = TypedEvent<[string], { account: string }>;

export type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>;

export type UserIsRegistratedEvent = TypedEvent<
  [string, string],
  { _user: string; _refer: string }
>;

export type UserIsRegistratedEventFilter =
  TypedEventFilter<UserIsRegistratedEvent>;

export type WithdrawEvent = TypedEvent<
  [string, BigNumber],
  { _to: string; _amount: BigNumber }
>;

export type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;

export interface TradingFloor extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: TradingFloorInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    addOrder(
      _totalPriceForACDM: BigNumberish,
      _amountACDM: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    balanceOfACDM(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    buyACDMInSale(
      _amountACDM: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    buyOrder(
      _idOrder: BigNumberish,
      _amountACDM: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    cancelOrder(
      _id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    finishRound(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getIdOrder(overrides?: CallOverrides): Promise<[BigNumber]>;

    getOrder(
      _numOfRound: BigNumberish,
      _idOrder: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[OrderStructOutput]>;

    getPrice(overrides?: CallOverrides): Promise<[BigNumber]>;

    getRefer(_user: string, overrides?: CallOverrides): Promise<[string]>;

    getRound(
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[RoundStructOutput]>;

    getTradingFloorAddress(overrides?: CallOverrides): Promise<[string]>;

    numOfRound(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    pause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    registration(
      _refer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    tradingFloorInit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    unpause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdraw(
      _to: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  addOrder(
    _totalPriceForACDM: BigNumberish,
    _amountACDM: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  balanceOfACDM(
    _userAddress: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  buyACDMInSale(
    _amountACDM: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  buyOrder(
    _idOrder: BigNumberish,
    _amountACDM: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  cancelOrder(
    _id: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  finishRound(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getIdOrder(overrides?: CallOverrides): Promise<BigNumber>;

  getOrder(
    _numOfRound: BigNumberish,
    _idOrder: BigNumberish,
    overrides?: CallOverrides
  ): Promise<OrderStructOutput>;

  getPrice(overrides?: CallOverrides): Promise<BigNumber>;

  getRefer(_user: string, overrides?: CallOverrides): Promise<string>;

  getRound(
    _id: BigNumberish,
    overrides?: CallOverrides
  ): Promise<RoundStructOutput>;

  getTradingFloorAddress(overrides?: CallOverrides): Promise<string>;

  numOfRound(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  pause(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  registration(
    _refer: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  tradingFloorInit(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  unpause(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdraw(
    _to: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addOrder(
      _totalPriceForACDM: BigNumberish,
      _amountACDM: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    balanceOfACDM(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    buyACDMInSale(
      _amountACDM: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    buyOrder(
      _idOrder: BigNumberish,
      _amountACDM: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    cancelOrder(_id: BigNumberish, overrides?: CallOverrides): Promise<void>;

    finishRound(overrides?: CallOverrides): Promise<void>;

    getIdOrder(overrides?: CallOverrides): Promise<BigNumber>;

    getOrder(
      _numOfRound: BigNumberish,
      _idOrder: BigNumberish,
      overrides?: CallOverrides
    ): Promise<OrderStructOutput>;

    getPrice(overrides?: CallOverrides): Promise<BigNumber>;

    getRefer(_user: string, overrides?: CallOverrides): Promise<string>;

    getRound(
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<RoundStructOutput>;

    getTradingFloorAddress(overrides?: CallOverrides): Promise<string>;

    numOfRound(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    pause(overrides?: CallOverrides): Promise<void>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    registration(_refer: string, overrides?: CallOverrides): Promise<boolean>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    tradingFloorInit(overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    unpause(overrides?: CallOverrides): Promise<void>;

    withdraw(
      _to: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ACDMBought(address,uint256,uint256)"(
      buyer?: string | null,
      _amountACDM?: null,
      _PriceInETH?: null
    ): ACDMBoughtEventFilter;
    ACDMBought(
      buyer?: string | null,
      _amountACDM?: null,
      _PriceInETH?: null
    ): ACDMBoughtEventFilter;

    "FeeTransfered(address,uint256)"(
      _to?: string | null,
      _amount?: null
    ): FeeTransferedEventFilter;
    FeeTransfered(
      _to?: string | null,
      _amount?: null
    ): FeeTransferedEventFilter;

    "OrderBought(address,address,uint256,uint256)"(
      _owner?: string | null,
      _buyer?: string | null,
      _amountACDM?: null,
      _priceForAmountACDM?: null
    ): OrderBoughtEventFilter;
    OrderBought(
      _owner?: string | null,
      _buyer?: string | null,
      _amountACDM?: null,
      _priceForAmountACDM?: null
    ): OrderBoughtEventFilter;

    "OrderCancelled(uint256,uint256,address)"(
      _numOfRound?: null,
      _id?: null,
      _owner?: null
    ): OrderCancelledEventFilter;
    OrderCancelled(
      _numOfRound?: null,
      _id?: null,
      _owner?: null
    ): OrderCancelledEventFilter;

    "OrderCreated(address,uint256,uint256,uint256)"(
      _owner?: string | null,
      _amountACDM?: null,
      _totalPriceForACDM?: null,
      idOrder?: BigNumberish | null
    ): OrderCreatedEventFilter;
    OrderCreated(
      _owner?: string | null,
      _amountACDM?: null,
      _totalPriceForACDM?: null,
      idOrder?: BigNumberish | null
    ): OrderCreatedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;

    "Paused(address)"(account?: null): PausedEventFilter;
    Paused(account?: null): PausedEventFilter;

    "PriceChanged(uint256)"(_newPrice?: null): PriceChangedEventFilter;
    PriceChanged(_newPrice?: null): PriceChangedEventFilter;

    "RoundStarted(bool,uint256,uint256)"(
      _saleOrTrade?: null,
      _totalSupply?: null,
      _price?: null
    ): RoundStartedEventFilter;
    RoundStarted(
      _saleOrTrade?: null,
      _totalSupply?: null,
      _price?: null
    ): RoundStartedEventFilter;

    "Unpaused(address)"(account?: null): UnpausedEventFilter;
    Unpaused(account?: null): UnpausedEventFilter;

    "UserIsRegistrated(address,address)"(
      _user?: string | null,
      _refer?: string | null
    ): UserIsRegistratedEventFilter;
    UserIsRegistrated(
      _user?: string | null,
      _refer?: string | null
    ): UserIsRegistratedEventFilter;

    "Withdraw(address,uint256)"(
      _to?: string | null,
      _amount?: null
    ): WithdrawEventFilter;
    Withdraw(_to?: string | null, _amount?: null): WithdrawEventFilter;
  };

  estimateGas: {
    addOrder(
      _totalPriceForACDM: BigNumberish,
      _amountACDM: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    balanceOfACDM(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    buyACDMInSale(
      _amountACDM: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    buyOrder(
      _idOrder: BigNumberish,
      _amountACDM: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    cancelOrder(
      _id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    finishRound(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getIdOrder(overrides?: CallOverrides): Promise<BigNumber>;

    getOrder(
      _numOfRound: BigNumberish,
      _idOrder: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPrice(overrides?: CallOverrides): Promise<BigNumber>;

    getRefer(_user: string, overrides?: CallOverrides): Promise<BigNumber>;

    getRound(_id: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    getTradingFloorAddress(overrides?: CallOverrides): Promise<BigNumber>;

    numOfRound(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    pause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    registration(
      _refer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    tradingFloorInit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    unpause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdraw(
      _to: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addOrder(
      _totalPriceForACDM: BigNumberish,
      _amountACDM: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    balanceOfACDM(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    buyACDMInSale(
      _amountACDM: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    buyOrder(
      _idOrder: BigNumberish,
      _amountACDM: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    cancelOrder(
      _id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    finishRound(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getIdOrder(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getOrder(
      _numOfRound: BigNumberish,
      _idOrder: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getRefer(
      _user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRound(
      _id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTradingFloorAddress(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    numOfRound(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    registration(
      _refer: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    tradingFloorInit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    unpause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdraw(
      _to: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
