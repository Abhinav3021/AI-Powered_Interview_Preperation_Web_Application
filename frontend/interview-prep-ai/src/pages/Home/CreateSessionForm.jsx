import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import SpinnerLoader from '../../components/Loaders/SpinnerLoader';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const CreateSessionForm = () => {
    const [formData, setFormData] = useState({
        role:"",
        experience: "",
        topicToFocus: "",
        description:"",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate=useNavigate();
    const handleChange = (key,value) => {
        
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    const handleCreateSession = async (e) => {
        e.preventDefault();

        const { role, experience, topicsToFocus, description } = formData;
        if (!role || !experience || !topicsToFocus || !description) {
            setError("All fields are required");
            return;
        }
        setError("");
        setIsLoading(true);

        try{
            //call AI API to generate questions
            const aiResponse=await axiosInstance.post(
                API_PATHS.AI.GENERATE_QUESTIONS,
                {
                    role,
                    experience,
                    topicsToFocus,
                    numberOfQuestions: 10,
                }
            );

            // Should be array like [{question:"", answer:""}...]
            const generatedQuestions = aiResponse.data;

            const response= await axiosInstance.post(API_PATHS.SESSION.CREATE, {
                ...formData,
                questions: generatedQuestions,
            });
            if(response.data?.session?._id){
                navigate(`/interview-prep/${response.data?.session?._id}`);
            }
        }catch(error){
            if(error.response && error.response.data.message) {
                setError(error.response.data.message || "Failed to create session");
            }else{
                setError("Something went wrong. Please try again.");
            }
        }
    }
  return (
    <div className="w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center">
        <h3 className="text-lg font-semibold text-black">
            Start a New Interview Journey
        </h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-3">
            Fill out a few quick details and unlock your personalized set of interview questions!
        </p>

         <form onSubmit={handleCreateSession} className="flex flex-col gap-3">
            <Input
            value={formData.role}
            onChange={({target})=>handleChange("role",target.value)}
            label="Target Role"
            placeholder="(e.g. Frontend Developer,UI/UX Designer etc.)"
            type="text"
            />
            <Input
            value={formData.experience}
            onChange={({target})=>{handleChange("experience",target.value)}}
            label="Experience (in years)"
            placeholder="(e.g. 1, 2, 3 etc)"
            type="number"
            />
            <Input
            value={formData.topicsToFocus}
            onChange={({target})=>{handleChange("topicsToFocus",target.value)}}
            label="Topic to Focus On"
            placeholder="(Comma-separated.g. React, Node.js, Design Patterns etc.)"
            type="text"
            />
            <Input
            value={formData.description}
            onChange={({target})=>{handleChange("description",target.value)}}
            label="Description"
            placeholder="(e.g. Briefly describe your interview preparation goals)"
            type="text"
            />

            {error &&  <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

            <button 
            className="btn-primary w-full mt-2"
            type="submit"
            disabled={isLoading}
            >
                {isLoading && <SpinnerLoader/>} Create Session
            </button>
         </form>
    </div>
  )
}

export default CreateSessionForm