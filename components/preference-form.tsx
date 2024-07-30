"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogState } from "@/actions/log-preference";
import { useRouter } from "next/navigation";
import { useFingerprint } from "@/lib/use-fingerprint";

type Preference = "A" | "B" | null;

interface PreferenceFormProps {
  handlePreferenceSubmit: (formData: FormData) => void;
  searchTerm: string;
  logState: LogState;
  isTrieveA: boolean;
  isQueryAllowed: boolean;
  resultA: React.ReactNode;
  resultB: React.ReactNode;
}

interface VotedQueries {
  [fingerprint: string]: string[];
}

const PreferenceForm: React.FC<PreferenceFormProps> = ({
  handlePreferenceSubmit,
  searchTerm,
  logState,
  isTrieveA,
  isQueryAllowed,
  resultA,
  resultB,
}) => {
  const fingerprint = useFingerprint();
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (fingerprint && searchTerm) {
      const votedQueries: VotedQueries = JSON.parse(
        localStorage.getItem("votedQueries") || "{}"
      );
      setHasVoted(votedQueries[fingerprint]?.includes(searchTerm) || false);
    }
  }, [fingerprint, searchTerm]);

  const onVote = (preference: Preference) => {
    if (hasVoted || !searchTerm || !fingerprint || !isQueryAllowed) return;

    setIsSubmitting(true);

    const votedQueries: VotedQueries = JSON.parse(
      localStorage.getItem("votedQueries") || "{}"
    );
    if (!votedQueries[fingerprint]) {
      votedQueries[fingerprint] = [];
    }
    votedQueries[fingerprint].push(searchTerm);
    localStorage.setItem("votedQueries", JSON.stringify(votedQueries));

    const winner =
      preference === "A"
        ? isTrieveA
          ? "trieve"
          : "algolia"
        : isTrieveA
        ? "algolia"
        : "trieve";
    const formData = new FormData();
    formData.append("winner", winner);
    formData.append("query", searchTerm);
    formData.append("fingerprint", fingerprint);

    handlePreferenceSubmit(formData);
    setHasVoted(true);
  };

  useEffect(() => {
    if (logState.message) {
      setIsSubmitting(false);
    }
  }, [logState]);

  if (!isQueryAllowed) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">
          This query is not in the allowed set.
        </p>
        <NewQueryButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-lg font-semibold text-center mb-4">
        Which search response do you prefer? Choose a result or use the buttons
        below to vote and try another query.
      </h2>
      {/* <div className="text-center space-x-4 mt-4">
        <Button
          onClick={() => onVote("A")}
          disabled={hasVoted || isSubmitting}
          className={`px-4 bg-[#ff6600] py-2 border border-[#ff6600] text-white hover:bg-[#ff8533] transition-colors duration-200 rounded ${
            hasVoted || isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          A is better
        </Button>
        <Button
          onClick={() => onVote("B")}
          disabled={hasVoted || isSubmitting}
          className={`px-4 bg-[#ff6600] py-2 border border-[#ff6600] text-white hover:bg-[#ff8533] transition-colors duration-200 rounded ${
            hasVoted || isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          B is better
        </Button>
      </div> */}
      <div className="flex justify-center mt-4">
        <div className="inline-flex rounded overflow-hidden">
          <button
            onClick={() => onVote("A")}
            disabled={hasVoted || isSubmitting}
            className={`px-4 py-2 bg-[#ff6600] text-white hover:bg-[#ff8533] transition-colors duration-200 ${
              hasVoted || isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            A is better
          </button>
          <div className="w-px bg-white"></div>
          <button
            onClick={() => onVote("B")}
            disabled={hasVoted || isSubmitting}
            className={`px-4 py-2 bg-[#ff6600] text-white hover:bg-[#ff8533] transition-colors duration-200 ${
              hasVoted || isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            B is better
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
            hasVoted
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-blue-500 hover:shadow-lg"
          }`}
          onClick={() => !hasVoted && onVote("A")}
        >
          <h3 className="text-lg font-semibold mb-2">Results A</h3>
          {resultA}
        </div>
        <div
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
            hasVoted
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-blue-500 hover:shadow-lg"
          }`}
          onClick={() => !hasVoted && onVote("B")}
        >
          <h3 className="text-lg font-semibold mb-2">Results B</h3>
          {resultB}
        </div>
      </div>

      {hasVoted && !logState.message && !isSubmitting && (
        <>
          <p className="text-green-500 text-center">
            You have already voted on this query.
          </p>
          <NewQueryButton />
        </>
      )}
      {logState.message && (
        <p
          className={`text-sm mt-2 text-center ${
            logState.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {logState.message}
        </p>
      )}
    </div>
  );
};

export const NewQueryButton: React.FC = () => {
  const router = useRouter();
  return (
    <Button onClick={() => router.push("/")} className="w-full">
      Try a New Query
    </Button>
  );
};

export default PreferenceForm;