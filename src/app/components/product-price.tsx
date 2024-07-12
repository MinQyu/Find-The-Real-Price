import { useQuery } from "@tanstack/react-query";

export interface IProductPriceProps {
  url: string;
  marketName: string;
}

export const fetchProductPrice = async (url: string): Promise<string> => {
  const response = await fetch(
    `/api/product-price?url=${encodeURIComponent(url)}`
  );
  const data = await response.json();
  return data.price;
};

export default function ProductPrice({ url, marketName }: IProductPriceProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["marketPrice", url],
    queryFn: () => fetchProductPrice(url),
  });

  if (isLoading) {
    return <div>Loading {marketName} price...</div>;
  }

  if (isError) {
    return <div>Error fetching {marketName} price</div>;
  }

  return (
    <div>
      <p>
        {marketName} Price: {data}
      </p>
    </div>
  );
}
