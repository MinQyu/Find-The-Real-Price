"use client";

import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loading from "./loading";
import SearchResult from "../components/home_search_result";
import { IFetchResult } from "../api/search/route";

export const fetchData = async (query: string) => {
  const { data } = await axios.get(
    `/api/search?q=${encodeURIComponent(query)}`
  );
  return data;
};

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data,
    isLoading,
    isError,
  }: { data?: IFetchResult[]; isLoading: any; isError: any } = useQuery({
    queryKey: ["crawlerData", searchQuery],
    queryFn: () => fetchData(searchQuery),
    enabled: !!searchQuery,
  });

  const handleSearch = () => {
    setSearchQuery(query);
  };
  return (
    <div>
      <h1>다나와 검색</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어를 입력하세요"
      />
      <button onClick={handleSearch}>검색</button>
      {isLoading && <Loading />}
      {isError && <div>Error fetching data</div>}
      {data && (
        <div>
          {data.map((item) => (
            <SearchResult
              id={item.id}
              key={item.id}
              imgSrc={item.imgSrc}
              title={item.title}
              specSet={item.specSet}
            />
          ))}
        </div>
      )}
    </div>
  );
}
