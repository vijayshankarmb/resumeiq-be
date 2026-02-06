export const normalizeResumeText = (text: string): string => {
  return text
    .replace(/\r\n/g, "\n")      
    .replace(/\t/g, " ")       
    .replace(/[ ]{2,}/g, " ")    
    .replace(/\n{2,}/g, "\n\n")  
    .trim()
    .toLowerCase();             
};
