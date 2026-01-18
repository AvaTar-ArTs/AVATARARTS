# ideoGram

[Untitled](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Untitled%2016e36221d8b2804c9d42c02f508b19a0.csv)

### [Youtube GPT, start a chat with a video | by Daniel Avila | LatinXinAI | Medium](https://medium.com/latinxinai/youtube-gpt-start-a-chat-with-a-video-efe92a499e60)

To start you must have an OpenAI account and add your API Key, then paste the URL of any video on Youtube.

![](https://miro.medium.com/v2/resize:fit:1400/1*u2tHo7rSCzK0MigSoOzpkw.png)

In this example I am using the following Streamlit video:

Click on Start Analysis, so that Youtube GPT performs the transcription of the video with OpenAI Whisper.

## OpenAI Whisper Transcription

The transcript will be uploaded in the “Transcription” tab.

![](https://miro.medium.com/v2/resize:fit:1400/1*Bosvmdgs9f5-n9TJD7Xeog.png)

# Get the video

youtube_video = YouTube(youtube_link)streams = youtube_video.streams.filter(only_audio=True)mp4_video = stream.download(filename='youtube_video.mp4')audio_file = open(mp4_video, 'rb')

# whisper load base model

model = whisper.load_model('base')

# Whisper transcription

output = model.transcribe("youtube_video.mp4")

![](https://miro.medium.com/v2/resize:fit:1400/1*EqwLYSTNYbJPTY-ex_ulww.png)

![](https://miro.medium.com/v2/resize:fit:1400/1*WD1BTTRXkhvS8ob2_0zpEA.png)

## OpenAI Embedding with text-embedding-ada-002

In the same process, the “embedding” of each segment of the video is carried out. You can see each segment with its respective embedding tokens in the “Embeddings” tab

# Embeddings

segments = output['segments']for segment in segments:openai.api_key = user_secretresponse = openai.Embedding.create(input= segment["text"].strip(),model="text-embedding-ada-002")embeddings = response['data'][0]['embedding']meta = {"text": segment["text"].strip(),"start": segment['start'],"end": segment['end'],"embedding": embeddings}data.append(meta)pd.DataFrame(data).to_csv('word_embeddings.csv')

![](https://miro.medium.com/v2/resize:fit:1400/1*ErWVlQVHc6FdfBu_MH1Pyw.png)

## OpenAI GPT-3

And finally, you can start asking questions about the video in the “Chat with the video” tab.

completions = openai.Completion.create(engine = "text-davinci-003",prompt = one_shot_prompt,max_tokens = 1024,n = 1,stop=["Q:"],temperature=0.5,)message = completions.choices[0].textreturn message

![](https://miro.medium.com/v2/resize:fit:1400/1*oteiDHsUag2Rv5q-1PK97A.png)

> Github Repo: [https://github.com/davila7/youtube-gpt](https://github.com/davila7/youtube-gpt)
> 

Follow me if you want to see more projects with this incredible technology

# Youtube GPT, start a chat with a video

![](https://miro.medium.com/v2/resize:fill:88:88/1*nx-R8hfMICkqKU8BZ-1EUQ.png)

![](https://miro.medium.com/v2/resize:fill:48:48/1*eG8aD-RrHFrcgiJRxeRrcA.png)

[Daniel Avila](https://medium.com/@dan.avila7?source=post%5Fpage---byline--efe92a499e60---------------------------------------)

·

Follow

Published in

[LatinXinAI](https://medium.com/latinxinai?source=post%5Fpage---byline--efe92a499e60---------------------------------------)

·

3 min read

·

Feb 8, 2023

134

3

[Listen](https://medium.com/plans?dimension=post%5Faudio%5Fbutton&postId=efe92a499e60&source=upgrade%5Fmembership---post%5Faudio%5Fbutton-----------------------------------------)

Share

More

Looking to hide highlights? You can now hide them from the “•••” menu.

Okay, got it

In this article, I will show you how YouTube GPT works

![](https://miro.medium.com/v2/resize:fit:1400/1*HRdpHJRzkD81Z9WdGFu9lg.png)

YouTube GPT is a tool that allows you to transcribe videos and then start a conversation about the content of the video.

> Note that to run Youtube GPT you must have credits in your OpenAI account.
> 

# Demo

Start a chat with this video of Microsoft CEO Satya Nadella’s interview.

[Youtubegpt - a Hugging Face Space by davila7Discover amazing ML apps made by the communityhuggingface.co](https://huggingface.co/spaces/davila7/youtubegpt?source=post%5Fpage-----efe92a499e60---------------------------------------)

# Code GPT

All the code of this project was written with [Code GPT](https://codegpt.co) 💪

![](https://miro.medium.com/v2/resize:fit:1400/1*POEVMCNQMhgSEbn3OqCuow.png)

Visit [https://codegpt.co](https://codegpt.co) to get the extension

[[[🔗 link]](https://developer.ideogram.ai/api-reference/api-reference/generate) — Generates images synchronously based on a given prompt and optional parameters.

Images links are available for a limited period of time; if you would like to keep the image, you must download it.](ideoGram%2015b36221d8b280918368e1dcfdedff3c/%5B%F0%9F%94%97%20link%5D%20%E2%80%94%20Generates%20images%20synchronously%20based%20on%20d0aaf02f44784c2b8c1235a33f6ad9fa.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%203fabea797b7b4f9ca3aba962433cb57b.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%20956c3757ed8c4ab8b385c53e831e3e22.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%20635efcc1f4134137b60e3c26d87eef4c.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%20bd14b65795574ae7af3f0ff677eb3ccc.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%20e23202146bb04dc2a6f48edd25f2c990.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%20713ebae570324151a38f2b770ec6d789.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%200f011fe66c0e4c42aa4488e8e94e7d89.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%2063f2eda7daed45be94aeedf7be099429.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%2012f691d42cac4de7bed893ff8717ca54.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%20280bddfc275243c4ba3ac48b40c5757d.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%206b2d902c59714276b7746e1137f10399.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%202fb69ebfab834e7e93c7fcb9d4bbfc9b.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%20503ca1e575ee4fe4bb63853fe3c16841.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%201fadded34db449ce87e2cdfe5803d143.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%20e6ed23c686804bf6abadfcc0c25df7c6.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%200d649846d9924a67aaa8714f05d5c4bd.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%2091c703dfdffd4de4aee9ed248db7d762.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%206721b3e12258409899ae03f1a23611ce.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%201a50b0979cee452db3998f53dbb342c3.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%2045fdf9a339c94311a3594d9b97e24b9d.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%207ef19e6d35774cb58318ebd77603c080.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%20e9438bbd85dc4780b7a6917e2b7e161d.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%204fde6270a4784f7297f731db512ee424.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%204abb5036fee643d8918092f3a8a8ed44.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%20f6bfc7a95f3046a0acec768e822df7fc.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%201d15c8406d324ad08344530123de5117.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%20a18e53a5d6c94df6ba4e8cbdbdcf3651.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%20400bb01fc5ef418e85559ff702c481f7.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%2088365819eff5421a882b997b9c001e8d.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%209fe38826c2c24b0680a2cbea35d39b7e.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%2066d407ba09084a828dc5af6aa5021e2e.md)

[[Ideogram](https://ideogram.ai/g/FIbM8cFSRfi6bxN1JcXk2A/0)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%206e6a2c9d9a594c3b938049d49a76ff0e.md)

[[Sora](https://sora.com/library)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Sora%20d1b91de9a6b44f2391cbac892f2adff0.md)

[[Ideogram](https://ideogram.ai/t/explore?f=t-shirt)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%208e6e2bcdcc63496f9e690f5f6b8f366f.md)

[[Ideogram](https://ideogram.ai/t/explore?f=t-shirt)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%20b2f78f744dbb42849926f6a729d2f52d.md)

[[Ideogram](https://ideogram.ai/t/explore?f=t-shirt)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%2030c2c3aefac54b2196bf07d188c1e840.md)

[[Ideogram](https://ideogram.ai/t/explore?f=t-shirt)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%2047d976b34c0e4865bc4577401c4f59bb.md)

[[Ideogram](https://ideogram.ai/t/explore?f=t-shirt)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%20334cf2d1e50f4dbf8e2853b4ea2a5c66.md)

[[Ideogram](https://ideogram.ai/t/explore?f=t-shirt)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%20f2ce2dcb37694caf9da08b96bc36f09c.md)

[[Ideogram](https://ideogram.ai/t/explore?f=poster)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%20f1eb66a7ad3e4478836883ded3b6bae7.md)

[[[🔗 link]](https://ideogram.ai/t/explore?f=t-shirt) — Image generation for everyone](ideoGram%2015b36221d8b280918368e1dcfdedff3c/%5B%F0%9F%94%97%20link%5D%20%E2%80%94%20Image%20generation%20for%20everyone%200344bd8c010047c09380df6a7754d962.md)

[[[🔗 link]](https://ideogram.ai/t/explore?f=t-shirt) — Image generation for everyone](ideoGram%2015b36221d8b280918368e1dcfdedff3c/%5B%F0%9F%94%97%20link%5D%20%E2%80%94%20Image%20generation%20for%20everyone%2025f0c87a6c9b4d468adf230a65d9d5f5.md)

[[Ideogram](https://ideogram.ai/t/explore?f=t-shirt)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%20101487db54244ba992a2283f98e73c19.md)

[[Ideogram](https://ideogram.ai/t/explore?f=t-shirt)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%200b5afbf311064cbe8804d8b25c7c44b3.md)

[[Ideogram](https://ideogram.ai/t/explore?f=t-shirt)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%20ef9a366568304b3f9e2c9a5ad23cdad9.md)

[[Ideogram](https://ideogram.ai/t/explore?f=t-shirt)](ideoGram%2015b36221d8b280918368e1dcfdedff3c/Ideogram%20854ae019dce240909fa9a57f351af8da.md)