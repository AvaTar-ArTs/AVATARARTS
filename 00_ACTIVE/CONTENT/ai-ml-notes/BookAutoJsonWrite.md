# The Proper Way to Make Calls to ChatGPT API

## How to make reliable calls to ChatGPT API to build robust applications

![Lucas Oliveira](https://miro.medium.com/v2/resize:fill:88:88/1*aCCClG-jSoIsK78-iBwddQ.png)

![Towards Data Science](https://miro.medium.com/v2/resize:fill:48:48/1*CJe3891yB1A1mzMdqemkdg.jpeg)

[Lucas Oliveira](https://lucolivi.medium.com/?source=post_page-----52e635bea8ff--------------------------------)

·

Follow

Published in

Towards Data Science

·

11 min read

·

Jul 15, 2023



131









LLMs are everywhere now, especially ChatGPT. There are a ton of applications being built on top of it and if you are not, you should give it a try.

![img](https://miro.medium.com/v2/resize:fit:1400/0*fJ9bDkUv2rDzGR9H.png)

Created with Midjourney.

Building applications on top of ChatGPT will likely require you to make several parallel calls. Unfortunately, you are not the only one. With so many applications performing millions of requests per day (KUDOS for their engineering team by the way) often the API will return a “too many requests” error. So we need a good way to deal with such errors while making several parallel calls.

In this small Python tutorial, we will cover these two important topics to efficiently perform calls to ChatGPT API:

1. Perform several calls in parallel
2. Retry calls in case they fail

# 1. Performing several calls in parallel

The simplest way to perform a call is to perform it synchronously, that is, send the request and wait for the response to arrive to continue the program. We can do that simply as follows:

```
import requests

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {OPENAI_API_KEY}"
}

response_json = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json={
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "ping"}],
    "temperature": 0
}).json()

print(response_json["choices"][0]["message"]["content"])
Pong!
```

If we are working in a simple system it is fine, however, if we wish to perform several calls in parallel to an API or other resources like a database, we can do it asynchronously for faster responses.

Executing tasks asynchronously will trigger every action and wait for them to finish in parallel, which will reduce the wait time.

A basic way to do this is to create different threads to process each request, however, there is a better way to do it [using async calls](https://realpython.com/async-io-python/).

Doing an async call is often more efficient since you can specify the exact places where your application should wait whereas in traditional threading the system will automatically put threads to wait, which may be suboptimal.

Below we present an example showing the difference between using sync and async calls.

```
# Sync call

import time

def delay_print(msg):
    print(msg, end=" ")
    time.sleep(1)

def sync_print():
    for i in range(10):
        delay_print(i)

start_time = time.time()
sync_print()
print("\n", time.time() - start_time, "seconds.")
0 1 2 3 4 5 6 7 8 9 
 10.019574642181396 seconds.
#Async Call

import asyncio

async def delay_print_async(msg):
    print(msg, end=" ")
    await asyncio.sleep(1)

async def async_print():
    asyncio.gather(*[delay_print_async(i) for i in range(10)])

start_time = time.time()
await async_print()
print("\n", time.time() - start_time, "seconds.")
0.0002448558807373047 seconds.
0 1 2 3 4 5 6 7 8 9 
```

The `asyncio.gather` method will trigger all async calls passed to it and return their results once they are ready.

Unfortunately performing async calls with the `requests` library is not possible. To do it you can use the `aiohttp` library. Below there is an example of how to perform an async call with `aiohttp`.

```
import aiohttp

async def get_completion(content):
    async with aiohttp.ClientSession() as session:
        async with session.post("https://api.openai.com/v1/chat/completions", headers=headers, json={
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": content}],
            "temperature": 0
        }) as resp:

            response_json = await resp.json()
            return response_json["choices"][0]['message']["content"]

await get_completion("Ping")
Pong!
```

As said before, to perform async requests we need to make use of the `asyncio.gather` method.

```
async def get_completion_list(content_list):
    return await asyncio.gather(*[get_completion(content) for content in content_list])

await get_completion_list(["ping", "pong"]*5)
['Pong!',
 'Ping!',
 'Pong!',
 'Ping!',
 'Pong!',
 'Ping!',
 'Pong!',
 'Ping!',
 'Pong!',
 'Ping!']
```

Although this works, performing calls this way is not ideal since we are recreating the session object for every call. We can save resources and time by reusing the same session object like this:

```
async def get_completion(content, session):
    async with session.post("https://api.openai.com/v1/chat/completions", headers=headers, json={
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": content}],
        "temperature": 0
    }) as resp:

        response_json = await resp.json()
        return response_json["choices"][0]['message']["content"]

async def get_completion_list(content_list):
    async with aiohttp.ClientSession() as session:
        return await asyncio.gather(*[get_completion(content, session) for content in content_list])

await get_completion_list(["ping", "pong"]*5)
```

Simple, right? With this, you can easily perform several calls. One problem however is that often it is not a good practice to perform unlimited calls this way since you can overload a system and be penalized preventing you from performing additional requests for some amount of time ([trust me, you will](https://platform.openai.com/docs/guides/rate-limits)). So it is a good idea to limit the amount of calls you can perform at the same time. You can do this easily with the `asyncio.Semaphore` class.

The `Semaphore` class creates a context manager that will manage the amount of async calls that are currently being performed within its context. If the max amount is reached it will block until some of the calls finish.

```
async def get_completion(content, session, semaphore):
    async with semaphore:

        await asyncio.sleep(1)

        async with session.post("https://api.openai.com/v1/chat/completions", headers=headers, json={
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": content}],
            "temperature": 0
        }) as resp:

            response_json = await resp.json()
            return response_json["choices"][0]['message']["content"]

async def get_completion_list(content_list, max_parallel_calls):
    semaphore = asyncio.Semaphore(value=max_parallel_calls)

    async with aiohttp.ClientSession() as session:
        return await asyncio.gather(*[get_completion(content, session, semaphore) for content in content_list])

start_time = time.perf_counter()
completion_list = await get_completion_list(["ping", "pong"]*5, 100)
print("Time elapsed: ", time.perf_counter() - start_time, "seconds.")
print(completion_list)
Time elapsed:  1.8094507199984946 seconds.
['Pong!', 'Ping!', 'Pong!', 'Ping!', 'Pong!', 'Ping!', 'Pong!', 'Ping!', 'Pong!', 'Ping!']
```

An optional thing here is to report how the progress of the calls is going. You can do it by creating a small class that will hold the progress and be shared across all calls. You can do it as the following:

```
class ProgressLog:
    def __init__(self, total):
        self.total = total
        self.done = 0

    def increment(self):
        self.done = self.done + 1

    def __repr__(self):
        return f"Done runs {self.done}/{self.total}."

async def get_completion(content, session, semaphore, progress_log):
    async with semaphore:

        await asyncio.sleep(1)

        async with session.post("https://api.openai.com/v1/chat/completions", headers=headers, json={
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": content}],
            "temperature": 0
        }) as resp:

            response_json = await resp.json()

            progress_log.increment()
            print(progress_log)

            return response_json["choices"][0]['message']["content"]

async def get_completion_list(content_list, max_parallel_calls):
    semaphore = asyncio.Semaphore(value=max_parallel_calls)
    progress_log = ProgressLog(len(content_list))

    async with aiohttp.ClientSession() as session:
        return await asyncio.gather(*[get_completion(content, session, semaphore, progress_log) for content in content_list])

start_time = time.perf_counter()
completion_list = await get_completion_list(["ping", "pong"]*5, 100)
print("Time elapsed: ", time.perf_counter() - start_time, "seconds.")
print(completion_list)
Done runs 1/10.
Done runs 2/10.
Done runs 3/10.
Done runs 4/10.
Done runs 5/10.
Done runs 6/10.
Done runs 7/10.
Done runs 8/10.
Done runs 9/10.
Done runs 10/10.
Time elapsed:  1.755018908999773 seconds.
['Pong!', 'Ping!', 'Pong!', 'Ping!', 'Pong!', 'Ping!', 'Pong!', 'Ping!', 'Pong!', 'Ping!']
```

This completes this section on how to perform multiple async requests. With this, you can perform several async calls, limit the number of calls per time and report the progress. However, there are still some problems to handle.

The requests made can fail for several different reasons like server overload, connection interruption, bad requests, etc. These may generate exceptions or return unpredictable responses so we need to treat these cases and automatically retry failed calls.

# 2. Retry calls in case they fail

To handle failed calls we will make use of the `tenacity` library. Tenacity provides function decorators that will automatically retry our function call in case it generates an exception.

```
from tenacity import (
    retry,
    stop_after_attempt,
    wait_random_exponential,
)
```

To provide a retry functionality to our calls we will need to place the `@retry` decorator. Using it without additional parameters will make the function retry immediately and indefinitely once it fails. This is not good for some reasons.

One is that our function call may fail due to server overload which makes it reasonable to wait some time before trying again. To indicate the time to wait we will use the approach of the exponential backoff using the parameter `wait=wait_random_exponential(min=min_value, max=max_value)`. This will increase the wait time the more the function fails.

One optional thing is to log messages whenever some retry occurs. We can do it by providing some function to the parameter `before_sleep`. Here we will use the `print` function, however, a better way is to use the `logging` module and pass a `logging.error` or `logging.debug` function to this parameter.

To demonstrate we will generate random exceptions.

```
import random

class ProgressLog:
    def __init__(self, total):
        self.total = total
        self.done = 0

    def increment(self):
        self.done = self.done + 1

    def __repr__(self):
        return f"Done runs {self.done}/{self.total}."

@retry(wait=wait_random_exponential(min=1, max=60), before_sleep=print)
async def get_completion(content, session, semaphore, progress_log):
    async with semaphore:

        #await asyncio.sleep(1)
        if random.random() < 0.2:
            raise Exception("Random exception")

        async with session.post("https://api.openai.com/v1/chat/completions", headers=headers, json={
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": content}],
            "temperature": 0
        }) as resp:

            response_json = await resp.json()

            progress_log.increment()
            print(progress_log)

            return response_json["choices"][0]['message']["content"]

async def get_completion_list(content_list, max_parallel_calls):
    semaphore = asyncio.Semaphore(value=max_parallel_calls)
    progress_log = ProgressLog(len(content_list))

    async with aiohttp.ClientSession() as session:
        return await asyncio.gather(*[get_completion(content, session, semaphore, progress_log) for content in content_list])

start_time = time.perf_counter()
completion_list = await get_completion_list(["ping", "pong"]*5, 100)
print("Time elapsed: ", time.perf_counter() - start_time, "seconds.")
print(completion_list)
<RetryCallState 133364377433616: attempt #1; slept for 0.74; last result: failed (Exception Random exception)>
<RetryCallState 133364377424496: attempt #1; slept for 0.79; last result: failed (Exception Random exception)>
Done runs 1/10.
Done runs 2/10.
Done runs 3/10.
Done runs 4/10.
Done runs 5/10.
Done runs 6/10.
Done runs 7/10.
Done runs 8/10.
Done runs 9/10.
Done runs 10/10.
Time elapsed:  1.1305301820011664 seconds.
['Pong!', 'Ping!', 'Pong!', 'Ping!', 'Pong!', 'Ping!', 'Pong!', 'Ping!', 'Pong!', 'Ping!']
```

This will make our function wait some time before retrying it. However, the reason for failure may be systematical due to a server downtime or a bad payload for example. In this case, we want our amount of retries to be limited. We can do it with the parameter `stop=stop_after_attempt(n)`.

```
import random

class ProgressLog:
    def __init__(self, total):
        self.total = total
        self.done = 0

    def increment(self):
        self.done = self.done + 1

    def __repr__(self):
        return f"Done runs {self.done}/{self.total}."

@retry(wait=wait_random_exponential(min=1, max=60), stop=stop_after_attempt(2), before_sleep=print)
async def get_completion(content, session, semaphore, progress_log):
    async with semaphore:

        #await asyncio.sleep(1)
        if random.random() < 0.9:
            raise Exception("Random exception")

        async with session.post("https://api.openai.com/v1/chat/completions", headers=headers, json={
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": content}],
            "temperature": 0
        }) as resp:

            response_json = await resp.json()

            progress_log.increment()
            print(progress_log)

            return response_json["choices"][0]['message']["content"]

async def get_completion_list(content_list, max_parallel_calls):
    semaphore = asyncio.Semaphore(value=max_parallel_calls)
    progress_log = ProgressLog(len(content_list))

    async with aiohttp.ClientSession() as session:
        return await asyncio.gather(*[get_completion(content, session, semaphore, progress_log) for content in content_list])

start_time = time.perf_counter()
completion_list = await get_completion_list(["ping", "pong"]*5, 100)
print("Time elapsed: ", time.perf_counter() - start_time, "seconds.")
print(completion_list)
<RetryCallState 133364608660048: attempt #1; slept for 0.1; last result: failed (Exception Random exception)>
<RetryCallState 133364377435680: attempt #1; slept for 0.71; last result: failed (Exception Random exception)>
<RetryCallState 133364377421472: attempt #1; slept for 0.17; last result: failed (Exception Random exception)>
<RetryCallState 133364377424256: attempt #1; slept for 0.37; last result: failed (Exception Random exception)>
<RetryCallState 133364377430928: attempt #1; slept for 0.87; last result: failed (Exception Random exception)>
<RetryCallState 133364377420752: attempt #1; slept for 0.42; last result: failed (Exception Random exception)>
<RetryCallState 133364377422576: attempt #1; slept for 0.47; last result: failed (Exception Random exception)>
<RetryCallState 133364377431312: attempt #1; slept for 0.11; last result: failed (Exception Random exception)>
<RetryCallState 133364377425840: attempt #1; slept for 0.69; last result: failed (Exception Random exception)>
<RetryCallState 133364377424592: attempt #1; slept for 0.89; last result: failed (Exception Random exception)>
---------------------------------------------------------------------------
Exception                                 Traceback (most recent call last)
/usr/local/lib/python3.10/dist-packages/tenacity/_asyncio.py in __call__(self, fn, *args, **kwargs)
     49                 try:
---> 50                     result = await fn(*args, **kwargs)
     51                 except BaseException:  # noqa: B902

5 frames
Exception: Random exception

The above exception was the direct cause of the following exception:

RetryError                                Traceback (most recent call last)
/usr/local/lib/python3.10/dist-packages/tenacity/__init__.py in iter(self, retry_state)
    324             if self.reraise:
    325                 raise retry_exc.reraise()
--> 326             raise retry_exc from fut.exception()
    327 
    328         if self.wait:

RetryError: RetryError[<Future at 0x794b5057a590 state=finished raised Exception>]
```

With this parameter set a `RetryError` will raise once the amount of tries reaches the maximum value. However, it may be the case that we want to continue our running without generating an exception, just saving a `None` value to the call return to handle it later. To do it we can use the callback function `retry_error_callback` to just return the `None` value in case a `RetryError` error occurs:

```
import random

class ProgressLog:
    def __init__(self, total):
        self.total = total
        self.done = 0

    def increment(self):
        self.done = self.done + 1

    def __repr__(self):
        return f"Done runs {self.done}/{self.total}."

@retry(wait=wait_random_exponential(min=1, max=60), stop=stop_after_attempt(2), before_sleep=print, retry_error_callback=lambda _: None)
async def get_completion(content, session, semaphore, progress_log):
    async with semaphore:

        #await asyncio.sleep(1)
        if random.random() < 0.7:
            raise Exception("Random exception")

        async with session.post("https://api.openai.com/v1/chat/completions", headers=headers, json={
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": content}],
            "temperature": 0
        }) as resp:

            response_json = await resp.json()

            progress_log.increment()
            print(progress_log)

            return response_json["choices"][0]['message']["content"]

async def get_completion_list(content_list, max_parallel_calls):
    semaphore = asyncio.Semaphore(value=max_parallel_calls)
    progress_log = ProgressLog(len(content_list))

    async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(1)) as session:
        return await asyncio.gather(*[get_completion(content, session, semaphore, progress_log) for content in content_list])

start_time = time.perf_counter()
completion_list = await get_completion_list(["ping", "pong"]*5, 100)
print("Time elapsed: ", time.perf_counter() - start_time, "seconds.")
print(completion_list)
<RetryCallState 133364377805024: attempt #1; slept for 0.22; last result: failed (Exception Random exception)>
<RetryCallState 133364377799456: attempt #1; slept for 0.53; last result: failed (Exception Random exception)>
<RetryCallState 133364377801328: attempt #1; slept for 0.24; last result: failed (Exception Random exception)>
<RetryCallState 133364377810208: attempt #1; slept for 0.38; last result: failed (Exception Random exception)>
<RetryCallState 133364377801616: attempt #1; slept for 0.54; last result: failed (Exception Random exception)>
<RetryCallState 133364377422096: attempt #1; slept for 0.59; last result: failed (Exception Random exception)>
<RetryCallState 133364377430592: attempt #1; slept for 0.07; last result: failed (Exception Random exception)>
<RetryCallState 133364377425648: attempt #1; slept for 0.05; last result: failed (Exception Random exception)>
Done runs 1/10.
Done runs 2/10.
Done runs 3/10.
Time elapsed:  2.6409040250000544 seconds.
['Pong!', 'Ping!', None, None, None, None, None, 'Ping!', None, None]
```

With this, `None` values will be returned instead of generating errors.

One problem not handled yet is the stuck connection problem. This happens when we perform a request and for some reason, the host holds the connection but neither fails nor returns something. To handle such cases we need to place a timeout to return in case the call doesn’t return a value within a given period. To do it we can use use the `timeout` parameter from the `aiohttp` library together with the `aiohttp.ClientTimeout` class. In case a timeout occurs here, a `TimeoutError` will be raised, which will then be handled by the `retry` decorator from `tenacity` and automatically run the function again.

```
class ProgressLog:
    def __init__(self, total):
        self.total = total
        self.done = 0

    def increment(self):
        self.done = self.done + 1

    def __repr__(self):
        return f"Done runs {self.done}/{self.total}."

@retry(wait=wait_random_exponential(min=1, max=60), stop=stop_after_attempt(20), before_sleep=print, retry_error_callback=lambda _: None)
async def get_completion(content, session, semaphore, progress_log):
    async with semaphore:

        async with session.post("https://api.openai.com/v1/chat/completions", headers=headers, json={
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": content}],
            "temperature": 0
        }) as resp:

            response_json = await resp.json()

            progress_log.increment()
            print(progress_log)

            return response_json["choices"][0]['message']["content"]

async def get_completion_list(content_list, max_parallel_calls):
    semaphore = asyncio.Semaphore(value=max_parallel_calls)
    progress_log = ProgressLog(len(content_list))

    async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(10)) as session:
        return await asyncio.gather(*[get_completion(content, session, semaphore, progress_log) for content in content_list])

start_time = time.perf_counter()
completion_list = await get_completion_list(["ping", "pong"]*100, 100)
print("Time elapsed: ", time.perf_counter() - start_time, "seconds.")
<RetryCallState 133364375201936: attempt #1; slept for 0.57; last result: failed (TimeoutError )>
Time elapsed:  12.705538211999738 seconds.
```

Great! Now we have a robust way to run multiple parallel requests that will automatically retry in case some failure occurs and return `None` values in case the failure is systematic. So the final code will be as follows:

```
import asyncio
import aiohttp
from tenacity import (
    retry,
    stop_after_attempt,
    wait_random_exponential,
)

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {OPENAI_API_KEY}"
}

class ProgressLog:
    def __init__(self, total):
        self.total = total
        self.done = 0

    def increment(self):
        self.done = self.done + 1

    def __repr__(self):
        return f"Done runs {self.done}/{self.total}."

@retry(wait=wait_random_exponential(min=1, max=60), stop=stop_after_attempt(20), before_sleep=print, retry_error_callback=lambda _: None)
async def get_completion(content, session, semaphore, progress_log):
    async with semaphore:

        async with session.post("https://api.openai.com/v1/chat/completions", headers=headers, json={
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": content}],
            "temperature": 0
        }) as resp:

            response_json = await resp.json()

            progress_log.increment()
            print(progress_log)

            return response_json["choices"][0]['message']["content"]

async def get_completion_list(content_list, max_parallel_calls, timeout):
    semaphore = asyncio.Semaphore(value=max_parallel_calls)
    progress_log = ProgressLog(len(content_list))

    async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(timeout)) as session:
        return await asyncio.gather(*[get_completion(content, session, semaphore, progress_log) for content in content_list])
```

In summary, we have implemented the following features:

1. Asynchronous calls to reduce wait time.
2. Logging async calls progress.
3. Automatically trigger retries when a call fails.
4. Return None values in case the fails are systematical.
5. Retry a call when it timeouts and doesn’t return anything.

If you have any questions, found some error, or have any ideas on how to improve this leave a comment below!