# cf-sesami-open

cloudflare workersに、sesamiの開け締めをコントロールするAPIを生成します。

## 開発の仕方

- Cloudflareのアカウントを取得する
- ソースコードのクローン
- インストール
- 環境変数の設定
- 開発サーバを立ち上げる
- テストする
- deploy
- 運用する

### Cloudflareのアカウントを取得する

[Cludflare](https://www.cloudflare.com/ja-jp/)のアカウントを取得してください。
アカウントを取得済みの方は、この項目はスキップしても問題ありません。

### ソースコードのクローン

下記コマンドを実行して、ソースコードを取得してください。

```
git clone git@github.com:ArcCosine/cf-sesami-open.git
```

### インストール

インストールに関しては、下記コマンドを実行してください。npmでも良いですが、[bun](https://bun.sh/)推奨です。

```
bun install
bunx wrangler login
```

または

```
npm install
npx wrangler login
```

Cloudflareのページが開きますので、そこで認証を行ってください。



### 環境変数の設定

*wrangler.toml*ファイルを修正してください。
wrangler.tomlファイルが無かった場合は、新たに作成してください。
wrangler.tomlに、以下の項目を指定してください。

```toml
name = "cf-sesami-open"
compatibility_date = "2023-01-01"
compatibility_flags = [ "nodejs_compat" ]

[vars]
API_KEY = ""
UUID = ""
SECRET_KEY = ""
PASSWORD_DIGEST = ""
```

- nameに関しては、任意です
- compatibility_dateは、開発段階では"2023-01-01"です。
- compatibility_flagsを設定していないと、Bufferなどが使えないので必ず設定してください。
- API_KEYは、[SESAMIの公式サイト](https://partners.candyhouse.co/)から取得してください。
- SESAMIデバイスのUUIDとSESAMIデバイスのSECRET_KEYは、同じサイトにデバイスのQRコードをアップロードする事で簡単に取得する事が出来ます。
- PASSWORD_DIGESTは、[SHA512](https://emn178.github.io/online-tools/sha512.html)などのサイトで生成して取得してください。オンラインツールを使うのが不安な方は後述する内部ツールで取得できます。


### 開発サーバを立ち上げる


下記コマンドを実行すると、開発サーバが立ち上がります。

```
npm run dev
```

[http://127.0.0.1:8787/](http://127.0.0.1:8787/)へアクセスすると、

```
cf-sesami-open
```

と表示されていたら、成功です。

#### localhostにアクセス出来なかった場合、

もし、WSL上で開発していて、http://localhost:8787/やhttp://127.0.0.1:8787/でアクセス出来なかった場合は、http://172.XX.XX.XX:8787/と表示されているURLにアクセスしてみてください。

### 開発サーバでPASSWORD_DIGESTを取得する

開発サーバを立ち上げた状態で、（※パスワードは任意の文字列）

```
http://127.0.0.1:8787/generate/パスワード
```

とアクセスすると、PASSWORD_DIGESTを取得する事が出来ます。

### テストする

[Thunder Client](https://www.thunderclient.com/)などを使って、リクエストを送って実際にテストしてください。

施錠リクエスト先

```
http://127.0.0.1:8787/api/sesami/lock
```

施錠リクエストパラメータ

```json
{
  "password":"設定したパスワード文字列",
  "history":"任意の名前(cf-locked等)"
}
```

解錠リクエスト先

```
http://127.0.0.1:8787/api/sesami/unlock
```

解錠リクエストパラメータ

```json
{
  "password":"設定したパスワード文字列",
  "history":"任意の名前(cf-unlocked)"
}
```


### deploy

```
npm run deploy
```

全ての設定が完了したら、deployしてください。

```
https://cf-sesami-open.XXXXXXX.workers.dev
```

のようなURLが出力されるので、控えてください。

### 運用する

deployしたURLをベースにリクエストを飛ばしてください。

施錠リクエスト先

```
https://cf-sesami-open.XXXXXXX.workers.dev/api/sesami/lock
```

施錠リクエストパラメータ

```json
{
  "password":"設定したパスワード文字列",
  "history":"任意の名前(cf-locked等)"
}
```

解錠リクエスト先

```
https://cf-sesami-open.XXXXXXX.workers.dev/api/sesami/unlock
```

解錠リクエストパラメータ

```json
{
  "password":"設定したパスワード文字列",
  "history":"任意の名前(cf-unlocked)"
}
```
