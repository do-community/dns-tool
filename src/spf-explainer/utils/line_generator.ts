/*
Copyright 2019 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// Defines the main gap size.
const mainGapSize = 8

// The line multiplier.
const lineMultiplier = 0.05

// Defines the line color.
const lineColor = "#000000"

// Check if 2 numbers are in the range of x (a/b are compared).
const within = (x: number, a: number, b: number) => {
    let larger, smaller
    if (a > b) {
        larger = a
        smaller = b
    } else {
        larger = b
        smaller = a
    }
    return x >= (larger - smaller)
}

// Adds the offset.
const addOffset = (y: number) => {
    return y + window.pageYOffset
}

// Renders a claw for the final part. It should look a bit like this:
// |-- (line 20px)
// |
// |  (line is height of object)
// |
// |-- (line 20px)
const drawClaw = (x: number, top: number, bottom: number, generator: LineGenerator, svg: SVGSVGElement) => {
    // Draw the core middle line.
    generator.drawLine(svg, lineColor, x, x, top, bottom)

    // Draw the claws.
    generator.drawLine(svg, lineColor, x, x + 20, top, top)
    generator.drawLine(svg, lineColor, x, x + 20, bottom, bottom)
}

// A lock. Only one line generator can run at once.
// While initialising a line generator does block, it's also doing a bunch of things where there is a opportunity for another function to be ran inbetween, causing a race condition.
let lock = false

// The main line generator class.
export default class LineGenerator {
    public a!: HTMLElement
    public b!: HTMLElement
    public lineDiv!: HTMLElement
    public destroyed: boolean
    public downX: number | undefined
    public visible: boolean

    public constructor(a: HTMLElement, b: HTMLElement) {
        this.a = a
        this.b = b
        this.downX = Math.floor(window.innerWidth * lineMultiplier)
        this.destroyed = false
        this.visible = false
        const f = () => {
            if (!lock) this.setup()
            else setTimeout(f, 5)
        }
        f()
    }

    private _createContainer() {
        const div = document.createElement("div")
        div.style.position = "absolute"
        div.style.top = "0"
        div.style.left = "0"
        div.style.overflow = "show"
        div.style.pointerEvents = "none"
        document.body.appendChild(div)
        return div
    }

    private _createInnerSvg(container: HTMLDivElement) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svg.setAttribute("overflow", "visible")
        container.appendChild(svg)
        return svg
    }

    public drawLine(svg: SVGSVGElement, stroke: string, x1: number, x2: number, y1: number, y2: number) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
        line.setAttribute("stroke", stroke)
        line.setAttribute("stroke-width", "1")
        line.setAttribute("x1", x1.toString())
        line.setAttribute("x2", x2.toString())
        line.setAttribute("y1", addOffset(y1).toString())
        line.setAttribute("y2", addOffset(y2).toString())
        svg.appendChild(line)
    }

    public setup() {
        // Locks the initialiser.
        lock = true

        // Gets the positions of A/B.
        const aRect = this.a.getBoundingClientRect() as DOMRect
        const bRect = this.b.getBoundingClientRect()
        const aTop = aRect.top
        const bTop = bRect.top + Math.floor(bRect.height / 2)

        // Makes the div container.
        const container = this._createContainer()
        this.lineDiv = container

        // Makes the inner SVG.
        const svg = this._createInnerSvg(container)

        // Gets the left side of B.
        const bLeft = bRect.left - mainGapSize

        try {
            // If bLeft is less than 0, return.
            if (0 > bLeft) return

            // Gets the best pathway to point A.
            const aParentRect = this.a.parentElement!.getBoundingClientRect() as DOMRect
            let aBestY = aTop - 4
            let aTouch = aTop
            let top = true
            if (!within(3, aParentRect.y, aRect.y) || aRect.width > 1000) {
                aTouch = aRect.bottom
                aBestY = aRect.bottom + 4
                top = false
            }

            // The best X for A.
            const aBestX = aRect.x + (aRect.width > 1000 ? 20 : Math.floor(aRect.width / 2))

            // Draw a line from "aBestY" to "aTouch".
            this.drawLine(svg, lineColor, aBestX, aBestX, top ? aBestY : aTouch, top ? aTouch : aBestY)

            // Draw a line from "this.downX" to "aBestX" using "aBestY".
            this.drawLine(svg, lineColor, this.downX!, aBestX, aBestY, aBestY)

            // Draws the claw.
            drawClaw(bLeft, bRect.top - mainGapSize, bRect.bottom + mainGapSize, this, svg)

            // bLeft being greater than bTop means there isn't enough room. Return and destroy.
            if (this.downX! > bLeft) return this.destroy()

            // Draw a line from "bTop" to "bLeft".
            this.drawLine(svg, lineColor, this.downX!, bLeft, bTop, bTop)

            // Draw the down line.
            this.drawLine(svg, lineColor, this.downX!, this.downX!, aBestY, bTop)
        } finally {
            // Unlocks the generator.
            lock = false
        }
    }

    public destroy() {
        if (this.destroyed) return
        if (this.lineDiv) this.lineDiv.remove()
        this.destroyed = true
        this.downX = undefined
    }
}
