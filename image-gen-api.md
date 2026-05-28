# img-generator API — reference for direct curl / fetch usage

This document describes how to call the generation backend directly — useful
for scripting, testing, or letting another Claude Code session interact with
the service without going through the web UI.

- **Base URL:** `https://gen-api.ggrn.pro`
- **Auth:** none (open endpoints, CORS allows any `*.vercel.app` and a few fixed origins)
- **Protocol:** HTTPS via Cloudflare → HTTP origin on VDS `212.34.135.79`
- **Windows note:** always add `--ssl-no-revoke` to curl on Windows, otherwise schannel cert revocation checks make it flaky

---

## 0. Health check (always start here)

```bash
curl -s --ssl-no-revoke https://gen-api.ggrn.pro/health
```

Expected:
```json
{"status":"ok","uptime":12345.6,"db":"ok"}
```

If `db` is not `ok`, the Postgres container is down — do not try to generate.

---

## 1. The main call: `POST /api/generate`

Orchestrates the whole batch: creates DB rows, runs key failover, uploads
results to R2, streams progress back as **Server-Sent Events**. One HTTP call
per batch — the browser can close and generation continues server-side.

### Request body

```jsonc
{
  "prompt":            "A cozy mountain cabin at sunset",  // REQUIRED, plain text
  "model":             "gemini-3-pro-image-preview",       // optional, default = pro
  "resolution":        "1K",                               // "1K" | "2K"
  "aspectRatio":       "1:1",                              // see list below
  "imageCount":        1,                                  // 1..10, default 1
  "referenceImageIds": ["<uuid>", "<uuid>"]                // optional, see §3
}
```

**Models:**
- `gemini-3-pro-image-preview` — higher quality, slower 
- `gemini-3.1-flash-image-preview` — faster, cheaper (default)

**Aspect ratios accepted by Gemini:**
`1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `9:16`, `16:9`, `21:9`

**Resolution:** `1K` or `2K`. Higher resolution = slower + more R2 storage.

### Response: Server-Sent Events stream

`Content-Type: text/event-stream`. Events are separated by a blank line; each
event has an `event:` name and `data:` JSON payload.

**Event sequence for a successful N-image batch:**

```
event: batch
data: {"batch":{ id, model, prompt, resolution, aspect_ratio, requested_count, status:"generating", ... },
       "images":[{ id, batch_id, index_in_batch:0, status:"pending" }, ...]}

event: image                    ← fires once per image, in arbitrary order
data: {"imageId":"...", "status":"done",
       "image_url":"https://generator-images.ggrn.pro/generated-images/<batch>/<img>.jpg",
       "thumbnail_url":"<same as image_url — we don't make a separate thumb>",
       "storage_path":"generated-images/<batch>/<img>.jpg",
       "mime_type":"image/jpeg",
       "finish_reason":"STOP"}

event: done
data: {"ok":true, "batch_id":"<uuid>", "status":"done"|"partial"|"blocked"|"error"}
```

**On failure, the `image` event carries:**
```json
{"imageId":"...", "status":"error"|"blocked",
 "error":"...",
 "block_reason":"IMAGE_SAFETY"|"...",
 "exhaustion_reason":"rate_limit"|"cooldown"|"blocked"|"timeout"}
```

### Text-only prompt, 1 image, 1K square

```bash
curl -sN --ssl-no-revoke -X POST https://gen-api.ggrn.pro/api/generate \
  -H 'Content-Type: application/json' \
  -d '{
    "prompt":      "a red apple on white background",
    "resolution":  "1K",
    "aspectRatio": "1:1",
    "imageCount":  1
  }'
```

`-N` disables curl's output buffering so you see SSE events as they arrive.

### Multi-image batch, 16:9, flash model

```bash
curl -sN --ssl-no-revoke -X POST https://gen-api.ggrn.pro/api/generate \
  -H 'Content-Type: application/json' \
  -d '{
    "prompt":      "moody cinematic shot of a foggy forest at dawn",
    "model":       "gemini-3.1-flash-image-preview",
    "resolution":  "1K",
    "aspectRatio": "16:9",
    "imageCount":  4
  }'
