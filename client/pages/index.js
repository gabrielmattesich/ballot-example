import Head from 'next/head'
import MetamaskLogo from '../styles/assets/metamask.png';
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import Web3 from 'web3'

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    function checkConnectedWallet() {
      const userData = JSON.parse(localStorage.getItem('userAccount'));
      if (userData != null) {
        setUserInfo(userData);
        setIsConnected(true);
      }
    }
    checkConnectedWallet();
  }, []);

  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      // eslint-disable-next-line
      provider = window.web3.currentProvider;
    } else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
    return provider;
  };

  const onConnect = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        if (currentProvider !== window.ethereum) {
          console.log(
            'Non-Ethereum browser detected. You should consider trying MetaMask!'
          );
        }
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const chainId = await web3.eth.getChainId();
        const account = userAccount[0];
        let ethBalance = await web3.eth.getBalance(account); // Get wallet balance
        ethBalance = web3.utils.fromWei(ethBalance, 'ether'); //Convert balance to wei
        setIsConnected(true); 
        saveUserInfo(ethBalance, account, chainId);
        console.log('Estado de la conexión: ', isConnected)
        if (userAccount.length === 0) {
          console.log('Please connect to meta mask');
        }
      }
    } catch (err) {
      console.error(
        'There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.',
        err
      );
    }
  };

  const onDisconnect = () => {
    window.localStorage.removeItem('userAccount');
    setUserInfo({});
    setIsConnected(false);
  };

  const saveUserInfo = (ethBalance, account, chainId) => {
    const userAccount = {
      account: account,
      balance: ethBalance,
      connectionid: chainId,
    };
    window.localStorage.setItem('userAccount', JSON.stringify(userAccount)); //user persisted data
    const userData = JSON.parse(localStorage.getItem('userAccount'));
    setUserInfo(userData);
    setIsConnected(true);
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Votación</title>
        <meta name="description" content="Generado con Hardhat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Bienvenido a la votación del día
        </h1>
        <div>
              <div className="app-wrapper">
              {!isConnected && (
                <div className={styles.card}>
                  <button className="app-buttons__login" onClick={onConnect}>
                    Conectarse con la billetera.
                  </button>
                </div>
              )}
            </div>
            {isConnected && (
              <div className={styles.card}>
                <div className="app-details">
                  <h2>Bienvenido a la votación</h2>
                  <div className="app-account">
                    <span>Identificación:</span> <br />
                    <code>{userInfo.account}</code>
                  </div>
                  <div className="app-balance">
                    <span>Balance:</span><br />
                    <code>{userInfo.balance}</code>
                  </div>
                  <div className="app-connectionid">
                    <span>Identificación única:</span><br />
                    <code>{userInfo.connectionid}</code>
                  </div>
                </div>
                <div>
                  <button className="app-buttons__logout" onClick={onDisconnect}>
                    Disconnect
                  </button>
                </div>
              </div>
            )}
        </div>

        <p className={styles.description}>
          Personas que han votado: 
          <code className={styles.code}>20000</code>
        </p>

        <div className={styles.grid}>
          <a href="/" className={styles.card}>
            <h2>Opcion 1</h2>
            <p>Propuestas</p>
          </a>

          <a href="/" className={styles.card}>
            <h2>Opcion 2</h2>
            <p>Propuestas</p>
          </a>

          <a href="/" className={styles.card}>
            <h2>Opcion 3</h2>
            <p>Propuestas</p>
          </a>

          <a href="/" className={styles.card}>
            <h2>Opcion 4</h2>
            <p>Propuestas</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Wobli
        </a>
      </footer>
    </div>
  )
}
