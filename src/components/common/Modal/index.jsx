/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";

export default function Modal({
  open,
  setOpen,
  children,
  title,
  btnText = "Submit",
  preventOutsideClick = false,
  submitHandler = () => {},
  onClose = () => {},
  isDisabled = false,
  hideFooter = false
}) {

  useEffect(()=>{
    if(open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  },[open])

  if (!open) return null;

  const handleClose = () => {
    if(isDisabled) return
    setOpen(false)
    onClose()
  }

  return (
    <div
      onClick={() => {
        if (preventOutsideClick) return;
        handleClose()
      }}
      className={`fixed w-screen h-screen !inset-0 z-[10001] bg-black bg-opacity-30 backdrop-blur-sm grid place-content-center ${
        !preventOutsideClick ? "cursor-pointer" : "cursor-auto"
      } `}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="w-[90vw] max-w-[600px] bg-white max-h-[70vh] flex flex-col cursor-auto"
      >
        <div className="h-[8vh] w-full border-b flex items-center justify-between px-4">
          <p className="font-bold break-before-avoid">{title}</p>
          <button onClick={handleClose}>
            <AiOutlineClose className="text-gray-700" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[54vh]">{children}</div>
        {!hideFooter ? <div className="w-full h-[8vh] border-t flex px-4 items-center justify-end gap-2">
          <button onClick={handleClose} className="bg-blue-500 text-sm hover:bg-opacity-90 text-white rounded-md px-4 py-1 flex items-center gap-x-2">
            Close
          </button>
          <button disabled={isDisabled} onClick={submitHandler} className="bg-blue-500  text-sm hover:bg-opacity-90 text-white rounded-md px-4 py-1 flex items-center gap-x-2">
            {btnText}
          </button>
        </div> : null}
      </div>
    </div>
  );
}
