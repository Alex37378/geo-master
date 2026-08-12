import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";
import landmarks from "../src/data/landmarks.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(
    __dirname,
    "../public/landmarks"
);

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Get Wikipedia image
async function getWikipediaImage(name) {

    const url =
        `https://en.wikipedia.org/w/api.php?action=query&format=json` +
        `&prop=pageimages&pithumbsize=1000&titles=${encodeURIComponent(name)}`;


    const response = await axios.get(url, {

        headers: {
            "User-Agent":
                "GeoMasterGame/1.0 (contact@example.com)"
        }

    });


    const pages =
        response.data.query.pages;


    const page =
        Object.values(pages)[0];


    if (!page.thumbnail) {
        return null;
    }


    return page.thumbnail.source;
}



async function downloadWithRetry(imageUrl, filename) {
    const cleanUrl = imageUrl.split("?")[0];

    const response = await axios.get(cleanUrl, {
        responseType: "arraybuffer",
        maxRedirects: 5,
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "*/*",
            "Referer": "https://en.wikipedia.org/"
        },
        validateStatus: status => status < 500
    });

    console.log(response.status);

    if (response.status !== 200) {
        throw new Error(`HTTP ${response.status}`);
    }

    fs.writeFileSync(filename, response.data);
    return true;
}



async function main() {


    let success = 0;


    for (
        let i = 0;
        i < landmarks.length;
        i++
    ) {


        const landmark =
            landmarks[i];


        const filename =
            path.join(
                outputDir,
                `${landmark.id}.jpg`
            );


        console.log(
            `[${i + 1}/${landmarks.length}] ${landmark.name}`
        );



        // Skip existing images

        if (fs.existsSync(filename)) {

            console.log(
                "  ✓ Already exists"
            );

            success++;
            continue;

        }



        try {


            const imageUrl =
                await getWikipediaImage(
                    landmark.wiki
                );


            if (!imageUrl) {

                throw new Error(
                    "No image found"
                );

            }

            const cleanImageUrl = imageUrl.split("?")[0];

            const downloaded =
                await downloadWithRetry(
                    imageUrl,
                    filename
                );


            if (!downloaded) {

                throw new Error(
                    "Failed after retries"
                );

            }


            console.log(
                "  ✓ Downloaded"
            );


            success++;



        } catch(err) {


            console.log(
                "  ✗ Failed:",
                err.message
            );
            fs.appendFileSync(
                "failed-landmarks.txt",
                `${landmark.id},${landmark.name},${landmark.wiki}\n`
            );
        }



        // avoid Wikipedia rate limits

        await sleep(7000);

    }



    console.log(
        `\nFinished: ${success}/${landmarks.length} images`
    );

}


main();