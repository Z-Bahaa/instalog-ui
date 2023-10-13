import dayjs from 'dayjs';

interface ListItemProps{
  actor: string;
  action: string;
  date: string;
  handleEventChange: () => void;
}


const ListItem =({actor, action, date, handleEventChange}: ListItemProps) => {
  return(
    <div id="table-head" onClick={handleEventChange} className=" flex flex-col  w-full justify-between text-sm font-semibold pt-1 text-neutral-500 pb-1 ">
      <p className="text-xs pb-1">ACTOR</p>
      <p className=" text-sm text-neutral-700 pb-1">{actor}</p>
      <p className="text-xs pb-1">ACTION</p>
      <p className=" text-sm text-neutral-700 pb-1">{action}</p>
      <p className="text-xs pb-1">DATE</p>
      <p className=" text-sm text-neutral-700 pb-1">{dayjs(date).format('MMM D, h:mm')}</p>
    </div>
  )
}

export default ListItem;