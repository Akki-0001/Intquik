const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Generates SEO-optimized review suggestions using Groq
 * @param {string} businessName - The name of the business
 * @param {string[]} keywords - SEO keywords for the business
 * @param {string[]} usedSuggestions - Array of already used suggestions
 * @returns {Promise<string[]>} - Array of 3 review suggestions
 */
const generateReviews = async (businessName, keywords = [], usedSuggestions = []) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.warn("GROQ_API_KEY not found, falling back to mock logic");
      return generateMockReviews(businessName, keywords, usedSuggestions);
    }

    const keywordStr = keywords.length > 0 ? keywords.join(", ") : "excellent service, great quality";
    let excludePrompt = "";
    if (usedSuggestions.length > 0) {
      excludePrompt = `\nDO NOT use or generate any of these exact reviews again:\n- ${usedSuggestions.slice(-5).join("\n- ")}`;
    }

    const prompt = `You are an expert copywriter. Write exactly 3 short, realistic, and highly positive 5-star Google reviews for a business named "${businessName}". 
    The reviews MUST incorporate some of these keywords naturally: ${keywordStr}.
    Keep them under 2 sentences each. Make them sound like they were written by real customers.${excludePrompt}
    
    CRITICAL: Be extremely creative, varied, and unique in your phrasing. Avoid generic templates. Every review must sound distinct.
    
    IMPORTANT: Output ONLY a valid JSON array of 3 strings. No markdown, no introduction, no explanation. Just the JSON array.
    Example format: ["review 1", "review 2", "review 3"]`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant", // Fast and capable for short copy
      temperature: 0.95, // Increased temperature for higher randomness and variety
      max_tokens: 200,
    });

    let resultText = completion.choices[0]?.message?.content || "[]";
    // Strip markdown formatting if any
    resultText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const reviews = JSON.parse(resultText);
    if (Array.isArray(reviews) && reviews.length >= 3) {
      return reviews.slice(0, 3);
    } else {
      return generateMockReviews(businessName, keywords, usedSuggestions);
    }
  } catch (error) {
    console.error("Groq API Error (generateReviews):", error.message);
    return generateMockReviews(businessName, keywords, usedSuggestions); // Fallback
  }
};

/**
 * Generates an owner reply to a customer review using Groq
 * @param {string} customerName - The name of the customer
 * @param {number} rating - The star rating (1-5)
 * @param {string} comment - The customer's review comment
 * @param {string} businessName - The name of the business
 * @returns {Promise<string>} - The generated reply text
 */
const generateReply = async (customerName, rating, comment, businessName = "Our Business") => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return generateMockReply(customerName, rating);
    }

    const prompt = `You are a polite, professional business owner of "${businessName}".
    A customer named "${customerName}" left a ${rating}-star review with the following comment: "${comment}"
    
    Write a short, professional, and empathetic reply to this review.
    If the rating is 4 or 5 stars, express gratitude.
    If the rating is 1 to 3 stars, apologize for their experience, show empathy, and invite them to reach out privately.
    
    Keep the reply under 3 sentences. Output ONLY the reply text, nothing else.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.6,
      max_tokens: 150,
    });

    const reply = completion.choices[0]?.message?.content || "";
    return reply.trim() || generateMockReply(customerName, rating);
  } catch (error) {
    console.error("Groq API Error (generateReply):", error.message);
    return generateMockReply(customerName, rating);
  }
};

// --- Fallback Mock Functions (in case Groq fails or API key is missing) ---

const generateMockReviews = (businessName, keywords = [], usedSuggestions = []) => {
  const defaultKeywords = ["service", "experience", "quality", "staff"];
  const kw1 = keywords.length > 0 ? keywords[0] : defaultKeywords[0];
  const kw2 = keywords.length > 1 ? keywords[1] : defaultKeywords[1];
  
  const allMocks = [
    `The ${kw1} at ${businessName} was incredibly fast and the staff was super friendly! Highly recommend.`,
    `Amazing ${kw2} from start to finish at ${businessName}. Clean space and great atmosphere.`,
    `Best ${kw1} in town! ${businessName} exceeded all my expectations. Will definitely be coming back.`,
    `I was blown away by the ${kw2} at ${businessName}. Every detail was perfect!`,
    `If you're looking for great ${kw1}, look no further than ${businessName}. Five stars!`,
    `The team at ${businessName} really knows how to deliver top-notch ${kw2}. I'll be returning soon.`,
    `Absolutely loved my experience at ${businessName}. Their ${kw1} is second to none!`,
    `Great customer service and fantastic ${kw2}. ${businessName} has won me over as a regular.`
  ];

  // Filter out the ones that are already used
  let availableMocks = allMocks.filter(m => !usedSuggestions.includes(m));

  // If we run out, reset the pool
  if (availableMocks.length < 3) {
    availableMocks = [...allMocks];
  }

  // Randomly shuffle and return 3 to maintain variety
  return availableMocks.sort(() => 0.5 - Math.random()).slice(0, 3);
};

const generateMockReply = (customerName, rating) => {
  if (rating >= 4) {
    return `Hi ${customerName}, thank you so much for the wonderful ${rating}-star review! We are thrilled to hear you had such a great experience. We look forward to welcoming you back soon!`;
  } else {
    return `Hi ${customerName}, thank you for your feedback. We're sorry to hear that your experience didn't meet your expectations. We'd love to learn more and make things right. Please reach out to us directly.`;
  }
};

module.exports = {
  generateReviews,
  generateReply,
};
