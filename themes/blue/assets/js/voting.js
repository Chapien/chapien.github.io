function refresh(slug) {
        fetch('https://voting.redstrate.com/votes/' + slug)
        .then(function(response) {
                return response.json();
        })
        .then(function(data) {
                document.getElementById("num-votes").innerHTML = "❤️ " + data["votes"];
        });
}

function addVote(slug) {
        const request = new Request("https://voting.redstrate.com/votes/" + slug, {
                method: "POST"
        });
        fetch(request)
        .then((response) => { refresh(slug) });
}
