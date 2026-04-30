"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2, Settings } from "lucide-react";
import React, { useState } from "react";
import KeywordsList from "./_components/KeywordsList";

function TrendingKeywords() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [keywordsList, setKeywordsList] = useState<any>();

  const onFind = async () => {
    setKeywordsList(undefined);
    setLoading(true);

    try {
      const result = await axios.get(
        "/api/trending-keywords?query=" + userInput
      );

      if (result.data.error) {
        console.error(result.data.error);
        return;
      }

      setKeywordsList(result.data); // DB response
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-10 md:px-20 lg:px-40">
      <div className="flex items-center justify-center mt-5 flex-col gap-2">
        <h2 className="font-bold text-4xl">YouTube Trending Keywords</h2>
        <p className="text-gray-400 text-center">
          Discover the latest YouTube trending keywords updated in real-time to boost your content strategy. 
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onFind();
        }}
        className="p-2 border rounded-xl flex gap-2 items-center bg-secondary mt-5"
      >
        <input
          type="text"
          value={userInput}
          placeholder="Enter topic or keywords which you want to find"
          className="w-full p-2 outline-none bg-transparent"
          onChange={(e) => setUserInput(e.target.value)}
        />

        <Button type="submit" disabled={loading || !userInput.trim()}>
          {loading ? <Loader2 className="animate-spin" /> : <Settings />}
          Search
        </Button>
      </form>

      <KeywordsList loading={loading} keywordsList={keywordsList} />
    </div>
  );
}

export default TrendingKeywords;