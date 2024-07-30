
import { SearchResults, SearchResult } from "@/components/search-view";

const USE_DUMMY_TRIEVE_DATA = true;

export const searchBoth = async (query: string): Promise<SearchResults> => {
  const algoliaResponse = await fetch(
    "https://uj5wyc0l7x-dsn.algolia.net/1/indexes/Item_dev/query",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Algolia-API-Key": "28f0e1ec37a5e792e6845e67da5f20dd",
        "X-Algolia-Application-Id": "UJ5WYC0L7X",
      },
      body: JSON.stringify({
        query: query,
        hitsPerPage: 10,
        tagFilters: [["story"]],
      }),
    }
  );

  if (!algoliaResponse.ok) {
    throw new Error("Network response was not ok");
  }

  const algoliaData = await algoliaResponse.json();

  const algoliaResults = algoliaData.hits.map((hit: any) => ({
    title: hit.title,
    url: hit.url,
    points: hit.points,
    author: hit.author,
    created_at: hit.created_at,
    num_comments: hit.num_comments,
  }));

  let trieveResults;
  if (USE_DUMMY_TRIEVE_DATA) {
    trieveResults = algoliaResults.map((result: SearchResult) => ({
      ...result,
      points: Math.floor(result.points * 1.1),
      num_comments: Math.floor(result.num_comments * 1.1),
    }));
  } else {
    const trieveResponse = await fetch(
      "https://hackernews.withtrieve.com/api/chunk/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "tr-IeuEU6Ni7JmT73eynHMjcaRXiNsjosBl",
          "tr-dataset": "b96b60eb-cfd1-42c4-9320-78ebef592cfd",
          "x-api-version": "V2",
        },
        body: JSON.stringify({
          query: query,
          search_type: "fulltext",
          page: 1,
          highlight_results: true,
          highlight_delimiters: [" ", "-", "_", ".", ","],
          highlight_threshold: 0.85,
          highlight_max_num: 50,
          highlight_window: 0,
          highlight_max_length: 50,
          use_weights: false,
          slim_chunks: false,
          use_quote_negated_terms: true,
          filters: {
            jsonb_prefilter: false,
            must: [{ field: "tag_set", match: ["story"] }],
          },
          page_size: 10,
          score_threshold: 7,
        }),
      }
    );

    if (!trieveResponse.ok) {
      throw new Error("Trieve API response was not ok");
    }

    const trieveData = await trieveResponse.json();
    trieveResults = trieveData.chunks.map((chunk: any) => ({
      title: chunk.chunk.metadata.title,
      url: chunk.chunk.link || chunk.chunk.metadata.url,
      points: chunk.chunk.metadata.score || 0,
      author: chunk.chunk.metadata.by,
      created_at: new Date(chunk.chunk.metadata.time * 1000).toISOString(),
      num_comments: chunk.chunk.metadata.descendants || 0,
    }));
  }

  return { trieveResults, algoliaResults };
};