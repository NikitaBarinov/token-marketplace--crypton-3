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
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export type ReferStruct = { firstRefer: string; secondRefer: string };

export type ReferStructOutput = [string, string] & {
  firstRefer: string;
  secondRefer: string;
};

export interface TradingFloorInterface extends utils.Interface {
  functions: {
    "balanceOfACDM(address)": FunctionFragment;
    "balanceOfETH(address)": FunctionFragment;
    "buyACDMInSale(uint256)": FunctionFragment;
    "getBlockTimeStamp()": FunctionFragment;
    "getPrice()": FunctionFragment;
    "getRefer(address)": FunctionFragment;
    "getTradingFloorAddress()": FunctionFragment;
    "numOfRound()": FunctionFragment;
    "registration(address,address)": FunctionFragment;
    "totalSupplyACDM()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "balanceOfACDM",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOfETH",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "buyACDMInSale",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getBlockTimeStamp",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "getPrice", values?: undefined): string;
  encodeFunctionData(functionFragment: "getRefer", values: [string]): string;
  encodeFunctionData(
    functionFragment: "getTradingFloorAddress",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "numOfRound",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "registration",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupplyACDM",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "balanceOfACDM",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "balanceOfETH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "buyACDMInSale",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBlockTimeStamp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getPrice", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getRefer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getTradingFloorAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "numOfRound", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "registration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalSupplyACDM",
    data: BytesLike
  ): Result;

  events: {
    "PriceChanged(uint256)": EventFragment;
    "UserIsRegistrated(address,address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "PriceChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UserIsRegistrated"): EventFragment;
}

export type PriceChangedEvent = TypedEvent<
  [BigNumber],
  { _newPrice: BigNumber }
>;

export type PriceChangedEventFilter = TypedEventFilter<PriceChangedEvent>;

export type UserIsRegistratedEvent = TypedEvent<
  [string, string, string],
  { _user: string; _firstRefer: string; _secondRefer: string }
>;

export type UserIsRegistratedEventFilter =
  TypedEventFilter<UserIsRegistratedEvent>;

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
    balanceOfACDM(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { balance: BigNumber }>;

    balanceOfETH(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { balance: BigNumber }>;

    buyACDMInSale(
      _amountACDM: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getBlockTimeStamp(overrides?: CallOverrides): Promise<[BigNumber]>;

    getPrice(overrides?: CallOverrides): Promise<[BigNumber]>;

    getRefer(
      _user: string,
      overrides?: CallOverrides
    ): Promise<[ReferStructOutput]>;

    getTradingFloorAddress(overrides?: CallOverrides): Promise<[string]>;

    numOfRound(overrides?: CallOverrides): Promise<[BigNumber]>;

    registration(
      _firstRefer: string,
      _secondRefer: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    totalSupplyACDM(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  balanceOfACDM(
    _userAddress: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  balanceOfETH(
    _userAddress: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  buyACDMInSale(
    _amountACDM: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getBlockTimeStamp(overrides?: CallOverrides): Promise<BigNumber>;

  getPrice(overrides?: CallOverrides): Promise<BigNumber>;

  getRefer(
    _user: string,
    overrides?: CallOverrides
  ): Promise<ReferStructOutput>;

  getTradingFloorAddress(overrides?: CallOverrides): Promise<string>;

  numOfRound(overrides?: CallOverrides): Promise<BigNumber>;

  registration(
    _firstRefer: string,
    _secondRefer: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  totalSupplyACDM(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    balanceOfACDM(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balanceOfETH(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    buyACDMInSale(
      _amountACDM: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    getBlockTimeStamp(overrides?: CallOverrides): Promise<BigNumber>;

    getPrice(overrides?: CallOverrides): Promise<BigNumber>;

    getRefer(
      _user: string,
      overrides?: CallOverrides
    ): Promise<ReferStructOutput>;

    getTradingFloorAddress(overrides?: CallOverrides): Promise<string>;

    numOfRound(overrides?: CallOverrides): Promise<BigNumber>;

    registration(
      _firstRefer: string,
      _secondRefer: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    totalSupplyACDM(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {
    "PriceChanged(uint256)"(_newPrice?: null): PriceChangedEventFilter;
    PriceChanged(_newPrice?: null): PriceChangedEventFilter;

    "UserIsRegistrated(address,address,address)"(
      _user?: null,
      _firstRefer?: null,
      _secondRefer?: null
    ): UserIsRegistratedEventFilter;
    UserIsRegistrated(
      _user?: null,
      _firstRefer?: null,
      _secondRefer?: null
    ): UserIsRegistratedEventFilter;
  };

  estimateGas: {
    balanceOfACDM(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balanceOfETH(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    buyACDMInSale(
      _amountACDM: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getBlockTimeStamp(overrides?: CallOverrides): Promise<BigNumber>;

    getPrice(overrides?: CallOverrides): Promise<BigNumber>;

    getRefer(_user: string, overrides?: CallOverrides): Promise<BigNumber>;

    getTradingFloorAddress(overrides?: CallOverrides): Promise<BigNumber>;

    numOfRound(overrides?: CallOverrides): Promise<BigNumber>;

    registration(
      _firstRefer: string,
      _secondRefer: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    totalSupplyACDM(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    balanceOfACDM(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    balanceOfETH(
      _userAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    buyACDMInSale(
      _amountACDM: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getBlockTimeStamp(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getRefer(
      _user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTradingFloorAddress(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    numOfRound(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    registration(
      _firstRefer: string,
      _secondRefer: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    totalSupplyACDM(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}