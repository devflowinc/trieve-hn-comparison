"use client";

import React, { useState, useEffect } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";
import { Suspense } from "react";
import { useFormState } from "react-dom";
import { logPreference, LogState } from "@/actions/log-preference";
import PreferenceForm from "./preference-form";
import { useRouter } from "next/navigation";
import queries from "@/lib/queries";
import { searchBoth } from "@/lib/search-both";
import { useFingerprint } from "@/lib/use-fingerprint";

const queryClient = new QueryClient();

export type SearchResult = {
  title: string;
  url: string;
  points: number;
  author: string;
  created_at: string;
  num_comments: number;
};

export type SearchResults = {
  search1: SearchResult[];
  search2: SearchResult[];
};

const SearchResultItem: React.FC<{ result: SearchResult }> = ({ result }) => (
  <div className="px-2 rounded-md pb-3">
    <div className="flex items-center flex-wrap">
      <div className="w-full mb-[-6px] text-[#828282] text-wrap break-word leading-[14pt]">
        <div
          className="mr-1 text-[11pt] sm:text-[10pt] text-black text-wrap"
          // href={result.url}
        >
          {result.title}
        </div>
        {result.url && (
          <div
            className="text-[8pt] text-[#828282] break-all"
            // href={result.url}
          >
            ({result.url})
          </div>
        )}
      </div>
      <div className="w-full items-center text-[9pt] sm:text-[7pt] text-[#828282] pt-1">
        <span>
          {result.points} points by {result.author}{" "}
          {new Date(result.created_at).toLocaleString()}
        </span>
        <span className="px-1">|</span>
        <div>
          {result.num_comments} comments
        </div>
      </div>
    </div>
  </div>
);



function HNSearchComparisonView() {
  const [searchTerm, setSearchTerm] = useQueryState("q", { defaultValue: "" });
  const [isTrieveA, setIsTrieveA] = useState<boolean>(Math.random() < 0.5);
  const [results, setSearchResults] = useState<SearchResults | null>(null);
  const [logState, logAction] = useFormState<LogState, FormData>(
    logPreference,
    {
      message: "",
      success: false,
    }
  );
  const [localLogState, setLocalLogState] = useState<LogState>({
    message: "",
    success: false,
  });
  const fingerprint = useFingerprint();
  const [submittedQueries, setSubmittedQueries] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (fingerprint) {
      const votedQueries = JSON.parse(localStorage.getItem("votedQueries") || "{}");
      setSubmittedQueries(votedQueries[fingerprint] || []);
    }
  }, [fingerprint]);

  useEffect(() => {
    if (!searchTerm && fingerprint) {
      const availableQueries = queries.filter(q => !submittedQueries.includes(q));
      if (availableQueries.length > 0) {
        const randomQuery = availableQueries[Math.floor(Math.random() * availableQueries.length)];
        router.push(`?q=${randomQuery}`);
      } else {
        setSearchTerm("all_voted");
      }
    }
  }, [searchTerm, fingerprint, submittedQueries, router, setSearchTerm]);

  useEffect(() => {
    if (logState.message) {
      setLocalLogState(logState);
    }
  }, [logState]);

  useEffect(() => {
    setLocalLogState({ message: "", success: false });
  }, [searchTerm]);


  useEffect(() => {
    async function fetchData() {
      let results = await searchBoth(searchTerm)
      setSearchResults({
        search1: isTrieveA ? results.search1 : results.search2,
        search2: isTrieveA ? results.search2 : results.search1,
      })
    }
    fetchData();
  }, [searchTerm, isTrieveA]);

  const handlePreferenceSubmit = (formData: FormData) => {
    logAction(formData);
    const availableQueries = queries.filter(q => !submittedQueries.includes(q));
    if (availableQueries.length > 0) {
      const randomQuery = availableQueries[Math.floor(Math.random() * availableQueries.length)];
      const updatedQueries = [...submittedQueries, searchTerm];
      const votedQueries = JSON.parse(localStorage.getItem("votedQueries") || "{}");
      votedQueries[fingerprint] = updatedQueries;
      localStorage.setItem("votedQueries", JSON.stringify(votedQueries));
      setSubmittedQueries(updatedQueries);
      setIsTrieveA(Math.random() < 0.5);
      setTimeout(() => {
        router.push(`?q=${randomQuery}`);
      }, 700);
    } else {
      setSearchTerm("all_voted");
    }
  };

  const renderResults = (results: SearchResult[] | undefined) => {
    if (!results || results.length === 0)
      return <div className="text-center">No results found</div>;

    return results.map((result: SearchResult, index: number) => (
      <SearchResultItem key={index} result={result} />
    ));
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl bg-[#f6f6ef]">
      <h1 className="text-2xl font-bold mb-6 text-[#ff6600]">
        Search Engine Comparison
      </h1>
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Input
            type="search"
            placeholder="Search"
            disabled={true}
            value={searchTerm === "all_voted" ? "" : searchTerm}
            onChange={(e) => setSearchTerm(e.target.value || null)}
            className="bg-white border border-[#828282]"
          />
        </div>
        {searchTerm === "all_voted" && (
          <div className="text-center text-lg mb-4">
            You have voted on all available queries.
          </div>
        )}
        {searchTerm && searchTerm !== "all_voted" && (
          <PreferenceForm
            handlePreferenceSubmit={handlePreferenceSubmit}
            resultA={renderResults(results?.search1)}
            resultB={renderResults(results?.search2)}
            searchTerm={searchTerm}
            logState={localLogState}
            isTrieveA={isTrieveA}
          />
        )}
      </div>
    </div>
  );
}

export default function Wrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <HNSearchComparisonView />
      </Suspense>
    </QueryClientProvider>
  );
}