```

All 4 images run in parallel server-side — total time ≈ single-image time.

### Just the final image URLs (jq)

```bash
curl -sN --ssl-no-revoke -X POST https://gen-api.ggrn.pro/api/generate \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"a blue cat","resolution":"1K","aspectRatio":"1:1","imageCount":1}' \
  | awk '/^data: /{sub(/^data: /,""); print}' \
  | jq -r 'select(.status=="done") | .image_url'
```

---

## 2. Generate with a reference image (two-step)

To condition the generation on an existing image, upload the reference first,
then pass the resulting ID in `referenceImageIds`. Uploads are deduped by
SHA-256 content hash — the same image uploaded twice returns the same ID.

### Step 2a: `POST /api/reference-images`

```jsonc
{
  "data":      "<base64 string, no data:... prefix>",
  "mime_type": "image/jpeg",       // or image/png, image/webp
  "width":     1024,               // optional
  "height":    1024                // optional
}
```

**Response:**
```json
{
  "id":            "uuid",
  "storage_path":  "reference-images/deduplicated/<sha256>.jpg",
  "mime_type":     "image/jpeg",
  "image_url":     "https://generator-images.ggrn.pro/reference-images/deduplicated/<sha256>.jpg",
  "size_bytes":    123456,
  "width":         1024,
  "height":        1024,
  "deduplicated":  false
}
```

### Step 2b: pass the ID into `/api/generate`

```jsonc
{
  "prompt":            "Edit the uploaded image: add a hat on the cat",
  "resolution":        "1K",
  "aspectRatio":       "1:1",
  "imageCount":        1,
  "referenceImageIds": ["<uuid returned from step 2a>"]
}
```

### Full shell example (Linux/macOS, bash)

```bash
IMG=path/to/cat.jpg
B64=$(base64 -w0 "$IMG")             # mac: base64 -i "$IMG" | tr -d '\n'
MIME=$(file -b --mime-type "$IMG")

REF_ID=$(curl -s --ssl-no-revoke -X POST https://gen-api.ggrn.pro/api/reference-images \
  -H 'Content-Type: application/json' \
  -d "$(jq -n --arg data "$B64" --arg mime "$MIME" \
        '{data:$data, mime_type:$mime}')" \
  | jq -r '.id')

echo "uploaded ref $REF_ID"

curl -sN --ssl-no-revoke -X POST https://gen-api.ggrn.pro/api/generate \
  -H 'Content-Type: application/json' \
  -d "$(jq -n --arg prompt 'add a tiny red hat to the cat' --arg ref "$REF_ID" \
        '{prompt:$prompt, resolution:"1K", aspectRatio:"1:1", imageCount:1,
          referenceImageIds:[$ref]}')"
```

### PowerShell example (Windows)

```powershell
$img  = 'C:\path\to\cat.jpg'
$b64  = [Convert]::ToBase64String([IO.File]::ReadAllBytes($img))
$mime = 'image/jpeg'

$ref = Invoke-RestMethod -Method Post `
  -Uri 'https://gen-api.ggrn.pro/api/reference-images' `
  -ContentType 'application/json' `
  -Body (@{ data=$b64; mime_type=$mime } | ConvertTo-Json)

$body = @{
  prompt             = 'add a tiny red hat to the cat'
  resolution         = '1K'
  aspectRatio        = '1:1'
  imageCount         = 1
  referenceImageIds  = @($ref.id)
} | ConvertTo-Json

Invoke-WebRequest -Method Post `
  -Uri 'https://gen-api.ggrn.pro/api/generate' `
  -ContentType 'application/json' `
  -Body $body -UseBasicParsing | Select-Object -ExpandProperty Content
```

---

## 3. Downloading a generated image

Two options:

### 3a. Directly from R2 (no extra server hop)

```
https://generator-images.ggrn.pro/<storage_path>
```

e.g. `https://generator-images.ggrn.pro/generated-images/<batch>/<img>.jpg`.
Works from browsers and anywhere else — public, CDN-cached, no auth.

