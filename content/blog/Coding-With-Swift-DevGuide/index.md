---
title: Build a Physics Engine from Scratch - Swift Series 3.1/5
date: "2020-02-12T22:12:03.284Z"
description: "MSpriteKit strives to be a general-purpose framework for drawing edges, and volume based nodes in two dimensions. It includes an in-built view renderer, while offering a simple programming interface..."
---

After 2 weeks, I present the developer guide for MSpriteKit and how it relates to the Game Engine for Peggle 2.0 - PEGEngine.

---

## Architecture

### General

The 3 main components of the Peggle2.0Game are:

- MSpriteKit: Foundation, supplying the Physics Engine, Scene builders and View Renderer
- PEGEngine: A Peggle2.0 specific engine which specifies the appearance and behaviors of game objects
- GameViewContoller: The root view controller of the app, which setups a pre-loaded `Board` into the View, and start the Game Loop running.

![Figure 1: Relationship between MSpriteKit, PEGEngine and GameController](PS3_Fig1.png)
_Figure 1: Relationship between MSpriteKit, PEGEngine and GameController_

### MSpriteKit

MSpriteKit strives to be a general-purpose framework for drawing edges, and volume based nodes in two dimensions. It includes an in-built view renderer, while offering a simple programming interface to make it easy to create games and other graphics-intensive apps. Equipped with a set of animations and physics behaviors, you can quickly add life to your visual elements.

MSpriteKit, like the original SpriteKit by Apple, is split into 3 distinct components:

- Base: `MKNode`

- Scene Building and View Renderer: Display visual content using MSpriteKit.

  - `MKView`: MSpriteKit's inbuilt view renderer, equipped with a game loop to refresh the view per frame.
  - `MKScene`: An object that organizes all of the active MSpriteKit content.
  - `MKSpriteNode`, `MKEdgeNode`: Onscreen graphical elements that can be initialized from an image, a solid color or as an edge.

- Physics Simulation: Add physics behaviors to nodes in your scene.

  - `MKPhysicsWorld`: The driver of the physics engine in a scene; it exposes the ability for you to configure and query the physics system.
  - `MKPhysicsBody`: An object that adds physics simulation to a node.
  - `MKPhysicsContact`: A description of the contact between two physics bodies.
  - protocol `MKPhysicsContactDelegate`: Methods your app can implement to respond when physics bodies come into contact.

![General Architecture of MSpriteKit](MSpriteKitGeneral.png)
_Figure 2: General Architecture of MSpriteKit (more on specific classes in Figure 3)_

### PEGEngine

A game engine built on top of MSpriteKit specifically made for a remade Peggle 2.0 (see [1]).The game engine encapsulates the game objects and their behaviors when interacting with other game objects.

Figure 3: General Architecture of PEGEngine

## Physics

Figure 4: Resolving collisions

## References

[more about peggle](https://cs3217.netlify.com/docs/problem-sets/problem-set-2)

[spritekit](https://developer.apple.com/documentation/spritekit)

[swift docs](https://swift.org/documentation/)
