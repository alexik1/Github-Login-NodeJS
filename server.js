import express from 'express'
import fetch from 'node-fetch'
const app = express()


const client_id = process.env.client_id
const client_secret = process.env.client_secret

console.log({client_id,client_secret})

app.get('/', (req, res) => {
    res.send("Test0")

})

app.get('/login/github', (req,res) => {
    const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=http://localhost:9000/login/github/callback`
    res.redirect(url)
})

async function getAccessToken (code) {
    const res = await fetch("https://github.com/login/oauth/access_token", {
        method: 'POST',
        headers: {
            "Content-Type":"application/json"
        },
        body : JSON.stringify({
            client_id,
            client_secret,
            code
        })
    })
    const data = await res.text();
    const params = new URLSearchParams(data);
    return params.get("access_token");
}

async function getGithubUser (access_token) {
    const req = await fetch('https://api.github.com/user', {
        headers: {
            Authorization: `bearer ${access_token}`
        }
    })
    const data = await req.json()
    return data
}


app.get('/login/github/callback', async (req,res) => {
    const code = req.query.code;
    const token = await getAccessToken(code);
    const githubData = await getGithubUser(token);

    //res.json(githubData);
    res.send(githubData.login);
})








const PORT = process.env.PORT || 9000
app.listen(PORT, () => console.log('PORT IS 9000'))