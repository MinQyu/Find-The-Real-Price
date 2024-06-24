import { useQuery } from "@tanstack/react-query";
import { IMarketUrls } from "../api/product-urls/route";

export const fetchProductUrl = async (id: number): Promise<IMarketUrls> => {
  const response = await fetch(
    `/api/product-urls?id=${encodeURIComponent(id)}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};

export default function Product({ id }: { id: number }) {
  const {
    data,
    isLoading,
    isError,
  }: { data?: IMarketUrls; isLoading: any; isError: any } = useQuery({
    queryKey: ["UrlData", id],
    queryFn: () => fetchProductUrl(id),
    enabled: !!id,
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  return (
    <div>
      <p>ID: {id}</p>
      {data && (
        <div>
          <a href={data.coupang} target="_blank" rel="noopener noreferrer">
            쿠팡 링크
          </a>
          <a href={data.eleven} target="_blank" rel="noopener noreferrer">
            11번가 링크
          </a>
          <a href={data.gmarket} target="_blank" rel="noopener noreferrer">
            G마켓 링크
          </a>
          <a href={data.auction} target="_blank" rel="noopener noreferrer">
            옥션 링크
          </a>
        </div>
      )}
    </div>
  );
}
