import { Button, HStack, Input, useToast } from '@chakra-ui/react'
import React, { useContext, useEffect, useRef, useState } from 'react'

import { UserDataContext } from '../../context/userContext'
import updateGasSettings from '../../utils/database-functions/updateGasSettings'

import "./gasModal.css"

const GasModal = ({ setGasModalOpen, gasModalOpen }) => {

  const toast = useToast()

  const gasModalOpenRef = useRef(gasModalOpen)
  const { gasSettings, setGasSettings, ethData } = useContext(UserDataContext)
  const [custom, setCustom] = useState(false)



  useEffect(() => {
    window.addEventListener("click", closeModal)

    return () => {
      window.removeEventListener("click", closeModal)
    }
  }, [])

  const closeModal = e => {
    if (gasModalOpenRef.current) {
      const modalContainer = document.querySelector(".gas-modal-container")
      const footerGasPreset = document.querySelector(".footer-gas-preset")

      const path = e.composedPath()
      if (path.includes(footerGasPreset)) return

      modalContainer.classList.remove("visible")
      setTimeout(() => {
        setGasModalOpen(false)
      }, 250)
    }
  }

  function openCustom() {
    changePreset("custom")
    document.querySelector(".gas-modal-container").classList.add("extend")
    setCustom(true)
  }

  function closeCustom() {
    document.querySelector(".gas-modal-container").classList.remove("extend")
    setCustom(false)
  }

  useEffect(() => {


    if (gasModalOpen) {
      gasModalOpenRef.current = true

      const presetValue = gasSettings.value
      const allPresets = document.querySelectorAll(".gas-modal-single-preset")
      const presetName = `.${presetValue}-gas-preset`
      const selectedPreset = document.querySelector(presetName)

      if (presetValue === "custom") openCustom()

      allPresets.forEach(preset => preset.classList.remove("active"))
      selectedPreset.classList.add("active")
      setTimeout(() => {
        document.querySelector(".gas-modal-container").classList.add("visible")
      }, 10)
    }
    else {
      gasModalOpenRef.current = false
      if (custom) {
        setCustom(false)
      }
    }
  }, [gasModalOpen])


  async function changePreset(value, type) {

    try {
      const allPresets = document.querySelectorAll(".gas-modal-single-preset")
      const presetName = `.${value}-gas-preset`
      const selectedPreset = document.querySelector(presetName)

      allPresets.forEach(preset => preset.classList.remove("active"))
      selectedPreset.classList.add("active")

      if (custom && value !== "custom") closeCustom()

      let newGasSetting = {}
      let maxGas;

      switch (value) {
        case "standard":
          maxGas = ethData.gasMapping["standardGas"].maxFeePerGas
          newGasSetting = { ...gasSettings, maxFeePerGas: maxGas, maxPriorityFeePerGas: 1, value, label: "Standard" }
          break
        case "fast":
          maxGas = ethData.gasMapping["fastGas"].maxFeePerGas

          newGasSetting = { ...gasSettings, maxFeePerGas: maxGas, maxPriorityFeePerGas: 1.5, value, label: "Fast" }
          break
        case "instant":
          maxGas = ethData.gasMapping["instantGas"].maxFeePerGas

          newGasSetting = { ...gasSettings, maxFeePerGas: maxGas, maxPriorityFeePerGas: 2.5, value, label: "Instant" }
          break
        case "custom":
          const maxFeePerGas = document.querySelector(".gas-modal-maxFeePerGas-input")?.value || gasSettings?.custom?.maxFeePerGas
          const maxPriorityFeePerGas = document.querySelector(".gas-modal-maxPriorityFeePerGas-input")?.value || gasSettings?.custom?.maxPriorityFeePerGas

          newGasSetting = { maxFeePerGas, maxPriorityFeePerGas, custom: { maxFeePerGas, maxPriorityFeePerGas }, value, label: "Custom" }
          break
      }

      const updateResult = await updateGasSettings(newGasSetting)
      if (updateResult) setGasSettings(newGasSetting)
      else throw new Error("Error updating gas settings")
    }
    catch (e) {
      toast({
        title: "Error",
        description: "Error updating gas settings",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <>
      {
        gasModalOpen &&
        <div className='gas-modal-container'>
          <p className='gas-modal-title'>Gas preset</p>

          <div className='gas-modal-presets-container'>
            <div className='gas-modal-single-preset instant-gas-preset active' onClick={() => changePreset("instant")}>
              <i className="fa-solid fa-bolt"></i>
              <p>Instant</p>
            </div>

            <div className='gas-modal-single-preset fast-gas-preset' onClick={() => changePreset("fast")}>
              <i className="fa-sharp fa-solid fa-rocket-launch"></i>
              <p>Fast</p>
            </div>

            <div className='gas-modal-single-preset standard-gas-preset' onClick={() => changePreset("standard")}>
              <i className="fa-solid fa-truck"></i>
              <p>Standard</p>
            </div>

            <div className='gas-modal-single-preset custom-gas-preset' onClick={openCustom}>
              <i className="fa-solid fa-gear"></i>
              <p>Custom</p>
            </div>

            {
              custom &&
              <>
                <hr className='gas-modal-hr' />

                <div className='gas-modal-custom-extend'>

                  <div>
                    <p>Max Fee per Gas</p>
                    <HStack>
                      <Input _placeholder={"1.5"} color="white" className='gas-modal-maxFeePerGas-input' defaultValue={gasSettings.custom.maxFeePerGas} />
                    </HStack>
                  </div>


                  <div>
                    <p>Max Priority Fee per Gas</p>

                    <HStack>
                      <Input _placeholder={"40"} color="white" className="gas-modal-maxPriorityFeePerGas-input" defaultValue={gasSettings.custom.maxPriorityFeePerGas} />
                    </HStack>
                  </div>

                  <div>
                    <Button className='gas-modal-save-button' height={"30px"} colorScheme="blue" onClick={() => changePreset("custom", "save")}>Save</Button>
                  </div>
                </div>
              </>
            }
          </div>
        </div>

      }

    </>
  )
}

export default GasModal