import { NextRequest, NextResponse } from "next/server";

const cheerio = require("cheerio");

export interface IFetchResult {
  id: number;
  imgSrc: string;
  title: string;
  specSet: string;
}

const fetchDanawaResults = async (query: string): Promise<IFetchResult[]> => {
  const INFO_SELECTOR = ".product_list .prod_main_info";
  const IMG_SRC_SELECTOR = ".thumb_image img";
  const PROD_NAME_SELECTOR = ".prod_info .prod_name a";
  const SPEC_LIST_SELECTOR = ".prod_info .prod_spec_set .spec_list";
  try {
    const url = `https://search.danawa.com/dsearch.php?module=goods&act=dispMain&k1=${encodeURIComponent(
      query
    )}`;
    const response = await fetch(url);
    const data = await response.text();
    const $ = cheerio.load(data);
    const results: IFetchResult[] = [];
    $(INFO_SELECTOR).each((_, element) => {
      const imgElement = $(element).find(IMG_SRC_SELECTOR);
      const imgSrc = imgElement.attr("data-src") || imgElement.attr("src");
      // 레이지 로드 문제 해결
      const title = $(element).find(PROD_NAME_SELECTOR).text().trim();
      const link = $(element).find(PROD_NAME_SELECTOR).attr("href");
      const idString = link ? link.match(/pcode=(\d+)&/) : null;
      const id = idString ? parseInt(idString[1]) : 0;
      const specList = $(element).find(SPEC_LIST_SELECTOR);
      let specSet = "";
      $(specList)
        .contents()
        .each((_, element) => {
          if (element.type === "tag" && element.tagName === "br") {
            specSet += "\n";
          } else if (element.type === "text") {
            specSet += $(element).text().trim() + " ";
          } else if (element.type === "tag" && element.tagName === "span") {
            specSet += `<span>${$(element).text().trim()}</span> `;
          } else {
            specSet += $(element).text().trim() + " ";
          }
        });
      results.push({ id, imgSrc, title, specSet });
    });
    return results;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const results = await fetchDanawaResults(q);
  return new NextResponse(JSON.stringify(results), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
