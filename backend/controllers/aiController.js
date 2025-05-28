const {GoogleGenAI}= require("@google/genai");
const {conceptExplainPrompt,questionAnswerPrompt}=require("../utils/prompts")

const ai=new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

//@desc Generate interview questions and answers using Gemini
//@route POST /api/ai/generate-questions
//@access Private
const generateInterviewQuestions=async (req,res)=>{
    try {
        const {role,experience,topicsToFocus,numberOfQuestions}=req.body;
        if(!role || !experience || !topicsToFocus || !numberOfQuestions){
            return res.status(400).json({message:"Please provide all required fields"})
        }

        const prompts=questionAnswerPrompt(role,experience,topicsToFocus,numberOfQuestions);

        const response=await ai.models.generateContent({
            model:"gemini-2.0-flash-lite",
            contents:prompts,
        });

        let rawText=response.text;

        // Clean it:Remove ```json and ``` from begining to end
        const cleanedText= rawText
        .replace(/^```json\s*/,"") // removing the starting ```json
        .replace(/```$/,"") // removing the ending ```
        .trim() // trim any extra spaces

        // Now safe to parse
        const data=JSON.parse(cleanedText);

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({message:"Failed to generate questions",error:error.message})
    }
}

//@desc Explains a interview question
//@route POST /api/ai/generate-explanation
//@access Private
const generateConceptExplanation=async (req,res)=>{
    try {
        const {question}=req.body;

        if(!question){
            return res.status(400).json({message:"Please provide a question to explain"})
        }

        const prompts=conceptExplainPrompt(question);

        const response=await ai.models.generateContent({
            model:"gemini-2.0-flash-lite",
            contents:prompts,
        });
        let rawText=response.text;
        // Clean it:Remove ```json and ``` from begining to end
        const cleanedText= rawText
        .replace(/^```json\s*/,"") // removing the starting ```json
        .replace(/```$/,"") // removing the ending ```
        .trim() // trim any extra spaces

        // Now safe to parse
        const data=JSON.parse(cleanedText);
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({message:"Failed to generate questions",error:error.message})
    }
}

module.exports={generateConceptExplanation,generateInterviewQuestions};