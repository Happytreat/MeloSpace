---
title: My Reflection on React Native vs Flutter
date: "2019-09-01T22:12:03.284Z"
description: " React Native allows one to utilise native components by running code through the native JS Engine and a Native JS Bridge, where Flutter uses virtual components. ..."
---

#### CS3216

This semester, I am enrolled in [CS3216](https://www.cs3216.com) - Software Product Engineering for Digital Markets. Each week, we have different presenters come talk to us about different topics that might help us in developing innovative products that will gain traction in the market. Last week, we had a representatives from 2 companies talk about Cross Platform Mobile Application Development. One of them have been using React Native for their products and the other used Flutter. I'd like to share my reflection about the discussion, for the future self and also for anyone that might want to hear more about what I've to say.

#### React Native and Flutter

I've learnt more about Flutter and React native technology such as how they work under the hood - React Native allows one to utilise native components by running code through the native JS Engine and a Native JS Bridge, where Flutter uses virtual components. Even though I have heard of both Flutter and RN before, understanding briefly how both tech worked under the hood made me understood deeper many pros and cons discussed by the presenters yesterday. For instance, RN preserve the native feel if you want your app to "feel" the same as other native apps. Meanwhile, you might be able to do more animations/interactive UI with Flutter and not RN. Scalability issues of RN include having just a single JS bundle (compared to the JS web you could have multiple bundles using Webpack and code-splitting to lighten the load). Flutter seems to manage scalability just fine. However for both technology, while they might thrives on high-end modern phones, low-end phone suffer in terms of performance.

#### Right Tool for the Right Job

This leads me to the next point I've learnt: use the Right Tool for the Right Job. Both Flutter and RN have pros and cons, I should focus on what my product needs and what I aim to achieve as a benchmark for selecting the tech stack. Cross-platform development is awesome because as mentioned by the second presenter (on RN), one key reason why Shopee uses RN is to match product development with business growth -- a point I can relate to from interning at a startup. It is much more cost-saving to just maintain one code base that can also reuse components used in the web.

#### Be Prepared for Breaking Changes

Lastly, a point that was mentioned on both presentation struck me: how open-source tools like RN or iOS make breaking changes all the time. That influences how we should try to avoid using third party libraries as best as possible in production and also have end-to-end testing like Cypress to make sure that with an upgrade, features work the same way they do. This can be a complicated process because we might have to test on different environment/platforms or browsers. In production, we have to also be updated on the latest issues/changes of a tool we are using and be ready to dig into the source code and fix changes ourselves.


