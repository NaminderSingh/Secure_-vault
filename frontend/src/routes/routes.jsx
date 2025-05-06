import {createBrowserRouter} from "react-router-dom"
import LandingPage from "../pages/LandingPage"
import Navbar from "../components/Navbar"
import Dashboard from "../components/dashboard"
import UploadImage from "../components/UploadImage"
import Userguide from "../components/userguide"
import GetImage from "../components/GetImage"
import AboutUs from "../components/AboutUs"


export const routes = createBrowserRouter(

    [
    {path:"/",element:<LandingPage/>},
    {path:"/home",element:(
        <div className="mt-10">
           <Navbar/>
<Dashboard/>
           
{/* <Dashboard/> */}
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
    
)},
    {path:"/aboutus",element:(
        <div >
           <Navbar/>
           <AboutUs/>

        </div>
    
)},
    {path:"/userguide",element:(
        <div >
           <Navbar/>
           <Userguide/>

        </div>
    
)},
    {path:"/userguidenull",element:(
        <div >

           <Userguide/>

        </div>
    
)}
])