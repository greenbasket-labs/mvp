import { providers, utils } from "ethers";
import { useEffect, useState } from "react";

export const _isMetaMaskInstalled = () => {
  if (typeof window === "undefined") return false;

  return Boolean(window.ethereum && window.ethereum.isMetaMask);
};

export const _getProvider = () => {
  if (!_isMetaMaskInstalled()) return null;

  return new providers.Web3Provider(window.ethereum);
};

export const _getChain = async () => {
  const provider = _getProvider();

  if (!provider) return -1;

  const network = await provider.getNetwork();

  return `${network.chainId}`;
};

export const _getAddress = async () => {
  const provider = _getProvider();

  if (!provider) return null;

  try {
    const accounts = await provider.listAccounts();

    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const _onAccountsChanged = (callback) => {
  if (!_isMetaMaskInstalled()) return;

  window.ethereum.on("accountsChanged", callback);
};

const _onChainChanged = (callback) => {
  if (!_isMetaMaskInstalled()) return;

  window.ethereum.on("chainChanged", callback);
};

export const WalletHook = () => {
  const [wallet, setWallet] = useState(null);
  const [chain, setChain] = useState(-1);

  useEffect(() => {
    const load = async () => {
      const address = await _getAddress();
      const currentChain = await _getChain();

      setWallet(address ? address.toLowerCase() : null);
      setChain(currentChain);
    };

    _onAccountsChanged((accounts) => {
      if (!accounts || !accounts[0]) {
        setWallet(null);
        return;
      }

      setWallet(accounts[0].toLowerCase());
    });

    _onChainChanged((chainId) => {
      if (!chainId) return;

      setChain(parseInt(chainId, 16).toString());
    });

    load();
  }, []);

  return {
    wallet,
    chain,
  };
};

export const connectMetamask = async () => {
  console.log("connectMetamask started");

  if (!_isMetaMaskInstalled()) {
    console.log("MetaMask NOT installed");
    alert("MetaMask is not installed");
    return false;
  }

  try {
    console.log("Requesting MetaMask account...");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    console.log("Account connected:", accounts);

    return true;
  } catch (error) {
    console.error("MetaMask connection error:", error);
    alert(error.message);

    return false;
  }
};

export const switchToMainnet = async () => {
  if (!_isMetaMaskInstalled()) return false;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xA86A" }],
    });

    return true;
  } catch (error) {
    console.error("Network switch error:", error);
    return false;
  }
};

export const watchTransaction = (txHash, callback) => {
  const provider = _getProvider();

  if (!provider) return;

  provider.once(txHash, (transaction) => {
    callback(transaction, transaction.status === 1);
  });
};

export const parseBigNumber = (bn, decimals = 2) => {
  if (!bn) return 0;

  try {
    return numberWithCommas(
      parseFloat(utils.formatUnits(bn, "gwei")).toFixed(decimals)
    );
  } catch (error) {
    return bn;
  }
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}