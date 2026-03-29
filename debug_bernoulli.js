function debug() {
    const question = "The current ... I(t) = (4t^2 + 3)e^-0.2t. Obtain the total charge flow from 0 to 10 seconds.";
    let cleaned = question
      .replace(/[a-z]\([a-z]\)\s*=\s*/i, 'ASSIGNMENT_FOUND')
      .split('ASSIGNMENT_FOUND')[1] || question;
      
    // Split by sentence end or action verb
    cleaned = cleaned.split(/\.\s+|by\s+|from\s+|obtain\s+|find\s+/i)[0].trim();
    
    console.log("Original:", question);
    console.log("Cleaned:", cleaned);
}
debug();
