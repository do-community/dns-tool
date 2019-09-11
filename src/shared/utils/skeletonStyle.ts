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

export const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getSkeletonStyle = (min: number, max: number, size = 1) => {
    return {
        height: `${size}em`,
        margin: `${size * .35}em 0`,
        background: `hsl(0, 0%, ${getRandomInt(80, 90)}%)`,
        borderRadius: `${size * .5}em`,
        width: `${getRandomInt(min, max)}px`,
        opacity: `${getRandomInt(20, 30)/100}`,
        animationDelay: `${getRandomInt(0, 600)}ms`,
        animationDuration: `${getRandomInt(900, 1200)}ms`,
    }
}
