import { IFetchResult } from "../api/search/route";
import styles from "@/app/styles/home_search_result.module.css";
import DOMPurify from "dompurify";
import { useState } from "react";
import Product from "./product";

export interface ISearchResultProps extends IFetchResult {}

export default function SearchResult({
  id,
  imgSrc,
  title,
  specSet,
}: ISearchResultProps) {
  const [showPrice, setShowPrice] = useState(false);
  const handleItemClick = () => {
    setShowPrice(true);
  };
  const sanitizedText = DOMPurify.sanitize(specSet);
  return (
    <div key={id} className={styles.result_item} onClick={handleItemClick}>
      <img src={imgSrc} />
      <div className={styles.result_item__info_box}>
        <h2>{title}</h2>
        <div dangerouslySetInnerHTML={{ __html: sanitizedText }} />
      </div>
      {showPrice && <Product id={id} />}
    </div>
  );
}
