import { Event } from '../../domain-models'
import { motion } from "framer-motion"
import dayjs from 'dayjs';
import { AiOutlineClose } from 'react-icons/ai'

interface EventDetailsProps {
  activeEvent: Event;
  handleEventChange: () => void
}

const EventDetails = ({ activeEvent, handleEventChange }: EventDetailsProps) => {
  return (
    <div className="fixed z-1 w-screen h-screen">
      <div onClick={() => { handleEventChange }} className=" absolute z-2  w-screen h-screen "></div>
      <motion.div
        initial={{ opacity: 0, }}
        animate={{ opacity: 1, }}
        transition={{ duration: .3 }}
      >
        <div className=" absolute z-12 bg-white sm:hidden svn:grid-cols-2 fft:p-8 thn:p-8 p-14 gap-x-32 thn:gap-x-4 gap-y-4 my-12 mx-8 mr-12  grid grid-cols-3 border-neutral-300 border rounded-3xl top-1/2 transform  -translate-y-1/2">
          <AiOutlineClose color="red" className="absolute right-8 top-6" size="20px" onClick={handleEventChange} />
          <div className="">
            <h1 className="font-medium text-sm text-neutral-500 mb-3">ACTOR</h1>
            <div className="w-full   grid grid-cols-2 thn:grid-cols-1 ">
              <p className="font-normal text-sm text-neutral-500 mb-2">Name</p>
              <p className="font-normal text-sm text-black mb-2">{activeEvent?.actorName}</p>
              <p className="font-normal text-sm text-neutral-500 mb-2">Email</p>
              <p className="font-normal text-sm text-black mb-2">{activeEvent?.targetName}</p>
              <p className="font-normal text-sm text-neutral-500 mb-2">ID</p>
              <p className="font-normal text-sm text-black mb-2">{activeEvent?.actorId}</p>
            </div>
          </div>
          <div className="">
            <h1 className="font-medium text-sm text-neutral-500 mb-3">ACTION</h1>
            <div className="w-full   grid grid-cols-2 thn:grid-cols-1 ">
              <p className="font-normal text-sm text-neutral-500 mb-2">Name</p>
              <p className="font-normal text-sm text-black mb-2">{activeEvent?.action?.name || ""}</p>
              <p className="font-normal text-sm text-neutral-500 mb-2">Object</p>
              <p className="font-normal text-sm text-black mb-2">{activeEvent?.action?.object || ""}</p>
              <p className="font-normal text-sm text-neutral-500 mb-2">ID</p>
              <p className="font-normal text-sm text-black mb-2">{activeEvent?.action?.id || ""}</p>
            </div>
          </div>
          <div className="">
            <h1 className="font-medium text-sm text-neutral-500 mb-3">DATE</h1>
            <div className="w-full   grid grid-cols-2 thn:grid-cols-1 ">
              <p className="font-normal text-sm text-neutral-500 mb-2">Readable</p>
              <p className="font-normal text-sm text-black mb-2">{dayjs(activeEvent?.occurredAt).format('MMM D, h:mm')}</p>
            </div>
          </div>
          <div className="">
            <h1 className="font-medium text-sm text-neutral-500 mb-3">METADATA</h1>
            <div className="w-full   grid grid-cols-2 thn:grid-cols-1 ">
              <p className="font-normal text-sm text-neutral-500 mb-2">Redirect</p>
              <p className="font-normal text-sm text-black mb-2">{activeEvent?.metadata?.redirect}</p>
              <p className="font-normal text-sm text-neutral-500 mb-2">Description</p>
              <p className="font-normal text-sm text-black mb-2">{activeEvent?.metadata?.description}</p>
              <p className="font-normal text-sm text-neutral-500 mb-2">Request ID</p>
              <p className="font-normal text-sm text-black mb-2">{activeEvent?.metadata?.xRequestId}</p>
            </div>
          </div>
          <div className="">
            <h1 className="font-medium text-sm text-neutral-500 mb-3">TARGET</h1>
            <div className="w-full   grid grid-cols-2 thn:grid-cols-1 ">
              <p className="font-normal text-sm text-neutral-500 mb-2">Name</p>
              <p className="font-normal text-sm text-black mb-2">{activeEvent?.targetName}</p>
              <p className="font-normal text-sm text-neutral-500 mb-2">Location</p>
              <p className="font-normal text-sm text-black mb-2">{activeEvent?.location}</p>
              <p className="font-normal text-sm text-neutral-500 mb-2">ID</p>
              <p className="font-normal text-sm text-black mb-2">{activeEvent?.targetId}</p>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  )
}

export default EventDetails;
