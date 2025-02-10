document.getElementById("click").addEventListener("click", Search);
//try and catch error handling is not purely done by me. Had to chatgpt.
async function fetch() {
    const readmeUrl = "https://raw.githubusercontent.com/haoel/leetcode/master/README.md";
    try {
        let extract = await fetch(readmeUrl);
        let wait = await extract.text();
        document.getElementById("readme").innerHTML = marked.parse(wait);
    } catch (error) {
        console.error("Error", error);
    }
}

fetch();

async function Search() {
    let query = document.getElementById("search").value.split(" ").join("").toLowerCase();
    let result = document.getElementById("results");
    result.innerHTML = `<p style="color: yellow;">Searching</p>`;

    try {
        let extract = await fetch("https://raw.githubusercontent.com/haoel/leetcode/master/README.md");
        let wait = await extract.text();

        if (wait.toLowerCase().includes(query)) {
            let regex = new RegExp(`\\|\\s*${query}\\s*\\|[^|]*\\|[^|]*\\[(.*?)\\]\\((.*?)\\)`, "i");
            //tried extracting the link through strings but failed. Hence had to chatgpt how to use RegExp.
            let match = wait.match(regex);
            if (match && match[2]) {
                let link1 = match[2].replace("./", "").replace("Subtring", "Substring"); //Using 2 here because that is the content part of the link we are generating. Everything else is standard.
                let linkf = `https://raw.githubusercontent.com/haoel/leetcode/master/${link1}`;//final link to the sol.
              fetch(linkf)
                .then(extract => {
                                if (!extract.ok) throw new Error("Solution file not found");
                                return extract.text();
                 })
                            .then(code => Show(linkf, code))
                            .catch(error => {
                                console.log("Solution not found.");
                                result.innerHTML = `<p style="color: red;">Solution not available for this problem.</p>`;
                            });

            } else {
                result.innerHTML = `<p style="color: red;">Solution not found.</p>`;
            }
        } else {
            result.innerHTML = `<div id="sol" style="color: aliceblue;"> No matching solution found.</div>`;
        }
    } catch (error) {
        result.innerHTML = `<p style="color: red;">Error</p>`;
    }
}

async function Show(solutionUrl, code) {
    let result = document.getElementById("results");

    try {
        let file = solutionUrl.split('.').pop();
        let lang = getlang(file);
        result.innerHTML = `<h3 style="color: lightblue;">Solution:</h3>
            <pre><code class="${lang}">${escapeHTML(code)}</code></pre>`;

    } catch (error) {
        result.innerHTML = `<p style="color: red;">Error</p>`;
        console.error("Error displaying solution file:", error);
    }
}
function getlang(a) {
    const type = {
        "cpp": "language-cpp",
        "py": "language-python",
        "java": "language-java",
    };

    if (a in type) {
        return type[a];
    } else {
        return "Alien Language";
    }

}
//Do not understand why we use this, had to chatgpt it in order to get the codeextract
function escapeHTML(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
