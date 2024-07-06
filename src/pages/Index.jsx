import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Index = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ text: "", images: [] });

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSendQuery = async () => {
    if (!query.trim()) {
      toast("Please enter a query.");
      return;
    }

    try {
      // Call the OpenAI API for photo analysis
      const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        "Authorization": `Bearer sk-proj-qmjriLWJCWuFSfZcGDEcT3BlbkFJz1wavvl0BZ8I8xLy2IBB`,
        },
        body: JSON.stringify({
          prompt: query,
          max_tokens: 100,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch analysis results.");
      }

      const data = await response.json();
      setResults({ text: data.choices[0].text, images: [] }); // Assuming the response contains text analysis
    } catch (error) {
      toast.error("Error fetching analysis results.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
      <h1 className="text-3xl">Chatbot Interface</h1>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Photo Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>{results.text}</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {results.images.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Analysis result ${index + 1}`}
                  className="mx-auto object-cover w-full h-[200px]"
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="w-full max-w-2xl flex space-x-2">
        <Textarea
          value={query}
          onChange={handleQueryChange}
          placeholder="Type your query here..."
          className="flex-grow"
        />
        <Button onClick={handleSendQuery}>Send</Button>
      </div>
    </div>
  );
};

export default Index;