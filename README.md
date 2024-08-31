# cf-sesame-open

cloudflare workers に、sesame の開け締めをコントロールする API を生成します。

## 開発の仕方

-   Cloudflare のアカウントを取得する
-   ソースコードのクローン
-   インストール
-   環境変数の設定
-   開発サーバを立ち上げる
-   テストする
-   deploy
-   運用する

### Cloudflare のアカウントを取得する

[Cludflare](https://www.cloudflare.com/ja-jp/)のアカウントを取得してください。
アカウントを取得済みの方は、この項目はスキップしても問題ありません。

### ソースコードのクローン

下記コマンドを実行して、ソースコードを取得してください。

```
git clone git@github.com:ArcCosine/cf-sesame-open.git
```

### インストール

インストールに関しては、下記コマンドを実行してください。npm でも良いですが、[bun](https://bun.sh/)推奨です。

```
bun install
bunx wrangler login
```

または

```
npm install
npx wrangler login
```

Cloudflare のページが開きますので、そこで認証を行ってください。

### 環境変数の設定

*wrangler.toml*ファイルを修正してください。
wrangler.toml ファイルが無かった場合は、新たに作成してください。
wrangler.toml に、以下の項目を指定してください。

```toml
name = "cf-sesame-open"
compatibility_date = "2023-01-01"
compatibility_flags = [ "nodejs_compat" ]

[vars]
API_KEY = ""
UUID = ""
SECRET_KEY = ""
PASSWORD_DIGEST = ""
```

-   name に関しては、任意です（設定した名前が、URLに反映されます）。
-   compatibility_date は、開発段階では"2023-01-01"です。
-   compatibility_flags を設定していないと、Buffer が使えないので必ず設定してください。
-   API_KEY は、[SESAME の公式サイト](https://biz.candyhouse.co/)から取得してください。
-   SESAME デバイスの UUID と SESAME デバイスの SECRET_KEY は、同じサイトにデバイスの QR コードをアップロードする事で簡単に取得する事が出来ます。
-   PASSWORD_DIGEST は、[SHA512](https://emn178.github.io/online-tools/sha512.html)などのサイトで生成して取得してください。オンラインツールを使うのが不安な方は後述する内部ツールで取得できます。

### 開発サーバを立ち上げる

下記コマンドを実行すると、開発サーバが立ち上がります。

```
bun run dev
```

[http://127.0.0.1:8787/](http://127.0.0.1:8787/)へアクセスすると、

```
cf-sesame-open
```

と表示されていたら、成功です。

#### localhost にアクセス出来なかった場合、

もし、WSL 上で開発していて、localhost:8787 や 127.0.0.1:8787 でアクセス出来なかった場合は、172.XX.XX.XX:8787 と表示されている URL にアクセスしてみてください。

### 開発サーバで PASSWORD_DIGEST を取得する

開発サーバを立ち上げた状態で、（※パスワードは任意の文字列）

```
http://127.0.0.1:8787/generate/パスワード
```

とアクセスすると、PASSWORD_DIGEST を取得する事が出来ます。

### テストする

[curl](https://curl.se/)や、[Thunder Client](https://www.thunderclient.com/)などを使って、リクエストを送って実際にテストしてください。

施錠リクエスト先

```
http://127.0.0.1:8787/api/sesame/lock
```

施錠リクエストパラメータ

```json
{
    "password": "設定したパスワード文字列"
}
```

解錠リクエスト先

```
http://127.0.0.1:8787/api/sesame/unlock
```

解錠リクエストパラメータ

```json
{
    "password": "設定したパスワード文字列"
}
```

### deploy

```
bun run deploy
```

全ての設定が完了したら、deploy してください。

```
https://cf-sesame-open.XXXXXXX.workers.dev
```

のような URL が出力されるので、控えてください。

### 運用する

deploy した URL をベースにリクエストを飛ばしてください。

施錠リクエスト先

```
https://cf-sesame-open.XXXXXXX.workers.dev/api/sesame/lock
```

施錠リクエストパラメータ

```json
{
    "password": "設定したパスワード文字列"
}
```

解錠リクエスト先

```
https://cf-sesame-open.XXXXXXX.workers.dev/api/sesame/unlock
```

解錠リクエストパラメータ

```json
{
    "password": "設定したパスワード文字列"
}
```

### 現状の問題点

history部分のエンコードがバグっており、誰が施錠/解錠したのか上手く表示されない。
[Cloudflare Workers側の話](https://twitter.com/yusukebe/status/1725807676591091715)のようなので、対応される事を待つ必要がある。
