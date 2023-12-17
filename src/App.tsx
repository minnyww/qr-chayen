/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react'
import generatePayload from 'promptpay-qr'
import { Avatar, Button, Checkbox, Input } from '@nextui-org/react'
import QRCode from "react-qr-code";
import './App.css'
import { toJpeg } from 'html-to-image'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dataURLtoFile = (dataurl: any, filename: any) => {
  const arr = dataurl.split(",")
  const mimeType = arr[0].match(/:(.*?);/)[1]
  const decodedData = atob(arr[1])
  let lengthOfDecodedData = decodedData.length
  const u8array = new Uint8Array(lengthOfDecodedData);
  while (lengthOfDecodedData--) {
    u8array[lengthOfDecodedData] = decodedData.charCodeAt(lengthOfDecodedData);
  }
  return new File([u8array], filename, { type: mimeType });
};





function App() {
  const [phonenumber, setPhoneNumber] = useState<string | undefined>()
  const [amount, setAmount] = useState(0)
  const [peopleAmount, setPeopleAmount] = useState(1)
  const [qrValue, setQrValue] = useState('')
  const [isSavePhoneNumber, setIsSavePhoneNumber] = useState(false)

  useEffect(() => {
    const savedPhone = localStorage.getItem("phone")
    if (savedPhone) {
      setPhoneNumber(savedPhone)
      setIsSavePhoneNumber(true)
    }
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shareFile = (file: any, title: any, text: any) => {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator
        .share({
          files: [file],
          title,
          text
        })
        .then(() => console.log("Share was successful."))
        .catch((error) => {
          window.alert(`Sharing failed ${JSON.stringify(error)}`)
        });
    } else {
      window.alert("Your system doesn't support sharing files.");
    }
  };

  const createImage = () => {
    //@ts-ignore
    toJpeg(document.getElementById("qrcode"), { quality: 1, backgroundColor: 'white', height: 300 }).then(
      (dataUrl) => {
        const file = dataURLtoFile(dataUrl, "qrcode-promptpay.png");
        shareFile(file, "QR Chayen", "http://qr-chayen.web.app/");
      }
    );
  };

  return (
    <>
      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div
          style={{ display: 'flex', padding: '1rem', flexDirection: 'column', gap: "16px", width: '100%', justifyContent: 'center' }}>
          <Input value={phonenumber} label="Phone Number" onChange={({ target: { value } }) => {
            setPhoneNumber(value)
          }} />
          <div className="flex w-full md:flex-nowrap gap-4">
            <div style={{ flex: 2 }}>
              <Input type="number" value={amount.toString()} label="Amount (ใส่หรือไม่ใส่ก็ได้)" onChange={({ target: { value } }) => setAmount(+value)} />
            </div>
            <div style={{ flex: 1 }}>
              <Input type="number" value={peopleAmount.toString()} label="กี่คน" onChange={({ target: { value } }) => setPeopleAmount(+value)} />
            </div>
          </div>
          {qrValue &&
            <div id="qrcode" style={{ padding: '1rem' }}>
              <QRCode value={qrValue} style={{ width: '100%' }} />
            </div>
          }
          <Button
            color="primary"
            onClick={() => {
              if (phonenumber) {
                const payload = generatePayload(phonenumber, { amount: amount * peopleAmount })
                if (isSavePhoneNumber) {
                  localStorage.setItem("phone", phonenumber)

                }
                if (!isSavePhoneNumber) {
                  localStorage.setItem("phone", "")
                }
                setQrValue(payload)
              }
            }}>Generate
          </Button>
          {qrValue &&
            <Button
              color="primary" variant="bordered"
              onClick={() => {
                createImage()
              }}>
              Share
            </Button>
          }
          <Checkbox
            isSelected={isSavePhoneNumber}
            onChange={(e) => {
              setIsSavePhoneNumber(e.target.checked)
            }}
          >
            Save Phone Number
          </Checkbox>
          <Button style={{ width: 'fit-content' }} size='sm' color="primary" onClick={() => {
            localStorage.clear()
            window.location.reload()
          }}>Reset Setting
          </Button>
          <div className="flex gap-4 items-center">
            <Avatar onClick={() => {
              window.location.href = "scbeasy://scan/camera"
            }} isBordered src="https://www.phutipat-vetiver.com/wp/wp-content/uploads/scb-icon.png" />
            {/* <Avatar onClick={() => {
              window.location.href = "https://7eleven.mobi/navPage/SE013"
            }} isBordered src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/7-eleven-logo-icon.png" /> */}
            <Avatar onClick={() => {
              window.location.href = "line://pay/scanQR"
            }} isBordered src="https://creative.line.me/static/d0286d95a0633e57756d831830d57180/4910b25d5ef7fbac014c2166b10629cf.png" />
            <Avatar onClick={() => {
              window.location.href = "ascendmoney://wallet.truemoney.co.th/app/660000000007"
            }} isBordered src="https://inwfile.com/s-ck/wy9m4g.jpg" />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