### 3b. Via our proxy (forces Content-Disposition: attachment, sets filename)

```
GET https://gen-api.ggrn.pro/api/download?url=<encoded R2 URL>&filename=<name.ext>
```

Example:
```bash
curl -sL --ssl-no-revoke \
  'https://gen-api.ggrn.pro/api/download?url=https%3A%2F%2Fgenerator-images.ggrn.pro%2Fgenerated-images%2F<batch>%2F<img>.jpg&filename=cat.jpg' \
  -o cat.jpg
```

Only R2 public URLs are allowed — anything else returns 400.

---

## 4. Other endpoints you might want

| Method | Path                                      | Purpose |
|---|---|---|
| `GET`    | `/api/batches?limit=50&before=<iso>`      | List recent batches with their images + reference images |
| `GET`    | `/api/images/:id`                         | Single image row + URLs |
| `PATCH`  | `/api/batches/:id`                        | Body `{"liked":true}` — toggle like |
| `DELETE` | `/api/batches/:id`                        | Cascade-delete batch + images + R2 objects |
| `DELETE` | `/api/images/:id`                         | Delete a single image + its R2 object |
| `GET`    | `/api/keys`                               | List Gemini API keys (no key_value returned) |
| `POST`   | `/api/keys`                               | Body `{key_value, comment, key_type:"studio"\|"vertex"}` |
| `POST`   | `/api/keys/:id/reset-cooldown`            | Clear a key's cooldown state |
| `DELETE` | `/api/keys/:id`                           | Remove a key |

---

## 5. Error handling cheat sheet

| What you see | Meaning | Fix |
|---|---|---|
| `done` event with `status:"error"` and `exhaustion_reason:"rate_limit"` | All keys returned 429 | Wait, or add more keys |
| `exhaustion_reason:"cooldown"` | All keys are on the hour-long fatal cooldown | Check keys for `API_KEY_SERVICE_BLOCKED`, enable "Generative Language API" in their GCP project |
| `exhaustion_reason:"blocked"` | Prompt / generated image hit Gemini safety filter | Rewrite the prompt |
| `exhaustion_reason:"timeout"` | 10-minute absolute cap hit after many transient failures | Usually Google was having a bad day — retry later |
| HTTP 400 from `/api/generate` | Malformed body (missing `prompt`, bad JSON) | Check the request body |
| HTTP 403 + `error:"CORS not allowed"` | Origin not in allowlist and not `*.vercel.app` | Use `curl` (no Origin header) or request from an allowed origin |

---

## 6. Parsing SSE in Node / Bun

```js
const res = await fetch('https://gen-api.ggrn.pro/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'a green apple',
    resolution: '1K',
    aspectRatio: '1:1',
    imageCount: 1,
  }),
});

const reader  = res.body.getReader();
const decoder = new TextDecoder();
let buf = '';

while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  buf += decoder.decode(value, { stream: true });

  let idx;
  while ((idx = buf.indexOf('\n\n')) !== -1) {
    const raw = buf.slice(0, idx);
    buf = buf.slice(idx + 2);

    let event = 'message', data = '';
    for (const line of raw.split('\n')) {
      if (line.startsWith('event:')) event = line.slice(6).trim();
      else if (line.startsWith('data:')) data += line.slice(5).trim();
    }
    if (!data) continue;

    const payload = JSON.parse(data);
    if (event === 'image' && payload.status === 'done') {
      console.log('ready:', payload.image_url);
    }
  }
}
```

---

## 7. Minimal "does it work?" smoke test

```bash
curl -s  --ssl-no-revoke https://gen-api.ggrn.pro/health                                               # infra
curl -sN --ssl-no-revoke -X POST https://gen-api.ggrn.pro/api/generate \                               # e2e
  -H 'Content-Type: application/json' \
  -d '{"prompt":"a red circle","resolution":"1K","aspectRatio":"1:1","imageCount":1}' \
  | grep -m1 '"status":"done"'
```

If you see `"status":"done"` within ~30 seconds, the whole pipeline works:
DB insert → Gemini call → R2 upload → SSE stream.
