import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useEffect, useRef, useState } from 'react'
import Web3modal from "web3modal";
import {Contract, providers} from "ethers";
import {NFT_CONTRACT_ADDRESS, abi} from "../constants/index.js"

export default function Home() {
  const web3ModalRef = useRef();
  const [walletConnected, setWalletConnected] = useState(false);
  const [preSaleStarted, setPresaleStarted] = useState(false);
  const [preSaleEnded, setPresaleEnded] = useState(false);
  
  const StartPresale = async()=>{

  }

  const PresaleMint = async()=>{

  }

  const PublicMint = async()=>{
    
  }
  const checkPresaleStarted = async()=>{
    try{
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        abi,
        provider
      );
      const _preSaleStarted = await nftContract.preSaleStarted();
      if(_preSaleStarted){
        setPresaleStarted(true);
      }
      return _preSaleStarted;
    }catch(err){
      console.error(err);
    }
  }

  const checkPresaleEnded = async()=>{
    try{
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        abi,
        provider
      );
      const _preSaleEnded = await nftContract.preSaleEnded();
      if(_preSaleStarted){
        setPresaleStarted(true);
      }
      return _preSaleStarted;
    }catch(err){
      console.error(err);
    }
      
  }

  

  const connectWallet = async()=>{
    try{
      await getProviderOrSigner();  
      setWalletConnected(true);
    }catch(err){
      console.error(err);
    }
  }

  const getProviderOrSigner = async(needSigner = false)=>{
    try{
      const provider = await web3ModalRef.current.connect();
      const web3Provider = await ethers.providers.Web3Provider(provider);
      const {chainId} = await web3Provider.getNetwork();
      if(chainId != 11155111){
        window.alert("Connect network to Sepolia");
        throw new Error("Connect network to Sepolia");
      }
      if(needSigner){
        const signer = web3Provider.getSigner();
        return signer;
      }
      return web3Provider;
    }catch(err){
      console.error(err);
    }

  }

  useEffect(()=>{
      if(!walletConnected){
        web3ModalRef.current = new Web3modal({
          network:"sepolia",
          providerOptions:{},
          disableInjectedProvider:false,
        });
        connectWallet();
      }

    }, []);
  
  return (
    <>
      <Head>
        <title>NFT-Collection-dApp</title>
      </Head>
      <div className={styles.main}>

      </div>
    </>
  )
}
