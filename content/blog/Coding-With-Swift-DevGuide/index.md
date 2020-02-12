---
title: Build a Physics Engine from Scratch - Swift Series 3.1/5
date: "2020-02-12T22:12:03.284Z"
description: "MSpriteKit strives to be a general-purpose framework for drawing edges, and volume based nodes in two dimensions. It includes an in-built view renderer, while offering a simple programming interface..."
---

After 2 weeks, I present the developer guide for MSpriteKit and how it relates to the Game Engine for Peggle 2.0 - PEGEngine.

---

## Architecture

Figure 1: Relationship between MSpriteKit, PEGEngine and GameController

### MSpriteKit

MSpriteKit strives to be a general-purpose framework for drawing edges, and volume based nodes in two dimensions. It includes an in-built view renderer, while offering a simple programming interface to make it easy to create games and other graphics-intensive apps. Equipped with a set of animations and physics behaviors, you can quickly add life to your visual elements.

Figure 2: General Architecture of MSpriteKit

### PEGEngine

A game engine built on top of MSpriteKit specifically made for a remade Peggle 2.0 (see [1]).The game engine encapsulates the game objects and their behaviors when interacting with other game objects.

Figure 3: General Architecture of PEGEngine

## Physics

Figure 4: Resolving collisions

## References

[more about peggle](https://cs3217.netlify.com/docs/problem-sets/problem-set-2)

[spritekit](https://developer.apple.com/documentation/spritekit)

[swift docs](https://swift.org/documentation/)
