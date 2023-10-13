import dayjs from 'dayjs';

interface ListItemProps{
  actor: string;
  action: string;
  date: string;
  handleEventChange: () => void;
}


const ListItem =({actor, action, date, handleEventChange}: ListItemProps) => {
  return(
  <div   onClick={handleEventChange} className=" hover:bg-neutral-200 grid grid-cols-3  gap-x-1 auto-cols-auto  w-full items-center justify-between text-sm font-semibold pt-1 text-neutral-500 p-3 ">
      <div className="flex items-center ">
        <div className="ml-2 mr-4 flex items-center justify-items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 aspect-square w-8 h-8 rounded-full mt-2">
          <p className="text-white text-lg font-thin">{actor[0].toUpperCase()}</p>
        </div>
        <p className=" text-base text-neutral-700 font-normal py-2 pb-0 truncate ">{actor}</p>
      </div>
      <p className=" text-base text-neutral-700 font-normal py-2 pb-0 truncate ">{action}</p>
      <p className=" text-base text-neutral-700 font-normal py-2 pb-0 truncate ">{dayjs(date).format('MMM D, h:mm')}</p>
  </div>
  )
}

export default ListItem;