import { supabase } from '../supabaseClient';

export const InvokeLLM = async ({ prompt, response_json_schema }) => {
  // You can implement this later if needed
  throw new Error('LLM integration not yet implemented');
};

export const SendEmail = async () => { throw new Error('Not implemented'); };
export const SendSMS = async () => { throw new Error('Not implemented'); };
export const UploadFile = async () => { throw new Error('Not implemented'); };
export const GenerateImage = async () => { throw new Error('Not implemented'); };
export const ExtractDataFromUploadedFile = async () => { throw new Error('Not implemented'); };