import dayjs from 'dayjs';
import { memo } from 'react';
import { motion } from 'framer-motion'
import { Event } from '../../domain-models';

interface IProps {
  eventData: Event;
  handleEventChange: (event) => void;
}

const ListItem = memo(({ eventData, handleEventChange }: IProps) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
      }}
      onClick={() => handleEventChange(eventData)} className="hover:bg-neutral-200 grid grid-cols-3  gap-x-1 auto-cols-auto  w-full items-center justify-between text-sm font-semibold pt-1 text-neutral-500 p-3 ">
      <div className="flex items-center ">
        <div className="ml-2 mr-4 flex items-center justify-items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 aspect-square w-8 h-8 rounded-full mt-2">
          <p className="text-white text-lg font-thin">{eventData.targetName[0].toUpperCase()}</p>
        </div>
        <p className=" text-base text-neutral-700 font-normal py-2 pb-0 truncate ">{eventData.targetName}</p>
      </div>
      <p className=" text-base text-neutral-700 font-normal py-2 pb-0 truncate ">{eventData.action.name}</p>
      <p className=" text-base text-neutral-700 font-normal py-2 pb-0 truncate ">{dayjs(eventData.occurredAt).isValid() ? dayjs(eventData.occurredAt).format('MMM D, h:mm') : '-'}</p>
    </motion.div>
  )
}, (previousProps: IProps, newProps: IProps) => {
  return previousProps.eventData.id == newProps.eventData.id
})

export default ListItem;