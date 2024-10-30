import { useEffect, useState } from "react";

const fetchAIResponse = async (conversation) => {
  console.log("Sending conversation to AI for analysis...");
  return [
    { keyword: "Pricing plan", covered: true },
    { keyword: "Onboarding", covered: false },
    { keyword: "Product demo", covered: true },
    { keyword: "Discount policy", covered: false },
  ];
};

const KeywordsAndSuggestions = ({ conversation }) => {
  const [keywords, setKeywords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const loadKeywordStatus = async () => {
    try {
      const response = await fetchAIResponse(conversation);
      setKeywords(response);
      updateSuggestions(response);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  const updateSuggestions = (keywordStatus) => {
    const newSuggestions = [];
    if (keywordStatus.some(item => !item.covered)) {
      newSuggestions.push("Consider discussing the onboarding process.");
    }
    if (keywordStatus.some(item => item.keyword === "Pricing plan" && item.covered)) {
      newSuggestions.push("Ask if they need more details about the pricing plan.");
    }
    if (keywordStatus.some(item => !item.covered && item.keyword === "Discount policy")) {
      newSuggestions.push("Mention any applicable seasonal discounts.");
    }
    if (keywordStatus.some(item => item.covered && item.keyword === "Product demo")) {
      newSuggestions.push("Offer to schedule a product demo.");
    }
    setSuggestions(newSuggestions);
  };

  useEffect(() => {
    loadKeywordStatus();
    const intervalId = setInterval(() => loadKeywordStatus(), 25000);
    return () => clearInterval(intervalId);
  }, [conversation]);

  return (
    <div className="h-full flex flex-col gap-4">
    <div className="flex-1 bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-gray-800 text-lg font-semibold mb-4">Keywords</h2>
      <div className="flex flex-wrap gap-2">
        {keywords.map((item, index) => (
          <span
            key={index}
            className={`bg-custom-gradient text-white px-4 py-2 rounded-full shadow-sm ${
              item.covered ? "line-through opacity-50" : ""
            }`}
          >
            {item.keyword}
          </span>
        ))}
      </div>
    </div>
    
    <div className="flex-1 bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-gray-800 text-lg font-semibold mb-4">Suggestions</h2>
      <div className="flex flex-col gap-2">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <span
              key={index}
              className="bg-teal-200 text-teal-800 px-4 py-2 rounded-lg shadow-sm"
            >
              {suggestion}
            </span>
          ))
        ) : (
          <span className="text-gray-500">No suggestions available.</span>
        )}
      </div>
    </div>
  </div>
  );
};

export default KeywordsAndSuggestions;
