import { useRef, useEffect, useState } from 'react'

export default function CameraModal({ onCapture, onClose }) {
  const videoRef = useRef()
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let activeStream = null

    navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
      audio: false,
    }).then((stream) => {
      activeStream = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => setReady(true)
      }
    }).catch(() => {
      setError('Camera access was denied. Please allow camera permissions in your browser settings.')
    })

    return () => activeStream?.getTracks().forEach((t) => t.stop())
  }, [])

  function capture() {
    const video = videoRef.current
    if (!video || !ready) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)

    canvas.toBlob((blob) => {
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' })
      video.srcObject?.getTracks().forEach((t) => t.stop())
      onCapture(file)
    }, 'image/jpeg', 0.92)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {error ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-lg mb-2">Camera unavailable</p>
            <p className="text-gray-400 text-sm leading-relaxed">{error}</p>
          </div>
          <button onClick={onClose} className="px-8 py-3 bg-white text-black rounded-2xl font-bold text-sm">
            Go Back
          </button>
        </div>
      ) : (
        <>
          {/* Video */}
          <div className="relative flex-1 overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Corner guides */}
            {ready && (
              <div className="absolute inset-6 pointer-events-none">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-lg" />
              </div>
            )}

            {!ready && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="bg-black px-8 pt-6 pb-10 flex items-center justify-between">
            {/* Close */}
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Shutter */}
            <button
              onClick={capture}
              disabled={!ready}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40"
            >
              <div className="w-[68px] h-[68px] rounded-full border-4 border-black" />
            </button>

            {/* Placeholder for balance */}
            <div className="w-12 h-12" />
          </div>
        </>
      )}
    </div>
  )
}
