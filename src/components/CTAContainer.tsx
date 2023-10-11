import {CgMediaLive} from 'react-icons/cg'
import {IoDownload} from 'react-icons/io5'
import {BiFilter} from 'react-icons/bi'

const CTAContainer = () => {
  return (
    <div id="cta-container" className="md:hidden w-full bg-neutral-100 flex justify-items-center justify-center divide-x-2 divide-neutral-300 mb-1 mt-3">
          <button className=" flex items-center p-1 px-2" >
            <BiFilter size="21" color="#414141" />
            <p className="text-center text-neutral-500 text-sm font-normal mx-1">FILTER</p>
          </button>
          <button className=" flex items-center p-1 px-2" >
            <IoDownload size="19" color="#414141" />
            <p className="text-center text-neutral-500 text-sm font-normal mx-1 mt-1">EXPORT</p>
          </button>
          <button className=" flex items-center p-1 px-2" >
            <CgMediaLive size="19" color="#414141" />
            <p className="text-center text-neutral-500 text-sm font-normal mx-1">LIVE</p>
          </button>
        </div>
  )
}

export default CTAContainer
