import React, {useState, useEffect } from 'react'
import { LuPlus } from 'react-icons/lu'
import {CARD_BG} from '../../utils/data'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import SummaryCard from '../../components/Cards/SummaryCard'
import moment from 'moment'
import Model from '../../components/Model'
import CreateSessionForm from './CreateSessionForm'
import DeleteAlertContent from '../../components/DeleteAlertContent'

const Dashboard = () => {
  const navigarte=useNavigate();

  const [openCreateModel, setOpenCreateModel] = useState(false);
  const [session, setSession] = useState([])

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    sessionId: null,
  });

  const fetchAllSessions = async () => {
    try{
      const response=await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSession(response.data);
    }
    catch(error){
      console.error('Error fetching sessions:', error);
      
    }
  };

  const deleteSession=async (sessionData)=>{
    try{
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData?._id));

      toast.success("Session Deleted Successfully");
      setOpenDeleteAlert({
        open:false,
        data:null,
      });
      fetchAllSessions(); //to refresh the list of sessions displayed on the dashboard.
    }catch(error){
      console.error("Error deleting session data:",error)
    }
  };

  useEffect(() => {
    fetchAllSessions();
  }, []);
  return (
    <DashboardLayout>
      <div className="container mx-auto pt-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-0">
          {session?.map((data, index) => (
            <SummaryCard
            key={data?._id}
            color={CARD_BG[index % CARD_BG.length]}
            role={data?.role || ""}
            topicToFocus={data?.topicToFocus || ""}
            experience={data?.experience || "-"}
            questions={data?.questions.length || "-"}
            description={data?.description || ""}
            lastUpdated={
              data?.updatedAt
               ? moment(data.updatedAt).format("DD MMM YYYY")
                : "-"
            }
            onSelect={() => navigarte(`/interview-prep/${data?._id}`)}
            onDelete={() => {setOpenDeleteAlert({open: true,data})
          }}
            />
          ))}
        </div>
        <button 
        className="h-12 md:h-12 flex items-center justify-center gap-3 bg-linear-to-r from-[#FF9324] to-[#d87710] text-white font-semibold text-sm md:text-base rounded-full px-7 py:2.5 md:px-6 hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-2xl hover:shadow-orange-300 fixed bottom-10 md:bottom-20 right-10 md:right-20"
        onClick={() => setOpenCreateModel(true)}
        >
          <LuPlus className="text-2xl text-white" />
          Add New
        </button>
      </div>
      <Model
      isOpen={openCreateModel}
      onClose={() => setOpenCreateModel(false)}
      hideHeader
      >
        <div>
          <CreateSessionForm/>
        </div>
      </Model>

      <Model
      isOpen={openCreateModel}
      onClose={()=>{
        setOpenCreateModel(false);
      }}
      hideHeader
      >
        <div>
          <CreateSessionForm/>
        </div>
      </Model>

      <Model
      isOpen={openDeleteAlert?.open}
      onClose={()=>{
        setOpenDeleteAlert({open:false,data:null});
      }}
      title="Delete Alert"
      >
        <div className="w-[30vw">
          <DeleteAlertContent
          content="Are you sure you wanr to delete this session detail?"
          onDelete={()=> deleteSession(openDeleteAlert.data)}
          />
        </div>
      </Model>
    </DashboardLayout>
  )
}


export default Dashboard