import { IFetchResult } from "../api/search/route";
import styles from "@/app/styles/product.module.css";
import DOMPurify from "dompurify";
import { useState } from "react";
import ProductDetail from "./product-detail";

export interface ISearchResultProps extends IFetchResult {}

export default function Product({
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
      {showPrice && <ProductDetail id={id} />}
    </div>
  );
}
