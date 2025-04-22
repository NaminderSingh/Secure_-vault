import {createBrowserRouter} from "react-router-dom"
import Wallet from "../pages/Wallet"
import Home from "../pages/Home"
import Navbar from "../components/Navbar"
import Dashboard from "../components/dashboard"
import UploadImage from "../components/UploadImage"
import GetImage from "../components/GetImage"

export const routes = createBrowserRouter([
    {path:"/",element:<Wallet/>},
    {path:"/home",element:(
        <div className="mt-10">
           <Navbar/>
<Dashboard/>
        </div>
    
)},
    {path:"/upload",element:(
        <div >
           <Navbar/>
           <UploadImage/>
        </div>
    
)},
    {path:"/myfiles",element:(
        <div >
           <Navbar/>
           <GetImage/>
        </div>
    
)}
])