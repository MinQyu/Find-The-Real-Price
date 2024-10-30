import { useQuery } from "@tanstack/react-query";
import { IMarketUrls } from "../api/product-urls/route";
import styles from "@/app/styles/product-detail.module.css";

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

export default function ProductDetail({ id }: { id: number }) {
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
    <div className={styles.container}>
      {data && (
        <table>
          data
          <tr>
            <td>쿠팡</td>
            <td>카드할인</td>
            <td>
              <a href={data.coupang} target="_blank" rel="noopener noreferrer">
                구매 링크
              </a>
            </td>
          </tr>
          <tr>
            <td>11번가</td>
            <td>카드할인</td>
            <td>
              <a href={data.eleven} target="_blank" rel="noopener noreferrer">
                구매 링크
              </a>
            </td>
          </tr>
          <tr>
            <td>g마켓</td>
            <td>카드할인</td>
            <td>
              <a href={data.gmarket} target="_blank" rel="noopener noreferrer">
                구매 링크
              </a>
            </td>
          </tr>
          <tr>
            <td>옥션</td>
            <td>카드할인</td>
            <td>
              <a href={data.auction} target="_blank" rel="noopener noreferrer">
                구매 링크
              </a>
            </td>
          </tr>
        </table>
      )}
    </div>
  );
}
