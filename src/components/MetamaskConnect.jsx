import React, { useState } from 'react'
import { connectMetamask } from '../utils/ethereum'

const MetamaskConnect = () => {
  const [status, setStatus] = useState('Connect Metamask')

  const handleConnect = async () => {
    console.log('1. CONNECT BUTTON CLICKED')
    setStatus('Connecting...')

    try {
      if (!window.ethereum) {
        console.log('2. MetaMask NOT FOUND')
        setStatus('MetaMask not found')
        return
      }

      console.log('2. MetaMask FOUND')
      console.log('3. Requesting account...')

      const result = await connectMetamask()

      console.log('4. connectMetamask result:', result)

      if (result) {
        setStatus('Connected')
      } else {
        setStatus('Connection failed')
      }
    } catch (error) {
      console.error('CONNECT ERROR:', error)
      setStatus('Error - check console')
    }
  }

  return (
    <button
      type="button"
      onClick={handleConnect}
      style={{
        borderImage: 'url(/images/wood-frame.svg) 10 10 10 10 stretch',
        borderWidth: '10px',
        borderStyle: 'solid',
        cursor: 'pointer',
        background: 'transparent',
        padding: '10px 20px',
        color: 'white',
        position: 'relative',
        zIndex: 9999,
      }}
    >
      <div
        className="text-center font-console"
        style={{ fontSize: '20px' }}
      >
        {status}
      </div>
    </button>
  )
}

export default MetamaskConnect