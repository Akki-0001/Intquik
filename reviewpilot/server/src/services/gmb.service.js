const { google } = require("googleapis");
const { generateReply } = require("./ai.service");

// Initialize OAuth2 client
const getOAuthClient = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID || "mock_client_id",
    process.env.GOOGLE_CLIENT_SECRET || "mock_client_secret",
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/api/google/callback"
  );
};

// Generate auth URL
const getAuthUrl = () => {
  const oauth2Client = getOAuthClient();
  const scopes = [
    "https://www.googleapis.com/auth/business.manage",
  ];
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
};

// generateMockAiReply removed in favor of Groq API in ai.service.js
const getTokens = async (code) => {
  if (process.env.GOOGLE_CLIENT_ID) {
    const oauth2Client = getOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  }
  // Mock flow
  return {
    access_token: "mock_access_token_" + Date.now(),
    refresh_token: "mock_refresh_token",
    expiry_date: Date.now() + 3600 * 1000,
  };
};

const getLocations = async (tokens) => {
  if (process.env.GOOGLE_CLIENT_ID) {
    const oauth2Client = getOAuthClient();
    oauth2Client.setCredentials(tokens);
    const mybusinessbusinessinformation = google.mybusinessbusinessinformation({
      version: 'v1',
      auth: oauth2Client
    });
    // Find accounts first (simplified)
    const mybusinessaccountmanagement = google.mybusinessaccountmanagement({
      version: 'v1',
      auth: oauth2Client
    });
    const accounts = await mybusinessaccountmanagement.accounts.list();
    if (!accounts.data.accounts || accounts.data.accounts.length === 0) return [];
    
    const accountName = accounts.data.accounts[0].name;
    const locations = await mybusinessbusinessinformation.accounts.locations.list({
      parent: accountName,
      readMask: "name,title,storeCode",
    });
    return locations.data.locations || [];
  }
  
  // Mock flow
  return [
    { name: "locations/12345", title: "Mock Business Location 1", storeCode: "LOC1" },
    { name: "locations/67890", title: "Mock Business Location 2", storeCode: "LOC2" }
  ];
};

const syncReviews = async (business, tokens) => {
  if (!business.gmbLocationId) return [];

  if (process.env.GOOGLE_CLIENT_ID) {
    const oauth2Client = getOAuthClient();
    oauth2Client.setCredentials(tokens);
    const mybusinessreviews = google.mybusinessreviews({
      version: 'v1',
      auth: oauth2Client
    });

    const reviews = await mybusinessreviews.locations.reviews.list({
      parent: business.gmbLocationId,
    });
    return reviews.data.reviews || [];
  }

  // Mock flow
  return [
    {
      reviewId: `gmb-mock-${Date.now()}`,
      reviewer: { displayName: "Google Maps User" },
      starRating: "FIVE",
      comment: "Great experience synced from Google!",
      createTime: new Date().toISOString(),
    }
  ];
};

const replyToReview = async (locationId, reviewId, replyText, tokens) => {
  if (process.env.GOOGLE_CLIENT_ID) {
    const oauth2Client = getOAuthClient();
    oauth2Client.setCredentials(tokens);
    const mybusinessreviews = google.mybusinessreviews({
      version: 'v1',
      auth: oauth2Client
    });

    await mybusinessreviews.locations.reviews.reply({
      name: `${locationId}/reviews/${reviewId}`,
      requestBody: {
        comment: replyText,
      }
    });
    return true;
  }
  
  // Mock flow
  console.log(`[MOCK] Replied to GMB review ${reviewId} at ${locationId} with: "${replyText}"`);
  return true;
};

const processBusinessReviews = async (business) => {
  if (!business.googleAccessToken || !business.gmbLocationId) return { synced: 0, replied: 0 };

  const tokens = {
    access_token: business.googleAccessToken,
    refresh_token: business.googleRefreshToken,
    expiry_date: business.googleTokenExpiry,
  };

  try {
    const gmbReviews = await syncReviews(business, tokens);
    let repliesSent = 0;

    for (const rev of gmbReviews) {
      const ratingNum = rev.starRating === 'FIVE' ? 5 : rev.starRating === 'FOUR' ? 4 : rev.starRating === 'THREE' ? 3 : rev.starRating === 'TWO' ? 2 : 1;
      const customerName = rev.reviewer ? rev.reviewer.displayName : "Customer";
      
      if (business.autoReplyEnabled) {
        // In a real app we would only reply if there is no reviewReply object on rev
        if (!rev.reviewReply) {
           const replyText = await generateReply(customerName, ratingNum, rev.comment || "", business.name);
           await replyToReview(business.gmbLocationId, rev.reviewId, replyText, tokens);
           repliesSent++;
        }
      }
    }
    
    return { synced: gmbReviews.length, replied: repliesSent };
  } catch (error) {
    console.error(`Error processing reviews for business ${business._id}:`, error.message);
    throw error;
  }
};

module.exports = {
  getAuthUrl,
  getTokens,
  getLocations,
  syncReviews,
  replyToReview,
  processBusinessReviews,
};
