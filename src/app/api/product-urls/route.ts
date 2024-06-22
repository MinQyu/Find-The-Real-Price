import { NextRequest, NextResponse } from "next/server";

export interface IMarketUrls {
  coupang: string;
  eleven: string;
  gmarket: string;
  auction: string;
}

const fetchPageKeyFromBridge = async (
  bridgeUrl: string
): Promise<string | null> => {
  const cheerio = require("cheerio");
  try {
    const response = await fetch(bridgeUrl);
    const data = await response.text();
    const $ = cheerio.load(data);
    let pageKey: string | null = null;

    $("script").each((_, element) => {
      const scriptContent = $(element).html();
      if (scriptContent && scriptContent.includes("goLink")) {
        const match = scriptContent.match(/pageKey=(\d+)/);
        if (match) {
          pageKey = match[1];
        }
      }
    });

    return pageKey;
  } catch (error) {
    console.error("Error fetching page key from bridge:", error);
    return null;
  }
};

const fetchProductUrl = async (id: number): Promise<IMarketUrls> => {
  const cheerio = require("cheerio");
  try {
    const url = `https://prod.danawa.com/info/?pcode=${encodeURIComponent(id)}`;
    const response = await fetch(url);
    const data = await response.text();
    const $ = cheerio.load(data);
    const marketUrls: IMarketUrls = {
      coupang: "",
      eleven: "",
      gmarket: "",
      auction: "",
    };
    $(
      "#blog_content > div.summary_info > div.detail_summary > div.summary_left > div.lowest_area > div.lowest_list > table > tbody.high_list tr"
    ).each((_, element) => {
      const alt = $(element).find("img").attr("alt");
      const href = $(element).find("img").closest("a").attr("href");
      if (alt === "쿠팡" && href) {
        marketUrls.coupang = href;
      } else if (alt === "11번가" && href) {
        const match = href.match(/link_pcode=([^&]*)/);
        marketUrls.eleven = `https://www.11st.co.kr/products/${match[1]}`;
      } else if (alt === "G마켓" && href) {
        const match = href.match(/link_pcode=([^&]*)/);
        marketUrls.gmarket = `https://item.gmarket.co.kr/Item?goodscode=${match[1]}`;
      } else if (alt === "옥션" && href) {
        console.log(href);
        const match = href.match(/link_pcode=([^&]*)/);
        marketUrls.auction = `https://itempage3.auction.co.kr/DetailView.aspx?itemno=${match[1]}`;
      }
    });

    if (marketUrls.coupang) {
      const bridgeUrl = marketUrls.coupang;
      const pageKey = await fetchPageKeyFromBridge(bridgeUrl);
      if (pageKey) {
        marketUrls.coupang = `https://www.coupang.com/vp/products/${pageKey}`;
      }
    }

    return marketUrls;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      coupang: "",
      eleven: "",
      gmarket: "",
      auction: "",
    };
  }
};

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id") || "0");

  if (!id) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  const marketUrls = await fetchProductUrl(id);

  return new NextResponse(JSON.stringify(marketUrls), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
