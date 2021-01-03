---
title: "Testing Python3 Context Managers"
date: "2020-09-14T22:12:03.284Z"
description: "Python3 Context managers are beneficial tools for resource handling that involves locks and files. However, it might not be straightforward to test/mock..."
---

Python3 Context managers are beneficial tools for resource handling that involves locks and files. A common context manager is the in-built `open` function. Despite their benefits, context managers might not be straightforward to test/mock.

This post serve as a personal note on testing context managers and their async counterparts using `unittest` module.

## Testing Context Manager

For example lets consider how we can mock the in-built `open` function:

```python
from contextlib import contextmanager
from unittest import TestCase, main
from unittest.mock import mock_open

class TestContextManager(TestCase):
    def test_context_manager(self):
        with patch('builtins.open', mock_open(read_data="some string")):
            with open('/some/path', 'r') as f:
                self.assertEqual(f.read(), 'some string')
```

Notice that there is a convenient helper `mock_open` function provided by `unittest`.

Similarly we can also test an arbitrary context manager as follows (this example tests `open` without using the `mock_open` helper):

```python
class TestContextManager(TestCase):
    # Notice that open_mock isn't the context manager but
    # instead return the context manager
    @patch('builtins.open')
    def test_open_manually(self, open_mock):
        mock_file = MagicMock()
        mock_file.read.return_value = 'some string'
        open_mock.return_value.__enter__.return_value = mock_file
        with open('/some/path', 'r') as f:
            self.assertEqual(f.read(), 'some string')
```

## Testing Async Context Manager

Next, let's consider an arbitrary async context manager (we can use the `@asynccontextmanager` decorator).

```python
import asyncio
from contextlib import asynccontextmanager

@asynccontextmanager
async def some_async_cm():
    try:
        # perform async operations
        await asyncio.sleep(1)
        return 'result'
    finally:
        # release resources
        pass

async def async_function():
    async with some_async_cm() as result:
        return result
```

We can then create a mock async context manager as follows:

```python
from unittest import IsolatedAsyncioTestCase
from unittest.mock import MagicMock

class MockAsyncContextManager(MagicMock):
    async def __aenter__(self, *args, **kwargs):
        return self.__enter__(self, *args, **kwargs)

    async def __aexit__(self, *args, **kwargs):
        return self.__exit__(self, *args, **kwargs)

class TestAsyncContextManager(IsolatedAsyncioTestCase):
    @patch('__main__.some_async_cm')
    async def test_async_context_manager(self, mock_async_cm):
        mock_async_cm.return_value = MockAsyncContextManager()
        mock_async_cm.return_value.__aenter__.return_value = 'result'

        result = await async_function()
        self.assertEqual(result, 'result')
        mock_async_cm.assert_called_once()
```

---

## References

1. [https://medium.com/@yeraydiazdiaz/what-the-mock-cheatsheet-mocking-in-python-6a71db997832](https://medium.com/@yeraydiazdiaz/what-the-mock-cheatsheet-mocking-in-python-6a71db997832)

2. [https://devguide.python.org/runtests/](https://devguide.python.org/runtests/)

3. [https://docs.python.org/3.8/library/unittest.html#unittest.IsolatedAsyncioTestCase](https://docs.python.org/3.8/library/unittest.html#unittest.IsolatedAsyncioTestCase)
