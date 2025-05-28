const Session = require('../models/Session');
const Question = require('../models/Question');

// @desc Create a new session and linked questions
// @route POST /api/sessions/create
// @access Private
exports.createSession = async (req, res) => {
    try{
        const { role, experience, topicsToFocus, description, questions } = req.body;

        // Validate required fields
        if (!role || !experience || !topicsToFocus) {
            return res.status(400).json({ message: 'Role, experience, and topics to focus are required.' });
        }
        // Create session
        const session = await Session.create({
            user: req.user._id,
            role,
            experience,
            topicsToFocus,
            description,
            
        });

        const questionDocs= await Promise.all(  //After all questions are created, questionDocs is an array of their IDs.

            questions.map(async (q)=>{
                const question=await Question.create({
                    session: session._id,
                    question: q.question,
                    answer: q.answer,
                })
                return question._id;
            })
        )
        session.questions = questionDocs; //Adds the array of question IDs to the questions field of the session.
        await session.save();
        res.status(201).json({success: true, message: 'Session created successfully', session});
    } catch(error){
        console.error("Error creating session:", error);
        res.status(500).json({success:false ,message:"Server error",error:error.message});
    }
};

// @desc Get all sessions for the logged-in user
// @route GET /api/sessions/my-sessions
// @access Private
exports.getMySessions = async (req, res) => {
    try{
        console.log("Here it started",req.user.id)
        const sessions=await Session.find({user:req.user.id})
          .populate("questions")
          .sort({createdAt:-1});
        console.log("found it",sessions)
        res.status(200).json(sessions,req.user) 
    } catch(error){
        console.error("Error creating session:", error);
        res.status(500).json({success:false ,message:"Server error",error:error.message});
    }
}

// @desc Get session by ID with populated questions
// @route GET /api/sessions/:id
// @access Private
exports.getSessionById = async (req, res) => {
    try{
        const session=await Session.findById(req.params.id)
        .populate({
            path:"questions",
            select: 'question answer isPinned createdAt updatedAt',
            options: {sort: {isPinned:-1, createdAt:1}},
        }).exec();

        if(!session){
            return res
            .status(404)
            .json({success:false, message:"Session not found"});
        }
        res.status(200).json({success:true, session});
    } catch(error){
        console.error("Error creating session:", error);
        res.status(500).json({success:false ,message:"Server error",error:error.message});
    }
};

// @desc Delete a session by ID
// @route DELETE /api/sessions/:id
// @access Private
exports.deleteSession=async (req, res) => {
    try{
        const session=await Session.findById(req.params.id);

        if(!session){
            return res.status(404).json({message:"Session not found"});
        }

        //Check if the logged-in user owns this session
        if(session.user.toString()!=req.user.id){
            return res
            .status(401)
            .json({message:"Not authorized to delete this session"})
        }

        //First, delete all questions to this session
        await Question.deleteMany({session:session._id});

        //Then, delete the session
        await session.deleteOne();
        res.status(200).json({message:"Session deleted successfully"})
    } catch(error){
        console.error("Error creating session:", error);
        res.status(500).json({success:false ,message:"Server error",error:error.message});
    }
};
