export const searchyoutobe = async (
    query: string
) => {
    const url =
        `https://www.googleapis.com/youtube/v3/search` +
        `?part=snippet` +
        `&q=${encodeURIComponent(query)}` +
        `&key=${process.env.YOUTUBE_API_KEY}` +
        `&maxResults=5` +
        `&type=video`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(
        "YOUTUBE API RESPONSE:",
        JSON.stringify(data, null, 2)
    );
    return data.items.map((item: any) => ({
        title: item.snippet.title,
        description: item.snippet.description,
        channelTitle: item.snippet.channelTitle,

    }))

    // const video = await searchyoutobe(
    //     "tìm nội dung hôm nay"
    // )
    // console.log("YOUTUBE VIDEO:", video);
}