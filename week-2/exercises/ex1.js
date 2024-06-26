// import jsdom package to convert js to dom object
const { JSDOM } = require("jsdom");

//this function to fetch data from url specified
async function fetchData(url) {
    // verify valid url
    try {
        // create an URL object from url
        new URL(url);
    } catch (error) {
        // if an error occurs -> throw error
        throw Error(error);
    }

    // using try catch to handle exception
    try {
        // call api url with fetch and make response to text
        // res is value response from url
        const res = await fetch(url).then((e) => e.text());
        // convert response to dom object
        const dom = new JSDOM(res);
        // get body object
        const body = dom.window.document.body;
        // return result
        return body;
    } catch (error) {
        // if an error occurs -> throw error
        throw Error(error);
    }
}

//this function to get all links from body
function getLinks(body, baseUrl) {
    // get links of a elements
    const aLinks = body.querySelectorAll("a[href]");
    // get links of img elements
    const imgLinks = body.querySelectorAll("img");
    // get links of video elements
    const videoLinks = body.querySelectorAll("video");
    // get links of audio elements
    const audioLinks = body.querySelectorAll("audio");
    // init a links to contains all valid links
    const links = [];
    // using forEach to loop all element
    aLinks.forEach((e) => {
        // get absolute link
        let res;
        // check about:blank or mailto: link
        if (e.protocol === "about:") {
            let validUrl = e.hash || "";
            res = new URL(validUrl, baseUrl);
        } else if (e.protocol !== "mailto:") {
            res = new URL(e.href, baseUrl);
        }
        // Check an element exists in the links and not undefined
        if (res !== undefined && !links.includes(res.href)) {
            // push element in links
            links.push(res.href);
        }
    });
    // using forEach to loop all element
    imgLinks.forEach((e) => {
        // get absolute link
        let link = new URL(e.src, baseUrl).href;
        // Check an element exists in the links
        if (!links.includes(link)) {
            // push element in links
            links.push(link);
        }
    });
    videoLinks.forEach((e) => {
        // get absolute link
        let link = new URL(e.src, baseUrl).href;
        // Check an element exists in the links
        if (!links.includes(link)) {
            // push element in links
            links.push(link);
        }
    });
    audioLinks.forEach((e) => {
        // get absolute link
        let link = new URL(e.src, baseUrl).href;
        // Check an element exists in the links
        if (!links.includes(link)) {
            // push element in links
            links.push(link);
        }
    });
    // return result
    return links;
}

//this function to get all text from body
function getText(body) {
    // init a text to contain all valid text
    let text = "";
    // loop all childNodes of body
    for (let node of body.childNodes) {
        // check if node have a type equal text node (3) and node have textContent is trimmed equal ""
        // else node have a type equal element node
        if (node.nodeType === 3 && node.textContent.trim() != "") {
            // trim textContent to remove white space at both ends
            // replaceAll "\n" in text to ""
            // replace white spaces in text
            // assign to text variable
            text +=
                node.textContent
                    .trim()
                    .replaceAll("\n", "")
                    .replace(/\s+/g, " ") + " ";
        } else if (node.nodeType === 1) {
            // call recursion function to handle node
            text += getText(node);
        }
    }
    // return result
    return text;
}

// this function to get html from body
function getHtml(body) {
    // using innerHTML to get html from body
    const html = body.innerHTML;
    // return result
    return html;
}

// this function to get all require data from url
async function getData(url) {
    // using try catch to handle exception
    try {
        // using await to get body object form fetchData()
        const body = await fetchData(url);
        if (body.tagName !== "BODY") {
            throw Error("body is not Body Object DOM");
        }
        // links from getLinks()
        const links = getLinks(body, url);
        // text from getLinks()
        const text = getText(body);
        // html from getLinks()
        const html = getHtml(body);
        // create result object
        // const res = { links: links, text: text, html: html };
        const res = { links: links };
        // return json result
        return res;
        // return JSON.stringify(res);
    } catch (error) {
        return error;
    }
}

// defined an url
const url = "https://sonhoang2071.github.io/my-portfolio/";

// getData and console.log result
getData(url).then((res) => {
    console.log(res);
});

//  console.log(new URL("./assets/linkedin.png", "https://sonhoang2071.github.io/my-portfolio/"));
