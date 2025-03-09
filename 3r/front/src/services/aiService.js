import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";

const aiService = {
  loadModel: async () => {
    try {
      // Load the MobileNet model
      const model = await mobilenet.load();
      console.log("MobileNet model loaded successfully!");
      return model;
    } catch (error) {
      console.error("Error loading model: ", error);
    }
  },

  analyzeImage: async (imageElement) => {
    try {
      // Load the MobileNet model
      const model = await aiService.loadModel();

      // Classify the image
      const predictions = await model.classify(imageElement);
      console.log("Predictions:", predictions); // Debugging

      // Extract prediction details
      const result = predictions.map((pred) => ({
        className: pred.className.toLowerCase(),
        probability: pred.probability,
      }));

      console.log("Processed Predictions:", result); // Debugging

      // Define categories for degradable and non-degradable items
      const categories = {
        fruit: [
          "apple", "banana", "orange", "mango", "pear", "grapes", "watermelon", "cherry", "strawberry"
        ],
        vegetable: [
          "carrot", "potato", "onion", "tomato", "cucumber", "lettuce", "spinach", "broccoli", "cauliflower"
        ],
        degradable: [
          "fruit", "vegetable", "peel", "organic", "leaf", "plant", "compostable", "natural", "food waste"
        ],
        nonDegradable: [
          "plastic", "metal", "glass", "bottle", "can", "styrofoam", "rubber", "electronics", "wire", "iron", "steel", "screw"
        ],
      };

      // Default response if no classification matches
      let description = "Unclassified item.";
      let category = "Unclassified";
      let categoryConfidence = 0;

      // Analyze predictions to categorize the image
      for (let item of result) {
        const { className, probability } = item;

        // Check for degradable category (fruits, vegetables, etc.)
        if (categories.fruit.includes(className)) {
          description = `This item is classified as a ${className} with a confidence of ${(probability * 100).toFixed(2)}%. It is a fruit.`;
          category = "Degradable (Fruit)";
          categoryConfidence = probability;
        } else if (categories.vegetable.includes(className)) {
          description = `This item is classified as a ${className} with a confidence of ${(probability * 100).toFixed(2)}%. It is a vegetable.`;
          category = "Degradable (Vegetable)";
          categoryConfidence = probability;
        } else if (categories.degradable.some(keyword => className.includes(keyword))) {
          description = `This item is classified as ${className} with a confidence of ${(probability * 100).toFixed(2)}%. It is a degradable item.`;
          category = "Degradable";
          categoryConfidence = probability;
        }

        // Check for non-degradable category (plastics, metals, etc.)
        else if (categories.nonDegradable.some(keyword => className.includes(keyword))) {
          description = `This item is classified as ${className} with a confidence of ${(probability * 100).toFixed(2)}%. It is made of non-degradable material.`;
          category = "Non-Biodegradable: Recycle";
          categoryConfidence = probability;
        }
      }

      // If no category matches, return the most probable class and mark as unclassified
      if (category === "Unclassified" && result.length > 0) {
        description = `Unclassified item. Closest match: ${result[0]?.className || "unknown"} with a confidence of ${(result[0]?.probability * 100).toFixed(2)}%.`;
        category = "Unclassified";
        categoryConfidence = result[0]?.probability || 0;
      }

      // Return detailed analysis with description and category
      return {
        description: description,
        category: category,
        categoryConfidence: categoryConfidence * 100, // Show percentage confidence
      };

    } catch (error) {
      console.error("Error during image analysis: ", error);
      return {
        description: "Error analyzing the image.",
        category: "Error",
        categoryConfidence: 0,
      };
    }
  },
};

export default aiService;
