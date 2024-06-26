"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loading from "./loading";
import Product from "../components/product";
import { IFetchResult } from "../api/search/route";

export const fetchData = async (query: string): Promise<IFetchResult[]> => {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  const data = await response.json();
  return data;
};

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const {
    data,
    isLoading,
    isError,
  }: { data?: IFetchResult[]; isLoading: any; isError: any } = useQuery({
    queryKey: ["crawlerData", searchQuery],
    queryFn: () => fetchData(searchQuery),
    enabled: searchQuery.length > 0,
  });

  const handleSearch = () => {
    setSearchQuery(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <h1>다나와 검색</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="검색어를 입력하세요"
      />
      <button onClick={handleSearch}>검색</button>
      {isLoading && <Loading />}
      {isError && <div>Error fetching data</div>}
      {data && (
        <div>
          {data.map((item) => (
            <Product
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
