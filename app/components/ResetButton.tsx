'use client'

const ResetButton = () => {
  return (
    <button
      onClick={() => window.location.reload()}
      className='text-3xl text-white text-center p-2 pt-4 bg-orange reset-button cursor-pointer border-b-[6px] border-orange2 w-60'
    >
      Reset
    </button>
  )
}

export default ResetButton;