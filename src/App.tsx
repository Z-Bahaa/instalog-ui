import { useState, useEffect } from 'react'
import './App.css'
import BottomButton from './components/BottomButton'
import CTAContainer from './components/CTAContainer'

const events = [
  {"id":"0268f3e0-6afd-4d10-b8e9-c0fb37fa16a4",
  "object":"event","actor_id":"user_3VG742j9PUA2","actor_name":"ali Salah","group":"instatus.com","target_id":"user_DOKVD1U3L031","target_name":"sami@instatus.com","location":"105.40.62.95","occurred_at":"2022-01-05T14:31:13.607Z","action":{"id":"8f42349f-4990-455a-ba0a-1a0d6a6e3f4f","object":"event_action","name":"user.didsomethinghere","event_id":"0268f3e0-6afd-4d10-b8e9-c0fb37fa16a4"},"metadata":{"id":"ca65e4a3-6076-466f-8d0b-6380abed8b6a","redirect":"/setup","description":"User login failed.","x_request_id":"req_W4Y47lljg85H","event_id":"0268f3e0-6afd-4d10-b8e9-c0fb37fa16a4"}},{"id":"04d459ba-78e3-46f8-92a2-4b0f6139bf89","object":"event","actor_id":"user_3VG742j9PUA2","actor_name":"ali Salah","group":"instatus.com","target_id":"user_DOKVD1U3L031","target_name":"sami@instatus.com","location":"105.40.62.95","occurred_at":"2022-01-05T14:31:13.607Z","action":{"id":"889e0fdd-1ef1-4850-a5f9-fba440c1ed48","object":"event_action","name":"user.didsomethinghere","event_id":"04d459ba-78e3-46f8-92a2-4b0f6139bf89"},"metadata":{"id":"36c0094e-a639-40ea-b19e-f5b32026fa2d","redirect":"/setup","description":"User login failed.","x_request_id":"req_W4Y47lljg85H","event_id":"04d459ba-78e3-46f8-92a2-4b0f6139bf89"}},{"id":"0f4a597f-634a-4bbe-b373-3558f942887c","object":"event","actor_id":"user_3VG742j9PUA2","actor_name":"ali Salah","group":"instatus.com","target_id":"user_DOKVD1U3L031","target_name":"sami@instatus.com","location":"105.40.62.95","occurred_at":"2022-01-05T14:31:13.607Z","action":{"id":"ed2f30a1-5611-4227-840a-40f4a87f357d","object":"event_action","name":"user.didsomethinghere","event_id":"0f4a597f-634a-4bbe-b373-3558f942887c"},"metadata":{"id":"b2e3b4a2-d572-47c9-84cb-056228b0f285","redirect":"/setup","description":"User login failed.","x_request_id":"req_W4Y47lljg85H","event_id":"0f4a597f-634a-4bbe-b373-3558f942887c"}},{"id":"160de73b-620b-4c15-8c05-3f49e6358de3","object":"event","actor_id":"user_3VG742j9PUA2","actor_name":"ali Salah","group":"instatus.com","target_id":"user_DOKVD1U3L031","target_name":"sami@instatus.com","location":"105.40.62.95","occurred_at":"2022-01-05T14:31:13.607Z","action":{"id":"7409a834-1a54-4237-9275-92925758de70","object":"event_action","name":"user.didsomethinghere","event_id":"160de73b-620b-4c15-8c05-3f49e6358de3"},"metadata":{"id":"c404324d-5d34-4fb3-8b31-f65239e8d9e2","redirect":"/setup","description":"User login failed.","x_request_id":"req_W4Y47lljg85H","event_id":"160de73b-620b-4c15-8c05-3f49e6358de3"}},{"id":"368794b3-5598-4f9a-8a80-566aa9fbd3e4","object":"event","actor_id":"user_3VG742j9PUA2","actor_name":"ali Salah","group":"instatus.com","target_id":"user_DOKVD1U3L031","target_name":"sami@instatus.com","location":"105.40.62.95","occurred_at":"2022-01-05T14:31:13.607Z","action":{"id":"8ebae3d6-f571-4ebc-88ea-10a4539486f5","object":"event_action","name":"user.didsomethinghere","event_id":"368794b3-5598-4f9a-8a80-566aa9fbd3e4"},"metadata":{"id":"1645db3d-5815-472d-b35d-b1d68cbdbce3","redirect":"/setup","description":"User login failed.","x_request_id":"req_W4Y47lljg85H","event_id":"368794b3-5598-4f9a-8a80-566aa9fbd3e4"}},{"id":"392ed075-db85-44de-9124-68fb6e488ed0","object":"event","actor_id":"user_3VG742j9PUA2","actor_name":"ali Salah","group":"not instatus.com","target_id":"user_DOKVD1U3L031","target_name":"sami@instatus.com","location":"105.40.62.95","occurred_at":"2022-01-05T14:31:13.607Z","action":{"id":"e1988190-447d-4a10-978c-1a30859d849f","object":"event_action","name":"user.didsomethinghere","event_id":"392ed075-db85-44de-9124-68fb6e488ed0"},"metadata":{"id":"e5c487f5-a6d8-4fb6-81c7-85bfb783674a","redirect":"/setup","description":"User login failed.","x_request_id":"req_W4Y47lljg85H","event_id":"392ed075-db85-44de-9124-68fb6e488ed0"}}
]

function App() {
  const [w, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    setWidth(window.innerWidth)
  }, [window.innerWidth])

  return (
    <div className="p-8 flex flex-col items-center space-y justify-items-start justify-between 
      h-screen" >
      <div id="upper-section" className="w-full rounded-tl-2xl rounded-tr-2xl bg-neutral-100 border-neutral-300 border-x border-t items-center flex flex-col p-3 pb-0">
        <div id="search container" className="flex w-full items-center justify-between p-2 rounded-lg border border-neutral-300 ">
          <input type="text" name="search" placeholder="Search name, email or action..." className=" 
            bg-transparent focus:border-teal-500 focus:outline-none text-sm text-neutral-600 "/>
        </div>
        <CTAContainer />  
        <div id="table-head" className="md:hidden grid grid-cols-1 w-full justify-items-center justify-between text-sm font-semibold pt-1 text-neutral-700 pb-1">
          <p>EVENTS LOG</p>
        </div>
        <div id="table-content" className="md:hidden w-full bg-neutral-100 divide-y divide-neutral-300">
          {events.map(event => (
            <div id="table-head" className=" flex flex-col  w-full justify-between text-sm font-semibold pt-1 text-neutral-500 pb-1 ">
            <p className="text-xs">ACTOR</p>
            <p className=" text-sm text-neutral-700 pb-2">{event.actor_name}</p>
            <p className="text-xs">ACTION</p>
            <p className=" text-sm text-neutral-700 pb-2">{event.action.name}</p>
            <p className="text-xs">DATE</p>
            <p className=" text-sm text-neutral-700 pb-2">{event.occurred_at}</p>
          </div>
          ))}
        </div>
      </div>

      <BottomButton />
    </div >
  )
}

export default App
