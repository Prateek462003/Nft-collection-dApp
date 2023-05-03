import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useEffect, useRef, useState } from 'react'
import Web3modal, { Provider } from "web3modal";
import {Contract, ethers, providers, utils} from "ethers";
import {NFT_CONTRACT_ADDRESS, abi} from "../constants/index.js"

export default function Home() {
  const web3ModalRef = useRef();
  const [walletConnected, setWalletConnected] = useState(false);
  const [preSaleStarted, setPresaleStarted] = useState(false);
  const [preSaleEnded, setPresaleEnded] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenMinted, setTokenMinted] = useState("0");

  const getOwner = async()=>{
    try{
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        abi,
        provider
      );
      const _owner = await nftContract.owner();
      const signer = await getProviderOrSigner(true);
      const signerAddress = await signer.getAddress();

      if(signerAddress.toLowerCase() === _owner.toLowerCase()){
        setIsOwner(true);
      }
    }catch(err){
      console.error(err);
    }
  }
  const StartPresale = async()=>{
    try{
      const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        abi,
        signer
      );
      if(isOwner){
        const tx = await nftContract.StartPresale();
        setLoading(true);
        await tx.wait();
        setLoading(false);
        await checkPresaleStarted();
      }
    }catch(err){
      console.error(err);
    }
  }

  const PresaleMint = async()=>{
    try{
      const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const tx = await nftContract.PresaleMint({
        value: utils.parseEther("0.01")
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert("You have successfully minted Crypto Devs NFT")
    }catch(err){
      console.error(err);
    }
  }

  const PublicMint = async()=>{
    try{
      const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const tx = await nftContract.publicMint({
        value: utils.parseEther("0.02")
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert("You have successfully minted Crypto Devs NFT")
    }catch(err){
      console.error(err);
    }    
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
      const hasEnded = _preSaleEnded.lt(Math.floor(Date.now() / 1000));
      if(hasEnded){
        setPresaleEnded(true);
      }
      return _preSaleEnded;
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

  const getTokenId = async()=>{
    try{
      const provider = await getProviderOrSigner();
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        abi,
        provider
      );
      const _tokenId = await nftContract.tokenIds();
      setTokenMinted(_tokenId.toString());
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
        getOwner();

        getTokenId();
        const presaleEndedInterval = setInterval(async function(){
          const _preSaleStarted = await checkPresaleStarted();
          if(_preSaleStarted){
            const _preSaleEnded = await checkPresaleEnded();
            if(_preSaleEnded){
              clearInterval(presaleEndedInterval);
            }
          }
        }, 5000);

        setInterval(async function(){
          await getTokenId();
        }, 5000);

      }

    }, [walletConnected]);
    
    const renderButtons =()=>{
      if(!walletConnected){
        return(
          <button className={styles.button} onClick={connectWallet()}>
            Connect Wallet
          </button>
        );
      }

      if(!preSaleStarted && isOwner){
        return(
          <button className={styles.button} onClick={StartPresale()}>
            Start Presale!
          </button>
        );
      }
      
      if(!preSaleStarted){
        return(
          <div className={styles.description}>
            Presale hasn't Started Yet
          </div>
        );
      }
      if(preSaleStarted && !preSaleEnded){
        return(
          <div>
            <div className={styles.description}>
              You Can Mint a NFT if your address is Whitlisted
            </div>
            <button className={styles.button}>
              Presale Mint!!
            </button>
          </div>
        );
      }
      if(preSaleStarted && preSaleEnded){
        return(
          <button className={styles.button}>
            Mint
          </button>
        );
      }
      if(loading){
        return(
          <button className={styles.button}>
            Loading...
          </button>
        );
      }
    }
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
